import {css, html, LitElement, styleMap} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

export class SharepointListView extends LitElement {
    sortDirection;
    groupBy;
    groupByIdx;

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
        white-space: nowrap;
        
        background-color: transparent;
    }

    .sharepoint-listview-table tr:nth-child(even) {
        background-color: #f3f3f3;
    }

    .sharepoint-listview-table tr:nth-child(odd) {
        background-color: #f1f1f1;
    }
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
                }
            }
        };
    }

    render() {
        var $this = this;
        $this.sortDirection = new Map();

        if (this.siteUrl != null && this.siteUrl != '' && this.listName != null && this.listName != '' && this.viewName != null && this.viewName != '') {
            var id = Math.floor(Math.random() * 10000);
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
                    var result = await this.getListItemsForView(id, token, this.siteUrl, this.listName, this.viewName);
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

    async getListItems(ntxToken, webUrl, listTitle, listViewXml) 
    {
        listViewXml = listViewXml.replace('</ViewFields>', '<FieldRef Name="FileRef" /></ViewFields>');

        var url = webUrl + "/_api/web/lists/getbytitle('" + listTitle + "')/getitems?$expand=FieldValuesAsText,FieldValuesAsHtml"; 
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

    async getListItemsForView(id, ntxToken, webUrl, listTitle, viewTitle)
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

        console.log(listFields);

        var viewQueryUrl = webUrl + "/_api/web/lists/getByTitle('" + listTitle + "')/Views/getbytitle('" + viewTitle + "')";
        var data = await this.getJson(ntxToken, viewQueryUrl);
        data = (await data.json());   

        var listViewXml = data.d.ListViewXml;  
        var viewQuery = data.d.ViewQuery;
        console.log('listViewXml: ' + listViewXml);
        console.log('viewQuery: ' + viewQuery);

        if (listViewXml.toLowerCase().indexOf("groupby") > -1) {
            var matches = listViewXml.match(/<GroupBy.*><FieldRef Name=".+?<\/GroupBy>/g, '');
            if (matches != null && matches.length > 0) {
                $this.groupBy = matches[0].replace(/<GroupBy.*><FieldRef Name="/g,"").replace("\" /></GroupBy>","");
                console.log($this.groupBy);
            }
        }

        var listItemData = await $this.getListItems(ntxToken, webUrl, listTitle, listViewXml);
        if (listItemData != null) {
            listItemData = listItemData.d.results;
            console.log(listItemData);
            console.log('id: ' + id);
            var parser = new DOMParser();
            var doc = parser.parseFromString(listViewXml, "text/xml")                
            var fieldRefs = doc.getElementsByTagName("View")[0].getElementsByTagName("ViewFields")[0].getElementsByTagName("FieldRef");
            var htmlView = `<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"><input type="text" placeholder="Search View..." style="margin-bottom: 10px; width: 500px; padding: 8px;" /><br><div style="white-space: nowrap; display:block; margin-bottom: 5px; overflow-x:auto;"><h2>${listTitle} - ${viewTitle}</h2><table class="sharepoint-listview-table"><thead><tr>`;

            for (var i = 0; i < fieldRefs.length; i++) {
                var fieldRef = fieldRefs[i];
                console.log("internalName: " + fieldRef.attributes["Name"].nodeValue);
                var displayName = listFields.filter(function(itt){ return itt.InternalName == fieldRef.attributes["Name"].nodeValue})[0].Title;
                console.log("displayName: " + displayName);
                htmlView += `<th data-key="${i + 1}">${displayName}</th>`;
                if ($this.groupBy != null && $this.groupBy != "" && (fieldRef.attributes["Name"].nodeValue == $this.groupBy || (fieldRef.attributes["Name"].nodeValue.toLowerCase() == "linktitle" && $this.groupBy == "Title"))) {
                    $this.groupByIdx = i + 1;
                }
            }

            htmlView += '</tr></thead><tbody>'

            for (var o = 0; o < listItemData.length; o++) {
                htmlView += "<tr>";
                for (var i = 0; i < fieldRefs.length; i++) { 
                    var displayName = listFields.filter(function(itt){ return itt.InternalName == fieldRefs[i].attributes["Name"].nodeValue})[0].Title;
                    htmlView += "<td>" + $this.getFieldValue($this.siteUrl, displayName, fieldRefs[i].attributes["Name"].nodeValue, listItemData[o]) + "</td>";
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

    getFieldValue(siteUrl, displayName, internalName, item) {
        console.log(displayName);
        console.log(internalName);

        var value = '';

        try {
            if(internalName.toLowerCase() == "linktitle" 
            || internalName.toLowerCase() == "linktitlenomenu" 
            || displayName.toLowerCase()  == "title"
            || displayName.toLowerCase() == "title english" 
            || displayName.toLowerCase() == "title english" 
            || displayName.toLowerCase()  == "edit") {
                var itemUrl = item.FieldValuesAsText.FileRef;
                console.log(itemUrl);
                if (itemUrl != null && itemUrl != "") {
                    var tempItemUrl = itemUrl.split("Lists/")[1];
                    tempItemUrl = tempItemUrl.split("/")[0];
                    itemUrl = siteUrl + "/Lists/" + tempItemUrl + "/DispForm.aspx?ID=" + item["ID"];
                    var titleLink = item.FieldValuesAsText["Title"];
                    if (displayName.toLowerCase() == "edit") {
                        titleLink =  "Edit";
                    }
                    
                    if (titleLink.length > 60) {
                        titleLink = titleLink.substring(0, 60);
                      titleLink = titleLink + "...";
                    }
                    value = "<a href='" + itemUrl + "' data-interception='off' rel='noopener noreferrer'>" + titleLink + "</a>";
                }
            }
            else {
                if (item[internalName] != null && item[internalName].__metadata != null) {
                    var metadata = item[internalName].__metadata;
                    console.log(metadata);
                    if (metadata.type == "SP.FieldUrlValue") {
                        value = `<a href='${item[internalName]["Url"]}' target="_blank">${item[internalName]["Description"]}</a>`;
                    } 
                    else {
                        value = item.FieldValuesAsText[internalName];
                    }
                }
                else {
                    value = item.FieldValuesAsText[internalName];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        console.log(value);

        return value;
    }

    attachSortHandlers($this, target) {
        const table = $this.$$$(`${target} .sharepoint-listview-table`);
        console.log(table);
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
                var cellA = a.querySelector(`td:nth-child(${intKey})`)?.textContent || '';
                var cellB = b.querySelector(`td:nth-child(${intKey})`)?.textContent || '';
            
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
                icon.className = 'fas fa-chevron-right'; // Default to collapsed state
                icon.style.marginRight = '8px';
        
                // Add click event listener to toggle icon and row visibility
                groupCell.addEventListener('click', (ele) => {
                    var currentGroup = ele.target.getAttribute('group');
                    console.log(ele);
                    console.log(ele.target);
                    console.log(currentGroup);

                    var isExpanded = ele.target.closest('tr').getAttribute('data-expanded') === 'true';
                    ele.target.closest('tr').setAttribute('data-expanded', (!isExpanded).toString());
                    
                    if (isExpanded) {
                        ele.target.querySelector('i').className = 'fas fa-chevron-right'; // Collapsed state
                    } else {
                        ele.target.querySelector('i').className = 'fas fa-chevron-down'; // Expanded state
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