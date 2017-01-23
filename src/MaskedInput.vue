<template>
<input ref="input" :value="value" @keypress.prevent="keyPress(arguments[0])" @keydown="keyDown(arguments[0])" @mouseup="mouseUp(arguments[0])" @focus.prevent="focusin(arguments[0])" @focusout="focusout(arguments[0])" @cut="cut(arguments[0])" @copy="copy(arguments[0])"
    @paste="paste(arguments[0])" />
</template>

<script>
import InputMask from 'inputmask-core';
import ffpoly from './ff-polyfill.js'; //Firefox Polyfill for focus events
ffpoly();

export default {

  name: 'MaskedInput',

  data: () => ({
    firstFocus: true,
    marginLeft: 0,
    mask_core: null
  }),

  props: {
    value: {
      type: String
    },
    default: {
      type: String,
      default: ''
    },
    mask: {
      type: String,
      required: true
    }
  },

  watch: {
    // whenever question changes, this function will run
    mask: function(newMask) {
      try {
        this.mask_core = new InputMask({
          pattern: newMask,
          value: this.default
        })
      } catch (e) {
        this.mask_core = new InputMask({
          pattern: 'B\\ad1M\\ask',
          value: this.default
        })
      }
      this.update();
    }
  },

  mounted() {
    this.mask_core = new InputMask({
      pattern: this.mask,
      value: this.default
    })
    this.$refs.input.value = this.default
  },

  methods: {

    getValue() {
      return this.$refs.input.value
    },

    keyPress(e) {
      this.mask_core.input(e.key)
      this.update()
    },

    keyDown(e) {
      this.setNativeSelection()
      switch (e.keyCode) {

        //backspace
        case 8:
          e.preventDefault()
          if (
            this.mask_core.selection.start > this.marginLeft ||
            this.mask_core.selection.start != this.mask_core.selection.end
          ) {
            this.mask_core.backspace();
          }
          break;

          //left arrow
        case 37:
          e.preventDefault()

          if (this.$refs.input.selectionStart === this.$refs.input.selectionEnd)
            this.$refs.input.selectionStart--

            this.mask_core.selection = {
              start: this.$refs.input.selectionStart,
              end: this.$refs.input.selectionStart
            }
          break;

          //right arrow
        case 39:
          e.preventDefault()

          if (this.$refs.input.selectionStart === this.$refs.input.selectionEnd)
            this.$refs.input.selectionEnd++;

          this.mask_core.selection = {
            start: this.$refs.input.selectionEnd,
            end: this.$refs.input.selectionEnd
          }
          break;

          //end
        case 35:
          e.preventDefault()
          this.$refs.input.selectionStart = this.$refs.input.selectionEnd = this.$refs.input.value.length

          this.mask_core.selection = {
            start: this.$refs.input.selectionEnd,
            end: this.$refs.input.selectionEnd
          }
          break;

          //home
        case 36:
          e.preventDefault()
          this.$refs.input.selectionStart = this.$refs.input.selectionEnd = 0
          this.mask_core.selection = {
            start: this.$refs.input.selectionStart,
            end: this.$refs.input.selectionStart
          }
          break;

          //delete
        case 46:
          e.preventDefault()

          if (this.$refs.input.selectionStart === this.$refs.input.selectionEnd) {
            if (this.$refs.input.selectionEnd !== this.mask_core.length) {
              this.mask_core.setSelection({
                start: 0,
                end: this.mask_core.getValue().length
              })
              this.mask_core.backspace()
              this.mask_core.setSelection({
                start: 0,
                end: 0
              })
              this.$refs.input.selectionStart = this.mask_core.selection.start;
              this.$refs.input.selectionEnd = this.mask_core.selection.start;
            }
          } else {
            this.mask_core.backspace()
          }
          break;

      }

      this.update()

    },

    cut(e) {
      e.preventDefault();
      if (this.$refs.input.selectionStart !== this.$refs.input.selectionEnd) {

        let text = this.$refs.input.value.slice(
          this.$refs.input.selectionStart,
          this.$refs.input.selectionEnd
        )
        try {
          document.execCommand('copy')
        } catch (err) {}
        this.mask_core.backspace()
        this.update()
      }

    },

    copy(e) {},

    paste(e) {
      e.preventDefault();
      this.mask_core.paste(e.clipboardData.getData('text'))
      this.update()
    },

    update() {
      this.$refs.input.value = this.mask_core.getValue()
      this.$refs.input.selectionStart = this.mask_core.selection.start;
      this.$refs.input.selectionEnd = this.mask_core.selection.end;
      this.$emit('input', this.$refs.input.value)
    },

    focusin(e) {
      this.mask_core.setValue(this.value)
      this.update()
    },

    isEmpty() {
      return this.mask_core.emptyValue === this.$refs.input.value
    },

    focusout(e) {
      if (this.isEmpty()) {
        this.$refs.input.value = this.default
        this.mask_core.setSelection({
          start: 0,
          end: 0
        })
        this.$emit('input', '')
      }
    },

    setNativeSelection() {
      this.mask_core.selection = {
        start: this.$refs.input.selectionStart,
        end: this.$refs.input.selectionEnd
      }
    },

    mouseUp(e) {
      if (this.$refs.input.value === this.mask_core.emptyValue &&
        this.$refs.input.selectionStart === this.$refs.input.selectionEnd) {
        this.mask_core.setSelection({
          start: 0,
          end: 0
        })
        this.$refs.input.selectionStart = this.mask_core.selection.start;
        this.$refs.input.selectionEnd = this.mask_core.selection.start;
        this.marginLeft = this.mask_core.selection.start;

      } else {
        this.setNativeSelection();
      }
    }
  }

}
</script>
