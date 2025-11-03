import { html, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

// define the component
export class HideActionPanel extends LitElement {
    static properties = {
        hide: { type: Boolean },
        hideByDefault: { type: Boolean }
    };
  
    // return a promise for contract changes.
    static getMetaConfig() {
        return {
            controlName: 'Hide Action Panel',
            fallbackDisableSubmit: false,
            version: '1.0',
            standardProperties: {
                visibility: true
            },
            properties: {
                hide: {
                    type: 'boolean',
                    title: 'Hide Action Panel',
                    description: "Add any boolean criteria to hide action panel including date range evaluation, etc",
                    required: true
                },
                hideByDefault: {
                    type: 'boolean',
                    title: 'Hide By Default',
                    description: "Hide by default then show?  This property essentially reverses the behavior to become 'Show Action Panel'"          
                }
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
        console.log('Hide Action Panel: render()');

        if (document.querySelectorAll('.hide-button-style').length == 0) {
            const style = document.createElement('style');
            style.classList.add('hide-button-style')
            style.innerText = 'ntx-action-panel.hide-button [data-e2e="btn-save-and-continue"], ntx-action-panel.hide-button [data-e2e="btn-submit"] { visibility: hidden !important }';
            document.querySelector('head').append(style);
        }

        document.querySelectorAll('ntx-action-panel').forEach((panel) => {
            if (this.hideByDefault) {
                panel.classList.add('hide-button');
            }
            else {
                panel.classList.remove('hide-button');
            }
        });

        var $this = this;

            if ($this.hide != null) {
                document.querySelectorAll('ntx-action-panel').forEach((panel) => {
                    if ($this.hide) {
                        panel.classList.add('hide-button');
                    }
                    else {
                        panel.classList.remove('hide-button');
                    }
                });
            }


        return html`<p>Hide Action Panel<p/>`;
    }

}

// registering the web component
const elementName = 'hide-action-panel';
customElements.define(elementName, HideActionPanel);