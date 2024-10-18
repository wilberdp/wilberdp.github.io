import { html, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

var initialAttachments = null;

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
            }, 100);
        }
        catch(exc) { 
            console.log(exc);
        }
    }
}

function populateAttachmentJson() {
    var json = {};
    json["uploads"] = [];

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
                var tempJson = { "name": className.replace('attachments','').replaceAll('_', ' '), "values": att };
                json["uploads"].push(tempJson);
            }
        } 
    }

    if (initialAttachments == null) {
        initialAttachments = json;
    }
    else {
        var jsonKeys = json['uploads'].map(function(itt) { return itt['name']; });
        var jsonValues = json['uploads'].map(function(itt) { return itt['values']; });
        var initialKeys = initialAttachments['uploads'].map(function(itt) { return itt['name']; });
        var newJson = {};
        
        if (document.querySelector('.attachmentsJson textarea').value != '') { 
            try {
                newJson = JSON.parse(document.querySelector('.attachmentsJson textarea').value);
            }
            catch {
                newJson = {};
                newJson['uploads'] = [];
            }
        }
        else {
            newJson['uploads'] = [];
        }       

        var newJsonKeys = newJson['uploads'].map(function(itt) { return itt['name']; });
        var newJsonValues = newJson['uploads'].map(function(itt) { return itt['values']; });

        // remove
        for (var i = 0; i < newJsonKeys.length; i++) {
            if (jsonKeys.indexOf(newJsonKeys[i]) == -1) {
                newJson['uploads'] = newJson['uploads'].filter(function(itt){ return itt['name'] != newJsonKeys[i] });
            }
            else {
                for (var o = 0; o < newJsonValues[i].length; o++) {
                    var newJsonEntry = newJson['uploads'].filter(function(itt) { return itt['name'] == newJsonKeys[i] });
                    var jsonEntry = json['uploads'].filter(function(itt) { return itt['name'] == newJsonKeys[i] });
                    if (newJsonEntry != null && newJsonEntry.length > 0 && jsonEntry != null && jsonEntry.length > 0) {
                        var idx = jsonEntry[0]['values'].indexOf(newJsonValues[i][o]);
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
                newJson["uploads"].push({'name': jsonKeys[i], 'values': []})
            }

            var newJsonEntry = newJson['uploads'].filter(function(itt) { return itt['name'] == jsonKeys[i] });         
            var values = jsonValues[i];
            if (values != null && values.length > 0) {
                for (var o = 0; o < values.length; o++) {
                    if (newJsonEntry[0]['values'].indexOf(values[o]) == -1) {
                        newJsonEntry[0]['values'].push(values[o]);
                    }
                }    
            }                 
        }
        
        document.querySelector('.attachmentsJson textarea').value = JSON.stringify(newJson);
        document.querySelector('.attachmentsJson textarea').dispatchEvent(new Event('blur'));

        initialAttachments = json;
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


// registering the web component
const elementName = 'gather-attachments';
customElements.define(elementName, GatherAttachments);