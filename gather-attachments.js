import { html, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

var initialAttachments = null;
var newJson = {};

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
        newJson["uploads"] = [];
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

    //document.querySelector('.attachmentsJson textarea').value = JSON.stringify(json);
    //document.querySelector('.attachmentsJson textarea').dispatchEvent(new Event('blur'));
    //return;

    if (initialAttachments == null) {
        initialAttachments = json;
    }
    else {
        var jsonKeys = json['uploads'].map(function(itt) { return itt['name']; });
        var initialKeys = initialAttachments['uploads'].map(function(itt) { return itt['name']; });

        // add new
        for (var i = 0; i < jsonKeys.length; i++) {
            if (initialKeys.indexOf(jsonKeys[i]) == -1) {
                newJson["uploads"].push({'name': jsonKeys[i], 'values': []})
            }

            var newJsonEntry = newJson['uploads'].filter(function(itt) { return itt['name'] == jsonKeys[i] });         
            var values = json['uploads'].filter(function(itt) { return itt['name'] == jsonKeys[i] });
            if (values != null && values.length > 0) {
                values = values[0]['values'];   

                for (var o = 0; o < values.length; o++) {
                    if (newJsonEntry[0]['values'].indexOf(values[o]) == -1) {
                        newJsonEntry[0]['values'].push(values[o]);
                    }
                }    
            }                 
        }

        // remove
        for (var i = 0; i < initialKeys.length; i++) {
            if (jsonKeys.indexOf(initialKeys[i]) == -1) {
                newJson['uploads'] = newJson['uploads'].filter(function(itt){ return itt['name'] != initialKeys[i] });
            }

            var newJsonEntry = newJson['uploads'].filter(function(itt) { return itt['name'] == initialKeys[i] });         
            var initialEntry = initialAttachments['uploads'].filter(function(itt){ return itt['name'] == initialKeys[i]});
            if (initialEntry != null && initialEntry.length > 0 && newJsonEntry != null && newJsonEntry.length > 0) {
                for (var o = 0; o < initialEntry[0]['values'].length; o++) {
                    var val = initialEntry[0]['values'][o];
                    if (newJsonEntry[0]['values'] != null && newJsonEntry[0]['values'].length > 0 && newJsonEntry[0]['values'].indexOf(val) == -1) {
                        newJsonEntry[0]['values'].pop(newJsonEntry[0]['values'].indexOf(val));
                    }
                }  
            }
        }

        initialAttachments = json;

        document.querySelector('.attachmentsJson textarea').value = JSON.stringify(newJson);
        document.querySelector('.attachmentsJson textarea').dispatchEvent(new Event('blur'));
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