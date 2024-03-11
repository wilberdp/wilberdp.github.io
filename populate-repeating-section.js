import { html,LitElement} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';
// define the component
export class PopulateRepeatingSection extends LitElement {
  
    static properties = {
        repeatingSection: { type: String },
        values: { type: String }
    };
  
    // return a promise for contract changes.
    static getMetaConfig() {
        return {
            controlName: 'Populate Repeating Section',
            fallbackDisableSubmit: false,
            version: '1.2',
            properties: {
                repeatingSection: {
                    type: 'string',
                    title: 'Repeating Section Class'
                },
                values: {
                    type: 'string',
                    title: 'JSON used to populate'
                }
            }
        };
    }
  
    constructor() {
        super();
    }

    render() {
        if (this.repeatingSection != null && this.repeatingSection != '' && this.values != null && this.values != '') {
            var parsed = JSON.parse(this.values);
            for (var i = 0; i < parsed.length; i++) {
                for (var key in parsed[i]) {
                    if (parsed[i].hasOwnProperty(key)) {
                        console.log(key + ': ' + parsed[i][key]);
                    }
                }
            }
        }

        return html`<p>Hello ${this.repeatingSection}<p/>`;
    }
}

// registering the web component
const elementName = 'populate-repeating-section';
customElements.define(elementName, PopulateRepeatingSection);