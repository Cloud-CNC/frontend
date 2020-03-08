<template>
  <div>
    <lightbox v-model="lightbox.visible">
      <template v-slot:title>MFA QR Code</template>

      <template v-slot:content>
        <v-list>
          <v-list-item>
            <qr :text="lightbox.text"></qr>
          </v-list-item>
          <v-list-item>
            <v-btn @click="lightbox.visible = false">Close</v-btn>
          </v-list-item>
        </v-list>
      </template>
    </lightbox>

    <v-container align-center fluid fill-height>
      <v-col cols="12">
        <v-row justify="center">
          <v-card width="500">
            <v-card-title class="font-weight-light text-center">Edit your account</v-card-title>
            <v-card-text>
              <v-form>
                <v-list>
                  <v-list-item>
                    <v-text-field
                      ref="username"
                      v-model="account.username"
                      counter="30"
                      label="Username"
                      :rules="[rules.required, rules.username]"
                      @blur="update('username')"
                    />
                  </v-list-item>

                  <v-list-item>
                    <password ref="password" v-model="account.password" @blur="update('password')"></password>
                  </v-list-item>

                  <v-list-item>
                    <v-checkbox
                      ref="mfa"
                      v-model="account.mfa"
                      label="MFA"
                      @click.passive.stop="update('mfa')"
                    ></v-checkbox>
                  </v-list-item>

                  <v-list-item>
                    <v-select
                      :items="account.roles"
                      @blur="update('role')"
                      label="Role"
                      ref="role"
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
                </v-list>
              </v-form>
            </v-card-text>
          </v-card>
        </v-row>
      </v-col>
    </v-container>
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
    account: {
      roles: ['error'],
      role: null,
      username: null,
      password: null,
      mfa: false
    },
    lightbox: {
      text: null,
      visible: false
    },
    rules: {
      required: value => value != null || 'Required',
      username: value => filters.name.test(value) || 'Invalid username'
    }
  }),
  created: function ()
  {
    //Get account
    api.accounts.get().then(account =>
    {
      this.account.username = account.username;
      this.account.mfa = account.mfa;
      this.account.role = account.role;
    });

    //Get roles
    api.accounts.roles().then(roles =>
    {
      this.account.roles = roles;
    });
  },
  methods: {
    //Update account
    update: function (property)
    {
      //Precheck
      if (this.$refs[property].valid)
      {
        if (property == 'mfa' && this.account.mfa)
        {
          api.accounts.update({[property]: this.account[property]}).then(res =>
          {
            this.lightbox.text = res.otpauth;
            this.lightbox.visible = true;
          });
        }
        else
        {
          api.accounts.update({[property]: this.account[property]});
        }
      }
    }
  }
};
</script>

<style scoped>
</style>