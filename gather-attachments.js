import { html, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

var initialAttachments = null;
var updatedAttachments = null;

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

    if (initialAttachments == null || initialAttachments.uploads == null || initialAttachments.uploads.length == 0) {
        initialAttachments = {"uploads":[]};
        document.querySelector('.attachmentsJson textarea').value = JSON.stringify(initialAttachments);
        document.querySelector('.attachmentsJson textarea').dispatchEvent(new Event('blur'));
    }
    else {       
        var jsonKeys = json['uploads'].map(function(itt) { return itt['name']; });
        var jsonValues = json['uploads'].map(function(itt) { return itt['values']; });
        var initialKeys = initialAttachments['uploads'].map(function(itt) { return itt['name']; });
        var initialValues = initialAttachments['uploads'].map(function(itt) { return itt['values']; });

        if (updatedAttachments == null) {
            updatedAttachments = {};
            updatedAttachments['uploads'] = [];   
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


// registering the web component
const elementName = 'gather-attachments';
customElements.define(elementName, GatherAttachments);