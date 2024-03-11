import { html, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';
import 'https://code.jquery.com/jquery-3.7.1.min.js';

// define the component
export class PopulateRepeatingSection extends LitElement {
  
    static properties = {
        repeatingSectionClass: { type: String },
        values: { type: String }
    };
  
    // return a promise for contract changes.
    static getMetaConfig() {
        return {
            controlName: 'Populate Repeating Section',
            fallbackDisableSubmit: false,
            version: '1.0',
            properties: {
                repeatingSectionClass: {
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
        if (this.repeatingSectionClass != null && this.repeatingSectionClass != '' && this.values != null && this.values != '') {
            var repeatingSection = document.getElementsByClassName(this.repeatingSectionClass)[0];
            if (repeatingSection != null && repeatingSection.length > 0) {
                var parsed = JSON.parse(this.values);
                for (var i = 0; i < parsed.length; i++) {
                    var idx2 = 0;
                    var fields = jQuery('.' + this.repeatingSectionClass + ' input, .' + this.repeatingSectionClass + ' textarea');
                    for (var key in parsed[i]) {
                        if (parsed[i].hasOwnProperty(key)) {
                            console.log(key + ': ' + parsed[i][key]);
                            fields[idx2].val(parsed[i][key]);
                            idx2++;
                        }
                    }
                    jQuery('.' + this.repeatingSectionClass).closest('div').find('button.btn-repeating-section-new-row');
                }
            }
        }

        return html`<p>Hello ${this.repeatingSectionClass}<p/>`;
    }
}

// registering the web component
const elementName = 'populate-repeating-section';
customElements.define(elementName, PopulateRepeatingSection);