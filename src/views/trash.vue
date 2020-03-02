<template>
  <gallery :entities="files">
    <template v-slot:="props">
      <v-item-group>
        <v-btn @click="recover(props.entity)">Recover</v-btn>
        <v-btn color="error" @click="remove(props.entity)">Remove</v-btn>
      </v-item-group>
    </template>

    <template v-slot:empty class="font-weight-light">No files available!</template>
  </gallery>
</template>

<script>
//Imports
import api from '../assets/api';
import gallery from '../components/gallery';

export default {
  components: {
    gallery
  },
  data: () => ({
    files: []
  }),
  created: function ()
  {
    api.trash.all().then(files => this.files = files);

    //Get trash
    api.trash.all().then(files => this.files = files);
  },
  methods: {
    //Recover file
    recover: function (file)
    {
      api.trash.recover(file._id).then(() =>
      {
        //Get index
        const index = this.files.findIndex(item => item._id == file._id);

        //Remove file
        this.files.splice(index, 1);
      });
    },
    //Remove file
    remove: function (file)
    {
      api.trash.remove(file._id).then(() =>
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
</style>