/**
 * @fileoverview Cloud CNC frontend-plugin support module
 * 
 * Based on https://vueschool.io/articles/vuejs-tutorials/build-file-based-theme-inheritance-module-in-nuxt
 * and https://github.com/nuxt/components/blob/main/src/loader.ts
 */

//Imports
import extractMeta from '../../lib/extract-meta';
import getPlugins from './get-plugins';
import jiti from 'jiti';
import {Module, NuxtConfig} from '@nuxt/types';
import {base, directories, merged, resolveModule, watchSource} from './utils';
import {resolve} from 'path';
import {copy, ensureDir, emptyDir, existsSync, readdir} from 'fs-extra';
import {merge} from 'lodash';

//Portal targets
const portalTargets = new Map<string, string>();

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

      //Execute and load the config file
      const file = jiti(plugin.directory, {
        requireCache: false
      })(configPath);

      //Get the config
      const config = (file.default || file) as NuxtConfig;

      //Add build modules
      if (config.buildModules != null)
      {
        for (let module of config.buildModules)
        {
          //Resolve module paths
          if (typeof module == 'string')
          {
            module = resolveModule(plugin.directory, plugin.source || plugin.directory, module);
          }
          //Resolve module paths with config
          else if (Array.isArray(module) && typeof module[0] == 'string')
          {
            module[0] = resolveModule(plugin.directory, plugin.source || plugin.directory, module[0]);
          }

          //Add the module
          this.addModule(module);
        }
      }

      //Add modules
      if (config.modules != null)
      {
        for (let module of config.modules)
        {
          //Resolve module paths
          if (typeof module == 'string')
          {
            module = resolveModule(plugin.directory, plugin.source || plugin.directory, module);
          }
          //Resolve module paths with config
          else if (Array.isArray(module) && typeof module[0] == 'string')
          {
            module[0] = resolveModule(plugin.directory, plugin.source || plugin.directory, module[0]);
          }

          //Add the module
          this.addModule(module);
        }
      }

      //Merge options into Nuxt options
      this.options = merge(this.options, typeof config.default == 'object' ? config.default : config);

      //Add config to watch
      this.options.watch.push(resolve(plugin.directory, plugin.config));
    }

    //Merge source code if specified
    if (plugin.source != null)
    {
      //Compute source directory path
      const sourceDirectory = resolve(plugin.directory, plugin.source);

      //Copy plugin source code
      for (const directory of directories)
      {
        //Copy if exists
        if (existsSync(resolve(sourceDirectory, directory)))
        {
          await copy(resolve(sourceDirectory, directory), resolve(merged, directory));
        }
      }

      //Watch for changes in development
      if (process.env.NODE_ENV == 'development')
      {
        watchSource(sourceDirectory);
      }
    }
  }

  //Watch for changes in development
  if (process.env.NODE_ENV == 'development')
  {
    watchSource(base);
  }

  //Update portal targets
  if (existsSync(resolve(merged, 'portals')))
  {
    //Iterate over portals
    for (const portal of await readdir(resolve(merged, 'portals')))
    {
      //Compute the portal path
      const portalPath = resolve(merged, 'portals', portal);

      //Extract the portal metadata
      const meta = await extractMeta(portalPath);

      if (meta.target == null)
      {
        throw new Error('[Plugin Module] Portal metadata lacked target property!');
      }

      //Compute the target path
      const targetPath = resolve(merged, meta.target);

      //Update targets
      portalTargets.set(targetPath, portalPath);
    }
  }

  //Extend the Webpack build
  this.extendBuild(config =>
  {
    //Find the Vue SFC rule
    const vueRule = config.module?.rules.find(rule => rule.test?.toString().includes('.vue'));

    //Ensure the rule is defined
    if (vueRule == null)
    {
      throw new Error('[Plugin Module] No Vue SFC Webpack rule!');
    }

    //Move the loader to the modifiers
    if (vueRule.use == null)
    {
      vueRule.use = [{
        loader: vueRule.loader!.toString(),
        options: vueRule.options
      }];

      //Delete the loader
      delete vueRule.loader;
      delete vueRule.options;
    }
    //Convert to an array
    else if (!Array.isArray(vueRule.use))
    {
      vueRule.use = [
        vueRule.use as any
      ];
    }

    //Add a loader
    vueRule.use!.unshift({
      loader: resolve(__dirname, 'loader'),
      options: {
        targets: portalTargets
      }
    });
  });
};

//Export
export default module;