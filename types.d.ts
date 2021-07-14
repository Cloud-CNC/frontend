/**
 * @fileoverview TypeScript type augmentation
 */

declare module 'ast-to-literal'
{
  //Imports
  import {Node} from '@babel/types';

  //Export
  export default function (node: Node): any;
}