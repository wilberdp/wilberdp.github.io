import { html, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

// define the component
export class GetCurrentUserGroups extends LitElement {
    static properties = {
        groups: { type: String },
        spUrl: { type: String }
    };

    // return a promise for contract changes.
    static getMetaConfig() {
        return {
            controlName: 'GetCurrentUserGroups',
            fallbackDisableSubmit: false,
            version: '1.0',
            standardProperties: {
                visibility: true
            },
            properties: {
                groups: {
                    title: 'User\'s Groups',
                    type: 'string',
                    isValueField: true
                },
                spUrl: {
                    title: 'Sharepoint Site URL',
                    type: 'string'
                }
            },
            events: ['ntx-value-change']
        };
    }
  
    constructor() {
        super();
    }

    render() {
        if (this.spUrl != null && this.spUrl != '') {
            this.render2().then(res => {
                console.log(res);            
            });   
        }
        else {
            return html`<p>GetCurrentUserGroups: Sharepoint Site URL is null or empty</p>`
        }

        return html`<p>GetCurrentUserGroups</p>`;
    }

    async render2() {
        try {
            if (!window || !window.ntxContext || !window.ntxContext.accessTokenProvider) {
                return new Promise(res => setTimeout(render2, 100));
            }
            else {
                var token = await window.ntxContext.accessTokenProvider.getAccessToken();
                if (token != null && token != '') {
                    var url = this.spUrl + '/_api/web/currentuser/?$expand=groups';
                    const response = await fetch(url, {
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json;odata=verbose",
                            "Authorization": "Bearer " + token
                        }
                    });
                    const body = await response.text();
                    var json = jSON.parse(body);
                    var results = '|||' + json.d.Groups.results.map(function(itt) { return itt.Title }).join('|||') + '|||';
                    console.log(results);
                }
                else {
                    console.log('token is null or empty');
                }
            }
        }
        catch(exc) { 
            console.log(exc);
        }
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
}


// registering the web component
const elementName = 'get-current-user-groups';
customElements.define(elementName, GetCurrentUserGroups);