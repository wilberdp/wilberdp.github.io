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

function translateForm() {
    var hostweburl = decodeURIComponent(qs("SPHostUrl"));
    var appweburl = decodeURIComponent(qs("SPAppWebUrl"));

    var executor1 = new SP.RequestExecutor(appweburl);
    var executor2 = new SP.RequestExecutor(appweburl);

    var lang = "en";
    var country = qs("Country");
    var langOverride = qs("Language");
    
    executor1.executeAsync({
        url: appweburl + "/_api/SP.AppContextSite(@target)/web/lists/getbytitle('General Configuration')/items?@target='" + hostweburl + "'",
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data1) {
            data1 = JSON.parse(data1.body).d.results;
            if (langOverride != null && langOverride != "") {
                processContent(data1[i], langOverride);
            }
            else {
                executor2.executeAsync({
                    url: appweburl + "/_api/SP.UserProfiles.PeopleManager/GetMyProperties",
                    method: "GET",
                    headers: { "Accept": "application/json; odata=verbose" },
                    success: function (data2) {
                        lang = JSON.parse(data2.body).d.UserProfileProperties.results.filter(function (itt) { return itt.Key == "SPS-MUILanguages" });
                        if (lang != null && lang.length > 0) {
                            lang = lang[0].value.split('-')[0];
                            if (lang != null && lang != "" && lang.toLowerCase() != "en") {
                                processContent(data1[i], lang);
                            }
                        }
                        else {
                            if (country != null && country != "") {
                                executor2.executeAsync({
                                    url: appweburl + "/_api/SP.AppContextSite(@target)/web/lists/getbytitle('Countries')/items?$filter=Title eq '" + country + "'&@target='" + hostweburl + "'",
                                    method: "GET",
                                    headers: { "Accept": "application/json; odata=verbose" },
                                    success: function (data3) {
                                        var countryData = JSON.parse(data3.body).d.results;
                                        if (countryData != null && countryData.length > 0) {
                                            lang = countryData[0].DefaultLanguage;                                            
                                            if (lang != null && lang != "" && lang.toLowerCase() != "en") {
                                                processContent(data1[i], lang);
                                            }                                            
                                        }
                                    }
                                });
                            }
                        }
                    },
                    error: function (e) {
                    }
                });
            }
        }
    });
}

function qs(key) {
    key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&");
    var match = location.search.match(new RegExp("[?&]"+key+"=([^&]+)(&|$)"));
    return (match && decodeURIComponent(match[1].replace(/\+/g, " ")));
}

function processContent(content, lang) {
    var elements = document.querySelectorAll('.nf-label-control,.ms-addnew,.ms-descriptiontext,.ms-formlabel');
    for (var i = 0; i < elements.length; i++) {
        for (var o = 0; o < elements[i].childNodes.length; o++) {
            if (elements[i].childNodes[o].nodeType === Node.TEXT_NODE) {
                for (var p = 0; p < content.length; p++) {
                    if (elements[i].childNodes[o].textContent.trim().toLowerCase() == content[p].Title.toLowerCase().trim()) {
                        elements[i].childNodes[o].textContent = JSON.parse(content[p]["Content"])[Object.keys(JSON.parse(content[p]["Content"])).find(key => key.toLowerCase() === lang)]
                    }
                    if (elements[i].childNodes[o].textContent.text().trim().toLowerCase() == content[p].Title.toLowerCase().trim() + " *") {
                        elements[i].childNodes[o].innerHTML = JSON.parse(content[p]["Content"])[Object.keys(JSON.parse(content[p]["Content"])).find(key => key.toLowerCase() === lang)] + " <span style='color: #c0504d;'>*</span>";
                    }
                }
            }
        }
    }
    var elements = document.querySelectorAll('.nf-save-button');
    for (var i = 0; i < elements.length; i++) {
        for (var p = 0; p < content.length; p++) {
            if (elements[i].value.trim().toLowerCase() == content[p].Title.toLowerCase().trim()) {
                elements[i].value = JSON.parse(content[p]["Content"])[Object.keys(JSON.parse(content[p]["Content"])).find(key => key.toLowerCase() === lang)];
            }
        }
    }
}



// registering the web component
const elementName = 'form-submissions';
customElements.define(elementName, FormSubmissions);