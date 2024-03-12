import { html, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';
import 'https://cdn.jsdelivr.net/npm/flatpickr';

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
        this.render2().then(res => {
            console.log(res);            
        });   

        return html`<p>Hello ${this.repeatingSectionClass}<p/>`;
    }

    async render2() {
        if (this.repeatingSectionClass != null && this.repeatingSectionClass != '' && this.values != null && this.values != '') {
            var repeatingSection = document.getElementsByClassName(this.repeatingSectionClass);
            if (repeatingSection != null && repeatingSection.length > 0) {
                repeatingSection = repeatingSection[0];
                var parsed = JSON.parse(this.values);
                for (var i = 0; i < parsed.length; i++) {
                    var idx2 = 0;
                    var lastSection = repeatingSection.querySelector('.ntx-repeating-section-repeated-section:last-child');
                    var fields =  lastSection.querySelectorAll('.' + this.repeatingSectionClass + ' input, .' + this.repeatingSectionClass + ' textarea');
                    for (var key in parsed[i]) {
                        if (parsed[i].hasOwnProperty(key)) {
                            console.log(key + ': ' + parsed[i][key]);
                            fields[idx2].value = parsed[i][key];
                            idx2++;
                        }
                    }
                    var sectionCount = repeatingSection.querySelector('.ntx-repeating-section-repeated-section').length;
                    repeatingSection.parentElement.closest('div').querySelector('button.btn-repeating-section-new-row').click();
                    var exists = false;
                    while (!exists) {
                        await new Promise(r => setTimeout(r, 2000));
                        var newSectionCount = repeatingSection.querySelector('.ntx-repeating-section-repeated-section').length;
                        if (sectionCount != newSectionCount) {
                            exists = true;
                        }
                    }
                }
            }
        }
    }
}

// registering the web component
const elementName = 'populate-repeating-section';
customElements.define(elementName, PopulateRepeatingSection);