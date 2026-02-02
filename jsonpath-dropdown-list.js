import { html, css, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';
import {} from 'https://cdn.jsdelivr.net/npm/jsonpath@1.1.1/jsonpath.min.js';
import 'https://cdn.jsdelivr.net/npm/flatpickr';

// define the component
export class JSONPathDropdownList extends LitElement {  
    static styles = css`
        .form-control {
            color: var(--ntx-form-theme-color-secondary);
            background-color: var(--ntx-form-theme-color-input-background, transparent);
            font-size: var(--ntx-form-theme-text-input-size);
            font-family: var(--ntx-form-theme-font-family);
            border: 1px solid var(--ntx-form-theme-color-border);
            border-radius: var(--ntx-form-theme-border-radius);
            width: 97%;
            height: var(--ntx-form-control-line-height);
            padding: 0.4375rem 0.75rem;
        }

        .form-control:focus {
            outline: none;
            border-color: var(--ntx-form-theme-color-primary);
        }
    `;

    static properties = {
        jsonInput: { type: String },
        jsonPath: { type: String },
        value: { type: String }
    };
  
    // return a promise for contract changes.
    static getMetaConfig() {
        return {
            controlName: 'JSONPath Dropdown List',
            fallbackDisableSubmit: false,
            version: '1.0',
            standardProperties: {
                visibility: true
            },
            properties: {
                jsonInput: {
                    type: 'string',
                    title: 'JSON Input to Process'
                },
                jsonPath: {
                    type: 'string',
                    title: 'JSONPath Query'
                },
                value: {
                    type: 'string',
                    title: 'Selected Value',
                    isValueField: true                    
                }
            }
        };
    }
  
    constructor() {
        super();
    }

    handleBlur() {
        this.requestUpdate();

        const args = {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: this.value,
        };
        const event = new CustomEvent('ntx-value-change', args);
        this.dispatchEvent(event);
    }

    handleInput(event) {
        const input = event.target;
        this.value = input.value;
    }

    render() {
        if (this.jsonInput != null && this.jsonInput != '' & this.jsonPath != null && this.jsonPath != '') {
            var jp = require('jsonpath');
            var results = jp.query(this.jsonInput, this.jsonPath);
            return html`
                <select
                    class="form-control"
                    .value=${this.value}
                    @blur=${this.handleBlur}
                    @input=${this.handleInput}
                >${results.map(function(itt){ return `<option value="${itt}">${itt}</option>`; })}</select>
            `;
        }
        else {
            return html`
                <select
                    class="form-control"
                    .value=${this.value}
                    @blur=${this.handleBlur}
                    @input=${this.handleInput}
                ></select>
            `;
        }
    }
}


// registering the web component
const elementName = 'jsonpath-dropdown-list';
customElements.define(elementName, JSONPathDropdownList);