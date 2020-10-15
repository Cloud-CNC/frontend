<template>
  <div>
    <lightbox v-model="upsertLightbox.visible">
      <template v-slot:title>{{
        upsertLightbox.create
          ? "Create a new account"
          : "Edit " + upsertLightbox.username
      }}</template>

      <template v-slot:content>
        <v-form v-model="prechecks">
          <v-list>
            <v-list-item>
              <v-text-field
                :rules="[rules.required, rules.username]"
                counter="30"
                data-e2e="account-username"
                label="Username"
                v-model="upsertLightbox.username"
              />
            </v-list-item>

            <v-list-item>
              <password
                :placeholder="upsertLightbox.create ? undefined : '[unchanged]'"
                :rules="passwordRules"
                autocomplete="new-password"
                data-e2e="account-password"
                v-model="upsertLightbox.password"
              ></password>
            </v-list-item>

            <v-list-item>
              <v-switch
                data-e2e="account-mfa"
                label="MFA"
                v-model="upsertLightbox.mfa"
              ></v-switch>
            </v-list-item>

            <v-list-item>
              <v-select
                :items="upsertLightbox.roles"
                data-e2e="account-role"
                label="Role"
                v-model="upsertLightbox.role"
              >
                <template v-slot:item="role">{{
                  role.item.charAt(0).toUpperCase() + role.item.substring(1)
                }}</template>
                <template v-slot:selection="role">{{
                  role.item.charAt(0).toUpperCase() + role.item.substring(1)
                }}</template>
              </v-select>
            </v-list-item>

            <v-list-item>
              <v-btn-toggle>
                <v-btn
                  :disabled="!prechecks"
                  @click="upsert()"
                  data-e2e="upsert-account"
                  >{{ upsertLightbox.create ? "Create" : "Save" }}</v-btn
                >
                <v-btn
                  @click="upsertLightbox.visible = false"
                  data-e2e="close-account"
                  >Cancel</v-btn
                >
              </v-btn-toggle>
            </v-list-item>
          </v-list>
        </v-form>
      </template>
    </lightbox>

    <lightbox v-model="qrLightbox.visible">
      <template v-slot:title>MFA QR Code</template>

      <template v-slot:content>
        <v-list>
          <v-list-item>
            <qr data-e2e="account-mfa-token" :text="qrLightbox.text"></qr>
          </v-list-item>
          <v-list-item>
            <v-btn
              @click="qrLightbox.visible = false"
              data-e2e="close-account-mfa-token"
              >Close</v-btn
            >
          </v-list-item>
        </v-list>
      </template>
    </lightbox>

    <lightbox v-model="removeLightbox.visible">
      <template v-slot:title>Are you sure you want to remove {{ removeLightbox.username }}?</template>

      <template v-slot:content>
        <v-form>
          <v-btn-toggle>
            <v-btn @click="remove" color="error" data-e2e="remove-account-confirm">Remove</v-btn>
            <v-btn @click="removeLightbox.visible = false">Cancel</v-btn>
          </v-btn-toggle>
        </v-form>
      </template>
    </lightbox>

    <gallery @add="showUpsertLightbox()" :entities="accounts">
      <template v-slot:name="props">{{ props.entity.username }}</template>

      <template v-slot:description="props">
        <v-chip-group>
          <v-chip>{{
            props.entity.role.charAt(0).toUpperCase() +
            props.entity.role.substring(1)
          }}</v-chip>
        </v-chip-group>
      </template>

      <template v-slot:actions="props">
        <v-btn-toggle>
          <v-btn
            @click="impersonate(props.entity)"
            data-e2e="impersonate-account"
            >Impersonate</v-btn
          >
          <v-btn
            @click="showUpsertLightbox(props.entity)"
            data-e2e="edit-account"
            >Edit</v-btn
          >
          <v-btn
            color="error"
            @click="showRemoveLightbox(props.entity)"
            data-e2e="remove-account"
            >Remove</v-btn
          >
        </v-btn-toggle>
      </template>

      <template v-slot:empty class="font-weight-light"
        >No accounts available!</template
      >
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
    removeLightbox: {
      id: null,
      username: null,
      visible: false
    },
    upsertLightbox: {
      _id: null,
      create: false,
      mfa: false,
      password: null,
      role: null,
      roles: ['error'],
      username: null,
      visible: false
    },
    qrLightbox: {
      text: null,
      visible: false
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
      return this.upsertLightbox.create ? {
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
      this.upsertLightbox.roles = roles;
    });
  },
  methods: {
    //Show remove lightbox
    showRemoveLightbox: function (account)
    {
      this.removeLightbox.id = account._id;
      this.removeLightbox.username = account.username;
      this.removeLightbox.visible = true;
    },
    //Show upsert lightbox
    showUpsertLightbox: function (account)
    {
      //Configure lightbox
      if (account == null)
      {
        this.upsertLightbox._id = null;
        this.upsertLightbox.username = null;
        this.upsertLightbox.password = null;
        this.upsertLightbox.mfa = false;
        this.upsertLightbox.role = this.upsertLightbox.roles[0];
        this.upsertLightbox.create = true;
      }
      else
      {
        this.upsertLightbox._id = account._id;
        this.upsertLightbox.username = account.username;
        this.upsertLightbox.password = null;
        this.upsertLightbox.mfa = account.mfa;
        this.upsertLightbox.role = account.role;
        this.upsertLightbox.create = false;
      }

      //Show lightbox
      this.upsertLightbox.visible = true;
    },
    //Upsert account
    upsert: async function ()
    {
      //Create
      if (this.upsertLightbox.create)
      {
        //Update backend
        const {_id, otpauth} = await api.accounts.create(this.upsertLightbox.role, this.upsertLightbox.username, this.upsertLightbox.password, this.upsertLightbox.mfa);

        //Show otpauth URL if present
        if (otpauth != null)
        {
          this.qrLightbox.text = otpauth;
          this.qrLightbox.visible = true;
        }

        //Update frontend
        this.accounts.push({_id, username: this.upsertLightbox.username, mfa: this.upsertLightbox.mfa, role: this.upsertLightbox.role});
      }
      //Edit
      else
      {
        //Find original account
        const original = this.accounts.find(account => account._id == this.upsertLightbox._id);

        //Calculate changes
        const changes = {};
        for (const [key, value] of Object.entries(original))
        {
          if (this.upsertLightbox[key] != value)
          {
            //Save change
            changes[key] = this.upsertLightbox[key];

            //Update frontend
            original[key] = this.upsertLightbox[key];
          }
        }

        //Password
        if (this.upsertLightbox.password != null && this.upsertLightbox.password != '')
        {
          changes.password = this.upsertLightbox.password;
        }

        //Update backend
        const otpauth = await api.accounts.update(changes, this.upsertLightbox._id);

        if (changes.mfa)
        {
          this.qrLightbox.text = otpauth;
          this.qrLightbox.visible = true;
        }
      }

      //Hide the upsertLightbox
      this.upsertLightbox.visible = false;
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
    remove: async function ()
    {
      //Remove the account
      await api.accounts.remove(this.removeLightbox.id);

      //Get index
      const index = this.accounts.findIndex(item => item._id == this.removeLightbox.id);

      //Remove account
      this.accounts.splice(index, 1);

      //Hide remove lightbox
      this.removeLightbox.visible = false;
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