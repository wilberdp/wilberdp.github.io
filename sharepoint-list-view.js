import {css, html, LitElement, styleMap} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

export class SharepointListView extends LitElement {
    // Define scoped styles right with your component, in plain CSS
    static styles = css`  //Add custom CSS. See https://help.nintex.com/en-US/formplugins/Reference/Style.htm
      :host {
        height: 100%;
        width: 100%;
        display: block;
      }

      .frame {
        display: inline-block;
        height: 100%;
        width: 100%;
        background-color: transparent;
        border: none;
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

        if (this.siteUrl != null && this.siteUrl != '' && this.listName != null && this.listName != '' && this.viewName != null && this.viewName != '') {
            var id = Math.floor(Math.random() * 10000);
            this.render2(id).then(function(result) {
                var nodes = $this.$$$(`#sharepoint-list-view-${id}`);
                nodes[0].innerHTML = result;
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

        var listItemData = await $this.getListItems(ntxToken, webUrl, listTitle, listViewXml);
        if (listItemData != null) {
            listItemData = listItemData.d.results;
            console.log(listItemData);
            console.log('id: ' + id);
            var parser = new DOMParser();
            var doc = parser.parseFromString(listViewXml, "text/xml")                
            var fieldRefs = doc.getElementsByTagName("View")[0].getElementsByTagName("ViewFields")[0].getElementsByTagName("FieldRef");
            var htmlView = `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"><input type="text" placeholder="Search View..." style="margin-bottom: 10px; width: 500px; padding: 8px;" /><br><div style="white-space: nowrap; display:block; margin-bottom: 5px; overflow-x:auto;"><table class="paho-table"><thead><tr>`;

            for (var i = 0; i < fieldRefs.length; i++) {
                var fieldRef = fieldRefs[i];
                console.log("internalName: " + fieldRef.attributes["Name"].nodeValue);
                var displayName = listFields.filter(function(itt){ return itt.InternalName == fieldRef.attributes["Name"].nodeValue})[0].Title;
                console.log("displayName: " + displayName);
                htmlView += `<th data-key="${i + 1}">${displayName}</th>`;
            }

            for (var o = 0; o < listItemData.length; o++) {
                htmlView += "<tr>";
                for (var i = 0; i < fieldRefs.length; i++) { 
                    var displayName = listFields.filter(function(itt){ return itt.InternalName == fieldRefs[i].attributes["Name"].nodeValue})[0].Title;
                    htmlView += "<td>" + $this.getFieldValue(displayName, fieldRefs[i].attributes["Name"].nodeValue, listItemData[o]) + "</td>";
                }
                htmlView += "</tr>";
            }

            htmlView += "</tr></table>"

            return htmlView;
        }
        else {        
            return "";
        }
    }

    getFieldValue(displayName, internalName, item) {
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
                var itemUrl = item.FileRef;
                if (itemUrl != null && itemUrl != "") {
                    var tempItemUrl = itemUrl.split("Lists/")[1];
                    tempItemUrl = tempItemUrl.split("/")[0];
                    itemUrl = sUrl + "/Lists/" + tempItemUrl + "/DispForm.aspx?ID=" + item["ID"];
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