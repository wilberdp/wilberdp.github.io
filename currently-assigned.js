import { html, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

// define the component
export class CurrentlyAssigned extends LitElement {
    static properties = {
        currentlyAssigned: { type: Boolean },
        taskListTitle: { type: String },
        spUrl: { type: String },
        itemId: { type: String }
    };

    // return a promise for contract changes.
    static getMetaConfig() {
        return {
            controlName: 'CurrentlyAssigned',
            fallbackDisableSubmit: false,
            version: '1.0',
            standardProperties: {
                visibility: true
            },
            properties: {
                currentlyAssigned: {
                    title: 'Currently Assigned',
                    type: 'boolean',
                    defaultValue: false,
                    isValueField: true
                },
                taskListTitle: {
                    title: 'Task List Title',
                    type: 'string'
                },
                spUrl: {
                    title: 'Sharepoint Url',
                    type: 'string'
                },
                itemId: {
                    title: 'Item ID',
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
        this.render2().then(res => { }); 
        return html`<p>CurrentlyAssigned</p>`;
    }

    async render2() {
        try {
            if (!window || !window.ntxContext || !window.ntxContext.accessTokenProvider) {
                return new Promise(res => setTimeout(render2, 100));
            }
            else {
                var token = await window.ntxContext.accessTokenProvider.getAccessToken();
                if (token != null && token != '') {
                    var url = this.spUrl + '/_api/web/lists/getbytitle(\'' + this.taskListTitle + '\')/items?$filter=RequestID eq ' + this.itemId + '&$select=AssigneeID';
                    const response = await fetch(url, {
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json;odata=verbose",
                            "Authorization": "Bearer " + token
                        }
                    });
                    const body = await response.text();
                    var json = JSON.parse(body);
                    var results = json.d;
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
}


// registering the web component
const elementName = 'currently-assigned';
customElements.define(elementName, CurrentlyAssigned);