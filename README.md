# Vue Masked Input
Dead simple masked input component for Vue.js 2.X. Based on [inputmask-core](https://github.com/insin/inputmask-core).


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

If you need to include one of these characters as a static part of the mask, you can escape them with a preceding backslash:
```vue
<masked-input v-model="date" mask="+\\1 (111) 111-1111" placeholder="Phone number" type="tel" />
```
