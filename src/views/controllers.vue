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
                ref="name"
                v-model="lightbox.name"
                counter="30"
                label="Name"
                :rules="[rules.required, rules.name]"
                @blur="update('name')"
              />
            </v-list-item>

            <v-list-item>
              <v-btn-toggle>
                <v-btn v-if="lightbox.create" :disabled="!prechecks" @click="create()">Create</v-btn>
                <v-btn @click="lightbox.visible = false">{{ lightbox.create ? 'Cancel' : 'Close' }}</v-btn>
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
            :data="download(props.entity.name, props.entity._id, props.entity.key)"
            :filename="`${props.entity.name}.txt`"
          >Download</download>
          <v-btn @click="showLightbox(props.entity)">Edit</v-btn>
          <v-btn color="error" @click="remove(props.entity)">Remove</v-btn>
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
    download: (name, _id, key) =>
    {
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
    //Create controller
    create: function ()
    {
      api.controllers.create(this.lightbox.name).then(({_id, key}) =>
      {
        //Add to list
        this.controllers.push({
          _id,
          name: this.lightbox.name,
          key
        });

        //Hide lightbox
        this.lightbox.visible = false;
      });
    },
    //Update machine
    update: function (property)
    {
      //Precheck
      if (this.$refs[property].valid && !this.lightbox.create)
      {
        //Update front end
        const machine = this.controllers.find(machine => machine._id == this.lightbox._id);
        machine[property] = this.lightbox[property];

        //Update backend
        api.controllers.update({[property]: this.lightbox[property]}, this.lightbox._id);
      }
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
  width: 30vw !important;
}
</style>