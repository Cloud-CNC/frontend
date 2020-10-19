<template>
  <div>
    <v-dialog persistent v-model="progress.visible">
      <v-card>
        <v-card-title class="headline">Progress</v-card-title>
        <v-card-text>
          <v-progress-linear
            stream
            color="primary"
            :buffer-value="progress.value"
            :value="progress.value"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>

    <lightbox
      data-e2e="execute-file-lightbox"
      v-model="executeLightbox.visible"
    >
      <template v-slot:title>Execute {{ file.name }}</template>
      <template v-slot:content>
        <v-form>
          <v-list>
            <v-list-item>
              <v-select
                @change="updateViewer"
                data-e2e="execute-machine"
                item-text="name"
                item-value="_id"
                :items="machines"
                v-model="executeLightbox.machine"
                label="Machine"
              ></v-select>
            </v-list-item>

            <v-list-item>
              <v-btn-toggle>
                <v-btn @click="execute" data-e2e="confirm-execute"
                  >Execute</v-btn
                >
                <v-btn @click="executeLightbox.visible = false">Cancel</v-btn>
              </v-btn-toggle>
            </v-list-item>
          </v-list>
        </v-form>
      </template>
    </lightbox>

    <lightbox data-e2e="save-file-lightbox" v-model="saveLightbox.visible">
      <template v-slot:title>Save {{ file.name }} (GCODE)</template>
      <template v-slot:content>
        <v-form v-model="prechecks">
          <v-list>
            <v-list-item>
              <v-text-field
                :rules="[rules.required, rules.name]"
                data-e2e="save-file-name"
                label="Name"
                v-model="saveLightbox.name"
              ></v-text-field>
            </v-list-item>

            <v-list-item>
              <v-textarea
                :rules="[rules.description]"
                counter="1000"
                data-e2e="save-file-description"
                label="Description"
                v-model="saveLightbox.description"
              ></v-textarea>
            </v-list-item>

            <v-list-item>
              <v-btn-toggle>
                <v-btn @click="save" data-e2e="save-file" :disabled="!prechecks">Save</v-btn>
                <v-btn @click="saveLightbox.visible = false">Cancel</v-btn>
              </v-btn-toggle>
            </v-list-item>
          </v-list>
        </v-form>
      </template>
    </lightbox>

    <v-container fluid class="overlay-container">
      <v-col align="center">
        <v-toolbar class="overlay" color="primary">
          <v-toolbar-title>{{
            file.description != ""
              ? `${file.name} - ${file.description}`
              : file.name
          }}</v-toolbar-title>

          <v-spacer />

          <v-toolbar-items>
            <div class="toolbar-normalizer">
              <v-btn-toggle>
                <v-btn
                  @click="slice()"
                  color="accent"
                  data-e2e="slice-file"
                  :disabled="file.extension == 'gcode'"
                >
                  <v-icon>layers</v-icon>
                  Slice
                </v-btn>
                <v-btn
                  @click="showExecute()"
                  color="accent"
                  data-e2e="execute-file"
                >
                  <v-icon>dock</v-icon>
                  Execute
                </v-btn>
              </v-btn-toggle>
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
      :transfer="false"
    />
  </div>
</template>

<script>
//Imports
import {FileFormats} from 'unified-3d-loader';
import api from '../assets/api';
import CuraWASM from 'cura-wasm';
import filters from '../assets/filters';
import lightbox from '../components/lightbox';
import router from '@/router/index';
import store from '@/store/index';

//Compute accepted extensions
const accepts = Object.values(FileFormats).map(format => format.extensions).flat();
accepts.push('gcode');

export default {
  components: {
    lightbox
  },
  data: () => ({
    file: {
      name: '',
      extension: '',
      description: '',
      raw: new ArrayBuffer(0)
    },
    executeLightbox: {
      machine: null,
      visible: false
    },
    saveLightbox: {
      name: '',
      description: '',
      visible: false
    },
    machines: [{
      _id: null
    }],
    progress: {
      value: 0,
      visible: false
    },
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
    },
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
    //Get machines
    api.machines.all().then(machines =>
    {
      this.machines = machines;

      if (this.machines[0] != null && this.machines[0]._id != null)
      {
        this.executeLightbox.machine = this.machines[0]._id;
      }
    });

    //Get the file's metadata
    api.files.get(this.$route.params.id).then(file => 
    {
      this.file.name = file.name;
      this.file.description = file.description;

      //Ensure vue-3d-viewer can handle the extension
      if (accepts.includes(file.extension))
      {
        this.file.extension = file.extension;

        //Get the raw file
        api.files.raw(this.$route.params.id).then(raw =>
        {
          this.file.raw = raw;
        });
      }
      //Otherwise display an error message
      else
      {
        store.commit('showError', {
          name: 'Unknown Extension',
          description: `We're unable to display files with the "${file.extension}" extension at this time!`
        });
      }
    });
  },
  methods: {
    //Execute the file
    execute: function ()
    {
      api.machines.execute(this.executeLightbox.machine, this.$route.params.id);
    },

    //Save the file (After slicing)
    save: async function ()
    {
      //Conver the file to a blob
      const rawBlob = new Blob([this.file.raw]);

      //Create the file
      const id = await api.files.create(this.saveLightbox.name, this.saveLightbox.description, this.file.extension, rawBlob);

      //Fake redirect
      router.push(`/file/${id}`);
      this.file.name = this.saveLightbox.name;
      this.file.description = this.saveLightbox.description;
      this.saveLightbox.visible = false;
    },

    //Slice the file
    slice: async function ()
    {
      //Create the slicer
      const slicer = new CuraWASM({
        transfer: false
      });

      slicer.on('progress', progress =>
      {
        this.progress.value = progress;
      });

      //Reset the progress bar and display it
      this.progress.value = 0;
      this.progress.visible = true;

      console.log('Raw file', this.file);

      //Slice
      this.file.raw = await slicer.slice(this.file.raw, this.file.extension);
      this.file.extension = 'gcode';

      //Hide the progress bar
      this.progress.visible = false;

      //Prompt user to save
      this.saveLightbox.visible = true;
    },

    //Show the execute lightbox
    showExecute: function ()
    {
      this.executeLightbox.visible = true;
    },

    //Update the viewer
    updateViewer: function ()
    {
      const machine = this.machines.find(machine => machine._id == this.executeLightbox.machine);
      this.viewer.plane.X = machine.length;
      this.viewer.plane.Y = machine.width;
      this.viewer.position.X = machine.length / 2;
      this.viewer.position.Z = -machine.width / 2;
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
</style>