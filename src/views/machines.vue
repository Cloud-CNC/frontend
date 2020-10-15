<template>
  <div>
    <lightbox v-model="upsertLightbox.visible">
      <template v-slot:title>{{
        upsertLightbox.create
          ? "Create a new machine"
          : "Edit " + upsertLightbox.name
      }}</template>

      <template v-slot:content>
        <v-form v-model="prechecks">
          <v-list>
            <v-list-item>
              <v-text-field
                :rules="[rules.required, rules.name]"
                counter="30"
                data-e2e="machine-name"
                label="Name"
                v-model="upsertLightbox.name"
              />
            </v-list-item>

            <v-list-item>
              <v-select
                :items="controllers"
                :rules="[rules.required]"
                data-e2e="machine-controller"
                item-text="name"
                item-value="_id"
                label="Controller"
                v-model="upsertLightbox.controller"
              ></v-select>
            </v-list-item>

            <v-list-item>
              <v-combobox
                chips
                deletable-chips
                multiple
                :rules="[rules.required, rules.tags]"
                data-e2e="machine-tags"
                label="Tags"
                v-model="upsertLightbox.tags"
              />
            </v-list-item>

            <v-list-item>
              <v-text-field
                :rules="[rules.required, rules.number]"
                data-e2e="machine-length"
                label="Length"
                type="number"
                v-model.number="upsertLightbox.length"
              />
            </v-list-item>

            <v-list-item>
              <v-text-field
                :rules="[rules.required, rules.number]"
                data-e2e="machine-width"
                label="Width"
                type="number"
                v-model.number="upsertLightbox.width"
              />
            </v-list-item>

            <v-list-item>
              <v-text-field
                :rules="[rules.required, rules.number]"
                data-e2e="machine-height"
                label="Height"
                type="number"
                v-model.number="upsertLightbox.height"
              />
            </v-list-item>

            <v-list-item>
              <v-btn-toggle>
                <v-btn
                  :disabled="!prechecks"
                  @click="upsert()"
                  data-e2e="upsert-machine"
                  >{{ upsertLightbox.create ? "Create" : "Save" }}</v-btn
                >

                <v-btn
                  @click="upsertLightbox.visible = false"
                  data-e2e="close-machine"
                  >Cancel</v-btn
                >
              </v-btn-toggle>
            </v-list-item>
          </v-list>
        </v-form>
      </template>
    </lightbox>

    <lightbox v-model="controlLightbox.visible">
      <template v-slot:title>Control {{ machine.name }}</template>
      <template v-slot:content>
        <machine data-e2e="machine-control-panel" :machine="machine" :visible="controlLightbox.visible" />
      </template>
    </lightbox>

    <lightbox v-model="removeLightbox.visible">
      <template v-slot:title
        >Are you sure you want to remove {{ removeLightbox.name }}?</template
      >
      <template v-slot:content>
        <v-form>
          <v-btn-toggle>
            <v-btn @click="remove" color="error" data-e2e="remove-machine-confirm">Remove</v-btn>
            <v-btn @click="removeLightbox.visible = false">Cancel</v-btn>
          </v-btn-toggle>
        </v-form>
      </template>
    </lightbox>

    <gallery @add="showUpsertLightbox()" :entities="machines">
      <template v-slot:description="props">
        <p data-e2e="machine-info">
          Machine ID: {{ props.entity._id }}
          <br />
          Controller Name:
          {{
            controllers.find(
              (controller) => controller._id == props.entity.controller
            ).name
          }}
          <br />
          Controller ID: {{ props.entity.controller }}
        </p>
        <v-chip-group column>
          <v-chip small :key="tag" v-for="tag in props.entity.tags">{{
            tag
          }}</v-chip>
        </v-chip-group>
      </template>

      <template v-slot:actions="props">
        <v-btn-toggle>
          <v-btn
            @click="
              machine = props.entity;
              controlLightbox.visible = true;
            "
            data-e2e="control-machine"
            >Control</v-btn
          >
          <v-btn
            @click="showUpsertLightbox(props.entity)"
            data-e2e="edit-machine"
            >Edit</v-btn
          >
          <v-btn
            color="error"
            @click="showRemoveLightbox(props.entity)"
            data-e2e="remove-machine"
            >Remove</v-btn
          >
        </v-btn-toggle>
      </template>

      <template v-slot:empty class="font-weight-light"
        >No machines available!</template
      >
    </gallery>
  </div>
