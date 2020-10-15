<template>
  <div>
    <lightbox v-model="upsertLightbox.visible">
      <template v-slot:title>{{
        upsertLightbox.create
          ? "Create a new file"
          : "Edit " + upsertLightbox.name
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
                v-model="upsertLightbox.name"
              />
            </v-list-item>

            <v-list-item>
              <v-textarea
                :rules="[rules.description]"
                counter="1000"
                data-e2e="file-description"
                label="Description"
                v-model="upsertLightbox.description"
              />
            </v-list-item>

            <v-list-item v-if="upsertLightbox.create">
              <v-file-input
                :rules="[rules.raw]"
                @change="upsertLightbox.raw = $event"
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
                  >{{ upsertLightbox.create ? "Create" : "Save" }}</v-btn
                >
                <v-btn
                  @click="upsertLightbox.visible = false"
                  data-e2e="close-file"
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
            <v-btn @click="remove" color="error" data-e2e="remove-file-confirm">Remove</v-btn>
            <v-btn @click="removeLightbox.visible = false">Cancel</v-btn>
          </v-btn-toggle>
        </v-form>
      </template>
    </lightbox>

    <gallery @add="showUpsertLightbox()" :entities="files">
      <template v-slot:actions="props">
        <v-btn-toggle>
          <v-btn data-e2e="open-file" :to="`/file/${props.entity._id}`"
            >Open</v-btn
          >
          <v-btn data-e2e="edit-file" @click="showUpsertLightbox(props.entity)"
            >Edit</v-btn
          >
          <v-btn
            data-e2e="remove-file"
            color="error"
            @click="showRemoveLightbox(props.entity)"
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
    removeLightbox: {
      id: null,
      name: null,
      visible: false
    },
    upsertLightbox: {
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
    //Show remove lightbox
    showRemoveLightbox: function (file)
    {
      this.removeLightbox.id = file._id;
      this.removeLightbox.name = file.name;
      this.removeLightbox.visible = true;
    },
    //Show upsert lightbox
    showUpsertLightbox: function (file)
    {
      //Configure upsert lightbox
      if (file == null)
      {
        this.upsertLightbox._id = null;
        this.upsertLightbox.name = null;
        this.upsertLightbox.description = null;
        this.upsertLightbox.create = true;
      }
      else
      {
        this.upsertLightbox._id = file._id;
        this.upsertLightbox.name = file.name;
        this.upsertLightbox.description = file.description;
        this.upsertLightbox.create = false;
      }

      //Show upsert lightbox
      this.upsertLightbox.visible = true;
    },
    //Upsert file
    upsert: async function ()
    {
      //Create
      if (this.upsertLightbox.create)
      {
        //Get file extension
        const extension = this.upsertLightbox.raw.name.split('.').pop();

        //Convert the file to a blob
        const raw = await this.upsertLightbox.raw.arrayBuffer();
        const rawBlob = new Blob([raw]);

        //Update backend
        const _id = await api.files.create(this.upsertLightbox.name, this.upsertLightbox.description, extension, rawBlob);

        //Update frontend
        this.files.push({_id, name: this.upsertLightbox.name, description: this.upsertLightbox.description});
      }
      //Edit
      else
      {
        //Find original file
        const original = this.files.find(file => file._id == this.upsertLightbox._id);

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
        await api.files.update(changes, this.upsertLightbox._id);
      }

      //Hide the upsert lightbox
      this.upsertLightbox.visible = false;
    },
    //Remove file
    remove: async function ()
    {
      //Remove the file
      await api.files.remove(this.removeLightbox.id);

      //Get index
      const index = this.files.findIndex(item => item._id == this.removeLightbox.id);

      //Remove file
      this.files.splice(index, 1);

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
</style>