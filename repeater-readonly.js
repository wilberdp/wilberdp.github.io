import { html,LitElement} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';
// define the component
export class RepeaterReadOnly extends LitElement {
  
    static properties = {
        readOnlyControlVariable: { type: Boolean },
    };
  
    // return a promise for contract changes.
    static getMetaConfig() {
        return {
            controlName: 'Repeater Readonly',
            fallbackDisableSubmit: false,
            version: '1.2',
            properties: {
                readOnlyControlVariable: {
                    type: 'boolean',
                    title: 'Read-Only Control Variable'
                }
            }
        };
    }

    render() {
        console.log('render');
        if (this.readOnlyControlVariable) {
            showHide('none');
        }
        else {
            showHide('inline-block');
        }
        return html`<p>Repeater Read-Only Control</p>`;
    }
}

function showHide(attr1) {
    var eles = document.querySelectorAll('ntx-repeating-section button.ntx-repeating-section-remove-button, ntx-repeating-section button.btn-repeating-section-new-row');
    for (var i = 0; i < eles.length; i++) {
        eles[i].style.display = attr1;
    }
}

// registering the web component
const elementName = 'repeater-readonly';
customElements.define(elementName, RepeaterReadOnly);
