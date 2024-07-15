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
            if (this.values != null && this.values != "") {
                var $this = this;
                this.render2().then(res => {
                
                });
            }
        }

        return html`<p>'Populate Multiselect Dropdown' for '${this.multiClass}'<p/>`;
    }

    async render2() {
        try {
            if (this.multiClass != null && this.multiClass != '' && this.values != null && this.values != '') {
                var multiselect = document.getElementsByClassName(this.multiClass);
                if (multiselect != null && multiselect.length > 0) {
                    multiselect = multiselect[0];
                
                    // try ;# split
                    var splitVals = this.values.split(';#');
                    if (splitVals == null || splitVals.length == 1) {
                        // try , split
                        splitVals = this.values.split(',');
                    }
                    
                    var container = multiselect.closest('ntx-form-control');
                    var inputToTrigger = container.querySelector('div[role="combobox"] input');
                    inputToTrigger.dispatchEvent(new Event('input'));

                    for (var i = 0; i < splitVals.length; i++) {
                        container.querySelectorAll('.ng-dropdown-panel-items .ng-option').forEach(function (itt) { if (itt.innerText == splitVals[i]) { itt.click(); } });
                    }

                    container.querySelector('ng-dropdown-panel').remove();
                    container.querySelector('ng-select').classList.remove('ng-select-bottom');
                    container.querySelector('ng-select').classList.remove('ng-select-top');
                    container.querySelector('ng-select').classList.remove('ng-select-opened');
                    container.closest('form').dispatchEvent(new Event('input'));

                        /*
                        var containerElement = document.createElement('div');
                        containerElement.classList.add('ng-value');
                        containerElement.classList.add('ng-star-inserted');
                        var xElement = document.createElement('span');
                        xElement.classList.add('ng-value-icon');
                        xElement.classList.add('left');
                        xElement.classList.add('ng-star-inserted');
                        xElement.innerHTML = "×";
                        xElement.setAttribute("aria-hidden", "true");
                        var valueElement = document.createElement('span');
                        valueElement.classList.add('ng-value-label');
                        valueElement.classList.add('ng-star-inserted');
                        valueElement.innerHTML = splitVals[i].replaceAll("&", "&amp;");
                        valueElement.setAttribute("title", splitVals[i].replaceAll("&", "&amp;"));
                        containerElement.append(xElement);
                        containerElement.append(valueElement);
                        container.append(containerElement);

                        document.querySelector('#_de07458fb7ca85e382eb5c95ccaf0c77').value = 'SFPD';
                        document.querySelector('#_de07458fb7ca85e382eb5c95ccaf0c77').dispatchEvent(new Event('input'));
                        document.querySelector('.ng-option').click();
                        document.querySelector('#_de07458fb7ca85e382eb5c95ccaf0c77').value = '';
                        document.querySelector('#_de07458fb7ca85e382eb5c95ccaf0c77').dispatchEvent(new Event('input'));
                        document.querySelector('#_de07458fb7ca85e382eb5c95ccaf0c77').value = 'Rec & Park';
                        document.querySelector('#_de07458fb7ca85e382eb5c95ccaf0c77').dispatchEvent(new Event('input'));
                        document.querySelector('.ng-option').click();
                        document.querySelector('#_de07458fb7ca85e382eb5c95ccaf0c77').value = '';
                        document.querySelector('#_de07458fb7ca85e382eb5c95ccaf0c77').dispatchEvent(new Event('input'));
                        document.querySelector('ng-dropdown-panel').remove()
                        */
                }
            }
        }
        catch (exc) { 
            console.log(exc);
        }
    }
}

function angularize(parentElement) {
    document.querySelectorAll('.' + parentElement.multiClass + ' ntx-form-control').forEach(function(fc) {
        fc.querySelectorAll('input, ng-select, ntx-simple-choice').forEach(function(fc2) {
            if (fc2.tagName.toLowerCase() == 'ng-select' || fc2.tagName.toLowerCase() == 'ntx-simple-choice') { 
                fc2.dispatchEvent(new CustomEvent('ngModelChange', { bubbles: true })); 
                var clearIntVar = { id: uuidv4(), counter: 0 };
                var selInterval = setInterval(function (o) {
                    var optionToSelect = null;

                    if (o.value != null && o.value != '') {
                        if (o.tagName.toLowerCase() == 'ng-select')
                            optionToSelect = o.querySelector('ntx-simple-select-single ng-dropdown-panel .nx-ng-option[value="' + o.value + '"]');
                        else if (o.tagName.toLowerCase() == 'ntx-simple-choice')
                            optionToSelect = o.querySelector('ntx-simple-choice .nx-radio input[type="radio"][checked="true"]');
                    }

                    if (clearIntVar.counter > 20) {
                        removeFromSetIntervals(parentElement, clearIntVar.intId);
                        clearInterval(clearIntVar.intId);
                    }

                    if (optionToSelect != null) {

                        if (o.tagName.toLowerCase() == 'ng-select')
                            optionToSelect.closest('.ng-option').click();
                        else if (o.tagName.toLowerCase() == 'ntx-simple-choice')
                            optionToSelect.click();

                        removeFromSetIntervals(parentElement, clearIntVar.intId);
                        clearInterval(clearIntVar.intId);
                        scrollToTop(2);
                    }
                    else {
                        clearIntVar.counter++;
                    }
                }, 100, fc2);
                clearIntVar.intId = selInterval;
                parentElement.setIntervals.push(selInterval);
            }
            else {
                fc2.dispatchEvent(new Event('change', { bubbles: true }));
                fc2.dispatchEvent(new Event('input', {bubbles: true}));
                fc2.dispatchEvent(new Event('blur', { bubbles: true }));

                if (fc2.closest('ntx-datetime-picker') != null) {
                    fc2.dispatchEvent(new CustomEvent('ngModelChange', { bubbles: true }));
                }
                scrollToTop(3);
            }
        });
    });
}

function closeDropdowns(parentElement) {
    document.querySelector('.' + parentElement.multiClass).querySelectorAll('ng-select').forEach(function(i){ 
        var panel = i.querySelector('ng-dropdown-panel');
        if (panel != null) {
            panel.remove();
            i.classList.remove('ng-select-opened');
        }
    });

    document.querySelector('body').click();
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