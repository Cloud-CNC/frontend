/**
 * @fileoverview Route metadata module
 * 
 * Based on https://github.com/dword-design/nuxt-route-meta/blob/master/src/index.js
 */

//Imports
import astToLiteral from 'ast-to-literal';
import {CallExpression, Identifier, ObjectExpression} from '@babel/types';
import {Module} from '@nuxt/types';
import {RouteMeta} from 'vue-router';
import {parseComponent} from 'vue-template-compiler';
import {parseSync, traverse} from '@babel/core';
import {readFileSync} from 'fs';
import {NuxtRouteConfig} from '@nuxt/types/config/router';

/**
 * Extend the routes
 * @param routes Nuxt routes
 */
const extendRoutes = (routes: NuxtRouteConfig[]) =>
{
  //Iterate over routes
  for (const route of routes)
  {
    //Read the component
    const rawComponent = readFileSync(route.component as string, 'utf-8');

    //Parse the component
    const component = parseComponent(rawComponent);

    //Ensure the script is defined
    if (component.script != null)
    {
      //Parse the script
      const ast = parseSync(component.script.content, {
        extends: '@nuxt/babel-preset-app',
        filename: route.component as string,
      });

      //Traverse the AST
      let meta: RouteMeta | undefined;
      traverse(ast, {
        ExportDefaultDeclaration: path =>
        {
          //Ensure the declaration is a call ("Vue.extend({})")
          if (path.node.declaration.type == 'CallExpression')
          {
            //Cast
            const call = path.node.declaration as CallExpression;

            //Ensure there is exactly one argument and that it's an object
            if (call.arguments.length == 1 && call.arguments[0]!.type == 'ObjectExpression')
            {
              //Cast
              const object = call.arguments[0] as ObjectExpression;

              //Iterate over object fields
              for (const field of object.properties)
              {
                //Ensure the field is a property and that it's the meta property
                if (field.type == 'ObjectProperty' && field.key.type == 'Identifier' && (field.key as Identifier).name == 'meta')
                {
                  //Convert to object
                  meta = astToLiteral(field.value);
                }
              }
            }
          }
        }
      });

      //Update the route
      if (meta != null)
      {
        route.meta = meta as RouteMeta;
      }
    }
  }
}

//Module
const module: Module = function ()
{
  //Register hooks
  this.nuxt.hook('build:extendRoutes', extendRoutes);
};

//Export
export default module;