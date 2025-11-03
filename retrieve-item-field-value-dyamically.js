import { html, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

// define the component
export class RetrieveItemFieldValueDynamically extends LitElement {
    static properties = {
        spUrl: { type: String },
        listName: { type: String },
        filterExpression: { type: String },
        outputColumn: { type: String },
        outputValue: { type: String }
    };

    // return a promise for contract changes.
    static getMetaConfig() {
        return {
            controlName: 'RetrieveItemFieldValueDynamically',
            fallbackDisableSubmit: false,
            version: '1.0',
            standardProperties: {
                visibility: true
            },
            properties: {
                spUrl: {
                    title: 'Sharepoint Site URL',
                    type: 'string'
                },
                listName: {
                    title: 'List Name',
                    type: 'string'
                },
                filterExpression: {
                    title: 'Filter Expression',
                    type: 'string'
                },
                outputColumn: {
                    title: 'Output Column',
                    type: 'string'
                },
                outputValue: {
                    title: 'Output Value',
                    type: 'string',
                    isValueField: true
                }
            },
            events: ['ntx-value-change']
        };
    }
  
    constructor() {
        super();
    }

    render() {
        var msg = '';
        if (this.isNullOrEmpty(this.spUrl)) {
            msg += '"Sharepoint Site URL" is empty<br/>';
        }
        if (this.isNullOrEmpty(this.listName)) {
            msg += '"List Name" is empty<br/>';         
        }
        if (this.isNullOrEmpty(this.filterExpression)) {
            msg += '"Filter Expression" is empty<br/>';       
        }
        if (this.isNullOrEmpty(this.outputColumn)) {
            msg += '"Output Column" is empty<br/>';  
        }
        if (msg == '') {
            this.render2().then(res => {
                console.log(res);            
            });   
        }
        else {
            return html`<p>RetrieveItemFieldValueDynamically Errors<br/>${msg}</p>`
        }

        return html`<p>RetrieveItemFieldValueDynamically</p>`;
    }

    async render2() {
        try {
            if (!window || !window.ntxContext || !window.ntxContext.accessTokenProvider) {
                return new Promise(res => setTimeout(render2, 100));
            }
            else {
                var token = await window.ntxContext.accessTokenProvider.getAccessToken();
                if (token != null && token != '') {
                    var $this = this;
                    var running = false;

                    setInterval(async function(){
                        if (running) {
                            return;
                        }
                        else {
                            running = true;
                        }
                        var url = `${$this.spUrl}/_api/web/lists/getbytitle('${$this.listName}')/items?$filter=${$this.filterExpression}`;
                        const response = await fetch(url, {
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json;odata=verbose",
                                "Authorization": "Bearer " + token
                            }
                        });
                        const body = await response.text();
                        var results = JSON.parse(body);
                        var output = results.d.results[0][$this.outputColumn];
                        $this.onChange(output);
                        console.log(output);
                        running = false;
                    }, 5000);
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

    isNullOrEmpty(val) {
        return val == null || val == '';
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
const elementName = 'retrieve-item-field-value-dyamically';
customElements.define(elementName, RetrieveItemFieldValueDynamically);