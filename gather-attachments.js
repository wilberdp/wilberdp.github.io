import { html, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

var previousAttachments = null;

// define the component
export class GatherAttachments extends LitElement {
    // return a promise for contract changes.
    static getMetaConfig() {
        return {
            controlName: 'GatherAttachments',
            fallbackDisableSubmit: false,
            version: '1.0',
            standardProperties: {
                visibility: true
            },
            properties: {
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

        return html`<p>GatherAttachments</p>`;
    }

    async render2() {
        try {
            setInterval(function(){
                populateAttachmentJson();
            }, 10000);
        }
        catch(exc) { 
            console.log(exc);
        }
    }
}

function populateAttachmentJson() {
    var json = {"uploads":[]};

    if (previousAttachments == null) {
        previousAttachments = {"uploads":[]};
    }

    var fileUploads = document.querySelectorAll('[class*="attachments"]');
    for (var o = 0; o < fileUploads.length; o++) {
        var classes = fileUploads[o].classList;
        var className = '';
        for (var i = 0; i < classes.length; i++) {
            if (classes[i].indexOf('attachments') == 0) {
                className = classes[i];
                break;
            }
        }
        if (className != '') {
            var att = retrieveAttachments('.' + className);
            if (att != null && att.length > 0) {
                var tcn = className.replace('attachments', '').replaceAll('_s_', '/').replaceAll('_', ' ');
                var tkey = json["uploads"].filter(function(itt){ return itt["name"] == tcn });
                if (tkey == null || tkey.length == 0) {
                    json["uploads"].push( { "name": tcn, "values": att });
                }
                else {
                    tkey[0].values.concat(att);
                }                
            }
        } 
    }
    
    var dataToOutput = {"upload":[]};

    console.log(previousAttachments);
    console.log(json);

    console.log(JSON.stringify(previousAttachments) === JSON.stringify(json));

    var additions = getObjectDifferences(previousAttachments, json);
    console.log('differences');
    console.log(additions);

    previousAttachments = structuredClone(json);
    
    //console.log(dataToOutput);
    //document.querySelector('.attachmentsJson textarea').value = JSON.stringify(dataToOutput);
    //document.querySelector('.attachmentsJson textarea').dispatchEvent(new Event('blur'));
    return;

    if (initialAttachments == null || initialAttachments.uploads == null || initialAttachments.uploads.length == 0) {
        initialAttachments = json;
        document.querySelector('.attachmentsJson textarea').value = JSON.stringify({"uploads":[]});
        document.querySelector('.attachmentsJson textarea').dispatchEvent(new Event('blur'));
    }
    else {       
        var jsonKeys = json['uploads'].map(function(itt) { return itt['name']; });
        var jsonValues = json['uploads'].map(function(itt) { return itt['values']; });
        var initialKeys = initialAttachments['uploads'].map(function(itt) { return itt['name']; });
        var initialValues = initialAttachments['uploads'].map(function(itt) { return itt['values']; });

        if (updatedAttachments == null) {
            updatedAttachments = {"upload":[]};
        } 

        // remove
        for (var i = 0; i < initialKeys.length; i++) {
            if (jsonKeys.indexOf(initialKeys[i]) == -1) {
                updatedAttachments['uploads'] = updatedAttachments['uploads'].filter(function(itt){ return itt['name'] != initialKeys[i] });
            }
            else {
                for (var o = 0; o < initialValues[i].length; o++) {
                    var newJsonEntry = updatedAttachments['uploads'].filter(function(itt) { return itt['name'] == initialKeys[i] });
                    var jsonEntry = json['uploads'].filter(function(itt) { return itt['name'] == initialKeys[i] });
                    if (newJsonEntry != null && newJsonEntry.length > 0 && jsonEntry != null && jsonEntry.length > 0 && jsonEntry[0] != null && jsonEntry[0]['values'] != null) {
                        var idx = jsonEntry[0]['values'].indexOf(initialValues[i][o]);
                        if (idx == -1) {
                            newJsonEntry[0]['values'].splice(o, 1);
                        }                    
                    }
                }
            }
        }

        // add new
        for (var i = 0; i < jsonKeys.length; i++) {
            if (initialKeys.indexOf(jsonKeys[i]) == -1) {
                updatedAttachments["uploads"].push({'name': jsonKeys[i], 'values': []})
            }

            var newJsonEntry = updatedAttachments['uploads'].filter(function(itt) { return itt['name'] == jsonKeys[i] });         
            var values = jsonValues[i];
            if (values != null && values.length > 0) {
                for (var o = 0; o < values.length; o++) {
                    if (newJsonEntry != null && newJsonEntry.length > 0 && newJsonEntry[0] != null && newJsonEntry[0]['values'] != null) {
                        if (newJsonEntry[0]['values'].indexOf(values[o]) == -1) {
                            newJsonEntry[0]['values'].push(values[o]);
                        }
                    }
                }    
            }                 
        }
        
        document.querySelector('.attachmentsJson textarea').value = JSON.stringify(updatedAttachments);
        document.querySelector('.attachmentsJson textarea').dispatchEvent(new Event('blur'));

        //initialAttachments = json;
    }
}

function retrieveAttachments(selector) {
    var arr = [];
    var fileUploads = document.querySelectorAll(selector);
    for (var i = 0; i < fileUploads.length; i++) {
        var files = fileUploads[i].querySelectorAll('.nx-upload-filename');
        for (var o = 0; o < files.length; o++) {
            arr.push(files[o].textContent.trim());
        }
    }
    return arr;
}

function getObjectDifferences(obj1, obj2) {
    const differences = {};

    for (const key of new Set([...Object.keys(obj1), ...Object.keys(obj2)])) {
        const arr1 = obj1[key] || [];
        const arr2 = obj2[key] || [];

        if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
            if (!deepEqual(arr1, arr2)) {
                differences[key] = { added: arr2, removed: arr1 };
            }
            continue;
        }

        const arr1Map = new Map(arr1.map(item => [item.name, item]));
        const arr2Map = new Map(arr2.map(item => [item.name, item]));

        const added = [];
        const removed = [];
        const modified = [];

        for (const [name, item2] of arr2Map.entries()) {
            if (!arr1Map.has(name)) {
                added.push(item2);
            } else {
                const item1 = arr1Map.get(name);
                const valuesSet1 = new Set(item1.values || []);
                const valuesSet2 = new Set(item2.values || []);

                const valuesAdded = [...valuesSet2].filter(v => !valuesSet1.has(v));
                const valuesRemoved = [...valuesSet1].filter(v => !valuesSet2.has(v));

                if (valuesAdded.length > 0 || valuesRemoved.length > 0) {
                    modified.push({
                        name,
                        added: valuesAdded.length > 0 ? valuesAdded : undefined,
                        removed: valuesRemoved.length > 0 ? valuesRemoved : undefined
                    });
                }
            }
        }

        for (const [name, item1] of arr1Map.entries()) {
            if (!arr2Map.has(name)) {
                removed.push(item1);
            }
        }

        if (added.length > 0 || removed.length > 0 || modified.length > 0) {
            differences[key] = {};
            if (added.length > 0) differences[key].added = added;
            if (removed.length > 0) differences[key].removed = removed;
            if (modified.length > 0) differences[key].modified = modified;
        }
    }

    return differences;
}

function deepEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}

// registering the web component
const elementName = 'gather-attachments';
customElements.define(elementName, GatherAttachments);