# Vue Masked Input
Dead simple masked input component for Vue.js 2.X. Based on [inputmask-core](https://github.com/insin/inputmask-core).

### [Live Demo](https://niksmr.github.io/vue-masked-input/)

## Install
### npm
```
npm install vue-masked-input --save
```

## Usage
Use it with `v-model` just like a native html input with the `mask` attribute:
```vue
<masked-input v-model="date" mask="11/11/1111" placeholder="dd/mm/yyyy" />
```

The following format characters define editable parts of the mask (see [inputmask-core](https://github.com/insin/inputmask-core)):
* `1` - number
* `a` - letter
* `A` - letter, forced to upper case when entered
* `*` - alphanumeric
* `#` - alphanumeric, forced to upper case when entered
* `+` - any character

### Static characters
If you need to include one of these characters as a static part of the mask, you can escape them with a preceding backslash:
```vue
<masked-input v-model="phone" mask="\+\1 (111) 111-1111" placeholder="Phone number" type="tel" />
```

### Raw input
You can also get a raw user input text if you want. Instead of using v-model you might need second argument of the input event:
```vue
<masked-input mask="\+\1 (111) 1111-11" placeholder="Phone" @input="rawVal = arguments[1]" />
```

### Placeholder character
Placeholder character is customizable by `placeholder-char` attribute:
```vue
<masked-input v-model="phone" mask="\+\1 (111) 111-1111" placeholder-char="-" placeholder="Phone number" type="tel" />
```

### Custom mask object
You can use your own mask options object, it will be passed to the [inputmask-core](https://github.com/insin/inputmask-core#inputmask-options) constructor:
```vue
<masked-input
  v-model="custom"
  placeholder="Custom"
  :mask="{
    pattern: 'VVVV',
    formatCharacters: {
      'V': {
        validate: char => /[a-jA-J]/.test(char),
        transform: char => char.toUpperCase(),
      },
    },
  }"
/>
```

## Known issues/TODO
* Cut in mobile Chrome
* Cyrillic chars are not supported in mobile Chrome
* Backspace problems in mobile Chrome

Found more? It's open for feedback and pull requests
