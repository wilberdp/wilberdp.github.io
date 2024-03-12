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
                for (var i = 0; i < parsed.length - 1; i++) {
                    var sectionCount = repeatingSection.querySelectorAll('.ntx-repeating-section-repeated-section').length;
                    repeatingSection.parentElement.closest('div').querySelector('button.btn-repeating-section-new-row').click();
                    var exists = false;
                    while (!exists) {
                        await new Promise(r => setTimeout(r, 100));
                        var newSectionCount = repeatingSection.querySelectorAll('.ntx-repeating-section-repeated-section').length;
                        if (sectionCount != newSectionCount) {
                            exists = true;
                        }
                    }
                }

                for (var i = 0; i < parsed.length; i++) {
                    var idx2 = 0;
                    var lastSection = repeatingSection.querySelector('.ntx-repeating-section-repeated-section:nth-child(' + (i + 1) + ')');
                    var fields =  lastSection.querySelectorAll('.' + this.repeatingSectionClass + ' input:not([type="checkbox"]), .' + this.repeatingSectionClass + ' textarea, .nx-checkbox-group, .nx-radio-group');
                    for (var key in parsed[i]) {
                        if (parsed[i].hasOwnProperty(key)) {
                            console.log(key + ': ' + parsed[i][key]);
                            if (fields[idx2].classList.contains('flatpickr-input')) {
                                //await new Promise(r => setTimeout(r, 1000));
                                setTimeout(function (sel, dt) {
                                    flatpickr(sel, { allowInput: true, dateFormat: "M d, Y" }).setDate(new Date(dt), true);
                                }, 2000, fields[idx2], parsed[i][key]);
                            }
                            else {
                                if (fields[idx2].classList.contains('nx-checkbox-group')) {
                                    var cbs = fields[idx2].querySelectorAll('input[type="checkbox"]');
                                    var splitValue = parsed[i][key].split(';#');
                                    for (var o = 0; o < cbs.length; o++) {
                                        for (var p = 0; p < splitValue.length; p++) {
                                            if (cbs[o].value == splitValue[p]) {
                                                cbs[o].checked = true;
                                                cbs[o].setAttribute('checked', 'true');
                                            }
                                        }
                                    }
                                }
                                else {
                                    if (fields[idx2].classList.contains('nx-radio-group')) {
                                        var rads = fields[idx2].querySelectorAll('input[type="radio"]');
                                        for (var o = 0; o < rads.length; o++) {
                                            if (rads[o].value == parsed[i][key]) {
                                                rads[o].checked = true;
                                                rads[o].setAttribute('checked', 'true');
                                            }
                                        }
                                    }
                                    else {
                                        fields[idx2].value = parsed[i][key];
                                    }
                                }
                            }
                            idx2++;
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