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
        if (this.siteUrl != null && this.siteUrl != '' && this.listName != null && this.listName != '' && this.viewName != null && this.viewName != '') {
            var id = Math.floor(Math.random() * 10000);
            this.render2(id);
            return html`<p><div id="sharepoint-list-view-${id}></div></p>`
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
                    console.log(result);
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


    async getListItems(ntxToken, webUrl, listTitle, viewXml) 
    {
        //var viewXml = '<View><Query>' + queryText + '</Query></View>';
        var url = webUrl + "/_api/web/lists/getbytitle('" + listTitle + "')/getitems"; 
        var queryPayload = {  
                'query' : {
                    '__metadata': { 'type': 'SP.CamlQuery' }, 
                    'ViewXml' : viewXml  
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
                htmlView += `<th>${displayName}</th>`;
            }

            for (var o = 0; o < listItemData.length; o++) {
                htmlView += "<tr>";
                for (var i = 0; i < fieldRefs.length; i++) { 
                    var displayName = listFields.filter(function(itt){ return itt.InternalName == fieldRefs[i].attributes["Name"].nodeValue})[0].Title;
                    htmlView += "<td>" + $this.getFieldValue(displayName, listItemData[o]) + "</td>";
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

    getFieldValue(fieldRef, item) {
        console.log(fieldRef);

        var value = item[fieldRef];

        console.log(value);

        return value;
    }
}

const elementName = 'sharepoint-list-view';
customElements.define(elementName, SharepointListView);