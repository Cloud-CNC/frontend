<template>
  <div>
    <lightbox v-model="lightbox.visible">
      <template v-slot:title>{{
        lightbox.create ? "Create a new file" : "Edit " + lightbox.name
      }}</template>
      <template v-slot:content>
        <v-form v-model="prechecks">
          <v-list>
            <v-list-item>
              <v-text-field
                :rules="[rules.required, rules.name]"
                counter="30"
                data-e2e="file-name"
                label="Name"
                v-model="lightbox.name"
              />
            </v-list-item>

            <v-list-item>
              <v-textarea
                :rules="[rules.description]"
                counter="1000"
                data-e2e="file-description"
                label="Description"
                v-model="lightbox.description"
              />
            </v-list-item>

            <v-list-item v-if="lightbox.create">
              <v-file-input
                :rules="[rules.raw]"
                @change="lightbox.raw = $event"
                :accept="accepts"
                data-e2e="file-raw"
                label="File"
              />
            </v-list-item>
            <v-list-item>
              <v-btn-toggle>
                <v-btn
                  data-e2e="upsert-file"
                  :disabled="!prechecks"
                  @click="upsert()"
                  >{{ lightbox.create ? "Create" : "Save" }}</v-btn
                >
                <v-btn @click="lightbox.visible = false" data-e2e="close-file"
                  >Cancel</v-btn
                >
              </v-btn-toggle>
            </v-list-item>
          </v-list>
        </v-form>
      </template>
    </lightbox>
    <gallery @add="showLightbox()" :entities="files">
      <template v-slot:actions="props">
        <v-btn-toggle>
          <v-btn data-e2e="open-file" :to="`/file/${props.entity._id}`"
            >Open</v-btn
          >
          <v-btn data-e2e="edit-file" @click="showLightbox(props.entity)"
            >Edit</v-btn
          >
          <v-btn
            data-e2e="remove-file"
            color="error"
            @click="remove(props.entity)"
            >Remove</v-btn
          >
        </v-btn-toggle>
      </template>

      <template v-slot:empty class="font-weight-light"
        >No files available!</template
      >
    </gallery>
  </div>
</template>

<script>
//Imports
import {FileFormats} from 'unified-3d-loader';
import api from '../assets/api';
import filters from '../assets/filters';
import gallery from '../components/gallery';
import lightbox from '../components/lightbox';

//Compute accepted extensions
const accepts = Object.values(FileFormats).map(format => format.extensions.map(extension => '.' + extension).join(',') + ',' + format.mimes.join(',')).join(',') + ',.gcode';

export default {
  components: {
    lightbox,
    gallery
  },
  data: () => ({
    accepts,
    lightbox: {
      create: false,
      name: null,
      description: null,
      extension: null,
      raw: null,
      visible: false
    },
    files: [],
    prechecks: false,
    rules: {
      required: value => value != null || 'Required',
      name: value => filters.name.test(value) || 'Invalid name',
      description: value => filters.description.test(value) || 'Invalid description',
      raw: value => value instanceof File && value.size > 0 || 'Invalid file'
    }
  }),
  created: function ()
  {
    //Get files
    api.files.all().then(files => this.files = files);
  },
  methods:
  {
    //Show lightbox
    showLightbox: function (file)
    {
      //Configure lightbox
      if (file == null)
      {
        this.lightbox._id = null;
        this.lightbox.name = null;
        this.lightbox.description = null;
        this.lightbox.create = true;
      }
      else
      {
        this.lightbox._id = file._id;
        this.lightbox.name = file.name;
        this.lightbox.description = file.description;
        this.lightbox.create = false;
      }

      //Show lightbox
      this.lightbox.visible = true;
    },
    //Upsert file
    upsert: async function ()
    {
      //Create
      if (this.lightbox.create)
      {
        //Get file extension
        const extension = this.lightbox.raw.name.split('.').pop();

        //Convert the file to a blob
        const raw = await this.lightbox.raw.arrayBuffer();
        const rawBlob = new Blob([raw]);

        //Update backend
        const _id = await api.files.create(this.lightbox.name, this.lightbox.description, extension, rawBlob);

        //Update frontend
        this.files.push({_id, name: this.lightbox.name, description: this.lightbox.description});
      }
      //Edit
      else
      {
        //Find original file
        const original = this.files.find(file => file._id == this.lightbox._id);

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
        await api.files.update(changes, this.lightbox._id);
      }

      //Hide the lightbox
      this.lightbox.visible = false;
    },
    //Remove file
    remove: function (file)
    {
      api.files.remove(file._id).then(() =>
      {
        //Get index
        const index = this.files.findIndex(item => item._id == file._id);

        //Remove file
        this.files.splice(index, 1);
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
</style>