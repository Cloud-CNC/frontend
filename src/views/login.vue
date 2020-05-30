<template>
  <v-container align-center fluid fill-height>
    <v-col cols="12">
      <v-row justify="center">
        <v-card width="500">
          <v-card-title class="font-weight-light primary headline">Login</v-card-title>
          <v-spacer />
          <v-card-text id="container">
            <v-form v-model="prechecks">
              <v-text-field
                :rules="[rules.required, rules.username]"
                data-e2e="username"
                label="Username"
                prepend-icon="account_circle"
                v-if="initial"
                v-model="username"
              ></v-text-field>
              <password icon data-e2e="password" v-if="initial" v-model="password"></password>
              <v-text-field
                :rules="[rules.required, rules.otp]"
                data-e2e="otp"
                label="MFA Code"
                prepend-icon="vpn_key"
                type="number"
                v-if="!initial"
                v-model.number="otp"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="secondary" data-e2e="login" :disabled="!prechecks" @click="login">Submit</v-btn>
          </v-card-actions>
        </v-card>
        <v-snackbar
          class="font-weight-light title"
          data-e2e="invalid-credentials"
          v-model="invalid"
        >
          Invalid username, password, or MFA code!
          <v-btn icon color="accent" @click="invalid = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-snackbar>
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
//Imports
import api from '../assets/api';
import filters from '../assets/filters';
import password from '../components/password';

export default {
  components: {
    password
  },
  data: () => ({
    pswd: null,
    initial: true,
    username: null,
    password: null,
    otp: null,
    rules: {
      required: value => value != null || 'Required',
      username: value => filters.name.test(value) || 'Invalid username',
      otp: value => filters.otp.test(value) || 'Invalid code'
    },
    prechecks: false,
    invalid: false
  }),
  methods: {
    login: function ()
    {
      //Initial phase of MFA (Or only stage if disabled)
      if (this.initial)
      {
        api.sessions.login(this.username, this.password).then(res =>
        {
          if (res.valid && !res.mfa)
          {
            this.$router.push('/files');
          }
          else if (res.valid)
          {
            this.initial = false;
          }
          else
          {
            this.invalid = true;
          }
        });
      }
      else
      {
        api.sessions.mfa(this.otp).then(valid =>
        {
          if (valid)
          {
            this.$router.push('/files');
          }
          else
          {
            this.invalid = true;
          }
        });
      }
    }
  }
};
</script>

<style scoped>
#container {
  padding: 15px;
}
</style>