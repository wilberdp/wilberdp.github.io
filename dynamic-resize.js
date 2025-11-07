import { html, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

export class DynamicResize extends LitElement {  
    static getMetaConfig() {
        return {
            controlName: 'Dynamic Resize',
            fallbackDisableSubmit: false,
            version: '1.0',
            standardProperties: {
                visibility: true
            },
            properties: {
            }
        };
    }

    render() {
        console.log('Dynamic Resize: render()');

        var eventListenerLoaded = window.dynamicResizeEventListenerLoaded;

        if (!eventListenerLoaded) {
            window.dynamicResizeEventListenerLoaded = true;

            window.addEventListener("load", function () {
                if (
                    ((iframeDimensions_Old = { width: window.innerWidth, height: getMyHeight() }),
                    window.parent.postMessage(iframeDimensions_Old, "*"),
                    window.MutationObserver)
                ) {
                    var e = new MutationObserver(sendDimensionsToParent);
                    (config = {
                        attributes: !0,
                        attributeOldValue: !1,
                        characterData: !0,
                        characterDataOldValue: !1,
                        childList: !0,
                        subtree: !0,
                    }),
                        e.observe(document.body, config);
                } else window.setInterval(sendDimensionsToParent, 300);
            });     
        }
        return html`<p>Dynamic Resize<p/>`;
    }

}

function getMyHeight() {
    return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
}
function sendDimensionsToParent() {
    var e = { width: window.innerWidth, height: getMyHeight() };
    (e.width == iframeDimensions_Old.width && e.height == iframeDimensions_Old.height) ||
        (window.parent.postMessage(e, "*"), (iframeDimensions_Old = e));
}

const elementName = 'dynamic-resize';
customElements.define(elementName, DynamicResize);