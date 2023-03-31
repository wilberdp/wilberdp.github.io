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
      kind: "method",
      key: "render",
      value: function render() {
        showHide('none', 'none');
        return y`<input id="pinInput" class="form-control nx-input-control nx-theme-input-1" @keyup="${e => this.pinChange2(e)}" @change="${e => this.pinChange(e)}"></input>`;
      }
    }, {
      kind: "method",
      key: "pinChange",
      value: function pinChange(e) {
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
      key: "pinChange2",
      value: function pinChange2(e) {
        console.log('pinChange2');
        const el = this.shadowRoot?.getElementById('pinInput');
        if (el) {
          if (el.value == this.pinToMatch) {
            showHide('block', 'flex');
          }
          else {
            showHide('none', 'none');
          }
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
            pinToMatch: {
              type: 'string',
              title: 'PIN to match'
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

function showHide(attr1, attr2) {
  var eles = document.getElementsByClassName("mat-stepper-horizontal");
  for (var i = 0; i < eles.length; i++) {
    eles[i].style.display = attr1;
  }
  eles = document.getElementsByClassName("nx-action-panel");
  for (var i = 0; i < eles.length; i++) {
    eles[i].style.display = attr2;
  }
}
        

export { PINTextField };
