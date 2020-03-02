<template>
  <div>
    <lightbox v-model="lightbox.visible">
      <template v-slot:title>{{ lightbox.create ? 'Create a new file' : 'Edit ' + lightbox.name }}</template>
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
              <v-textarea
                ref="description"
                v-model="lightbox.description"
                counter="1000"
                label="Description"
                :rules="[rules.description]"
                @blur="update('description')"
              />
            </v-list-item>

            <v-list-item v-if="lightbox.create">
              <v-file-input
                ref="file"
                accept=".gcode"
                label="File"
                :rules="[rules.raw]"
                @blur="update('name')"
                @change="lightbox.raw = $event"
              />
            </v-list-item>
            <v-list-item>
              <v-item-group>
                <v-btn v-if="lightbox.create" :disabled="!prechecks" @click="create()">Create</v-btn>
                <v-btn @click="lightbox.visible = false">{{ lightbox.create ? 'Cancel' : 'Close' }}</v-btn>
              </v-item-group>
            </v-list-item>
          </v-list>
        </v-form>
      </template>
    </lightbox>
    <gallery @add="showLightbox()" :entities="files">
      <template v-slot:actions="props">
        <v-item-group>
          <v-btn :to="`/file/${props.entity._id}`">Open</v-btn>
          <v-btn @click="showLightbox(props.entity)">Edit</v-btn>
          <v-btn color="error" @click="remove(props.entity)">Remove</v-btn>
        </v-item-group>
      </template>

      <template v-slot:empty class="font-weight-light">No files available!</template>
    </gallery>
  </div>
</template>

<script>
//Imports
import api from '../assets/api';
import filters from '../assets/filters';
import gallery from '../components/gallery';
import lightbox from '../components/lightbox';

export default {
  components: {
    lightbox,
    gallery
  },
  data: () => ({
    lightbox: {
      name: null,
      description: null,
      raw: null,
      visible: false,
      create: false
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
    //Create file
    create: function ()
    {
      //Convert file to UTF8
      this.lightbox.raw.arrayBuffer().then(raw =>
      {
        raw = new Uint8Array(raw);
        const temp = [];
        raw.forEach((byte, i) => temp[i] = String.fromCharCode(byte));
        raw = temp.join('');

        api.files.create(this.lightbox.name, this.lightbox.description, raw).then(_id =>
        {
          //Add to list
          this.files.push({_id, name: this.lightbox.name, description: this.lightbox.description});

          //Hide lightbox
          this.lightbox.visible = false;
        });
      });
    },
    //Update file
    update: function (property)
    {
      //Precheck
      if (this.$refs[property].valid && !this.lightbox.create)
      {
        //Update front end
        const file = this.files.find(file => file._id == this.lightbox._id);
        file[property] = this.lightbox[property];

        //Update backend
        api.files.update({[property]: this.lightbox[property]}, this.lightbox._id);
      }
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