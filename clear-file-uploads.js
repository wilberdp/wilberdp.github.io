import { html, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

export class ClearFileUploads extends LitElement {
    static properties = {
        hasRun: { type: Boolean },
        classToTarget: { type: String },
    };        

    static getMetaConfig() {
        return {
            controlName: 'ClearFileUploads',
            fallbackDisableSubmit: false,
            version: '1.0',
            standardProperties: {
                visibility: true
            },
            properties: {
                classToTarget: {
                    title: 'Class to Target',
                    type: 'string'
                },
                hasRun: {
                    title: 'Has Run',
                    type: 'boolean',
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
        if (this.hasRun === false || this.expressionFor_hasRun === false) {
            this.render2().then(res => {
                console.log(res);            
            });   
        }

        return html`<p>ClearFileUploads</p>`;
    }

    async render2() {
        try {
            var $this = this;
            if ($this.classToTarget == null || $this.classToTarget == '') {
                $this.hasRun = true;
                return;
            }

            var theInterval = setInterval(function(){
                var fileUploads = document.querySelectorAll('.' + $this.classToTarget);
                if (fileUploads != null) {
                    for (var i = 0; i < fileUploads.length; i++) {
                        var toTrash = fileUploads[i].querySelectorAll('[data-e2e="trash"]');
                        if (toTrash != null) {
                            while (toTrash.length > 0) {
                                toTrash[0].closest('button').dispatchEvent(new Event('click'));
                                toTrash = fileUploads[i].querySelectorAll('[data-e2e="trash"]');
                            }
                        }
                    }
                    $this.hasRun = true;
                    clearInterval(theInterval);
                }
            }, 500);
        }
        catch(exc) { 
            console.log(exc);
        }
    }
}




function deepEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}

// registering the web component
const elementName = 'clear-file-uploads';
customElements.define(elementName, ClearFileUploads);