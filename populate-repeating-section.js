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
            visibility: true,
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

        return html`<p>'Populate Repeating Section' for '${this.repeatingSectionClass}'<p/>`;
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
                    var fields =  lastSection.querySelectorAll('.' + this.repeatingSectionClass + ' input:not([type="checkbox"]):not([type="radio"]), .' + this.repeatingSectionClass + ' textarea, .nx-checkbox-group, .nx-radio-group');
                    for (var key in parsed[i]) {
                        if (parsed[i].hasOwnProperty(key)) {
                            console.log(key + ': ' + parsed[i][key]);
                            if (fields[idx2].classList.contains('flatpickr-input')) {
                                var clearIntVar = { id: idx2, counter: 0 };
                                var dtInterval = setInterval(function (sel, dt, clearIntVar) {
                                    flatpickr(sel, { allowInput: true, dateFormat: "M d, Y" }).setDate(new Date(dt), true);
                                    if (sel.value == flatpickr.formatDate(new Date(dt), "M d, Y")) {
                                        clearInterval(clearIntVar.intId);
                                        sel.classList.remove('nx-is-empty');
                                    }
                                    clearIntVar.counter++;
                                    if (clearIntVar.counter > 20) {
                                        clearInterval(clearIntVar.intId);
                                    }
                                }, 100, fields[idx2], parsed[i][key], clearIntVar);
                                clearIntVar.intId = dtInterval;
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
                                        try {
                                            fields[idx2].value = parsed[i][key];
                                        } catch { }
                                        try {
                                            fields[idx2].closest('ng-select').value = parsed[i][key];
                                        } catch { }
                                        try {
                                            fields[idx2].closest('ng-select').querySelector('.ng-value .ng-star-inserted').setAttribute('title', parsed[i][key]);
                                        } catch { }
                                        try {
                                            fields[idx2].closest('ng-select').querySelector('.ng-value .ng-star-inserted').textContent = parsed[i][key];
                                        } catch { }
                                        try {
                                            var peopleField = fields[idx2].closest('ntx-simple-people-picker');
                                            if (peopleField != null) {
                                                fields[idx2].dispatchEvent(new Event('input'));
                                                var clearIntVar2 = { id: idx2, counter: 0 };
                                                var peopleInterval = setInterval(function (peopleField) {
                                                    peopleField = peopleField.querySelectorAll('.ng-option:not(.ng-option-disabled)');
                                                    if (peopleField != null && peopleField.length > 0) {
                                                        peopleField[0].dispatchEvent(new Event('click'));
                                                        clearInterval(clearIntVar2.intId);
                                                    }
                                                    clearIntVar2.counter++;
                                                    if (clearIntVar2.counter) {
                                                        clearInterval(clearIntVar2.intId);
                                                    }
                                                }, 500, peopleField);
                                                clearIntVar2.intId = peopleInterval;
                                            }
                                        }
                                        catch {}
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