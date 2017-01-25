<template>
  <input ref="input"
    :value="value"
    @keydown="keyDown(arguments[0])"
    @keypress="keyPress(arguments[0])"
    @keyup="keyUp(arguments[0])"
    @textInput="textInput(arguments[0])"
    @mouseup="mouseUp(arguments[0])"
    @focus.prevent="focusin(arguments[0])"
    @focusout="focusout(arguments[0])"
    @cut="cut(arguments[0])"
    @copy="copy(arguments[0])"
    @paste="paste(arguments[0])"
    :disabled="mask_core===null"
  />
</template>

<script>
import InputMask from 'inputmask-core'
import ffpoly from './ff-polyfill.js' //Firefox Polyfill for focus events
ffpoly()

export default {

  name: 'MaskedInput',

  data: () => ({
    marginLeft: 0,
    mask_core: null,
    updateAfterAll: false
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
    mask: function(newMask) {
      this.initMask()
    }
  },

  mounted() {
    this.initMask()
  },

  methods: {

    initMask() {
      try {
        this.mask_core = new InputMask({
          pattern: this.mask,
          value: this.default
        })
        this.$refs.input.value = this.default
        this.mask_core.setValue(this.default)
        this.mask_core.setSelection({
          start: 0,
          end: 0
        })
        this.$emit('input', this.default)
      }
      catch (e) {
        this.mask_core = null
        this.$refs.input.value = '0 editable chars in mask'
        this.$emit('input', this.$refs.input.value)
      }
    },

    getValue() {
      if (this.mask_core === null) return '';
      return this.mask_core.getValue()
    },

    keyDown(e) { //Always
      if (this.mask_core === null) {
        e.preventDefault()
        return;
      }

      switch (e.keyCode) {

        //backspace
        case 8:
          e.preventDefault()
          if (
            this.mask_core.selection.start > this.marginLeft ||
            this.mask_core.selection.start != this.mask_core.selection.end
          ) {
            this.mask_core.backspace()
            this.updateToCoreState()
          }
          break;

        //left arrow
        case 37:
          e.preventDefault()

          if (this.$refs.input.selectionStart === this.$refs.input.selectionEnd)
            this.$refs.input.selectionEnd = this.$refs.input.selectionStart--

            this.mask_core.selection = {
              start: this.$refs.input.selectionStart,
              end: this.$refs.input.selectionStart
            }
            this.updateToCoreState()
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
          this.updateToCoreState()
          break;

        //end
        case 35:
          e.preventDefault()
          this.$refs.input.selectionStart = this.$refs.input.selectionEnd = this.$refs.input.value.length

          this.mask_core.selection = {
            start: this.$refs.input.selectionEnd,
            end: this.$refs.input.selectionEnd
          }
          this.updateToCoreState()
          break;

        //home
        case 36:
          e.preventDefault()
          this.$refs.input.selectionStart = this.$refs.input.selectionEnd = 0
          this.mask_core.selection = {
            start: this.$refs.input.selectionStart,
            end: this.$refs.input.selectionStart
          }
          this.updateToCoreState()
          break;

        //delete
        case 46:
          e.preventDefault()

          if (this.$refs.input.selectionStart === this.$refs.input.selectionEnd) {
            this.mask_core.setValue('');
            this.mask_core.setSelection({
              start: 0,
              end: 0
            })
            this.$refs.input.selectionStart = this.mask_core.selection.start;
            this.$refs.input.selectionEnd = this.mask_core.selection.start;

          } else {
            this.mask_core.backspace()
          }
          this.updateToCoreState()
          break;
      }
    },

    input(e) {
    },

    keyPress(e) { //works only on Desktop  //Dirty FF hack
      if (navigator.userAgent.indexOf('Firefox') != -1 &&
      parseFloat(navigator.userAgent.substring(navigator.userAgent.indexOf('Firefox') + 8)) >= 3.6) {
        e.preventDefault()
        e.data = e.key
        this.textInput(e)
      }
    },

    textInput(e) {
      if (e.preventDefault) e.preventDefault()
      if (this.mask_core.input(e.data)) {
        this.updateAfterAll = true
      }
      this.updateToCoreState()
    },

    keyUp(e) {
      this.updateToCoreState()
      this.updateAfterAll = false
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
        this.updateToCoreState()
      }
    },

    copy(e) {},

    paste(e) {
      e.preventDefault()
      this.mask_core.paste(e.clipboardData.getData('text'))
      this.updateToCoreState()
    },

    updateToCoreState() {
      if (this.mask_core === null) {
        return;
      }
      this.$refs.input.value = this.mask_core.getValue()
      this.$refs.input.selectionStart = this.mask_core.selection.start;
      this.$refs.input.selectionEnd = this.mask_core.selection.end;
      this.$emit('input', this.$refs.input.value)
    },

    focusin(e) {
    },

    isEmpty() {
      if (this.mask_core === null) return true;
      return this.mask_core.getValue() === this.mask_core.emptyValue
    },

    focusout(e) {
      if (this.isEmpty()) {
        this.$refs.input.value = this.default
        this.mask_core.setSelection({
          start: 0,
          end: 0
        })
        this.$emit('input', this.default)
      }
    },

    setNativeSelection() {
      this.mask_core.selection = {
        start: this.$refs.input.selectionStart,
        end: this.$refs.input.selectionEnd
      }
    },

    mouseUp(e) {
      if (this.isEmpty() &&
        this.$refs.input.selectionStart === this.$refs.input.selectionEnd) {
        this.mask_core.setSelection({
          start: 0,
          end: 0
        })
        this.$refs.input.selectionStart = this.mask_core.selection.start;
        this.$refs.input.selectionEnd = this.mask_core.selection.start;
        this.marginLeft = this.mask_core.selection.start;
        this.updateToCoreState();
      }
      else {
        this.setNativeSelection();
      }
    }
  }

}
</script>
