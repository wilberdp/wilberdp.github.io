import { html, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';
import 'https://cdn.jsdelivr.net/npm/flatpickr';

// define the component
export class FormSubmissions extends LitElement {
    // return a promise for contract changes.
    static getMetaConfig() {
        return {
            controlName: 'FormSubmissions',
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

        return html`<p>FormSubmissions</p>`;
    }

    async render2() {
        try {
            document.querySelector(".countryField input").value = qs("Country");
            translateForm();
                        
            if (qs("isIframe") == "1") {
                var css = `
                    header.nx-sp-form-runtime-header, [data-automation-id="captionElement"], .nx-action-panel > div:nth-child(1) {
                        display: none !important;
                    }
                    [data-e2e="btn-submit"] {
                        margin-left: 0px !important;
                    }
                    body {
                        zoom: 86%;
                    }
                `;
                var style = document.createElement("style");
                style.appendChild(document.createTextNode(css));
                document.querySelector('head').appendChild(style);

            }
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
  json['mainReport-attachments'] = retrieveAttachments('.mainReport-attachments');
  json['annexes-attachments'] = retrieveAttachments('.annexes-attachments');
  json['letterMinistry-attachments'] = retrieveAttachments('.letterMinistry-attachments');
  json['letterCommittee-attachments'] = retrieveAttachments('.letterCommittee-attachments');
  json['other-attachments'] = retrieveAttachments('.other-attachments');
  document.querySelector('.attachmentsJson textarea').value = JSON.stringify(json);
}

function retrieveAttachments(selector) {
  var arr = [];
    var fileUploads = document.querySelectorAll(selector);
    for (var i = 0; i < fileUploads.length; i++) {
        var files = fileUploads[i].querySelectorAll('.nx-upload-filename');
        for (var o = 0; o < files.length; o++) {
            arr.push(files[o].innerText);
        }
    }
  return arr;
}

function translateForm2() {
    var hostweburl = decodeURIComponent(qs("SPHostUrl"));
    var appweburl = decodeURIComponent(qs("SPAppWebUrl"));
    var scriptbase = hostweburl + "/_layouts/15/";
    
    var executor1 = new SP.RequestExecutor(appweburl);

    



        //NWF$.getScript(scriptbase + "MicrosoftAjax.js").then(function (data) {
        //    return NWF$.getScript(scriptbase + "SP.Runtime.js");
        //}).then(function (data) {
        //    return NWF$.getScript(scriptbase + "SP.js");
        //}).then(function (data) {
        //    return NWF$.getScript(scriptbase + "SP.RequestExecutor.js");
        //}).then(function (data) {
            var executor = new SP.RequestExecutor(appweburl);

            var listname = "General Configuration";
            var filters = "";
            var url = appweburl + "/_api/SP.AppContextSite(@target)/web/lists/getbytitle('" + listname + "')/items?@target='" + hostweburl + "'" + filters;
            var url2 = appweburl + "/_api/SP.AppContextSite(@target)";

            executor.executeAsync({
                url: url,
                method: "GET",
                headers: { "Accept": "application/json; odata=verbose" },
                success: function (data) {
                    data = JSON.parse(data.body).d.results;

                    console.log(data);
                    for (var i = 0; i < data.length; i++) {
                        console.log(data[i]);
                        var content = JSON.parse(data[i].Content);
                        /*document.querySelectorAll('.nf-label-control,.ms-addnew,.ms-descriptiontext,.ms-formlabel').each(function () {
                            if (NWF$(this).text().trim().toLowerCase() == data[i].Title.toLowerCase()) {
                                NWF$(this).text(content[Object.keys(content).find(key => key.toLowerCase() === lang)]);
                            }
                            if (NWF$(this).text().trim().toLowerCase() == data[i].Title.toLowerCase() + " *") {
                                NWF$(this).html(content[Object.keys(content).find(key => key.toLowerCase() === lang)] + " <span style='color: #c0504d;'>*</span>");
                            }
                        });
                        NWF$('.nf-save-button').each(function () {
                            if (NWF$(this).val().trim().toLowerCase() == data[i].Title.toLowerCase()) {
                                NWF$(this).val(content[Object.keys(content).find(key => key.toLowerCase() === lang)]);
                            }
                        });*/
                    }
                },
                error: function (e) {
                }
            });
        //});
    
}

function qs(key) {
    key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&");
    var match = location.search.match(new RegExp("[?&]"+key+"=([^&]+)(&|$)"));
    return (match && decodeURIComponent(match[1].replace(/\+/g, " ")));
}



// registering the web component
const elementName = 'form-submissions';
customElements.define(elementName, FormSubmissions);