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
                json[className] = att;
            }
        } 
    }

    if (initialAttachments == null) {
        initialAttachments = json;
    }
    else {
        var jsonKeys = Object.keys(json);
        var initialKeys = Object.keys(initialAttachments);

        // add new
        for (var i = 0; i < jsonKeys.length; i++) {
            if (initialKeys.indexOf(jsonKeys[i]) == -1) {
                newJson[jsonKeys[i]] = [];
            }
            
            for (var o = 0; o < json[jsonKeys[i]].length; o++) {
                var val = json[jsonKeys[i]][o];
                if (newJson[jsonKeys[i]].indexOf(val) == -1) {
                    newJson[jsonKeys[i]].push(val);
                }
            }                     
        }

        // remove
        for (var i = 0; i < initialKeys.length; i++) {
            if (jsonKeys.indexOf(initialKeys[i]) == -1) {
                delete newJson[initialKeys[i]]
            }

            for (var o = 0; o < initialAttachments[initialKeys[i]].length; o++) {
                var val = initialAttachments[initialKeys[i]][o];
                if ((json[initialKeys[i]] == null || json[initialKeys[i]].indexOf(val) == -1) && newJson[initialKeys[i]] != null) {
                    newJson[initialKeys[i]].pop(newJson[initialKeys[i]].indexOf(val));
                }
            }  
        }

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