import { html, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';
import 'https://cdn.jsdelivr.net/npm/flatpickr';

// define the component
export class MultipleChoiceClass extends LitElement {  
    static properties = {
        multipleChoiceClass: { type: String },
        values: { type: String }
    };
  
    // return a promise for contract changes.
    static getMetaConfig() {
        return {
            controlName: 'Multiple Choice Select Values',
            fallbackDisableSubmit: false,
            version: '1.0',
            standardProperties: {
                visibility: true
            },
            properties: {
                multipleChoiceClass: {
                    type: 'string',
                    title: 'Multiple Choice Class'
                },
                values: {
                    type: 'string',
                    title: 'Values to populate'
                }
            }
        };
    }
  
    constructor() {
        super();
    }

    render() {
        this.render2().then(res => {
            console.log(res);            
        });   

        return html`<p>'Multiple Choice Select Values' for '${this.multipleChoiceClass}'<p/>`;
    }

    async render2() {
        try {
            if (this.multipleChoiceClass != null && this.multipleChoiceClass != '' && this.values != null && this.values != '') {
                var multipleChoice = document.getElementsByClassName(this.multipleChoiceClass);
                if (multipleChoice != null && multipleChoice.length > 0) {
                    multipleChoice = multipleChoice[0];
                    multipleChoice.click();    
                    var checkboxes = multipleChoice.querySelectorAll('.nx-ng-option')
                    var parsed = this.values.split(';#');

                    for (var i = 0; i < parsed.length; i++) {
                        for (var o = 0; o < checkboxes.length; o++) {
                            if (checkboxes[o].innerText == parsed[i]) {
                                checkboxes[o].querySelector('input[type="checkbox"]').parentNode.click();
                            }
                        }
                    }

                    multipleChoice.closest('ntx-form-rows').click();
                }
            }
        }
        catch(exc) { 
            console.log(exc);
        }
    }
}


// registering the web component
const elementName = 'multiple-choice-select-values';
customElements.define(elementName, MultipleChoiceClass);