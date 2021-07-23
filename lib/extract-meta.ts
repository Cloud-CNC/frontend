/**
 * @fileoverview Extract a Vue component's metadata
 * 
 * Based on https://github.com/dword-design/nuxt-route-meta/blob/master/src/index.js
 */

//Imports
import astToLiteral from 'ast-to-literal';
import {CallExpression, Identifier, ObjectExpression} from '@babel/types';
import {parseAsync, traverse} from '@babel/core';
import {parseComponent} from 'vue-template-compiler';
import {readFile} from 'fs-extra';

//Export
export default async (path: string) =>
{
  //Read the component
  const rawComponent = await readFile(path, 'utf-8');

  //Parse the component
  const component = parseComponent(rawComponent);

  //Ensure the script is defined
  if (component.script == null)
  {
    throw new Error(`[Extracting Metadata] Vue component ${path} lacked a script section!`);
  }

  //Parse the script
  const ast = await parseAsync(component.script.content, {
    extends: '@nuxt/babel-preset-app',
    filename: path,
  });
  
  //Extract the metadata
  let meta: any;

  //Traverse the AST
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

  return meta;
};