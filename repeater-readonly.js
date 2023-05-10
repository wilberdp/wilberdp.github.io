import { html,LitElement} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';
// define the component
export class HelloWorld extends LitElement {
  
  static properties = {
    who: {type: String},
  };
  
  // return a promise for contract changes.
  static getMetaConfig() {
    return {
      controlName: 'Hello World',
      fallbackDisableSubmit: false,
      version: '1.2',
      properties: {
        who: {
          type: 'string',
          title: 'Who',
          description: 'Who to say hello to'
        }
      }
    };
  }
  
  constructor() {
    super();
    this.who = 'World';
  }

  render() {
    return html`<p>Hello ${this.who}<p/>`;
  }
}

// registering the web component
const elementName = 'hello-world';
customElements.define(elementName, HelloWorld);

/*
import { _ as _decorate, s, i, e, y, a as e$1 } from './query-assigned-elements-5558b813.js';

const fire = (element, data) => {
  const args = {
    bubbles: true,
    cancelable: false,
    composed: true,
    ...data
  };
  console.log('fire!');
  // the event name 'nintex-value-change' is required to tell the form engine to update the value
  const event = new CustomEvent('ntx-value-change', args);
  element.dispatchEvent(event);
  return event;
};
let RepeaterReadOnly = _decorate([e$1('repeater-readonly')], function (_initialize, _LitElement) {
  class RepeaterReadOnly extends _LitElement {
    constructor(...args) {
      super(...args);
      _initialize(this);
    }
  }
  return {
    F: RepeaterReadOnly,
    d: [{
      kind: "method",
      key: "render",
        value: function render() {
            console.log('render');
            if (this.readOnlyControlVariable) {
                showHide('none');
            }
            else {
                showHide('inline-block');
            }

            return y`<span>Repeater Read-Only Control</span>`;
        }
    }, {
      kind: "method",
      static: true,
      key: "getMetaConfig",
      value: function getMetaConfig() {
        return {
          controlName: 'repeater-readonly',
          fallbackDisableSubmit: false,
          iconUrl: 'one-line-text',
          version: '1',
          properties: {
            readOnlyControlVariable: {
              type: 'boolean',
              title: 'Read-Only Control Variable'
            }
          },
          standardProperties: {
            fieldLabel: false,
            description: false,
            defaultValue: false,
            readOnly: false,
            visibility: true
          }
        };
      }
    }]
  };
}, s); 

function showHide(attr1) {
    var eles = document.querySelectorAll('ntx-repeating-section button.ntx-repeating-section-remove-button, ntx-repeating-section button.btn-repeating-section-new-row');
    for (var i = 0; i < eles.length; i++) {
        eles[i].style.display = attr1;
    }
}

export { RepeaterReadOnly };
*/
