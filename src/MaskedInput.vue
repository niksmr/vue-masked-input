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
    :disabled="mask_core===null || disabled"
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
    mask: {
      type: String,
      required: true,
      validator:  value => !! (value && value.length >= 1)
    },
    placeholderChar: {
      type: String,
      default: '_',
      validator:  value => !! (value && value.length === 1)
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  watch: {
    mask: function(newMask) {
      this.initMask()
    },
    value: function(newValue) {
      if (this.mask_core) this.mask_core.setValue(newValue) //For multiple inputs support
    },
  },

  mounted() {
    this.initMask()
  },

  methods: {

    initMask() {
      try {
        this.mask_core = new InputMask({
          pattern: this.mask,
          value: '',
          placeholderChar: this.placeholderChar,
          formatCharacters: {
            'a': {
              validate: char => /^[A-Za-zА-Яа-я]$/.test(char),
            },
            'A': {
              validate: char => /^[A-Za-zА-Яа-я]$/.test(char) ,
              transform: char => char.toUpperCase()
            },
            '*': {
              validate: char => /^[\dA-Za-zА-Яа-я]$/.test(char),
            },
            '#': {
              validate: char => /^[\dA-Za-zА-Яа-я]$/.test(char),
              transform: char => char.toUpperCase()
            },
            '+': {
              validate: char => true,
            },
          }
        })
        for (const char of this.$refs.input.value) {
          this.mask_core.input(char)
        }
        this.mask_core.setSelection({
          start: 0,
          end: 0
        })
        if (this.$refs.input.value === '') {
          this.$emit('input', '', '')
        }
        else {
          this.updateToCoreState()
        }


      }
      catch (e) {
        console.error(e.message);
        this.mask_core = null
        this.$refs.input.value = 'Error, see console'
        this.$emit('input', this.$refs.input.value, '')
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
      this.setNativeSelection()


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

    keyPress(e) { //works only on Desktop
      if (e.ctrlKey) return; //Fix FF copy/paste issue
      /*
       IE & FF are not trigger textInput event, so we have to force it
      */
      const isIE = /*@cc_on!@*/false || !!document.documentMode; //by http://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
      const isFirefox = typeof InstallTrigger !== 'undefined';


      if (isIE || isFirefox) {
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
        /*let text = this.$refs.input.value.slice(
          this.$refs.input.selectionStart,
          this.$refs.input.selectionEnd
        )*/
        try {
          document.execCommand('copy')
        } catch (err) {}
        this.mask_core.backspace()
        this.updateToCoreState()
      }
    },

    copy(e) {
    },

    paste(e) {
      e.preventDefault()
      const pasteText = e.clipboardData.getData('text')
      for (const char of pasteText) {
        this.mask_core.input(char)
      }
      this.updateToCoreState()
    },

    updateToCoreState() {
      if (this.mask_core === null) {
        return;
      }
      if (this.$refs.input.value !== this.mask_core.getValue()) {
        this.$refs.input.value = this.mask_core.getValue()
        this.$emit('input', this.$refs.input.value, this.mask_core.getRawValue())
      }
      this.$refs.input.selectionStart = this.mask_core.selection.start;
      this.$refs.input.selectionEnd = this.mask_core.selection.end;
    },

    focusin(e) {
    },

    isEmpty() {
      if (this.mask_core === null) return true;
      return this.mask_core.getValue() === this.mask_core.emptyValue
    },

    focusout(e) {
      if (this.isEmpty()) {
        this.$refs.input.value = ''
        this.mask_core.setSelection({
          start: 0,
          end: 0
        })
        this.$emit('input', '', '')
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
