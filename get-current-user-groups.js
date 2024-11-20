import { html, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

// define the component
export class GetCurrentUserGroups extends LitElement {
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
        if (spUrl != null && spUrl != '') {
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
        return new Promise();
    }
}


// registering the web component
const elementName = 'get-current-user-groups';
customElements.define(elementName, GetCurrentUserGroups);