/**
 * @fileoverview Vue router
 */

//Imports
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
    path: '/',
    redirect: '/files',
    meta: {
      menu: false
    }
  },
  {
    name: 'Login',
    path: '/login',
    component: login,
    meta: {
      menu: false
    }
  },
  {
    name: 'File',
    path: '/file/:id',
    component: file,
    meta: {
      menu: false
    }
  },
  {
    name: 'Files',
    path: '/files',
    component: files,
    meta: {
      icon: 'folder',
      menu: true
    }
  },
  {
    name: 'Trash',
    path: '/trash',
    component: trash,
    meta: {
      icon: 'delete',
      menu: true
    }
  },
  {
    name: 'Machines',
    path: '/machines',
    component: machines,
    meta: {
      icon: 'dock',
      menu: true
    }
  },
  {
    name: 'Controllers',
    path: '/controllers',
    component: controllers,
    meta: {
      icon: 'account_tree',
      menu: true
    }
  },
  {
    name: 'Admin',
    path: '/admin',
    component: admin,
    meta: {
      icon: 'gavel',
      menu: true
    }
  },
  {
    name: 'Account',
    path: '/account/:id?',
    component: account,
    meta: {
      icon: 'account_circle',
      menu: true
    }
  },
  {
    name: '404',
    path: '/**',
    component: error,
    meta: {
      menu: false
    }
  }
];

//Export a router singleton
export default new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});