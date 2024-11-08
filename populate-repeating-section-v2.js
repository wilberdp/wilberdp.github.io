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
                this.render2();
            }
        }
        return html`<p>'Populate Repeating Section' for '${this.repeatingSectionClass}'<p/>`;
    }

    async render2() {
        try {
            console.log('Populate Repeating Section: render2()');

            if (this.repeatingSectionClass != null && this.repeatingSectionClass != '' && this.values != null && this.values != '') {
                var repeatingSection = document.getElementsByClassName(this.repeatingSectionClass);
                if (repeatingSection != null && repeatingSection.length > 0) {
                    repeatingSection = repeatingSection[0];

                    var loadingScreen = '<div style="z-index: 9000;background: rgba(0,0,0,0.4);" id="overlayContainerCustom" class="overlayLoading"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="position: absolute; width: 0; height: 0" id="__SVG_SPRITE_NODE__"><symbol viewBox="0 0 34 34" id="nintex-x-loader-center-left"><path d="M24.01 17l-17 17L0 26.99 9.99 17 0 7.01 7.01 0l17 17z"></path></symbol><symbol viewBox="0 0 34 34" id="nintex-x-loader-center-right"><path d="M24.01 17L34 26.99 26.99 34l-17-17 17-17L34 7.01 24.01 17z"></path></symbol><symbol viewBox="0 0 24 34" id="nintex-x-loader-left"><path d="M24 17L7.01 34 0 26.99 9.98 17 0 7.01 7.01 0 24 17z"></path></symbol><symbol viewBox="0 0 24 34" id="nintex-x-loader-right"><path d="M14.02 16.99L24 26.98l-7.01 7L0 16.99 16.99 0 24 7.01l-9.98 9.98z"></path></symbol></svg><div class="nx-modal-overlay nx-modal-overlay-override"><div class="nx-modal-dialog nx-dialog-thin nx-dialog-small"><div class="nx-modal-dialog-body"><div class="nx-spinner-container nx-spinner-container--center"><div class="nx-nintex-spinner nx-spinner nx-nintex-spinner-large nx-spinner-theme-light"><div class="nx-nintex-spinner-trail-left nx-nintex-spinner-fifth"><svg xmlns="http://www.w3.org/2000/svg" focusable="false" class="nx-icon"><use xlink:href="#nintex-x-loader-left"></use></svg></div><div class="nx-nintex-spinner-trail-left nx-nintex-spinner-forth"><svg xmlns="http://www.w3.org/2000/svg" focusable="false" class="nx-icon"><use xlink:href="#nintex-x-loader-left"></use></svg></div><div class="nx-nintex-spinner-trail-left nx-nintex-spinner-third"><svg xmlns="http://www.w3.org/2000/svg" focusable="false" class="nx-icon"><use xlink:href="#nintex-x-loader-left"></use></svg></div><div class="nx-nintex-spinner-trail-left nx-nintex-spinner-second"><svg xmlns="http://www.w3.org/2000/svg" focusable="false" class="nx-icon"><use xlink:href="#nintex-x-loader-left"></use></svg></div><div class="nx-nintex-spinner-middle"><svg xmlns="http://www.w3.org/2000/svg" focusable="false" class="nx-icon nx-nintex-spinner-left"><use xlink:href="#nintex-x-loader-center-left"></use></svg><svg xmlns="http://www.w3.org/2000/svg" focusable="false" class="nx-icon nx-nintex-spinner-right"><use xlink:href="#nintex-x-loader-center-right"></use></svg></div><div class="nx-nintex-spinner-trail-right nx-nintex-spinner-second"><svg xmlns="http://www.w3.org/2000/svg" focusable="false" class="nx-icon"><use xlink:href="#nintex-x-loader-right"></use></svg></div><div class="nx-nintex-spinner-trail-right nx-nintex-spinner-third"><svg xmlns="http://www.w3.org/2000/svg" focusable="false" class="nx-icon"><use xlink:href="#nintex-x-loader-right"></use></svg></div><div class="nx-nintex-spinner-trail-right nx-nintex-spinner-forth"><svg xmlns="http://www.w3.org/2000/svg" focusable="false" class="nx-icon"><use xlink:href="#nintex-x-loader-right"></use></svg></div><div class="nx-nintex-spinner-trail-right nx-nintex-spinner-fifth"><svg xmlns="http://www.w3.org/2000/svg" focusable="false" class="nx-icon"><use xlink:href="#nintex-x-loader-right"></use></svg></div></div></div><p class="nx-spinner-status">Loading...</p></div></div></div></div>';
                    if (document.querySelector('#overlayContainerCustom') == null) {
                        var loadingHtml = stringToHTML(loadingScreen);
                        console.log(loadingHtml);
                        repeatingSection.closest('body').append(loadingHtml);
                    }

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
                            matchRowCountToData(parsed, repeatingSection).then(async (e) => {
                                writeJSONValuesToRepeater(this, parsed, repeatingSection).then((e2) => { 
                                    document.querySelector('#overlayContainerCustom').remove();
                                });
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
                        matchRowCountToData2(parsed, repeatingSection).then(async (e) => {
                            writeXMLValuesToRepeater(this, parsed, repeatingSection).then((e2) => {
                                document.querySelector('#overlayContainerCustom').remove();
                            });
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

    if (destinationField != null && destinationField.classList != null) {
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
                            fireEvents(cbs[o]);
                        }
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
            
                // Textbox
                if (destinationField.closest('ntx-textbox') != null || destinationField.closest('ntx-number') != null || destinationField.closest('ntx-email') != null) {
                    destinationField.value = valToSet;
                    fireEvents(destinationField);
                }
                // Dropdown
                else if (destinationField.closest('ntx-simple-select-single') != null && valToSet != null && valToSet != '') {
                    var dField = destinationField.closest('ntx-simple-select-single');
                    var sel = dField.querySelector('ng-select');
                                        
                    destinationField.value = valToSet;
                    destinationField.dispatchEvent(new CustomEvent('input', { bubbles: true }));
                    var opt = sel.querySelector('ng-dropdown-panel .ng-option .nx-ng-option[value="' + valToSet + '"]');

                    pause(100).then((e) => { 
                        if (opt == null) {
                            opt = sel.querySelector('ng-dropdown-panel .ng-option .nx-ng-option[value="' + valToSet + '"]');
                        }
                        if (opt != null) {
                            opt.dispatchEvent(new Event('click', { bubbles: true }));
                        }
                        var sel2 = sel.querySelector('.ng-dropdown-panel');
                        if (sel2 != null) {
                            sel2.style.display = 'none';
                        }
                    });
                }
                // Radio buttons
                else if (destinationField.classList.contains('nx-radio-group')) {
                    var rads = destinationField.querySelectorAll('input[type="radio"]');
                    for (var o = 0; o < rads.length; o++) {
                        if (rads[o].value == valueToWrite) {
                            rads[o].checked = true;
                            rads[o].setAttribute('checked', 'true');
                            fireEvents(rads[o]);
                        }
                    }
                }
                // People picker
                else if (destinationField.closest('ntx-simple-people-picker') != null) {
                    var peopleField = destinationField.closest('ntx-simple-people-picker');
                    if (peopleField != null) {
                        destinationField.value = valToSet;
                        destinationField.dispatchEvent(new Event('input'));
                        setTimeout(clickPeoplePickerSelection, 500, peopleField, 0);
                    }
                }
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

// deprecated
async function matchRowCountToData(parsed, repeatingSection) {
    var originalSectionCount = repeatingSection.querySelectorAll('.ntx-repeating-section-repeated-section').length;
    if (originalSectionCount < parsed.length) {
        // add rows
        for (var i = 0; i < parsed.length - originalSectionCount; i++) {
            var sectionCount = repeatingSection.querySelectorAll('.ntx-repeating-section-repeated-section').length;
            repeatingSection.parentElement.closest('div').querySelector('button.btn-repeating-section-new-row').click();
            var exists = false;
            while (!exists) {
                await pause(100);
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
                await pause(100);
                var newSectionCount = repeatingSection.querySelectorAll('.ntx-repeating-section-repeated-section').length;
                if (sectionCount != newSectionCount) {
                    exists = true;
                }
            }
        }
    }
}

// delete all but the first, add one, delete the first, then add target - 1
async function matchRowCountToData2(parsed, repeatingSection) {
    var originalSectionCount = repeatingSection.querySelectorAll('.ntx-repeating-section-repeated-section').length;
    console.log(originalSectionCount);
    // delete all rows
    for (var i = originalSectionCount; i > 1; i--) {
        var sectionCount = repeatingSection.querySelectorAll('.ntx-repeating-section-repeated-section').length;
        repeatingSection.querySelectorAll('.ntx-repeating-section-repeated-section')[0].querySelector('.ntx-repeating-section-remove-button').click();
        var exists = false;
        while (!exists) {
            console.log('sectionCount1: ' + sectionCount);
            await pause(100);
            var newSectionCount = repeatingSection.querySelectorAll('.ntx-repeating-section-repeated-section').length;
            if (sectionCount != newSectionCount) {
                exists = true;
            }
        }
    }

    // add one
    repeatingSection.parentElement.closest('div').querySelector('button.btn-repeating-section-new-row').click();

    // delete first
    repeatingSection.querySelectorAll('.ntx-repeating-section-repeated-section')[0].querySelector('.ntx-repeating-section-remove-button').click();

    // add new rows
    if (parsed.length > 1) {
        for (var i = 1; i < parsed.length; i++) {
            var sectionCount = repeatingSection.querySelectorAll('.ntx-repeating-section-repeated-section').length;
            repeatingSection.parentElement.closest('div').querySelector('button.btn-repeating-section-new-row').click();
            var exists = false;
            while (!exists) {
                console.log('sectionCount2: ' + sectionCount);
                await pause(100);
                var newSectionCount = repeatingSection.querySelectorAll('.ntx-repeating-section-repeated-section').length;
                if (sectionCount != newSectionCount) {
                    exists = true;
                }
            }
        }
    }
}

async function pause(ms) {
    new Promise(r => setTimeout(r, ms));
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

function fireEvents(ele) {
    ele.dispatchEvent(new Event('input', { bubbles: true }));
    ele.dispatchEvent(new Event('blur', { bubbles: true }));
}

function stringToHTML(html, trim = true) {
  // Process the HTML string.
  html = trim ? html.trim() : html;
  if (!html) return null;

  // Then set up a new template element.
  const template = document.createElement('template');
  template.innerHTML = html;
  const result = template.content.children;

  // Then return either an HTMLElement or HTMLCollection,
  // based on whether the input HTML had one or more roots.
  if (result.length === 1) return result[0];
  return result;
}

function removeFromSetIntervals(parentElement, value) {
    var idx = parentElement.setIntervals.indexOf(value);
    if (idx > -1) {
        parentElement.setIntervals.splice(idx, 1);
    }
}

function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}

// registering the web component
const elementName = 'populate-repeating-section';
customElements.define(elementName, PopulateRepeatingSection);