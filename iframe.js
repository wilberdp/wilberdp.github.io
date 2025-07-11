import {css, html, LitElement, styleMap} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

export class Iframe extends LitElement {
    // Define scoped styles right with your component, in plain CSS
    static styles = css`  //Add custom CSS. See https://help.nintex.com/en-US/formplugins/Reference/Style.htm
      :host {
        height: 100%;
        width: 100%;
        display: block;
      }

      .frame {
        display: inline-block;
        height: 100%;
        width: 100%;
        background-color: transparent;
        border: none;
      }
    `;

    static getMetaConfig() {
        // plugin contract information
        return {
            controlName: 'IFrame',
            fallbackDisableSubmit: false,
            description: 'IFrame component',
            iconUrl: "one-line-text",
            groupName: 'Visual',
            version: '1.0',
            properties: { //Custom configuration fields. See https://help.nintex.com/en-US/formplugins/Reference/CustomField.htm
                src: {
                    type: 'string',
                    title: 'Source URL',
                    description: 'URL of the iframe, please note many sites block render in iframes'
                },
                height: {
                    type: 'string',
                    title: 'Height',
                    description: 'Height of the component',
                }
            },
            standardProperties: {
                readOnly: true,  //Add a read-only mode. See https://help.nintex.com/en-US/formplugins/Reference/ReadOnly.htm
                required: true,
                description: true,
            }
        };
    }

    static properties = {
        name: 'Wikipedia',
        title: 'Wikipedia',
        src: 'https://www.wikipedia.org/',
        height: '100%'
    }

    // Render the UI as a function of component state
    render() {
        let styles = {height: this.height};

        return html`
            <iframe
                    class="frame"
                    style=${styleMap(styles)}
                    name=${this.name}
                    allow="geolocation *; microphone; camera"
                    title=${this.title}
                    src=${this.src}
            ></iframe>`;
    }
}

// registering the web component.
const elementName = 'iframe';
customElements.define(elementName, Iframe);