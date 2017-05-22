import InputMask from 'inputmask-core';
import ffpoly from './ff-polyfill'; // Firefox Polyfill for focus events

ffpoly();

export default {
  name: 'MaskedInput',
  render(h) {
    return h('input', {
      ref: 'input',
      attrs: {
        disabled: this.maskCore === null || this.disabled,
      },
      domProps: {
        value: this.value,
      },
      on: {
        keydown: this.keyDown,
        keypress: this.keyPress,
        keyup: this.keyUp,
        textInput: this.textInput,
        mouseup: this.mouseUp,
        focusout: this.focusOut,
        cut: this.cut,
        copy: this.copy,
        paste: this.paste,
      },
    });
  },

  data: () => ({
    marginLeft: 0,
    maskCore: null,
    updateAfterAll: false,
  }),

  props: {
    value: {
      type: String,
    },
    mask: {
      required: true,
      validator: value => !!((value && value.length >= 1) || value instanceof Object),
    },
    placeholderChar: {
      type: String,
      default: '_',
      validator: value => !!(value && value.length === 1),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  watch: {
    mask(newValue, oldValue) {
      if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
        this.initMask();
      }
    },
    value(newValue) {
      if (this.maskCore) this.maskCore.setValue(newValue); // For multiple inputs support
    },
  },

  mounted() {
    this.initMask();
  },

  methods: {
    initMask() {
      try {
        if (this.mask instanceof Object) {
          this.maskCore = new InputMask(this.mask);
        } else {
          this.maskCore = new InputMask({
            pattern: this.mask,
            value: '',
            placeholderChar: this.placeholderChar,
            /* eslint-disable quote-props */
            formatCharacters: {
              'a': {
                validate: char => /^[A-Za-zА-Яа-я]$/.test(char),
              },
              'A': {
                validate: char => /^[A-Za-zА-Яа-я]$/.test(char),
                transform: char => char.toUpperCase(),
              },
              '*': {
                validate: char => /^[\dA-Za-zА-Яа-я]$/.test(char),
              },
              '#': {
                validate: char => /^[\dA-Za-zА-Яа-я]$/.test(char),
                transform: char => char.toUpperCase(),
              },
              '+': {
                validate: () => true,
              },
            },
            /* eslint-enable */
          });
        }
        [...this.$refs.input.value].reduce((memo, item) => this.maskCore.input(item), null);
        this.maskCore.setSelection({
          start: 0,
          end: 0,
        });
        if (this.$refs.input.value === '') {
          this.$emit('input', '', '');
        } else {
          this.updateToCoreState();
        }
      } catch (e) {
        this.maskCore = null;
        this.$refs.input.value = 'Error';
        this.$emit('input', this.$refs.input.value, '');
      }
    },
    getValue() {
      return this.maskCore ? this.maskCore.getValue() : '';
    },

    keyDown(e) { // Always
      if (this.maskCore === null) {
        e.preventDefault();
        return;
      }
      this.setNativeSelection();
      switch (e.keyCode) {
        // backspace
        case 8:
          e.preventDefault();
          if (
            this.maskCore.selection.start > this.marginLeft ||
            this.maskCore.selection.start !== this.maskCore.selection.end
          ) {
            this.maskCore.backspace();
            this.updateToCoreState();
          }
          break;

        // left arrow
        case 37:
          e.preventDefault();
          if (this.$refs.input.selectionStart === this.$refs.input.selectionEnd) {
            // this.$refs.input.selectionEnd = this.$refs.input.selectionStart - 1; @TODO
            this.$refs.input.selectionStart -= 1;
          }
          this.maskCore.selection = {
            start: this.$refs.input.selectionStart,
            end: this.$refs.input.selectionStart,
          };
          this.updateToCoreState();
          break;

        // right arrow
        case 39:
          e.preventDefault();
          if (this.$refs.input.selectionStart === this.$refs.input.selectionEnd) {
            this.$refs.input.selectionEnd += 1;
          }
          this.maskCore.selection = {
            start: this.$refs.input.selectionEnd,
            end: this.$refs.input.selectionEnd,
          };
          this.updateToCoreState();
          break;

        // end
        case 35:
          e.preventDefault();
          this.$refs.input.selectionStart = this.$refs.input.value.length;
          this.$refs.input.selectionEnd = this.$refs.input.value.length;
          this.maskCore.selection = {
            start: this.$refs.input.selectionEnd,
            end: this.$refs.input.selectionEnd,
          };
          this.updateToCoreState();
          break;

        // home
        case 36:
          e.preventDefault();
          this.$refs.input.selectionStart = 0;
          this.$refs.input.selectionEnd = 0;
          this.maskCore.selection = {
            start: this.$refs.input.selectionStart,
            end: this.$refs.input.selectionStart,
          };
          this.updateToCoreState();
          break;

        // delete
        case 46:
          e.preventDefault();
          if (this.$refs.input.selectionStart === this.$refs.input.selectionEnd) {
            this.maskCore.setValue('');
            this.maskCore.setSelection({
              start: 0,
              end: 0,
            });
            this.$refs.input.selectionStart = this.maskCore.selection.start;
            this.$refs.input.selectionEnd = this.maskCore.selection.start;
          } else {
            this.maskCore.backspace();
          }
          this.updateToCoreState();
          break;

        default:
          break;
      }
    },

    keyPress(e) { // works only on Desktop
      if (e.ctrlKey) return; // Fix FF copy/paste issue
      // IE & FF are not trigger textInput event, so we have to force it
      /* eslint-disable */
      const isIE = /*@cc_on!@*/false || !!document.documentMode; //by http://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
      /* eslint-enable */
      const isFirefox = typeof InstallTrigger !== 'undefined';
      if (isIE || isFirefox) {
        e.preventDefault();
        e.data = e.key;
        this.textInput(e);
      }
    },

    textInput(e) {
      if (e.preventDefault) e.preventDefault();
      if (this.maskCore.input(e.data)) {
        this.updateAfterAll = true;
      }
      this.updateToCoreState();
    },

    keyUp(e) {
      if (e.keyCode === 9) { // Preven change selection for Tab in
        return;
      }
      this.updateToCoreState();
      this.updateAfterAll = false;
    },


    cut(e) {
      e.preventDefault();
      if (this.$refs.input.selectionStart !== this.$refs.input.selectionEnd) {
        try {
          document.execCommand('copy');
        } catch (err) {} // eslint-disable-line no-empty
        this.maskCore.backspace();
        this.updateToCoreState();
      }
    },

    copy() {},

    paste(e) {
      e.preventDefault();
      const text = e.clipboardData.getData('text');
      [...text].reduce((memo, item) => this.maskCore.input(item), null);
      this.updateToCoreState();
    },

    updateToCoreState() {
      if (this.maskCore === null) {
        return;
      }
      if (this.$refs.input.value !== this.maskCore.getValue()) {
        this.$refs.input.value = this.maskCore.getValue();
        this.$emit('input', this.$refs.input.value, this.maskCore.getRawValue());
      }
      this.$refs.input.selectionStart = this.maskCore.selection.start;
      this.$refs.input.selectionEnd = this.maskCore.selection.end;
    },

    isEmpty() {
      if (this.maskCore === null) return true;
      return this.maskCore.getValue() === this.maskCore.emptyValue;
    },

    focusOut() {
      if (this.isEmpty()) {
        this.$refs.input.value = '';
        this.maskCore.setSelection({
          start: 0,
          end: 0,
        });
        this.$emit('input', '', '');
      }
    },

    setNativeSelection() {
      this.maskCore.selection = {
        start: this.$refs.input.selectionStart,
        end: this.$refs.input.selectionEnd,
      };
    },

    mouseUp() {
      if (this.isEmpty() &&
        this.$refs.input.selectionStart === this.$refs.input.selectionEnd) {
        this.maskCore.setSelection({
          start: 0,
          end: 0,
        });
        this.$refs.input.selectionStart = this.maskCore.selection.start;
        this.$refs.input.selectionEnd = this.maskCore.selection.start;
        this.marginLeft = this.maskCore.selection.start;
        this.updateToCoreState();
      } else {
        this.setNativeSelection();
      }
    },
  },
};
