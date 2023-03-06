import { _ as _decorate, s, i, y } from './lit-element-6d4b1918.js';
import { property } from 'lit/decorators';

let PINTextField = _decorate(null, function (_initialize, _LitElement) {
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
      decorators: [property()],
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
        return y`<div><input class="pinInput"></div><div>${this.pin}</div>`;
      }
    }, {
      kind: "method",
      static: true,
      key: "getMetaConfig",
      value: function getMetaConfig() {
        return {
          controlName: 'PIN Field',
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
