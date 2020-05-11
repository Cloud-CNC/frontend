<template>
  <div>
    <lightbox v-model="lightboxes.upsert.visible">
      <template
        v-slot:title
      >{{lightboxes.upsert.create ? 'Create a new account' : 'Edit ' + lightboxes.upsert.username }}</template>

      <template v-slot:content>
        <v-form v-model="prechecks">
          <v-list>
            <v-list-item>
              <v-text-field
                ref="username"
                v-model="lightboxes.upsert.username"
                counter="30"
                label="Username"
                :rules="[rules.required, rules.username]"
                @blur="update('username')"
              />
            </v-list-item>

            <v-list-item>
              <password
                autocomplete="new-password"
                @blur="update('password')"
                ref="password"
                v-model="lightboxes.upsert.password"
              ></password>
            </v-list-item>

            <v-list-item>
              <v-checkbox
                ref="mfa"
                v-model="lightboxes.upsert.mfa"
                label="MFA"
                @click.passive.stop="update('mfa')"
              ></v-checkbox>
            </v-list-item>

            <v-list-item>
              <v-select
                :items="lightboxes.upsert.roles"
                @blur="update('role')"
                label="Role"
                ref="role"
                v-model="lightboxes.upsert.role"
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
              <v-btn-toggle>
                <v-btn
                  v-if="lightboxes.upsert.create"
                  :disabled="!prechecks"
                  @click="create()"
                >Create</v-btn>
                <v-btn
                  @click="lightboxes.upsert.visible = false"
                >{{ lightboxes.upsert.create ? 'Cancel' : 'Close' }}</v-btn>
              </v-btn-toggle>
            </v-list-item>
          </v-list>
        </v-form>
      </template>
    </lightbox>

    <lightbox v-model="lightboxes.qr.visible">
      <template v-slot:title>MFA QR Code</template>

      <template v-slot:content>
        <v-list>
          <v-list-item>
            <qr :text="lightboxes.qr.text"></qr>
          </v-list-item>
          <v-list-item>
            <v-btn @click="lightboxes.qr.visible = false">Close</v-btn>
          </v-list-item>
        </v-list>
      </template>
    </lightbox>

    <gallery @add="showLightbox()" :entities="accounts">
      <template v-slot:name="props">{{props.entity.username}}</template>

      <template v-slot:description="props">
        <v-chip-group>
          <v-chip>{{ props.entity.role.charAt(0).toUpperCase() + props.entity.role.substring(1) }}</v-chip>
        </v-chip-group>
      </template>

      <template v-slot:actions="props">
        <v-btn-toggle>
          <v-btn @click="impersonate(props.entity)">Impersonate</v-btn>
          <v-btn @click="showLightbox(props.entity)">Edit</v-btn>
          <v-btn color="error" @click="remove(props.entity)">Remove</v-btn>
        </v-btn-toggle>
      </template>

      <template v-slot:empty class="font-weight-light">No accounts available!</template>
    </gallery>
  </div>
</template>

<script>
//Imports
import api from '../assets/api';
import filters from '../assets/filters';
import gallery from '../components/gallery';
import lightbox from '../components/lightbox';
import main from '../main';
import password from '../components/password';
import qr from '../components/qr';

export default {
  components: {
    gallery,
    lightbox,
    password,
    qr
  },
  data: () => ({
    accounts: [],
    lightboxes: {
      upsert: {
        _id: null,
        roles: ['error'],
        role: null,
        username: null,
        password: null,
        mfa: false,
        visible: false,
        create: false
      },
      qr: {
        text: null,
        visible: false
      }
    },
    prechecks: false,
    rules: {
      required: value => value != null || 'Required',
      username: value => filters.name.test(value) || 'Invalid username'
    }
  }),
  created: function ()
  {
    //Get accounts
    api.accounts.all().then(accounts => this.accounts = accounts);

    //Get roles
    api.accounts.roles().then(roles =>
    {
      this.lightboxes.upsert.roles = roles;
    });
  },
  methods: {
    //Show lightbox
    showLightbox: function (account)
    {
      //Configure lightbox
      if (account == null)
      {
        this.lightboxes.upsert._id = null;
        this.lightboxes.upsert.username = null;
        this.lightboxes.upsert.password = null;
        this.lightboxes.upsert.mfa = false;
        this.lightboxes.upsert.role = this.lightboxes.upsert.roles[0];
        this.lightboxes.upsert.create = true;
      }
      else
      {
        this.lightboxes.upsert._id = account._id;
        this.lightboxes.upsert.username = account.username;
        this.lightboxes.upsert.password = null;
        this.lightboxes.upsert.mfa = account.mfa;
        this.lightboxes.upsert.role = account.role;
        this.lightboxes.upsert.create = false;
      }

      //Show lightbox
      this.lightboxes.upsert.visible = true;
    },
    //Create account
    create: function ()
    {
      api.accounts.create(this.lightboxes.upsert.role, this.lightboxes.upsert.username, this.lightboxes.upsert.password, this.lightboxes.upsert.mfa).then(res =>
      {
        //Show otpauth URL if present
        if (res.otpauth != null)
        {
          this.lightboxes.qr.text = res.otpauth;
          this.lightboxes.qr.visible = true;
        }

        //Add to list
        this.accounts.push({_id: res._id, username: this.lightboxes.upsert.username, mfa: this.lightboxes.upsert.mfa, role: this.lightboxes.upsert.role});

        //Hide lightbox
        this.lightboxes.upsert.visible = false;
      });
    },
    //Impersonate account
    impersonate: function (account)
    {
      const impersonate = main.$children[0].impersonate;
      impersonate.name = account.username;
      impersonate.visible = true;

      api.accounts.impersonate.start(account._id, account.username);
    },
    //Update account
    update: function (property)
    {
      //Precheck
      if (this.$refs[property].valid && !this.lightboxes.upsert.create)
      {
        const account = this.accounts.find(account => account._id == this.lightboxes.upsert._id);

        if (property == 'mfa' && this.lightboxes.upsert.mfa)
        {
          api.accounts.update({[property]: this.lightboxes.upsert[property]}, this.lightboxes.upsert._id).then(res =>
          {
            this.lightboxes.qr.text = res.otpauth;
            this.lightboxes.qr.visible = true;
          });
        }
        else
        {
          api.accounts.update({[property]: this.lightboxes.upsert[property]}, this.lightboxes.upsert._id);
        }

        account[property] = this.lightboxes.upsert[property];
      }
    },
    //Remove account
    remove: function (account)
    {
      api.accounts.remove(account._id).then(() =>
      {
        //Get index
        const index = this.accounts.findIndex(item => item._id == account._id);

        //Remove account
        this.accounts.splice(index, 1);
      });
    }
  }
};
</script>

<style scoped>
#container {
  padding: 15px;
}

#create {
  float: right;
}

.v-chip {
  margin: 4px 2px;
}
</style>