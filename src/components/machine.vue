<template>
  <v-container cols="12">
    <v-row>
      <!--
        Place camera feeds for all machines here.
        Use the "v-if" prop (v-if="machine._id == '<ID>'") to hide/show elements for different machines.

        Access the API via the "api" object or use the "send" function to send raw data to the appropriate machine.
        
        Lightbox visibility is available via the "visible" boolean.
        Machine information is available via the "machine" object:
        {
          "tags": String[]
          "_id": String,
          "controller": String,
          "name": String,
          "length": Number,
          "width": Number,
          "height": Number,
          "__v": Number
        }
      -->
    </v-row>
    <v-row>
      <v-col cols="5">
        <v-row justify="center">
          <v-list>
            <v-list-item>
              <v-btn block @click="send('M112\n')" color="red" data-e2e="emergency-stop-machine">Emergency Stop</v-btn>
            </v-list-item>
            <v-list-item>
              <v-btn block @click="send('M0\n')" data-e2e="stop-machine">Stop</v-btn>
            </v-list-item>
            <v-list-item>
              <v-btn block @click="send('M81\n')" data-e2e="turn-off-machine">Off</v-btn>
            </v-list-item>
            <v-list-item>
              <v-btn block @click="send('G28\n')" data-e2e="home-machine">Home</v-btn>
            </v-list-item>
          </v-list>
        </v-row>
      </v-col>
      <v-col cols="7">
        <v-row>
          <v-container>
            <v-row align="center">
              <v-col cols="9">
                <v-row justify="center">
                  <v-btn icon @click="send('G91\nG0 Y10\n')" data-e2e="jog-machine-forward">
                    <v-icon>keyboard_arrow_up</v-icon>
                  </v-btn>
                </v-row>
                <v-row>
                  <v-col cols="5" align="center">
                    <v-btn icon @click="send('G91\nG0 X10\n')" data-e2e="jog-machine-left">
                      <v-icon>keyboard_arrow_left</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="2"></v-col>
                  <v-col cols="5" align="center">
                    <v-btn icon @click="send('G91\nG0 X-10\n')" data-e2e="jog-machine-right">
                      <v-icon>keyboard_arrow_right</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-btn icon @click="send('G91\nG0 Y-10\n')" data-e2e="jog-machine-backward">
                    <v-icon>keyboard_arrow_down</v-icon>
                  </v-btn>
                </v-row>
              </v-col>
              <v-col cols="3">
                <v-row justify="center">
                  <v-btn icon @click="send('G91\nG0 Z10\n')" data-e2e="jog-machine-up">
                    <v-icon>keyboard_arrow_up</v-icon>
                  </v-btn>
                </v-row>
                <v-row justify="center">
                  <v-btn icon @click="send('G91\nG0 Z-10\n')" data-e2e="jog-machine-down">
                    <v-icon>keyboard_arrow_down</v-icon>
                  </v-btn>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="10">
        <v-text-field data-e2e="machine-command" label="GCODE" v-model="command"></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-btn @click="send(`${command}\n`)" color="primary" data-e2e="send-machine-command">Send</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
//Imports
import api from '@/assets/api';

export default {
  data: () => ({
    command: null
  }),
  props: {
    machine: {
      required: true,
      type: Object
    },
    visible: {
      required: true,
      type: Boolean
    }
  },
  methods: {
    send(data)
    {
      api.machines.command(this.machine._id, data);
    }
  }
};
</script>

<style>
</style>