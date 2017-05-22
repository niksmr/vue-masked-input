<template>
<div id="app">
  <h2 style="float: right;"><a href="https://github.com/niksmr/vue-masked-input">GitHub</a></h2>
  <h1>Vue Masked Input</h1>


  <h3>Dead simple masked input component for Vue.js 2.X</h3>

  <hr />
  <ul>
    <li>1 – number</li>
    <li>a – letter</li>
    <li>A – letter, forced to upper case when entered</li>
    <li>* – alphanumeric</li>
    <li># – alphanumeric, forced to upper case when entered</li>
    <li>+ – any character</li>
  </ul>

  <h4>Date: </h4>
  <masked-input v-model="date" mask="11 / 11 / 1111" placeholder="Date" /><span>{{ date }}</span>
  <p class="code">
    &lt;masked-input v-model="date" mask="11 / 11 / 1111" placeholder="Date" /&gt;
  </p>

  <h4>Phone: </h4>
  <masked-input v-model="phone" mask="\+\1 (111) 1111-11" placeholder="Phone" /><span>{{ phone }}</span>
  <p class="code">
    &lt;masked-input v-model="phone" mask="\+\1 (111) 1111-11" placeholder="Phone" /&gt;
  </p>

  <h4>Get a raw value: </h4>
  <masked-input mask="\+\1 (111) 1111-11" placeholder="Phone" @input="rawVal = arguments[1]" /><span>{{ rawVal }}</span>
  <p class="code">
    &lt;masked-input mask=&quot;\+\1 (111) 1111-11&quot; placeholder=&quot;Phone&quot; <br />&nbsp;&nbsp;@input=&quot;rawVal = arguments[1]&quot; /&gt;
  </p>

  <h4>Your own mask (hot re-mask available): </h4>
  <input v-model="userMask" placeholder="Mask" />
  <masked-input v-model="userField" :mask="userMask" placeholder="Text" /><span>{{ userField }}</span>
  <br />
  <br />

  <h4>Install </h4>
  <p class="code">
    npm install vue-masked-input --save
  </p>

  <h4>Use</h4>
  <p class="code">
    import MaskedInput from 'vue-masked-input'
    <br /> ... <br />components: { <br />&nbsp;&nbsp;MaskedInput <br />}
  </p>
  <br />

  <h4>Check <a href="https://github.com/niksmr/vue-masked-input">GitHub</a> for more</h4>
  <br />
</div>
</template>

<script>
import MaskedInput from './MaskedInput.js'
import Vue from 'vue'
import 'babel-polyfill'

export default {
  name: 'app',
  data: () => ({
    date: '',
    phone: '',
    userMask: 'aa-aa-AAAA',
    userField: '',
    rawVal: ''
  }),
  components: {
    MaskedInput
  }

}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900');
@import url('https://fonts.googleapis.com/css?family=Overpass+Mono:400,700');
body {
  background-color: #FAFAFA;
}

#app {
  max-width: 780px;
  margin: auto;
  font-family: 'Roboto', sans-serif;
  color: #2c3e50;
}

input {
  margin: 12px 0;
  font-family: inherit;
  font-size: inherit;
  padding: 8px 16px;
  border: none;
  border-bottom: 2px solid #4fc08d;
  outline: none;
  margin-right: 24px;
}

hr {
  border: none;
  border-bottom: 2px solid #DDD;
}

h1 {
  font-size: 48px;
  margin: 48px 0 8px 0;
  font-weight: 900;
}

h3 {
  margin: 0 0 24px;
  font-weight: 300;
}

h4 {
  margin: 36px 0 12px;
}

span {
  opacity: 0.5;
  margin-left: 16px;
  white-space: nowrap;
}

.code {
  padding: 24px;
  font-family: 'Overpass Mono', monospace;
  background-color: #EEE;
  font-size: 0.95em;
  font-weight: 500;
  line-height: 1.5em;
}
</style>
