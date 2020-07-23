<template>
  <div>
    <lightbox v-model="lightbox.visible">
      <template
        v-slot:title
      >{{ lightbox.create ? 'Create a new controller' : 'Edit ' + lightbox.name }}</template>
      <template v-slot:content>
        <v-form v-model="prechecks">
          <v-list>
            <v-list-item>
              <v-text-field
                :rules="[rules.required, rules.name]"
                counter="30"
                data-e2e="controller-name"
                label="Name"
                v-model="lightbox.name"
              />
            </v-list-item>

            <v-list-item>
              <v-btn-toggle>
                <v-btn
                  :disabled="!prechecks"
                  @click="upsert()"
                  data-e2e="upsert-controller"
                >{{ lightbox.create ? 'Create' : 'Save' }}</v-btn>
                <v-btn @click="lightbox.visible = false" data-e2e="close-controller">Cancel</v-btn>
              </v-btn-toggle>
            </v-list-item>
          </v-list>
        </v-form>
      </template>
    </lightbox>

    <gallery @add="showLightbox()" :entities="controllers">
      <template v-slot:actions="props">
        <v-btn-toggle>
          <download
            :data="download(props.entity.name, props.entity._id)"
            :filename="`${props.entity.name}.txt`"
            data-e2e="download-controller-key"
          >Download</download>
          <v-btn @click="showLightbox(props.entity)" data-e2e="edit-controller">Edit</v-btn>
          <v-btn color="error" @click="remove(props.entity)" data-e2e="remove-controller">Remove</v-btn>
        </v-btn-toggle>
      </template>

      <template v-slot:empty class="font-weight-light">No controllers available!</template>
    </gallery>
  </div>
</template>

<script>
//Imports
import api from '../assets/api';
import download from '../components/download.vue';
import filters from '../assets/filters';
import gallery from '../components/gallery.vue';
import lightbox from '../components/lightbox.vue';

export default {
  components: {
    download,
    gallery,
    lightbox
  },
  data: () => ({
    lightbox: {
      _id: null,
      name: null,
      visible: false,
      create: false
    },
    prechecks: false,
    controllers: [],
    rules: {
      required: value => value != null || 'Required',
      name: value => filters.name.test(value) || 'Invalid name'
    }
  }),
  created: function ()
  {
    //Get controllers
    api.controllers.all().then(controllers => 
    {
      this.controllers = controllers;
    });
  },
  methods:
  {
    //Generate download data
    download: (name, _id) => async () =>
    {
      //Get key
      const {key} = await api.controllers.key(_id);

      return `Name: ${name}\r\nID: ${_id}\r\nKey: ${key}`;
    },
    //Show lightbox
    showLightbox: function (controller)
    {
      //Configure lightbox
      if (controller == null)
      {
        this.lightbox._id = null;
        this.lightbox.name = null;
        this.lightbox.create = true;
      }
      else
      {
        this.lightbox._id = controller._id;
        this.lightbox.name = controller.name;
        this.lightbox.create = false;
      }

      //Show lightbox
      this.lightbox.visible = true;
    },
    upsert: async function ()
    {
      //Create
      if (this.lightbox.create)
      {
        //Update backend
        const _id = await api.controllers.create(this.lightbox.name);

        //Update frontend
        this.controllers.push({_id, name: this.lightbox.name});
      }
      //Edit
      else
      {
        //Find original controller
        const original = this.controllers.find(controller => controller._id == this.lightbox._id);

        //Calculate changes
        const changes = {};
        for (const [key, value] of Object.entries(original))
        {
          if (this.lightbox[key] != value)
          {
            //Save change
            changes[key] = this.lightbox[key];

            //Update frontend
            original[key] = this.lightbox[key];
          }
        }

        //Update backend
        await api.controllers.update(changes, this.lightbox._id);
      }

      //Hide the lightbox
      this.lightbox.visible = false;
    },
    //Remove machine
    remove: function (machine)
    {
      api.controllers.remove(machine._id).then(() =>
      {
        //Get index
        const index = this.controllers.findIndex(item => item._id == machine._id);

        //Remove machine
        this.controllers.splice(index, 1);
      });
    }
  }
};
</script>

<style>
#container {
  padding: 15px;
}

#create {
  float: right;
}

textarea {
  height: 20vh;
}
</style>