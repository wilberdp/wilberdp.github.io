import { html, css, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';
import { JSONPath } from 'https://cdn.jsdelivr.net/npm/jsonpath-plus@10.3.0/dist/index-browser-esm.min.js';
import 'https://cdn.jsdelivr.net/npm/flatpickr';

export class JSONPathFilteredControl extends LitElement {  
    static styles = css`
        .jsonpath-form-control {
            color: var(--ntx-form-theme-color-input-text);
            background-color: var(--ntx-form-theme-color-input-background, transparent);
            font-size: var(--ntx-form-theme-text-input-size);
            font-family: var(--ntx-form-theme-font-family);
            border: 1px solid var(--ntx-form-theme-color-border);
            border-radius: var(--ntx-form-theme-border-radius);
            width: 96%;
            height: 16px;
            padding-top: 8px;
            padding-bottom: 8px;
            padding-left: 12px;
        }

        select.jsonpath-form-control {
            -moz-appearance:none; /* Firefox */
            -webkit-appearance:none; /* Safari and Chrome */
            appearance:none;
            padding-right: 30px; 
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fit="" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M18.43 21.82a.6.6 0 0 1-.86 0l-2.5-2.62-1.89-2a.7.7 0 0 1 .43-1.2h8.78a.7.7 0 0 1 .43 1.16l-1.89 2z"></path></svg>');
            background-repeat: no-repeat;
            background-position: right -2px center;
            background-size: 35px;
        }

        .jsonpath-form-control:focus {
            outline: none;
            border-color: var(--ntx-form-theme-color-primary);
        }
    `;

    static properties = {
        jsonInput: { type: String },
        jsonPath: { type: String },
        retrieveUnique: { type: Boolean },
        controlType: { type: String },
        value: { type: String }
    };
  
    static getMetaConfig() {
        return {
            controlName: 'JSONPath Filtered Control',
            fallbackDisableSubmit: false,
            version: '1.0',
            standardProperties: {
                visibility: true,
                fieldLabel: true,
                description: true,
                readOnly: true,
                required: true
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
                retrieveUnique: {
                    type: 'boolean',
                    title: 'Unique values only',
                    defaultValue: true
                },
                controlType: {
                    type: 'string',
                    title: 'Control Type',
                    required: true,
                    enum: ['Dropdown List', 'Textbox']
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
        if (this.name != null && this.name != '') {
            this.title = this.name;
        }
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
        this.title = this.name;
        var results = [];

        if (this.controlType != null && this.controlType != '') {
            if (this.jsonInput != null && this.jsonInput != '' & this.jsonPath != null && this.jsonPath != '') {
                var results = JSONPath({path: this.jsonPath, json: JSON.parse(this.jsonInput) });
                console.log('results');
                console.log(results);
                if (this.retrieveUnique != null && this.retrieveUnique) {
                    results = [...new Set(results)];
                    console.log('unique results');
                    console.log(results);
                }

                console.log(this);

                if ((this.value == null || this.value == '') && (results != null && results.length > 0)) {
                    this.value = results[0];
                }
            }

            switch (this.controlType) {
                case 'Dropdown List':
                    return html`<div>
                        <select
                            class="jsonpath-form-control"
                            .value=${this.value}
                            @blur=${this.handleBlur}
                        >${results.map(function(itt){ return html`<option value="${itt}">${itt}</option>`; })}</select>
                    </div>`;
                case 'Textbox':
                    return html`<div>
                        <input
                            type="textbox"
                            class="jsonpath-form-control"
                            .value=${this.value}
                            @blur=${this.handleBlur}
                        >
                    </div>`;
                case 'Multiline Textbox':
                    return html`<div>
                        <textarea
                            class="jsonpath-form-control"
                            .value=${this.value}
                            @blur=${this.handleBlur}
                        ></textarea>
                    </div>`;
                default:
                    return html`Please configure this control`;
            }

        }
        else {
            return html`Please configure this control`;
        }
    }

    updated() {
        if (this.value != null) {
            const args = {
                bubbles: true,
                cancelable: false,
                composed: true,
                detail: this.value,
            };
            const event = new CustomEvent('ntx-value-change', args);
            this.dispatchEvent(event);
        }
    }
}

const elementName = 'jsonpath-filtered-control';
customElements.define(elementName, JSONPathFilteredControl);