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
      <v-col sm="5" xs="12">
        <v-row justify="center">
          <v-list>
            <v-list-item>
              <v-btn
                block
                @click="send('M112\n')"
                color="red"
                data-e2e="emergency-stop-machine"
              >Emergency Stop</v-btn>
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
      <v-col id="jog-arrows-container" sm="7" xs="12">
        <div id="jog-arrows">
          <v-btn
            icon
            @click="send('G91\nG0 Y10\n')"
            data-e2e="jog-machine-forward"
            id="jog-forward"
          >
            <v-icon>keyboard_arrow_up</v-icon>
          </v-btn>
          <v-btn icon @click="send('G91\nG0 X10\n')" data-e2e="jog-machine-left" id="jog-left">
            <v-icon>keyboard_arrow_left</v-icon>
          </v-btn>
          <v-btn icon @click="send('G91\nG0 X-10\n')" data-e2e="jog-machine-right" id="jog-right">
            <v-icon>keyboard_arrow_right</v-icon>
          </v-btn>
          <v-btn
            icon
            @click="send('G91\nG0 Y-10\n')"
            data-e2e="jog-machine-backward"
            id="jog-backward"
          >
            <v-icon>keyboard_arrow_down</v-icon>
          </v-btn>
          <v-btn icon @click="send('G91\nG0 Z10\n')" data-e2e="jog-machine-up" id="jog-up">
            <v-icon>keyboard_arrow_up</v-icon>
          </v-btn>
          <v-btn icon @click="send('G91\nG0 Z-10\n')" data-e2e="jog-machine-down" id="jog-down">
            <v-icon>keyboard_arrow_down</v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-text-field data-e2e="machine-command" label="Command" v-model="command">
        <template v-slot:append-outer>
          <v-btn @click="send(`${command}\n`)" color="primary" data-e2e="send-machine-command">Send</v-btn>
        </template>
      </v-text-field>
    </v-row>
  </v-container>
</template>

<script>
//Imports
import api from '@/assets/api';

export default {
  data: () => ({
    command: null,
  }),
  props: {
    machine: {
      required: true,
      type: Object,
    },
    visible: {
      required: true,
      type: Boolean,
    },
  },
  methods: {
    send(data) 
    {
      api.machines.command(this.machine._id, data);
    },
  },
};
</script>

<style scoped>
#jog-arrows-container {
  margin: auto 0;
  text-align: center;
}

#jog-arrows {
  align-items: center;
  justify-items: center;
  display: inline-grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-template-areas:
    ". forward . . up"
    "left . right . ."
    ". backward . . down";
}

#jog-forward {
  grid-area: forward;
}

#jog-up {
  grid-area: up;
}

#jog-left {
  grid-area: left;
}

#jog-right {
  grid-area: right;
}

#jog-backward {
  grid-area: backward;
}

#jog-down {
  grid-area: down;
}
</style>