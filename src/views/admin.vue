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
                :rules="[rules.required, rules.username]"
                counter="30"
                data-e2e="account-username"
                label="Username"
                v-model="lightboxes.upsert.username"
              />
            </v-list-item>

            <v-list-item>
              <password
                :placeholder="lightboxes.upsert.create ? undefined : '[unchanged]'"
                :rules="passwordRules"
                autocomplete="new-password"
                data-e2e="account-password"
                v-model="lightboxes.upsert.password"
              ></password>
            </v-list-item>

            <v-list-item>
              <v-switch data-e2e="account-mfa" label="MFA" v-model="lightboxes.upsert.mfa"></v-switch>
            </v-list-item>

            <v-list-item>
              <v-select
                :items="lightboxes.upsert.roles"
                data-e2e="account-role"
                label="Role"
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
                  :disabled="!prechecks"
                  @click="upsert()"
                  data-e2e="upsert-account"
                >{{ lightboxes.upsert.create ? 'Create' : 'Save' }}</v-btn>
                <v-btn @click="lightboxes.upsert.visible = false" data-e2e="close-account">Cancel</v-btn>
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
            <qr data-e2e="account-mfa-token" :text="lightboxes.qr.text"></qr>
          </v-list-item>
          <v-list-item>
            <v-btn @click="lightboxes.qr.visible = false" data-e2e="close-account-mfa-token">Close</v-btn>
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
          <v-btn @click="impersonate(props.entity)" data-e2e="impersonate-account">Impersonate</v-btn>
          <v-btn @click="showLightbox(props.entity)" data-e2e="edit-account">Edit</v-btn>
          <v-btn color="error" @click="remove(props.entity)" data-e2e="remove-account">Remove</v-btn>
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
        create: false,
        mfa: false,
        password: null,
        role: null,
        roles: ['error'],
        username: null,
        visible: false
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
  computed: {
    passwordRules: function ()
    {
      return this.lightboxes.upsert.create ? {
        required: value => value != null || 'Required',
        password: value => filters.password.test(value) || 'Invalid password',
      } : {
        required: () => true,
        password: value => value == null || value == '' || filters.password.test(value) || 'Invalid password',
      };
    }
  },
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
    //Upsert account
    upsert: async function ()
    {
      //Create
      if (this.lightboxes.upsert.create)
      {
        //Update backend
        const {_id, otpauth} = await api.accounts.create(this.lightboxes.upsert.role, this.lightboxes.upsert.username, this.lightboxes.upsert.password, this.lightboxes.upsert.mfa);

        //Show otpauth URL if present
        if (otpauth != null)
        {
          this.lightboxes.qr.text = otpauth;
          this.lightboxes.qr.visible = true;
        }

        //Update frontend
        this.accounts.push({_id, username: this.lightboxes.upsert.username, mfa: this.lightboxes.upsert.mfa, role: this.lightboxes.upsert.role});
      }
      //Edit
      else
      {
        //Find original account
        const original = this.accounts.find(account => account._id == this.lightboxes.upsert._id);

        //Calculate changes
        const changes = {};
        for (const [key, value] of Object.entries(original))
        {
          if (this.lightboxes.upsert[key] != value)
          {
            //Save change
            changes[key] = this.lightboxes.upsert[key];

            //Update frontend
            original[key] = this.lightboxes.upsert[key];
          }
        }

        //Password
        if (this.lightboxes.upsert.password != null && this.lightboxes.upsert.password != '')
        {
          changes.password = this.lightboxes.upsert.password;
        }

        //Update backend
        const otpauth = await api.accounts.update(changes, this.lightboxes.upsert._id);

        if (changes.mfa)
        {
          this.lightboxes.qr.text = otpauth;
          this.lightboxes.qr.visible = true;
        }
      }

      //Hide the lightboxes.upsert
      this.lightboxes.upsert.visible = false;
    },
    //Impersonate account
    impersonate: function (account)
    {
      const impersonate = main.$children[0].impersonate;
      impersonate.name = account.username;
      impersonate.visible = true;

      api.accounts.impersonate.start(account._id, account.username);
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