import { html, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

// define the component
export class CurrentlyAssigned extends LitElement {
    static properties = {
        currentlyAssigned: { type: Boolean },
        taskListTitle: { type: String },
        spUrl: { type: String },
        itemId: { type: String },
        currentUserEmail: { type: String }
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
                },
                currentUserEmail: {
                    title: 'Current User Email',
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
                    var url = this.spUrl + '/_api/web/lists/getbytitle(\'' + this.taskListTitle + '\')/items?$filter=RequestID eq \'' + this.itemId + '\' and TaskStatus eq \'Pending\'&$select=AssigneeID';
                    const response = await fetch(url, {
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json;odata=verbose",
                            "Authorization": "Bearer " + token
                        }
                    });
                    const body = await response.text();
                    var json = JSON.parse(body);
                    var results = json.d.results;
                    console.log(results);
                    var userEmail = this.currentUserEmail.toLowerCase();
                    for (var i = 0; i < results.length; i++) {
                        if (results[i].AssigneeID != null && results[i].AssigneeID.toLowerCase() == userEmail) {
                            this.currentlyAssigned = true;
                            this.onChange(true);
                            return;
                        }
                    }
                    this.onChange(false);
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

    onChange(value) {
        const args = {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: value
        };
        const event = new CustomEvent('ntx-value-change', args);
        this.dispatchEvent(event);
    }
}


// registering the web component
const elementName = 'currently-assigned';
customElements.define(elementName, CurrentlyAssigned);