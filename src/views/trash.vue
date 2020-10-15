<template>
  <div>
    <lightbox v-model="removeLightbox.visible">
      <template v-slot:title>Are you sure you want to permanently remove {{ removeLightbox.name }}?</template>
      <template v-slot:content>
        <v-form>
          <v-btn-toggle>
            <v-btn @click="remove" color="error" data-e2e="remove-file-confirm">Remove</v-btn>
            <v-btn @click="removeLightbox.visible = false">Cancel</v-btn>
          </v-btn-toggle>
        </v-form>
      </template>
    </lightbox>

    <gallery :add="false" :entities="files">
      <template v-slot:actions="props">
        <v-btn-toggle>
          <v-btn @click="recover(props.entity)" data-e2e="recover-file"
            >Recover</v-btn
          >
          <v-btn
            color="error"
            @click="showRemoveLightbox(props.entity)"
            data-e2e="remove-file"
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
import api from '../assets/api';
import lightbox from '../components/lightbox';
import gallery from '../components/gallery';

export default {
  components: {
    lightbox,
    gallery
  },
  data: () => ({
    files: [],
    removeLightbox: {
      id: null,
      name: null,
      visible: false
    }
  }),
  created: function ()
  {
    api.trash.all().then(files => this.files = files);

    //Get trash
    api.trash.all().then(files => this.files = files);
  },
  methods: {
    //Show remove lightbox
    showRemoveLightbox: function (file)
    {
      this.removeLightbox.id = file._id;
      this.removeLightbox.name = file.name;
      this.removeLightbox.visible = true;
    },
    //Recover file
    recover: async function (file)
    {
      //Recover the file
      await api.trash.recover(file._id);

      //Get index
      const index = this.files.findIndex(item => item._id == file._id);

      //Remove file
      this.files.splice(index, 1);
    },
    //Remove file
    remove: async function ()
    {
      //Remove the file (permanently)
      await api.trash.remove(this.removeLightbox.id);

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
</style>