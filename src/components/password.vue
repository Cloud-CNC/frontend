<template>
  <v-text-field
    :append-icon="visible ? 'visibility_off' : 'visibility'"
    :prepend-icon="icon ? 'lock' : null"
    :rules="[rules.required, rules.password]"
    :type="visible ? 'text' : 'password'"
    @blur="event => $emit('blur', event)"
    @click:append="visible = !visible"
    @input="event => $emit('input', event)"
    @update:error="update"
    counter="256"
    label="Password"
    ref="password"
    v-model="value"
  ></v-text-field>
</template>

<script>
//Imports
import filters from '../assets/filters';

export default {
  data: () => ({
    rules: {
      required: value => value != null || 'Required',
      password: value => filters.password.test(value) || 'Invalid password',
    },
    valid: false,
    visible: false
  }),
  methods: {
    update: function(valid)
    {
      this.valid = !valid;
    }
  },
  props: {
    icon: {
      default: false,
      type: Boolean
    },
    value: {
      type: String,
      required: true
    }
  }
};
</script>

<style>
</style>