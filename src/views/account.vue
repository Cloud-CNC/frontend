<template>
  <div>
    <v-container align-center fluid fill-height>
      <v-col cols="12">
        <v-row justify="center">
          <v-card width="500">
            <v-card-title class="font-weight-light text-center">Edit your account</v-card-title>
            <v-card-text>
              <v-form v-model="prechecks">
                <v-list>
                  <v-list-item>
                    <v-text-field
                      :rules="[rules.required, rules.username]"
                      counter="30"
                      data-e2e="account-username"
                      label="Username"
                      v-model="account.username"
                    />
                  </v-list-item>

                  <v-list-item>
                    <password :rules="passwordRules" data-e2e="account-password" placeholder="[unchanged]" v-model="account.password"></password>
                  </v-list-item>

                  <v-list-item>
                    <v-switch data-e2e="account-mfa" label="MFA" v-model="account.mfa"></v-switch>
                  </v-list-item>

                  <v-list-item>
                    <v-select
                      :items="roles"
                      data-e2e="account-role"
                      label="Role"
                      v-model="account.role"
                    >
                      <template
                        v-slot:item="role"
                      >{{role.item.charAt(0).toUpperCase() + role.item.substring(1)}}</template>
                      <template
                        v-slot:selection="role"
                      >{{role.item.charAt(0).toUpperCase() + role.item.substring(1)}}</template>
                    </v-select>
                  </v-list-item>

                  <v-list-item>
                    <v-btn :disabled="!prechecks" @click="update()" data-e2e="update-account">Save</v-btn>
                  </v-list-item>
                </v-list>
              </v-form>
            </v-card-text>
          </v-card>
        </v-row>
      </v-col>
    </v-container>

    <lightbox v-model="qr.visible">
      <template v-slot:title>MFA QR Code</template>

      <template v-slot:content>
        <v-list>
          <v-list-item>
            <qr data-e2e="account-mfa-token" :text="qr.text"></qr>
          </v-list-item>
          <v-list-item>
            <v-btn @click="qr.visible = false" data-e2e="close-account-mfa-token">Close</v-btn>
          </v-list-item>
        </v-list>
      </template>
    </lightbox>
  </div>
</template>

<script>
//Imports
import api from '../assets/api';
import filters from '../assets/filters';
import lightbox from '../components/lightbox';
import password from '../components/password';
import qr from '../components/qr';

export default {
  components: {
    lightbox,
    password,
    qr
  },
  data: () => ({
    roles: [],
    account: {
      role: null,
      username: null,
      password: null,
      mfa: false
    },
    original: {
      role: null,
      username: null,
      mfa: false
    },
    passwordRules: {
      required: () => true,
      password: value => value == null || value == '' || filters.password.test(value) || 'Invalid password',
    },
    prechecks: false,
    rules: {
      required: value => value != null || 'Required',
      username: value => filters.name.test(value) || 'Invalid username'
    },
    qr: {
      text: null,
      visible: false
    }
  }),
  created: function ()
  {
    //Get account
    api.accounts.get().then(account =>
    {
      this.account.role = account.role;
      this.account.username = account.username;
      this.account.mfa = account.mfa;

      this.original.role = account.role;
      this.original.username = account.username;
      this.original.mfa = account.mfa;
    });

    //Get roles
    api.accounts.roles().then(roles =>
    {
      this.roles = roles;
    });
  },
  methods: {
    //Update account
    update: async function ()
    {
      //Calculate changes
      const changes = {};
      for (const [key, value] of Object.entries(this.original))
      {
        if (this.account[key] != value)
        {
          //Save change
          changes[key] = this.account[key];
        }
      }

      //Password
      if (this.account.password != null && this.account.password != '')
      {
        changes.password = this.account.password;
      }

      //Update backend
      const otpauth = await api.accounts.update(changes);

      if (changes.mfa)
      {
        this.qr.text = otpauth;
        this.qr.visible = true;
      }
    }
  }
};
</script>

<style scoped>
</style>