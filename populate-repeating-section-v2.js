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
            standardProperties: {
                visibility: true
            },
            properties: {
                repeatingSectionClass: {
                    type: 'string',
                    title: 'Repeating Section Class'
                },
                values: {
                    type: 'string',
                    title: 'Data to populate (JSON or XML)'
                }
            }
        };
    }
  
    constructor() {
        super();
    }

    render() {
        console.log('Populate Repeating Section: render()');
        this.render2().then(res => {
            console.log(res);            
        });   

        return html`<p>'Populate Repeating Section' for '${this.repeatingSectionClass}'<p/>`;
    }

    async render2() {
        try {
            if (this.repeatingSectionClass != null && this.repeatingSectionClass != '' && this.values != null && this.values != '') {
                var repeatingSection = document.getElementsByClassName(this.repeatingSectionClass);
                if (repeatingSection != null && repeatingSection.length > 0) {
                    repeatingSection = repeatingSection[0];

                    var isJSON = false;
                    var isXML = false;

                    var isJSON = false;
                    var isXML = false;

                    try {
                        var temp = JSON.parse(this.values);
                        if (temp != null) {
                            isJSON = true;
                        }
                    }
                    catch { }
                    try {
                        var parser = new DOMParser();
                        var temp3 = parser.parseFromString(this.values, "application/xml");
                        var err = temp3.querySelector("parsererror");
                        if (!err) {
                            isXML = true;
                        }
                    }
                    catch (exc) { }
                    
                    console.log("isJSON: " + isJSON);
                    console.log("isXML: " + isXML);

                    if (isJSON) {
                        try {
                            var parsed = JSON.parse(this.values);
                            console.log(parsed);
                            await addRows(parsed, repeatingSection);
                            writeJSONValuesToRepeater(parsed, repeatingSection, this.repeatingSectionClass);
                        }
                        catch (exc2) {
                            console.log(exc2);
                        }
                    }
                    else if (isXML) {
                        try {
                            var parser = new DOMParser();
                            var parsed = parser.parseFromString(this.values, "application/xml").querySelectorAll("Items Item");
                            console.log(parsed);
                            await addRows(parsed, repeatingSection);
                            writeXMLValuesToRepeater(parsed, repeatingSection, this.repeatingSectionClass);
                        }
                        catch (exc2) {
                            console.log(exc2);
                        }
                    }
                    else {
                        console.log("invalid repeating section data");
                    }
                }
            }
        }
        catch (exc) { 
            console.log(exc);
        }
    }
}

function getRowFields(repeatingSection, idx, repeatingSectionClass) {
    var lastSection = repeatingSection.querySelector('.ntx-repeating-section-repeated-section:nth-child(' + (idx + 1) + ')');
    var fields = lastSection.querySelectorAll('.' + repeatingSectionClass + ' input:not([type="checkbox"]):not([type="radio"]), .' + repeatingSectionClass + ' textarea, .nx-checkbox-group, .nx-radio-group');
    var fields2 = new Array();
    for (var o = 0; o < fields.length; o++) {
        if (fields[o].closest('[hidden]') == null) {
            fields2.push(fields[o]);
        }
    }
    return fields2;
}

function writeValueToRepeaterField(valueToWrite, destinationField) {
    if (destinationField.classList.contains('flatpickr-input')) {
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
        }, 100, destinationField, valueToWrite, clearIntVar);
        clearIntVar.intId = dtInterval;
    }
    else {
        if (destinationField.classList.contains('nx-checkbox-group')) {
            var cbs = destinationField.querySelectorAll('input[type="checkbox"]');
            var splitValue = valueToWrite;
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
            if (destinationField.classList.contains('nx-radio-group')) {
                var rads = fields[idx2].querySelectorAll('input[type="radio"]');
                for (var o = 0; o < rads.length; o++) {
                    if (rads[o].value == valueToWrite) {
                        rads[o].checked = true;
                        rads[o].setAttribute('checked', 'true');
                    }
                }
            }
            else {
                var valToSet = valueToWrite;

                try {
                    if (Array.isArray(valueToWrite)) {
                        valToSet = valueToWrite[0]['mail'];
                    }
                }
                catch (exc) { console.log(exc); }

                try {
                    destinationField.value = valToSet;
                }
                catch (exc) { console.log(exc); }

                try {
                    destinationField.closest('ng-select').value = valToSet;
                }
                catch (exc) { console.log(exc); }

                try {
                    destinationField.closest('ng-select').querySelector('.ng-value .ng-star-inserted').setAttribute('title', valToSet);
                }
                catch (exc) { console.log(exc); }

                try {
                    destinationField.closest('ng-select').querySelector('.ng-value .ng-star-inserted').textContent = valToSet;
                }
                catch (exc) { console.log(exc); }
 
                try {
                    var peopleField = destinationField.closest('ntx-simple-people-picker');
                    if (peopleField != null) {
                        destinationField.dispatchEvent(new Event('input'));
                        setTimeout(clickPeoplePickerSelection, 500, peopleField, 0);
                    }
                }
                catch (exc) { console.log(exc); }
            }
        }
    }
}

function writeXMLValuesToRepeater(parsed, repeatingSection, repeatingSectionClass) {
    for (var i = 0; i < parsed.length; i++) {
        var idx2 = 0;
        var fields = getRowFields(repeatingSection, idx2, repeatingSectionClass);

        var controlValues = parsed[i].querySelectorAll("*");
        var list = [].slice.call(controlValues);
        var texts = list.map(function (itt) { return itt.innerHTML; });

        for (var o = 0; o < texts.length; o++) {
            try {
                console.log(texts[o]);
                writeValueToRepeaterField(texts[o], fields[idx2]);
                idx2++;
            }
            catch (exc) {
                console.log(exc);
            }
        }       
    }
}

function writeJSONValuesToRepeater(parsed, repeatingSection, repeatingSectionClass) {
    for (var i = 0; i < parsed.length; i++) {
        var idx2 = 0;
        var fields = getRowFields(repeatingSection, idx2, repeatingSectionClass);

        for (var key in parsed[i]) {
            if (parsed[i].hasOwnProperty(key)) {
                try {
                    console.log(key + ': ' + parsed[i][key]);
                    writeValueToRepeaterField(parsed[i][key], fields[idx2]);
                    idx2++;
                }
                catch (exc) {
                    console.log(exc);
                }
            }
        }
    }
}

async function addRows(parsed, repeatingSection) {
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
}

function clickPeoplePickerSelection(field, counter) {
    var field2 = field.querySelectorAll('.ng-option:not(.ng-option-disabled)');
    if (field2 != null && field2.length > 0) {
        field2[0].dispatchEvent(new Event('click'));
    }
    else {
        if (counter < 10) {
            setTimeout(clickPeoplePickerSelection, 500, field, counter + 1);
        }
    }
}

// registering the web component
const elementName = 'populate-repeating-section';
customElements.define(elementName, PopulateRepeatingSection);