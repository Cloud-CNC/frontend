<template>
  <div>
    <lightbox v-model="upsertLightbox.visible">
      <template v-slot:title>{{
        upsertLightbox.create
          ? "Create a new controller"
          : "Edit " + upsertLightbox.name
      }}</template>
      <template v-slot:content>
        <v-form v-model="prechecks">
          <v-list>
            <v-list-item>
              <v-text-field
                :rules="[rules.required, rules.name]"
                counter="30"
                data-e2e="controller-name"
                label="Name"
                v-model="upsertLightbox.name"
              />
            </v-list-item>

            <v-list-item>
              <v-btn-toggle>
                <v-btn
                  :disabled="!prechecks"
                  @click="upsert()"
                  data-e2e="upsert-controller"
                  >{{ upsertLightbox.create ? "Create" : "Save" }}</v-btn
                >
                <v-btn
                  @click="upsertLightbox.visible = false"
                  data-e2e="close-controller"
                  >Cancel</v-btn
                >
              </v-btn-toggle>
            </v-list-item>
          </v-list>
        </v-form>
      </template>
    </lightbox>

    <lightbox v-model="removeLightbox.visible">
      <template v-slot:title>Are you sure you want to remove {{ removeLightbox.name }}?</template>
      <template v-slot:content>
        <v-form>
          <v-btn-toggle>
            <v-btn @click="remove" color="error" data-e2e="remove-controller-confirm">Remove</v-btn>
            <v-btn @click="removeLightbox.visible = false">Cancel</v-btn>
          </v-btn-toggle>
        </v-form>
      </template>
    </lightbox>

    <gallery @add="showDownloadLightbox()" :entities="controllers">
      <template v-slot:actions="props">
        <v-btn-toggle>
          <download
            :data="download(props.entity.name, props.entity._id)"
            :filename="`${props.entity.name}.txt`"
            data-e2e="download-controller-key"
            >Download</download
          >
          <v-btn
            @click="showDownloadLightbox(props.entity)"
            data-e2e="edit-controller"
            >Edit</v-btn
          >
          <v-btn
            color="error"
            @click="showRemoveLightbox(props.entity)"
            data-e2e="remove-controller"
            >Remove</v-btn
          >
        </v-btn-toggle>
      </template>

      <template v-slot:empty class="font-weight-light"
        >No controllers available!</template
      >
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
    removeLightbox: {
      id: null,
      name: null,
      visible: false
    },
    upsertLightbox: {
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
    //Show download lightbox
    showDownloadLightbox: function (controller)
    {
      //Configure lightbox
      if (controller == null)
      {
        this.upsertLightbox._id = null;
        this.upsertLightbox.name = null;
        this.upsertLightbox.create = true;
      }
      else
      {
        this.upsertLightbox._id = controller._id;
        this.upsertLightbox.name = controller.name;
        this.upsertLightbox.create = false;
      }

      //Show upsert lightbox
      this.upsertLightbox.visible = true;
    },
    //Show remove lightbox
    showRemoveLightbox: function (controller)
    {
      this.removeLightbox.id = controller._id;
      this.removeLightbox.name = controller.name;
      this.removeLightbox.visible = true;
    },
    upsert: async function ()
    {
      //Create
      if (this.upsertLightbox.create)
      {
        //Update backend
        const _id = await api.controllers.create(this.upsertLightbox.name);

        //Update frontend
        this.controllers.push({_id, name: this.upsertLightbox.name});
      }
      //Edit
      else
      {
        //Find original controller
        const original = this.controllers.find(controller => controller._id == this.upsertLightbox._id);

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

        //Update backend
        await api.controllers.update(changes, this.upsertLightbox._id);
      }

      //Hide the upsert lightbox
      this.upsertLightbox.visible = false;
    },
    //Remove controller
    remove: async function ()
    {
      //Remove the controller
      await api.controllers.remove(this.removeLightbox.id);

      //Get index
      const index = this.controllers.findIndex(item => item._id == this.removeLightbox.id);

      //Remove controller
      this.controllers.splice(index, 1);

      //Hide remove lightbox
      this.removeLightbox.visible = false;
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