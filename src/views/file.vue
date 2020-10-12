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
                <v-btn @click="execute" data-e2e="confirm-execute"
                  >Execute</v-btn
                >
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
          <v-toolbar-title
            >{{ file.name }} - {{ file.description }}</v-toolbar-title
          >

          <v-spacer />

          <v-toolbar-items>
            <div class="toolbar-normalizer">
              <v-btn
                @click="showLightbox()"
                color="accent"
                data-e2e="execute-file"
              >
                <v-icon>dock</v-icon>
                Execute
              </v-btn>
            </div>
          </v-toolbar-items>
        </v-toolbar>
      </v-col>
    </v-container>
    <three-d-viewer
      class="viewer"
      :extension="file.extension"
      data-e2e="file-viewer"
      :file="file.raw"
      :plane="viewer.plane"
      :position="viewer.position"
      :rotation="viewer.rotation"
      :scale="viewer.scale"
      :theme="theme"
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
      extension: '',
      description: null,
      raw: new ArrayBuffer(0)
    },
    visible: false,
    viewer: {
      plane: {
        X: 10,
        Y: 10,
      },
      position: {
        X: 0,
        Y: 0,
        Z: 0,
      },
      rotation: {
        X: -90,
        Y: 0,
        Z: 180,
      },
      scale: {
        X: 0.1,
        Y: 0.1,
        Z: 0.1,
      }
    }
  }),
  created: function ()
  {
    //Get machines
    api.machines.all().then(machines =>
    {
      this.machines = machines;

      if (this.machines[0] != null && this.machines[0]._id != null)
      {
        this.machine = this.machines[0]._id;
      }
    });

    //Get the file's metadata
    api.files.get(this.$route.params.id).then(file => 
    {
      this.file.name = file.name;
      this.file.description = file.description;
      this.file.extension = file.extension;
    });

    //Get the raw file
    api.files.raw(this.$route.params.id).then(raw =>
    {
      this.file.raw = raw;
    });
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
          primary: '#1B5E20',
          secondary: '#4CAF50',
          plane: '#3a3a3a',
          background: '#212121'
        } : {
          primary: '#1565C0',
          secondary: '#64B5F6',
          plane: '#9E9E9E',
          background: '#EEEEEE'
        };
    }
  },
  watch: {
    machine: function ()
    {
      const machine = this.machines.find(machine => machine._id == this.machine);
      this.viewer.plane.X = machine.length;
      this.viewer.plane.Y = machine.width;
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

.toolbar-normalizer {
  margin: auto;
  padding: 10px;
}

#canvas {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>