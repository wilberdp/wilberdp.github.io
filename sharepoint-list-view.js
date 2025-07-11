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
            return this.render2().then(res => {
                return res;          
            });   
        }
        else {
            return html`<p>Sharepoint List View: parameters empty</p>`
        }
    }

    async render2() {
        try {
            if (!window || !window.ntxContext || !window.ntxContext.accessTokenProvider) {
                return new Promise(res => setTimeout(render2, 100));
            }
            else {
                var token = await window.ntxContext.accessTokenProvider.getAccessToken();
                if (token != null && token != '') {
                    this.getListItemsForView(token, this.siteUrl, this.listName, this.viewName).then(function(result){
                        console.log(result);
                    });
                }
                else {
                    console.log('no token');
                }
            }
        }
        catch (e) {
            console.log(e);
        }
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


    async getListItems(ntxToken, webUrl, listTitle, queryText) 
    {
        var viewXml = '<View><Query>' + queryText + '</Query></View>';
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


    async getListItemsForView(ntxToken, webUrl, listTitle, viewTitle)
    {
        var viewQueryUrl = webUrl + "/_api/web/lists/getByTitle('" + listTitle + "')/Views/getbytitle('" + viewTitle + "')";
        return await this.getJson(ntxToken, viewQueryUrl).then(
            async function(data){   
                data = (await data.json());   
                var listViewXml = data.d.ListViewXml;  
                var viewQuery = data.d.ViewQuery;
                console.log('listViewXml: ' + listViewXml);
                console.log('viewQuery: ' + viewQuery);
                return await this.getListItems(ntxToken, webUrl, listTitle, listViewXml); 
            }
        );
    }
}

const elementName = 'sharepoint-list-view';
customElements.define(elementName, SharepointListView);