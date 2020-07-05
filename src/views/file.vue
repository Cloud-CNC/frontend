<template>
  <div>
    <lightbox data-e2e="execute-file-lightbox" v-model="visible">
      <template v-slot:title>Execute {{ file.name }}</template>
      <template v-slot:content>
        <v-form>
          <v-list>
            <v-list-item>
              <v-select
                data-e2e="execute-machine"
                item-text="name"
                item-value="_id"
                :items="machines"
                v-model="machine"
                label="Machine"
              ></v-select>
            </v-list-item>

            <v-list-item>
              <v-btn-toggle>
                <v-btn @click="execute" data-e2e="confirm-execute">Execute</v-btn>
                <v-btn @click="visible = false">Cancel</v-btn>
              </v-btn-toggle>
            </v-list-item>
          </v-list>
        </v-form>
      </template>
    </lightbox>
    <v-container fluid class="overlay-container">
      <v-col align="center">
        <v-toolbar class="overlay" color="primary">
          <v-toolbar-title>{{ file.name }} - {{ file.description }}</v-toolbar-title>

          <v-spacer />

          <v-toolbar-items>
            <v-btn icon @click="showLightbox()" data-e2e="execute-file">
              <v-icon>dock</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
      </v-col>
    </v-container>
    <gcode-viewer
      :bed="viewer.bed"
      :gcode="file.raw"
      :position="viewer.position"
      :rotation="viewer.rotation"
      :scale="viewer.scale"
      :theme="theme"
      data-e2e="file-viewer"
    />
  </div>
</template>

<script>
//Imports
import api from '../assets/api';
import lightbox from '../components/lightbox';

export default {
  components: {
    lightbox
  },
  data: () => ({
    machines: [{
      _id: null
    }],
    machine: null,
    file: {
      name: null,
      description: null,
      raw: ''
    },
    visible: false,
    viewer: {
      bed: {
        X: 10,
        Y: 10
      },
      position: {
        X: 5,
        Y: 0,
        Z: -5
      },
      rotation: {
        X: -90,
        Y: 0,
        Z: 180
      },
      scale: {
        X: 0.1,
        Y: 0.1,
        Z: 0.1
      }
    }
  }),
  created: function ()
  {
    //Get machines
    api.machines.all().then(machines =>
    {
      this.machines = machines;
      this.machine = this.machines[0]?._id;
    });

    //Get file
    api.files.get(this.$route.params.id).then(file => this.file = file);
  },
  methods: {
    //Show the execute lightbox
    showLightbox: function ()
    {
      this.visible = true;
    },
    //Execute the file
    execute: function ()
    {
      api.machines.execute(this.machine, this.$route.params.id);
    }
  },
  computed: {
    theme: function ()
    {
      return this.$vuetify.theme.dark ?
        {
          extrusionColor: '#1B5E20',
          pathColor: '#4CAF50',
          bedColor: '#3a3a3a',
          backgroundColor: '#212121'
        } : {
          extrusionColor: '#1565C0',
          pathColor: '#64B5F6',
          bedColor: '#9E9E9E',
          backgroundColor: '#EEEEEE'
        };
    }
  },
  watch: {
    machine: function ()
    {
      const machine = this.machines.find(machine => machine._id == this.machine);
      this.viewer.bed.X = machine.length;
      this.viewer.bed.Y = machine.width;
      this.viewer.position.X = machine.length / 2;
      this.viewer.position.Z = -machine.width / 2;
    }
  }
};
</script>

<style scoped>
#container {
  padding: 15px;
}

.overlay-container {
  position: fixed;
  z-index: 1;
}

.overlay {
  width: fit-content;
}
</style>