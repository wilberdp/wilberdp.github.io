import { html, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';
import 'https://cdn.jsdelivr.net/npm/flatpickr';
import 'https://cdn.jsdelivr.net/npm/angular@1.8.3/angular.min.js';

// define the component
export class PopulateRepeatingSection extends LitElement {
    static properties = {
        repeatingSectionClass: { type: String },
        values: { type: String },
        setIntervals: { type: Array }
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
                    title: 'Data to populate',
                    description: "JSON or XML"
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
        console.log('Populate Repeating Section: render()');
        if (this.mode) {
            if (this.values != null && this.values != "") {
                var $this = this;
                this.render2().then(res => {
                    var clearIntVar = { id: uuidv4(), counter: 0 };
                    var angInterval = setInterval(function () {
                        if (clearIntVar.counter > 20) {
                            clearInterval(clearIntVar.intId);
                        }
                        if ($this.setIntervals.length == 0) {
                            angularize($this).then(res2 => {
                                //closeDropdowns($this);
                                clearInterval(clearIntVar.intId);
                            });
                        }
                        clearIntVar.counter++;
                    }, 500);
                    clearIntVar.intId = angInterval;
                });
            }
        }
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
                            matchRowCountToData(parsed, repeatingSection).then((e) => {
                                writeJSONValuesToRepeater(this, parsed, repeatingSection);
                            });
                        }
                        catch (exc2) {
                            console.log(exc2);
                        }
                    }
                    else if (isXML) {
                        var parser = new DOMParser();
                        var parsed = parser.parseFromString(this.values, "application/xml").querySelectorAll("Items Item");
                        console.log(parsed);
                        matchRowCountToData(parsed, repeatingSection).then((e) => {
                            writeXMLValuesToRepeater(this, parsed, repeatingSection);
                        });
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
        //if (fields[o].closest('[hidden]') == null) {
            fields2.push(fields[o]);
        //}
    }
    return fields2;
}

