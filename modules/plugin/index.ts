/**
 * @fileoverview Cloud CNC frontend-plugin support module
 * 
 * Based on https://vueschool.io/articles/vuejs-tutorials/build-file-based-theme-inheritance-module-in-nuxt
 */

//Imports
import getPlugins from './get-plugins';
import jiti from 'jiti';
import {Module} from '@nuxt/types';
import {base, directories, merged, watchSource} from './utils';
import {copy, ensureDir, emptyDir, existsSync} from 'fs-extra';
import {merge} from 'lodash';
import {resolve} from 'path';

//Module
const module: Module = async function ()
{
  //Update the source directory
  this.options.srcDir = merged;

  //Prepare the merged directory
  await ensureDir(merged);
  await emptyDir(merged);

  //Copy base source code
  for (const directory of directories)
  {
    //Copy if exists
    if (existsSync(resolve(base, directory)))
    {
      await copy(resolve(base, directory), resolve(merged, directory));
    }
  }

  //Get plugins
  const plugins = getPlugins(base);

  //Iterate over plugins
  for (const plugin of plugins)
  {
    //Merge config if specified
    if (plugin.config != null)
    {
      //Compute config path
      const configPath = resolve(plugin.directory, plugin.config!);

      //Execute and load the config
      const config = jiti(plugin.directory, {
        requireCache: false
      })(configPath);

      //Merge options into Nuxt options
      this.options = merge(this.options, typeof config.default == 'object' ? config.default : config);

      //Add config to watch
      this.options.watch.push(resolve(plugin.directory, plugin.config));
    }

    //Merge source code if specified
    if (plugin.source != null)
    {
      //Compute source path
      const sourcePath = resolve(plugin.directory, plugin.source);

      //Copy plugin source code
      for (const directory of directories)
      {
        //Copy if exists
        if (existsSync(resolve(sourcePath, directory)))
        {
          await copy(resolve(sourcePath, directory), resolve(merged, directory));
        }
      }

      //Watch for changes in development
      if (process.env.NODE_ENV == 'development')
      {
        watchSource(sourcePath);
      }
    }
  }

  //Watch for changes in development
  if (process.env.NODE_ENV == 'development')
  {
    watchSource(base);
  }
};

//Export
export default module;