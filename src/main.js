/**
 * @fileoverview Primary bootstrapping location
 */

//Imports
import './registerServiceWorker';
import 'material-icons/iconfont/material-icons.scss';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import App from './App.vue';
import router from './router';
import store from './store';
import Vue from 'vue';
import vuetify from './plugins/vuetify';

Vue.config.devtools = true;

//Vue singleton
export default new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app');