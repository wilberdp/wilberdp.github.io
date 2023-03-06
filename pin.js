import { _ as _decorate, s, i, e, y, a as e$1 } from './query-assigned-elements-5558b813.js';

const fire = (element, data) => {
  const args = {
    bubbles: true,
    cancelable: false,
    composed: true,
    ...data
  };
  console.log('fire');
  // the event name 'nintex-value-change' is required to tell the form engine to update the value
  const event = new CustomEvent('ntx-value-change', args);
  element.dispatchEvent(event);
  return event;
};
let PINTextField = _decorate([e$1('pin-field-2')], function (_initialize, _LitElement) {
  class PINTextField extends _LitElement {
    constructor(...args) {
      super(...args);
      _initialize(this);
    }
  }
  return {
    F: PINTextField,
    d: [{
      kind: "field",
      static: true,
      key: "styles",
      value() {
        return i`
        .pinInput {

        }
    `;
      }
    }, {
      kind: "field",
      decorators: [e()],
      key: "pin",
      value() {
        return "1234";
      }
    }, {
      kind: "method",
      key: "render",
      value: function render() {
        console.log("PIN: ", {
          name: this.pin
        });
        return y`<div><input class="pinInput form-control nx-input-control nx-theme-input-1" onchange="pinChange()"></div><div>${this.pin}</div>`;
      }
    }, {
      kind: "method",
      key: "pinChange",
      value: function pinChange() {
        console.log('pinChange');
        const el = this.shadowRoot?.getElementById('pinInput');
        if (el) {
          fire(this, {
            detail: el.value
          });
        }
      }
    }, {
      kind: "method",
      static: true,
      key: "getMetaConfig",
      value: function getMetaConfig() {
        return {
          controlName: 'pin-field',
          fallbackDisableSubmit: false,
          iconUrl: 'one-line-text',
          version: '1',
          properties: {
            outlined: {
              type: 'boolean',
              title: 'Show Outline'
            },
            value: {
              type: 'string',
              title: 'PIN',
              isValueField: true,
              defaultValue: ''
            }
          },
          standardProperties: {
            fieldLabel: true,
            description: true,
            defaultValue: true,
            readOnly: true
          }
        };
      }
    }]
  };
}, s);

export { PINTextField };
