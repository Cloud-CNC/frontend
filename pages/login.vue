<template>
  <app-center>
    <v-card class="card">
      <v-card-title>Login <v-icon right>mdi-lock</v-icon></v-card-title>
      <v-card-text>
        <!-- Username and password -->
        <v-form>
          <v-text-field label="Username" />

          <v-text-field label="Password" type="password" />

          <v-btn block color="primary"
            ><v-icon left>mdi-login-variant</v-icon> Submit</v-btn
          >
        </v-form>

        <!-- Authentication method divider -->
        <portal-content name="additional-methods">
          <v-container class="divider-container">
            <v-row align="center">
              <v-divider class="divider" />
              <p class="divider-text">OR</p>
              <v-divider class="divider" />
            </v-row>
          </v-container>
        </portal-content>

        <!-- Extra authentication methods -->
        <v-list class="list">
          <plugin-target name="additional-methods" multiple />
        </v-list>
      </v-card-text>
    </v-card>
  </app-center>
</template>

<script lang="ts">
//Imports
import Vue from 'vue';

//Export
export default Vue.extend({
  meta: {
    hidden: true
  }
});
</script>

<style scoped>
.card {
  min-width: 300px;
  width: 40vw;
}

.divider {
  border-top-width: 2px;
}

.divider-container {
  margin-top: 10px;
}

.divider-text {
  margin: auto 10px;
}

.list {
  padding: 0;
}
</style>