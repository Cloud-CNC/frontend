<template>
  <div>
    <lightbox v-model="lightboxes.upsert.visible">
      <template
        v-slot:title
      >{{ lightboxes.upsert.create ? 'Create a new machine' : 'Edit ' + lightboxes.upsert.name }}</template>

      <template v-slot:content>
        <v-form v-model="prechecks">
          <v-list>
            <v-list-item>
              <v-text-field
                :rules="[rules.required, rules.name]"
                counter="30"
                data-e2e="machine-name"
                label="Name"
                v-model="lightboxes.upsert.name"
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
                v-model="lightboxes.upsert.controller"
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
                v-model="lightboxes.upsert.tags"
              />
            </v-list-item>

            <v-list-item>
              <v-text-field
                :rules="[rules.required, rules.number]"
                data-e2e="machine-length"
                label="Length"
                type="number"
                v-model.number="lightboxes.upsert.length"
              />
            </v-list-item>

            <v-list-item>
              <v-text-field
                :rules="[rules.required, rules.number]"
                data-e2e="machine-width"
                label="Width"
                type="number"
                v-model.number="lightboxes.upsert.width"
              />
            </v-list-item>

            <v-list-item>
              <v-text-field
                :rules="[rules.required, rules.number]"
                data-e2e="machine-height"
                label="Height"
                type="number"
                v-model.number="lightboxes.upsert.height"
              />
            </v-list-item>

            <v-list-item>
              <v-btn-toggle>
                <v-btn
                  :disabled="!prechecks"
                  @click="upsert()"
                  data-e2e="upsert-machine"
                >{{ lightboxes.upsert.create ? 'Create' : 'Save' }}</v-btn>

                <v-btn @click="lightboxes.upsert.visible = false" data-e2e="close-machine">Cancel</v-btn>
              </v-btn-toggle>
            </v-list-item>
          </v-list>
        </v-form>
      </template>
    </lightbox>

    <lightbox data-e2e="machine-controller" v-model="lightboxes.control.visible">
      <template v-slot:title>Control {{machine.name}}</template>
      <template v-slot:content>
        <machine :machine="machine" :visible="lightboxes.control.visible" />
      </template>
    </lightbox>

    <gallery @add="showLightbox()" :entities="machines">
      <template v-slot:description="props">
        <p data-e2e="machine-info">
          Machine ID: {{props.entity._id}}
          <br />
          Controller Name: {{controllers.find(controller => controller._id == props.entity.controller).name}}
          <br />
          Controller ID: {{props.entity.controller}}
        </p>
        <v-chip-group column>
          <v-chip small :key="tag" v-for="tag in props.entity.tags">{{ tag }}</v-chip>
        </v-chip-group>
      </template>

      <template v-slot:actions="props">
        <v-btn-toggle>
          <v-btn
            @click="machine = props.entity; lightboxes.control.visible = true"
            data-e2e="control-machine"
          >Control</v-btn>
          <v-btn @click="showLightbox(props.entity)" data-e2e="edit-machine">Edit</v-btn>
          <v-btn color="error" @click="remove(props.entity)" data-e2e="remove-machine">Remove</v-btn>
        </v-btn-toggle>
      </template>

      <template v-slot:empty class="font-weight-light">No machines available!</template>
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
    lightboxes: {
      control: {
        visible: false
      },
      upsert: {
        _id: null,
        controller: null,
        tags: [],
        name: null,
        length: 0,
        width: 0,
        height: 0,
        create: false,
        visible: false
      }
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
    //Show lightbox
    showLightbox: function (machine)    
    {
      //Configure lightbox
      if (machine == null)      
      {
        this.lightboxes.upsert._id = null;
        this.lightboxes.upsert.controller =
          this.controllers.length > 0 ? this.controllers[this.controllers.length - 1]._id : null;
        this.lightboxes.upsert.name = null;
        this.lightboxes.upsert.tags = [];
        this.lightboxes.upsert.length = 0;
        this.lightboxes.upsert.width = 0;
        this.lightboxes.upsert.height = 0;
        this.lightboxes.upsert.create = true;
      }
      else      
      {
        this.lightboxes.upsert._id = machine._id;
        this.lightboxes.upsert.controller = machine.controller;
        this.lightboxes.upsert.name = machine.name;
        this.lightboxes.upsert.tags = machine.tags;
        this.lightboxes.upsert.length = machine.length;
        this.lightboxes.upsert.width = machine.width;
        this.lightboxes.upsert.height = machine.height;
        this.lightboxes.upsert.create = false;
      }

      //Show upsert lightbox
      this.lightboxes.upsert.visible = true;
    },
    upsert: async function ()
    {
      //Create
      if (this.lightboxes.upsert.create)
      {
        //Update backend
        const _id = await api.machines.create(this.lightboxes.upsert.controller, this.lightboxes.upsert.name, this.lightboxes.upsert.tags, this.lightboxes.upsert.length, this.lightboxes.upsert.width, this.lightboxes.upsert.height);

        //Update frontend
        this.machines.push({_id, controller: this.lightboxes.upsert.controller, name: this.lightboxes.upsert.name, tags: this.lightboxes.upsert.tags, length: this.lightboxes.upsert.length, width: this.lightboxes.upsert.width, height: this.lightboxes.upsert.height});
      }
      //Edit
      else
      {
        //Find original machine
        const original = this.machines.find(machine => machine._id == this.lightboxes.upsert._id);

        //Calculate changes
        const changes = {};
        for (const [key, value] of Object.entries(original))
        {
          if (this.lightboxes.upsert[key] != value)
          {
            //Save change
            changes[key] = this.lightboxes.upsert[key];

            //Update frontend
            original[key] = this.lightboxes.upsert[key];
          }
        }

        //Update backend
        await api.machines.update(changes, this.lightboxes.upsert._id);
      }

      //Hide the lightboxes.upsert
      this.lightboxes.upsert.visible = false;
    },
    //Remove machine
    remove: function (machine)    
    {
      api.machines.remove(machine._id).then(() =>      
      {
        //Get index
        const index = this.machines.findIndex(item => item._id == machine._id);

        //Remove machine
        this.machines.splice(index, 1);
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