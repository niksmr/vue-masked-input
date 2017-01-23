<template>
<div id="app">
  <h1>Vue Masked Input</h1>
  <h3>Dead simple masked input component for Vue.js 2.X</h3>
  <hr />
  <h4>Date: </h4>
  <masked-input v-model="date" mask="11 / 11 / 1111" placeholder="Date" /><span v-if="">{{ date }}</span>
  <p class="code">
    &lt;masked-input v-model="date" mask="11 / 11 / 1111" placeholder="Date" /&gt;
  </p>
  <h4>Phone: </h4>
  <masked-input v-model="phone" mask="+\1 (111) 1111-11" placeholder="Phone" /><span>{{ phone }}</span>
  <p class="code">
    &lt;masked-input v-model="phone" mask="+\1 (111) 1111-11" placeholder="Phone" /&gt;
  </p>
  <h4>Your own mask (hot re-mask available): </h4>
  <input v-model="userMask" placeholder="Mask" />
  <masked-input v-model="userField" :mask="userMask" placeholder="Text" /><span>{{ userField }}</span>
  <br />
  <h4>Check <a href="#">GitHub</a> for more</h4>
</div>
</template>

<script>
import MaskedInput from './MaskedInput.vue';

export default {
  name: 'app',
  data: () => ({
    date: '',
    phone: '',
    userMask: 'aa-aa-AAAA',
    userField: '',
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
  font-family: inherit;
  font-size: inherit;
  padding: 8px 16px;
  border: none;
  border-bottom: 1px solid #4fc08d;
  outline: none;
  margin-right: 24px;
}

hr {
  border: none;
  border-bottom: 1px solid #DDD;
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
  margin-left: 32px;
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
