import { html, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';
import 'https://cdn.jsdelivr.net/npm/flatpickr';
import 'https://cdn.jsdelivr.net/npm/angular@1.8.3/angular.min.js';

// define the component
export class PopulateMultiselectDropdown extends LitElement {
    static properties = {
        multiClass: { type: String },
        values: { type: String },
        setIntervals: { type: Array }
    };
  
    // return a promise for contract changes.
    static getMetaConfig() {
        return {
            controlName: 'Populate Multiselect Dropdown',
            fallbackDisableSubmit: false,
            version: '1.0',
            standardProperties: {
                visibility: true
            },
            properties: {
                multiClass: {
                    type: 'string',
                    title: 'Repeating Section Class'
                },
                values: {
                    type: 'string',
                    title: 'Data to populate',
                    description: ', or ;# separated string.  , may fail if commas are present in the values'
                },
                mode: {
                    type: 'boolean',
                    title: 'Form Mode',
                    description: "'Is New mode' goes here to control rendering",
                    required: true
                }
            },
            events: ["ntx-value-change"]
        };
    }
  
    constructor() {
        super();
        this.setIntervals = new Array();
    }

    render() {
        console.log('Populate Multiselect Dropdown: render()');
        if (this.mode) {
            var $this = this;
            this.render2().then(res => {
                //this.render2();
            });
        }

        return html`<p>'Populate Multiselect Dropdown' for '${this.multiClass}'<p/>`;
    }

    async render2() {
        try {
            if (this.multiClass != null && this.multiClass != '') {
                var multiselect = document.getElementsByClassName(this.multiClass);
                if (multiselect != null && multiselect.length > 0) {
                    multiselect = multiselect[0];
                    var container = multiselect.closest('ntx-form-control');
                    cleanUpAndSet(this, container);
                }
            }
        }
        catch (exc) {
            console.log(exc);
        }
    }

}

function cleanUpAndSet(parentElement, container) {
    var entries = container.querySelectorAll('.ng-value-container .ng-value span.ng-value-icon.ng-star-inserted');
    if (entries.length > 0) {
        entries[0].dispatchEvent(new Event('click', { bubbles: true }));
        setTimeout(cleanUpAndSet, 100, parentElement, container);
    }
    else {
        if (parentElement.values != null && parentElement.values != '') {
            // try ;# split
            var splitVals = parentElement.values.split(';#');
            if (splitVals == null || splitVals.length == 1) {
                // try , split
                splitVals = parentElement.values.split(',');
            }

            var inputToTrigger = container.querySelector('div[role="combobox"] input');
            inputToTrigger.dispatchEvent(new Event('input', { bubbles: true }));
            scrollToTop('1');

            for (var i = 0; i < splitVals.length; i++) {
                container.querySelectorAll('.ng-dropdown-panel-items .ng-option').forEach(function (itt) {
                    if (itt.innerText.trim() == splitVals[i].trim()) {
                        itt.dispatchEvent(new Event('click', { bubbles: true }));
                        scrollToTop('2');
                    }
                });
            }

            container.querySelector('ng-dropdown-panel').remove();
            container.querySelector('ng-select').classList.remove('ng-select-bottom');
            container.querySelector('ng-select').classList.remove('ng-select-top');
            container.querySelector('ng-select').classList.remove('ng-select-opened');
        }
                        
        //container.querySelector('ntx-simple-select-multi').dispatchEvent(new CustomEvent('ngModelChange', { bubbles: true }));
        //document.activeElement.blur();
    }
}

function removeFromSetIntervals(parentElement, value) {
    var idx = parentElement.setIntervals.indexOf(value);
    if (idx > -1) {
        parentElement.setIntervals.splice(idx, 1);
    }
}

function scrollToTop(data) {
    console.log(data);
    document.querySelector('.nx-form-runtime-content.nx-theme-page').scroll({ top: 0, left: 0 });
}

function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}

// registering the web component
const elementName = 'populate-multiselect-dropdown';
customElements.define(elementName, PopulateMultiselectDropdown);