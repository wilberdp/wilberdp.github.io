import {css, html, LitElement, styleMap} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

export class SharepointListView extends LitElement {
    static properties = {
        siteUrl: { type: String },
        listName: { type: String },
        viewName: { type: String },
        filter: { type: String }
    };

    sortDirection;
    groupBy;
    groupByIdx;
    pageSize;

    // Define scoped styles right with your component, in plain CSS
    static styles = css`  //Add custom CSS. See https://help.nintex.com/en-US/formplugins/Reference/Style.htm
      :host {
        height: 100%;
        width: 100%;
        display: block;
      }

    .sharepoint-listview-table {
        width: 100%;
        padding: 5px;
        background-color: white;
   
    }
    .sharepoint-listview-table tr + tr td {
        border-top: solid 1px #e7e7e7;
    }
    .sharepoint-listview-table th,
    .sharepoint-listview-table td {
        text-align: left;
        padding: 5px;
        vertical-align: top;
        white-space: pre;
        
        background-color: transparent;

    }

    .sharepoint-listview-table .custom-chevron-right:before {
        content: "+";
        font-weight: bold;
        font-family: initial;
    }

    .sharepoint-listview-table .custom-chevron-down:before {
        content: "-";
        font-weight: bold;
        font-family: initial;
    }

    //.sharepoint-listview-table tbody tr:nth-child(even) {
    //    background-color: #f3f3f3;
    //}

    //.sharepoint-listview-table tbody tr:nth-child(odd) {
    //    background-color: #ffffff;
    //}
    
    `;

    static getMetaConfig() {
        // plugin contract information
        return {
            controlName: 'sharepoint-list-view',
            fallbackDisableSubmit: false,
            description: 'Sharepoint List View',
            version: '1.0',
            properties: { 
                siteUrl: {
                    type: 'string',
                    title: 'Site Url'
                },
                listName: {
                    type: 'string',
                    title: 'List Name'
                },
                viewName: {
                    type: 'string',
                    title: 'List View Name'
                },
                filter: {
                    type: 'string',
                    title: 'Filter Expression (CAML)',
                    description: 'CAML for additional filtering.  This will be AND the view query.'
                },
                events: ["ntx-value-change"]
            }
        };
    }

    onChange(e) {
        const args = {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: e.target.values
        };
        const event = new CustomEvent('ntx-value-change', args);
        this.dispatchEvent(event);
    }

    render() {
        var $this = this;
        $this.sortDirection = new Map();

        if (this.siteUrl != null && this.siteUrl != '' && this.listName != null && this.listName != '' && this.viewName != null && this.viewName != '') {
            var id = Math.floor(Math.random() * 10000000000);
            this.render2(id).then(function(result) {
                var nodes = $this.$$$(`#sharepoint-list-view-${id}`);
                nodes[0].innerHTML = result;
                if ($this.groupByIdx != null && $this.groupByIdx != "") {
                    $this.appendGroupedRows($this.$$$(`#sharepoint-list-view-${id} tbody`)[0], $this.$$$(`#sharepoint-list-view-${id} tbody tr`), $this.groupByIdx, true)
                }
                $this.attachSortHandlers($this, `#sharepoint-list-view-${id}`);
            });
            return html`<p><div id='sharepoint-list-view-${id}'></div></p>`;
        }
        else {
            return html`<p>Sharepoint List View: parameters empty</p>`
        }
    }

