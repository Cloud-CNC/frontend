/**
 * @fileoverview Get plugins
 */

//Imports
import {readPackageSync} from 'read-pkg';
import {resolve} from 'path';

/**
 * Cloud CNC frontend-plugin
 */
interface Plugin
{
  /**
   * Raw path to the plugin's Nuxt config file
   */
  config?: string;

  /**
   * Fully-qualified path to the plugin's directory
   */
  directory: string;

  /**
   * Plugin name
   */
  name: string;

  /**
   * Raw path to the plugin's source code
   */
  source?: string;
}

//Module
export default (root: string) =>
{
  //Read the package
  const rootPkg = readPackageSync({
    cwd: root
  });

  //Ensure there are dependencies
  if (rootPkg.dependencies == null)
  {
    throw new Error('[Plugin Module] No package dependencies!');
  }

  //Filter dependencies
  const plugins = Object.entries(rootPkg.dependencies).flatMap(([key, value]) =>
  {
    //Filter non-plugins
    if (key.startsWith('@cloud-cnc/plugin-') || key.startsWith('cloud-cnc-plugin-'))
    {
      //Compute the dependency directory
      const directory = value.startsWith('file:') ? resolve(root, value.substring(5)) : resolve(root, 'node_modules', key);

      //Read the dependency package
      const dependencyPkg = readPackageSync({
        cwd: directory
      });

      //Validate the "cloud-cnc" field
      if (dependencyPkg['cloud-cnc'] == null || dependencyPkg['cloud-cnc'].frontend == null)
      {
        throw new Error(`[Plugin Module] Cloud CNC plugin ${key} has an invalid/missing "cloud-cnc" field!`);
      }

      //Convert to a plugin
      const plugin: Plugin = {
        config: dependencyPkg['cloud-cnc'].frontend.config,
        directory,
        name: key,
        source: dependencyPkg['cloud-cnc'].frontend.source
      };

      return [plugin];
    }
    else
    {
      return [];
    }
  });

  return plugins;
};