</template>

<script>
//Imports
import api from '../assets/api';
import filters from '../assets/filters';
import gallery from '../components/gallery';
import lightbox from '../components/lightbox';
import machine from '../components/machine';

export default {
  components: {
    gallery,
    lightbox,
    machine
  },
  data: () => ({
    controllers: [],
    controlLightbox: {
      visible: false
    },
    removeLightbox: {
      id: null,
      name: null,
      visible: false
    },
    upsertLightbox: {
      _id: null,
      controller: null,
      tags: [],
      name: null,
      length: 0,
      width: 0,
      height: 0,
      create: false,
      visible: false
    },
    machine: {name: null},
    machines: [],
    prechecks: false,
    rules: {
      required: value => value != null || 'Required',
      name: value => filters.name.test(value) || 'Invalid name',
      tags: value =>
        (value instanceof Array && filters.tags.test(JSON.stringify(value))) ||
        'Invalid tags',
      number: value => typeof value == 'number' || 'Invalid number'
    }
  }),
  created: function ()  
  {
    //Get controllers
    api.controllers.all().then(controllers => this.controllers = controllers);

    //Get machines
    api.machines.all().then(machines => this.machines = machines);
  },
  methods: {
    //Show remove lightbox
    showRemoveLightbox: function (machine)
    {
      this.removeLightbox.id = machine._id;
      this.removeLightbox.name = machine.name;
      this.removeLightbox.visible = true;
    },
    //Show upsert lightbox
    showUpsertLightbox: function (machine)    
    {
      //Configure lightbox
      if (machine == null)      
      {
        this.upsertLightbox._id = null;
        this.upsertLightbox.controller =
          this.controllers.length > 0 ? this.controllers[this.controllers.length - 1]._id : null;
        this.upsertLightbox.name = null;
        this.upsertLightbox.tags = [];
        this.upsertLightbox.length = 0;
        this.upsertLightbox.width = 0;
        this.upsertLightbox.height = 0;
        this.upsertLightbox.create = true;
      }
      else      
      {
        this.upsertLightbox._id = machine._id;
        this.upsertLightbox.controller = machine.controller;
        this.upsertLightbox.name = machine.name;
        this.upsertLightbox.tags = machine.tags;
        this.upsertLightbox.length = machine.length;
        this.upsertLightbox.width = machine.width;
        this.upsertLightbox.height = machine.height;
        this.upsertLightbox.create = false;
      }

      //Show upsert lightbox
      this.upsertLightbox.visible = true;
    },
    upsert: async function ()
    {
      //Create
      if (this.upsertLightbox.create)
      {
        //Update backend
        const _id = await api.machines.create(this.upsertLightbox.controller, this.upsertLightbox.name, this.upsertLightbox.tags, this.upsertLightbox.length, this.upsertLightbox.width, this.upsertLightbox.height);

        //Update frontend
        this.machines.push({_id, controller: this.upsertLightbox.controller, name: this.upsertLightbox.name, tags: this.upsertLightbox.tags, length: this.upsertLightbox.length, width: this.upsertLightbox.width, height: this.upsertLightbox.height});
      }
      //Edit
      else
      {
        //Find original machine
        const original = this.machines.find(machine => machine._id == this.upsertLightbox._id);

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
        await api.machines.update(changes, this.upsertLightbox._id);
      }

      //Hide the upsertLightbox
      this.upsertLightbox.visible = false;
    },
    //Remove machine
    remove: async function ()
    {
      //Remove the machine
      await api.machines.remove(this.removeLightbox.id);

      //Get index
      const index = this.machines.findIndex(item => item._id == this.removeLightbox.id);

      //Remove machine
      this.machines.splice(index, 1);

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