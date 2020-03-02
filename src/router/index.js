//Vue
import Vue from 'vue';
import VueRouter from 'vue-router';

//Views
import account from '../views/account.vue';
import admin from '../views/admin.vue';
import controllers from '../views/controllers.vue';
import error from '../views/error.vue';
import file from '../views/file.vue';
import files from '../views/files.vue';
import login from '../views/login.vue';
import machines from '../views/machines.vue';
import trash from '../views/trash.vue';

//Vue plugin
Vue.use(VueRouter);

//Routes
const routes = [
  {
    path: '/', redirect: '/files'
  },
  {
    name: 'Login', path: '/login', component: login
  },
  {
    name: 'File', path: '/file/:id', component: file
  },
  {
    name: 'Files', path: '/files', component: files
  },
  {
    name: 'Trash', path: '/trash', component: trash
  },
  {
    name: 'Machines', path: '/machines', component: machines
  },
  {
    name: 'Controllers', path: '/controllers', component: controllers
  },
  {
    name: 'Admin', path: '/admin', component: admin
  },
  {
    name: 'Account', path: '/account/:id?', component: account
  },
  {
    name: '404', path: '/**', component: error
  }
];

//Router singleton
export default new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});