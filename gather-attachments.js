import { html, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

var previousAttachments = null;
var dataToOutput = null;

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
            }, 500);
        }
        catch(exc) { 
            console.log(exc);
        }
    }
}

function populateAttachmentJson() {
    var json = {"uploads":[], "removed": []};

    if (dataToOutput == null) {
        dataToOutput = {"uploads":[], "removed": []};
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
    
    if (previousAttachments == null) {
        previousAttachments = structuredClone(json);
    }

    var differences = getObjectDifferences(previousAttachments, json);

    if (differences != null && differences["uploads"] != null) {
        console.log('differences');
        console.log(differences);

        var added = differences["uploads"]["added"];
        var removed = differences["uploads"]["removed"];
        var modified = differences["uploads"]["modified"];

        if (added != null) {
            for (var addedEntry in added) {
                dataToOutput["uploads"].push(added[addedEntry]);
            }
            console.log('added');
            console.log(added);
            console.log(dataToOutput)
        }
        if (removed != null) {
            for (var removedEntry in removed) {
                dataToOutput["uploads"].splice(dataToOutput["uploads"].indexOf(removed[removedEntry]), 1);
                //dataToOutput["removed"].push(removedEntry["name"]);
            }
            console.log('removed');
            console.log(removed);
            console.log(dataToOutput)
        }
        if (modified != null) {
            for (var modifiedEntry in modified) {
                var data = dataToOutput["uploads"].filter(function(itt) { return itt["name"] == modified[modifiedEntry]["name"] });

                if (data != null && data.length > 0) {
                    if (modified[modifiedEntry]["added"] != null && modified[modifiedEntry]["added"].length > 0) {
                        for (var addedEntry in modified[modifiedEntry]["added"]) {
                            data[0]["values"].push(modified[modifiedEntry]["added"][addedEntry]);
                        }
                    }
                    if (modified[modifiedEntry]["removed"] != null && modified[modifiedEntry]["removed"].length > 0) {
                        for (var removedEntry in modified[modifiedEntry]["removed"]) {
                            data[0]["values"].splice(data[0]["values"].indexOf(modified[modifiedEntry]["removed"][removedEntry]), 1);
                            //if (dataToOutput["removed"][modified[modifiedEntry]["name"]] == null) {
                            //    dataToOutput["removed"].push(modified[modifiedEntry]["name"])
                            //}
                            //dataToOutput["removed"][modified[modifiedEntry]["name"]].push(removedEntry);
                        }
                    }
                }
            }
            console.log('modified');
            console.log(modified);
            console.log(dataToOutput)
        }
    }

    previousAttachments = structuredClone(json);
    try {
        document.querySelector('.attachmentsJson textarea').value = JSON.stringify(dataToOutput);
        document.querySelector('.attachmentsJson textarea').dispatchEvent(new Event('blur'));
    }
    catch (exc) { }

    //try {
        //document.querySelector('.attachmentsJsonToRemove textarea').value = JSON.stringify(dataToRemove);
        //document.querySelector('.attachmentsJsonToRemove textarea').dispatchEvent(new Event('blur'));
    //}
    //catch (exc) { }
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