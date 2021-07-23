/**
 * @fileoverview Route metadata module
 */

//Imports
import extractMeta from '../lib/extract-meta';
import {Module} from '@nuxt/types';
import {NuxtRouteConfig} from '@nuxt/types/config/router';
import {RouteMeta} from 'vue-router';

//Module
const module: Module = function ()
{
  //Register hooks
  this.nuxt.hook('build:extendRoutes', async (routes: NuxtRouteConfig[]) =>
  {
    //Iterate over routes
    for (const route of routes)
    {
      //Extract the component metadata
      const meta = await extractMeta(route.component as string);

      //Update the route
      if (meta != null)
      {
        route.meta = meta as RouteMeta;
      }
    }
  });
};

//Export
export default module;