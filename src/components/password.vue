<template>
  <v-text-field
    :append-icon="visible ? 'visibility_off' : 'visibility'"
    :data-e2e="dataE2e"
    :placeholder="placeholder"
    :prepend-icon="icon ? 'lock' : null"
    :rules="[rules.required, rules.password]"
    :type="visible ? 'text' : 'password'"
    :value="value"
    @blur="event => $emit('blur', event)"
    @click:append="visible = !visible"
    @input="event => $emit('input', event)"
    @update:error="update"
    counter="256"
    label="Password"
    ref="password"
  ></v-text-field>
</template>

<script>
//Imports
import filters from '../assets/filters';

export default {
  data: () => ({
    valid: false,
    visible: false
  }),
  methods: {
    update: function (valid)
    {
      this.valid = !valid;
    }
  },
  props: {
    dataE2e: {
      type: String
    },
    icon: {
      default: false,
      type: Boolean
    },
    placeholder: {
      default: undefined,
      type: String
    },
    rules: {
      default: () => ({
        required: value => value != null || 'Required',
        password: value => filters.password.test(value) || 'Invalid password',
      }),
      type: Object
    },
    value: {
      type: String,
      validator: value => value == null || typeof value == 'string'
    }
  }
};
</script>

<style>
</style>