    async render2(id) {
        try {
            if (!window || !window.ntxContext || !window.ntxContext.accessTokenProvider) {
                return new Promise(res => setTimeout(render2, 100));
            }
            else {
                var token = await window.ntxContext.accessTokenProvider.getAccessToken();
                if (token != null && token != '') {
                    var result = await this.getListItemsForView(id, token, this.siteUrl, this.listName, this.viewName, this.filter);
                    return result;
                }
                else {
                    console.log('no token');
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return '<div>temporary result</div>';
    }

    async getJson(ntxToken, url) 
    {
        return await fetch(url, {       
            method: "GET", 
            headers: { 
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json;odata=verbose",
                "Authorization": "Bearer " + ntxToken
            }
        });
    }

    async getListItems(ntxToken, webUrl, listTitle, listViewXml, filter) 
    {
        listViewXml = listViewXml.replace('</ViewFields>', '<FieldRef Name="FileRef" /><FieldRef Name="ContentTypeId" /></ViewFields>');
        console.log(listViewXml);

        //<Query><Where><Eq><FieldRef Name="Title" /><Value Type="Text">123</Value></Eq></Where></Query><ViewFields>

        if (filter != null && filter != "") {
            var parser = new DOMParser();
            var doc = parser.parseFromString(filter, "text/xml") 
            if (doc != null && doc.querySelector('Value') != null && doc.querySelector('Value').textContent != null && doc.querySelector('Value').textContent != "") {
                if (listViewXml.indexOf("<Where>") > -1) {
                    listViewXml = listViewXml.replace("<Where>", `<Where><And>${filter}`).replace("</Where>", `</And></Where>`);
                }
                else {
                    listViewXml = listViewXml.replace("<Query />", "").replace("<ViewFields>", `<Query><Where>${filter}</Where></Query><ViewFields>`);
                }
            }

            if (doc != null) {
                var fieldRefs = Array.from(doc.querySelectorAll('FieldRef')).map(function(itt){ return itt.outerHTML; });
                listViewXml = listViewXml.replace('</ViewFields>', fieldRefs.join('') + '</ViewFields>');
            }
        }
        console.log(listViewXml);

        var url = `${webUrl}/_api/web/lists/getbytitle('${listTitle}')/getitems?$select=ContentType/Name&$expand=FieldValuesAsText,FieldValuesAsHtml,ContentType`; 
        var queryPayload = {  
                'query' : {
                    '__metadata': { 'type': 'SP.CamlQuery' }, 
                    'ViewXml' : listViewXml
                }
        };
        
        var digest = await (await fetch(webUrl + "/_api/contextinfo", {
            method: "POST",
            headers: {
                "Accept": "application/json;odata=verbose",
                "content-type": "application/json;odata=verbose",
                "Authorization": "Bearer " + ntxToken
            }
        })).json();

        if (digest != null && digest.d != null && digest.d.GetContextWebInformation != null) {
            digest = digest.d.GetContextWebInformation.FormDigestValue;
        }
        else {
            digest = null;
        }

        return await (await fetch(url, {
            method: "POST",
            body: JSON.stringify(queryPayload),
            headers: {
                "X-RequestDigest": digest,
                "Accept": "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose",
                "Authorization": "Bearer " + ntxToken
            }
        })).json();
    }

    async getListItemsForView(id, ntxToken, webUrl, listTitle, viewTitle, filter)
    {
        var $this = this;
        var listFieldsUrl = webUrl + "/_api/web/lists/getByTitle('" + listTitle + "')/Fields";
        var listFields = (await (await fetch(listFieldsUrl, {
            method: "GET", 
            headers: { 
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json;odata=verbose",
                "Authorization": "Bearer " + ntxToken
            }
        })).json()).d.results;

        //console.log(listFields);

        var viewQueryUrl = webUrl + "/_api/web/lists/getByTitle('" + listTitle + "')/Views/getbytitle('" + viewTitle + "')";
        var data = await this.getJson(ntxToken, viewQueryUrl);
        data = (await data.json());   

        var listViewXml = data.d.ListViewXml;  
        var viewQuery = data.d.ViewQuery;
        //console.log('listViewXml: ' + listViewXml);
        //console.log('viewQuery: ' + viewQuery);

        if (listViewXml.toLowerCase().indexOf("groupby") > -1) {
            var matches = listViewXml.match(/<GroupBy.*><FieldRef Name=".+?<\/GroupBy>/g, '');
            if (matches != null && matches.length > 0) {
                $this.groupBy = matches[0].replace(/<GroupBy.*><FieldRef Name="/g,"").replace("\" /></GroupBy>","");
                //console.log($this.groupBy);
            }
        }

        if (listViewXml.toLowerCase().indexOf("rowlimit") > -1) {
            //<RowLimit Paged="TRUE">30</RowLimit>
            var matches = listViewXml.match(/<RowLimit.*>.+?<\/RowLimit>/g, '');
            if (matches != null && matches.length > 0) {
                $this.pageSize = matches[0].replace(/<RowLimit.*>/g,"").replace("</RowLimit>","");
            }
        }

        //console.log(listViewXml);
        //listViewXml = listViewXml.replace(/<RowLimit.*>.+?<\/RowLimit>/g, '');
        //console.log(listViewXml);

        var listItemData = await $this.getListItems(ntxToken, webUrl, listTitle, listViewXml, filter);
        console.log(listItemData);
        if (listItemData != null) {
            listItemData = listItemData.d.results;
            //console.log('id: ' + id);
            var parser = new DOMParser();
            var doc = parser.parseFromString(listViewXml, "text/xml")                
            var fieldRefs = doc.getElementsByTagName("View")[0].getElementsByTagName("ViewFields")[0].getElementsByTagName("FieldRef");
            var htmlView = `<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"><div style="white-space: nowrap; display:block; margin-bottom: 5px; overflow-x:auto; max-height: 480px;"><h2>${listTitle} - ${viewTitle}</h2><table class="sharepoint-listview-table"><thead><tr>`;

            for (var i = 0; i < fieldRefs.length; i++) {
                var fieldRef = fieldRefs[i];
                //console.log("internalName: " + fieldRef.attributes["Name"].nodeValue);
                var displayName = listFields.filter(function(itt){ return itt.InternalName == fieldRef.attributes["Name"].nodeValue})[0];
                console.log(displayName);
                displayName = displayName.Title;
                //console.log("displayName: " + displayName);
                htmlView += `<th data-key="${i + 1}">${displayName}</th>`;
                if ($this.groupBy != null && $this.groupBy != "" && (fieldRef.attributes["Name"].nodeValue == $this.groupBy || (fieldRef.attributes["Name"].nodeValue.toLowerCase() == "linktitle" && $this.groupBy == "Title"))) {
                    $this.groupByIdx = i + 1;
                }
            }

            htmlView += '</tr></thead><tbody>'

            for (var o = 0; o < listItemData.length; o++) {
                htmlView += "<tr>";
                for (var i = 0; i < fieldRefs.length; i++) { 
                    var listField = listFields.filter(function(itt){ return itt.InternalName == fieldRefs[i].attributes["Name"].nodeValue})[0];
                    var fieldValue = $this.getFieldValue($this.siteUrl, listField, listItemData[o]);
                    htmlView += `<td sortvalue="${fieldValue.SortValue}">${fieldValue.DisplayValue}</td>`
                }
                htmlView += "</tr>";
            }

            htmlView += "</tbody></table>";

            return htmlView;
        }
        else {        
            return "";
        }
    }

    getFieldValue(siteUrl, listField, item) {
        console.log(item);
        console.log(listField.InternalName + ": " + listField.TypeAsString);
        console.log(item.FieldValuesAsText[internalName]);

        var internalName = listField.InternalName.replaceAll('_', '_x005f_');
        var displayName = listField.Title;
        var returner = { DisplayValue: "", SortValue: "" };

        try {
            if(internalName.toLowerCase() == "linktitle" 
            || internalName.toLowerCase() == "linktitlenomenu" 
            || displayName.toLowerCase()  == "title"
            || displayName.toLowerCase() == "title english" 
            || displayName.toLowerCase() == "title english" 
            || displayName.toLowerCase()  == "edit") {
                var itemUrl = item.FieldValuesAsText.FileRef;
                //console.log(itemUrl);
                if (itemUrl != null && itemUrl != "") {
                    var tempItemUrl = itemUrl.split("Lists/")[1];
                    tempItemUrl = tempItemUrl.split("/")[0];
                    itemUrl = siteUrl + "/Lists/" + tempItemUrl + "/DispForm.aspx?ID=" + item.FieldValuesAsText["ID"];
                    var titleLink = item.FieldValuesAsText["Title"];
                    if (displayName.toLowerCase() == "edit") {
                        titleLink =  "Edit";
                    }
                    
                    if (titleLink.length > 60) {
                        titleLink = titleLink.substring(0, 60);
                      titleLink = titleLink + "...";
                    }
                    returner.DisplayValue = "<a href='" + itemUrl + "' data-interception='off' rel='noopener noreferrer'>" + titleLink ?? "" + "</a>";
                }
            }
            else {
                if (listField.TypeAsString == "URL" && item[internalName] != null){
                    returner.SortValue = item[internalName]["Description"];
                    returner.DisplayValue = `<a href='${item[internalName]["Url"]}' target="_blank">${item[internalName]["Description"] ?? ""}</a>`;
                } 
                else {
                    if (listField.TypeAsString == "DateTime"){
                        returner.SortValue = item[internalName] ?? "";
                        returner.DisplayValue = item.FieldValuesAsText[internalName] ?? "";
                    }
                    else {
                        if (internalName == "ContentType") {
                            returner.SortValue = item.ContentType?.Name ?? "";
                            returner.DisplayValue = item.ContentType?.Name ?? "";
                        }
                        else {
                            returner.SortValue = item.FieldValuesAsText[internalName] ?? "";
                            returner.DisplayValue = item.FieldValuesAsText[internalName] ?? "";
                        }
                    }
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        //console.log(value);

        return returner;
    }

    attachSortHandlers($this, target) {
        const table = $this.$$$(`${target} .sharepoint-listview-table`);
        //console.log(table);
        if (table) {
            const headers = table[0].querySelectorAll('th');
            headers.forEach((header, index) => {
                header.addEventListener('click', () => {
                    const key = header.getAttribute('data-key');
                    if (key) {
                        $this.sortTableByColumn($this, key, index + 1, `${target} .sharepoint-listview-table`); // Adjust index as nth-child expects 1-based index
                    } else {
                        console.warn('No data-key attribute found on header:', header);
                    }
                });
            });
        } 
        else {
            console.warn(`Table with selector '${target} .sharepoint-listview-table' not found`);
        }
    }

    sortTableByColumn($this, key, intKey, tableSelector) {        
        var table = $this.$$$(tableSelector);
        if (table) {
            var tbody = table[0].querySelector('tbody');
            if (!tbody) {
                console.warn('No tbody found for table: ', tableSelector);
                return;
            }
      
            var rows = Array.from(tbody.querySelectorAll('tr'));
            var currentDirection = $this.sortDirection.get(key) || false;
        
            var sortedRows = rows.sort((a, b) => {
                var cellA = a.querySelector(`td:nth-child(${intKey})`)?.getAttribute("sortvalue") || '';
                var cellB = b.querySelector(`td:nth-child(${intKey})`)?.getAttribute("sortvalue") || '';
            
                if (currentDirection) {
                    return cellB.localeCompare(cellA); // descending
                } else {
                    return cellA.localeCompare(cellB); // ascending
                }
            });
      
          
            $this.sortDirection.set(key, !currentDirection);
        
            tbody.innerHTML = '';
            sortedRows.forEach(row => tbody.appendChild(row));
        } else {
            console.warn('Table not found');
        }
    }

    appendGroupedRows(tbody, rows, key, ascending) {
        //console.log('appendGroupedRows');

        var values = rows.map(row => {
            var cell = row.querySelector(`td:nth-child(${key})`);
            var cellValue = cell ? cell.textContent || 'Unknown' : 'Unknown';
            return { row, cellValue };
        });
      
        // Step 2: Group the rows based on the calculated values.
        var groupedRows = values.reduce((result, kvp) => {
            var key = kvp.cellValue;
            if (!result[key]) {
                result[key] = [];
            }
            result[key].push(kvp.row);
            return result;
        }, {});
      
        // Step 3: Sort the grouped rows based on the keys.
        var groupedRows = Object.keys(groupedRows).sort((a, b) => {
            if (ascending) {
                return a.localeCompare(b, undefined, { numeric: true });
            } else {
                return b.localeCompare(a, undefined, { numeric: true });
            }
        }).reduce((result, key) => {
            result[key] = groupedRows[key];
            return result;
        }, {});
      
        tbody.innerHTML = "";
        //console.log('1');
        for (var group in groupedRows) {
          //console.log('2');
            //if (Object.prototype.hasOwnProperty.call(groupedRows, group)) {
              //console.log('3');
                var groupHeader = document.createElement('tr');
                var groupCell = document.createElement('td');
                groupCell.colSpan = 2; // Adjust colspan based on number of columns
                groupCell.textContent = `Group: ${group}`;
                groupCell.style.cursor = 'pointer';
                groupCell.setAttribute('group', group);
        
                // Create icon element
                var icon = document.createElement('i');
                icon.className = 'custom-chevron-right'; // Default to collapsed state
                icon.style.marginRight = '8px';
        
                // Add click event listener to toggle icon and row visibility
                groupCell.addEventListener('click', (ele) => {
                    //console.log(ele);
                    //console.log(ele.target);

                    var tar = null;
                    if (ele.target.nodeName.toLowerCase() == "td") {
                        tar = ele.target;
                    }
                    else {
                        tar = ele.target.closest('td');
                    }
                    var currentGroup = tar.getAttribute('group');

                    //console.log(tar);

                    var isExpanded = tar.closest('tr').getAttribute('data-expanded') === 'true';
                    tar.closest('tr').setAttribute('data-expanded', (!isExpanded).toString());
                    
                    if (isExpanded) {
                        tar.querySelector('i').className = 'custom-chevron-right'; // Collapsed state
                    } else {
                        tar.querySelector('i').className = 'custom-chevron-down'; // Expanded state
                    }
        
                    groupedRows[currentGroup].forEach(row => {
                        row.style.display = isExpanded ? 'none' : '';
                    });
                });

                //console.log('4');
                groupCell.insertBefore(icon, groupCell.firstChild);
                groupHeader.appendChild(groupCell);
                groupHeader.setAttribute('data-expanded', 'false'); // Default to collapsed
                tbody.appendChild(groupHeader);
        
                groupedRows[group].forEach(row => {
                    row.style.display = 'none'; // Initially hide all rows
                    tbody.appendChild(row);
                });
            //}
        }
    }

    $$$(selector, rootNode = document.body) {
        const arr = []
        
        const traverser = node => {
            // 1. decline all nodes that are not elements
            if(node.nodeType !== Node.ELEMENT_NODE) {
                return
            }
            
            // 2. add the node to the array, if it matches the selector
            if(node.matches(selector)) {
                arr.push(node)
            }
            
            // 3. loop through the children
            const children = node.children
            if (children.length) {
                for(const child of children) {
                    traverser(child)
                }
            }
            
            // 4. check for shadow DOM, and loop through it's children
            const shadowRoot = node.shadowRoot
            if (shadowRoot) {
                const shadowChildren = shadowRoot.children
                for(const shadowChild of shadowChildren) {
                    traverser(shadowChild)
                }
            }
        }
        
        traverser(rootNode)
        
        return arr
    }
}

const elementName = 'sharepoint-list-view';
customElements.define(elementName, SharepointListView);