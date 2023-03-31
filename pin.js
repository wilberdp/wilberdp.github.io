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
        var eles = document.getElementsByClassName("mat-stepper-horizontal");
        for (var i = 0; i < eles.length; i++) {
          eles[i].style.display = 'none';
        }
        eles = document.getElementsByClassName("nx-action-panel");
        for (var i = 0; i < eles.length; i++) {
          eles[i].style.display = 'none';
        }
        return y`<input class="pinInput form-control nx-input-control nx-theme-input-1" @change="${() => this.pinChange()}"></input>`;
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

          if (el.value == this.pinToMatch) {
            var eles = document.getElementsByClassName("mat-stepper-horizontal");
            for (var i = 0; i < eles.length; i++) {
              eles[i].style.display = 'flex';
            }
            eles = document.getElementsByClassName("nx-action-panel");
            for (var i = 0; i < eles.length; i++) {
              eles[i].style.display = 'flex';
            }
          }
          else {
            var eles = document.getElementsByClassName("mat-stepper-horizontal");
            for (var i = 0; i < eles.length; i++) {
              eles[i].style.display = 'none';
            }
            eles = document.getElementsByClassName("nx-action-panel");
            for (var i = 0; i < eles.length; i++) {
              eles[i].style.display = 'none';
            }
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

export { PINTextField };
