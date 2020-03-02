//Imports
import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import 'material-icons/iconfont/material-icons.scss';

Vue.config.productionTip = false;

//Vue singleton
export default new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app');