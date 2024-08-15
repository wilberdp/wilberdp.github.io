import { html, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

// define the component
export class HideActionBar extends LitElement {
    static properties = {
        hide: { type: Boolean },
        data: { type: String }
    };
  
    // return a promise for contract changes.
    static getMetaConfig() {
        return {
            controlName: 'Hide Action Bar',
            fallbackDisableSubmit: false,
            version: '1.0',
            standardProperties: {
                visibility: true
            },
            properties: {
                hide: {
                    type: 'boolean',
                    title: 'Hide Action Bar',
                    description: "Add any boolean criteria to hide action bar including date range evaluation, etc",
                    required: true
                },
                data: {
                    type: 'string',
                    title: 'Output Data',
                    description: "Resulting data output in JSON format",
                    isValueField: true
                },
            },
            events: ["ntx-value-change"]
        };
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

    render() {
        console.log('Hide Action Bar: render()');

        document.querySelectorAll('ntx-action-panel').forEach((panel) => {
            if (this.hide) {
                panel.style.display = 'none';
            }
            else {
                panel.style.display = '';
            }
        });


        return html`<p>'Hide Action Bar'<p/>`;
    }

}

// registering the web component
const elementName = 'hide-action-bar';
customElements.define(elementName, HideActionBar);