async function writeValueToRepeaterField(parentElement, valueToWrite, destinationField) {
    valueToWrite = valueToWrite.replaceAll("&amp;", "&");

    if (destinationField.classList.contains('flatpickr-input')) {
        await new Promise(resolve => {
            var clearIntVar = { id: uuidv4(), counter: 0 };
            var dtInterval = setInterval(function (sel, dt, clearIntVar) {
                flatpickr(sel, { altInput: true, altFormat: "M d, Y", allowInput: true, dateFormat: "M d, Y" }).setDate(new Date(dt), true);
                if (sel.value == flatpickr.formatDate(new Date(dt), "M d, Y")) {
                    sel.classList.remove('nx-is-empty');
                    removeFromSetIntervals(parentElement, clearIntVar.intId);
                    clearInterval(clearIntVar.intId);
                    resolve();
                }
                clearIntVar.counter++;
                if (clearIntVar.counter > 20) {
                    removeFromSetIntervals(parentElement, clearIntVar.intId);
                    clearInterval(clearIntVar.intId);
                    resolve();
                }
            }, 100, destinationField, valueToWrite, clearIntVar);
            clearIntVar.intId = dtInterval;
            parentElement.setIntervals.push(dtInterval);
        });
    }
    else {
        if (destinationField.classList.contains('nx-checkbox-group')) {
            var cbs = destinationField.querySelectorAll('input[type="checkbox"]');
            var splitValue = valueToWrite.split(';#');
            for (var o = 0; o < cbs.length; o++) {
                cbs[o].checked = false;
                cbs[o].setAttribute('checked', 'false');
            }
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
                var rads = destinationField.querySelectorAll('input[type="radio"]');
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
                catch (exc) {
                    //console.log(exc);
                }

                try {
                    destinationField.value = valToSet;
                }
                catch (exc) {
                    //console.log(exc);
                }

                try {
                    destinationField.closest('ng-select').value = valToSet;
                }
                catch (exc) {
                    //console.log(exc);
                }

                try {
                    destinationField.closest('ng-select').querySelector('.ng-value .ng-star-inserted').setAttribute('title', valToSet);
                }
                catch (exc) {
                    //console.log(exc);
                }

                try {
                    destinationField.closest('ng-select').querySelector('.ng-value .ng-star-inserted').textContent = valToSet;
                }
                catch (exc) {
                    //console.log(exc);
                }

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

async function writeXMLValuesToRepeater(parentElement, parsed, repeatingSection) {
    for (var i = 0; i < parsed.length; i++) {
        var idx2 = 0;
        var fields = getRowFields(repeatingSection, i, parentElement.repeatingSectionClass);
        var controlValues = parsed[i].querySelectorAll("*");
        var list = [].slice.call(controlValues);
        var ids = list.map(function (itt) { return itt.tagName; });
        var texts = list.map(function (itt) { return itt.innerHTML; });
        var valuesWritten = new Array();
        var fieldsWritten = new Array();

        // populate by id
        for (var o = 0; o < texts.length; o++) {
            if (valuesWritten.indexOf(o) > -1) {
                continue;
            }

            var idToFind = ids[o];
            var fieldToFind = fields.filter(function (itt) { return itt.id.toLowerCase() == idToFind.toLowerCase(); });
    
            try {
                if (fieldToFind.length > 0) {
                    valuesWritten.push(o);
                    fieldsWritten.push(fields.indexOf(fieldToFind[0]));

                    await writeValueToRepeaterField(parentElement, texts[o], fieldToFind[0]);
                }
            }
            catch (exc) {
                console.log(exc);
            }
        } 

        // fill in the blanks
        for (var o = 0; o < texts.length; o++) {
            if (valuesWritten.indexOf(o) > -1) {
                continue;
            }

            while (fieldsWritten.indexOf(idx2) > -1) {
                idx2++;
            }

            valuesWritten.push(o);
            fieldsWritten.push(idx2);

            await writeValueToRepeaterField(parentElement, texts[o], fields[idx2]);
        }
    }
}

async function writeJSONValuesToRepeater(parentElement, parsed, repeatingSection) {
    for (var i = 0; i < parsed.length; i++) {
        var idx2 = 0;
        var fields = getRowFields(repeatingSection, i, parentElement.repeatingSectionClass);

        for (var key in parsed[i]) {
            if (parsed[i].hasOwnProperty(key)) {
                try {
                    console.log(key + ': ' + parsed[i][key]);
                    await writeValueToRepeaterField(parentElement, parsed[i][key], fields[idx2]);
                    idx2++;
                }
                catch (exc) {
                    console.log(exc);
                }
            }
        }
    }
}

async function matchRowCountToData(parsed, repeatingSection) {
    var originalSectionCount = repeatingSection.querySelectorAll('.ntx-repeating-section-repeated-section').length;
    if (originalSectionCount < parsed.length) {
        // add rows
        for (var i = 0; i < parsed.length - originalSectionCount; i++) {
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
    else if (originalSectionCount > parsed.length) {
        // delete rows
        for (var i = 0; i < originalSectionCount - parsed.length; i++) {
            var sectionCount = repeatingSection.querySelectorAll('.ntx-repeating-section-repeated-section').length;
            repeatingSection.querySelectorAll('.ntx-repeating-section-repeated-section')[sectionCount - 1].querySelector('.ntx-repeating-section-remove-button').click();
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

async function angularize(parentElement) {
    var formControls = document.querySelectorAll('.' + parentElement.repeatingSectionClass + ' ntx-form-control input, .' + parentElement.repeatingSectionClass + ' ntx-form-control ng-select, .' + parentElement.repeatingSectionClass + ' ntx-form-control ntx-simple-choice');
    formControls.forEach(function (itt) {
        itt.dispatchEvent(new Event('change', { bubbles: true }));
        itt.dispatchEvent(new Event('input', { bubbles: true }));
        itt.dispatchEvent(new Event('blur', { bubbles: true }));
        itt.dispatchEvent(new CustomEvent('ngModelChange', { bubbles: true }));
    });
    //return;

    for (var ii = 0; ii < formControls.length; ii++) {
        try {
            var fc2 = formControls[ii];
            if (fc2.tagName != null) {
                if (fc2.tagName.toLowerCase() == 'ng-select' || fc2.tagName.toLowerCase() == 'ntx-simple-choice') {
                    //fc2.dispatchEvent(new CustomEvent('ngModelChange', { bubbles: true }));

                    await new Promise(resolve => {
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
                                resolve();
                            }

                            if (optionToSelect != null) {

                                if (o.tagName.toLowerCase() == 'ng-select')
                                    optionToSelect.closest('.ng-option').click();
                                else if (o.tagName.toLowerCase() == 'ntx-simple-choice')
                                    optionToSelect.click();

                                removeFromSetIntervals(parentElement, clearIntVar.intId);
                                clearInterval(clearIntVar.intId);
                                resolve();
                            }
                            else {
                                clearIntVar.counter++;
                            }
                        }, 100, fc2);
                        clearIntVar.intId = selInterval;
                        parentElement.setIntervals.push(selInterval);
                    });
                }
                else {
                    fc2.dispatchEvent(new Event('change', { bubbles: true }));
                    fc2.dispatchEvent(new Event('input', { bubbles: true }));
                    fc2.dispatchEvent(new Event('blur', { bubbles: true }));

                    if (fc2.closest('ntx-datetime-picker') != null) {
                        fc2.dispatchEvent(new CustomEvent('ngModelChange', { bubbles: true }));
                    }
                }
            }
            
        }
        catch (exc) {
        }
    }
}

function closeDropdowns(parentElement) {
    document.querySelector('.' + parentElement.repeatingSectionClass).querySelectorAll('ng-select').forEach(function(i){ 
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
const elementName = 'populate-repeating-section';
customElements.define(elementName, PopulateRepeatingSection);