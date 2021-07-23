/**
 * @fileoverview Utilities
 */

//Imports
import {copy, existsSync, remove} from 'fs-extra';
import {resolve} from 'path';
import {watch} from 'chokidar';

/**
 * Directories to merge
 */
export const directories = [
  'assets',
  'components',
  'content',
  'layouts',
  'middleware',
  'pages',
  'plugins',
  'portals',
  'static',
  'store'
];

/**
 * Full-qualified project base directory
 */
export const base = resolve(__dirname, '..', '..');

/**
 * Fully-qualified merged source code directory
 */
export const merged = resolve(base, 'merged');

/**
 * Resolve a module path
 * @param root Plugin root directory
 * @param source Plugin source directory
 * @param raw Raw module path
 * @returns Fully-qualified module path
 */
export const resolveModule = (root: string, source: string, raw: string) =>
{
  //Relative to source
  if (raw.startsWith('@/') || raw.startsWith('~/'))
  {
    return resolve(root, source, raw.substring(2));
  }
  //Relative to root
  else if (existsSync(resolve(root, raw)))
  {
    return resolve(root, raw);
  }
  //Relative to Node module
  else if (existsSync(resolve(root, 'node_modules', raw)))
  {
    return resolve(root, 'node_modules', raw); 
  }
  //Unknown
  else
  {
    return raw;
  }
};

/**
 * Watch source code in the specified directory
 * @param source Directory to watch
 */
export const watchSource = (source: string) =>
{
  //File modified event handler
  const onModify = async (oldPath: string) =>
  {
    //Compute new path
    const newPath = oldPath.replace(source, merged);

    //Copy the file
    await copy(oldPath, newPath);
  };

  //File unlinked/deleted event handler
  const onUnlink = async (oldPath: string) =>
  {
    //Compute new path
    const newPath = oldPath.replace(source, merged);

    //Delete the file
    await remove(newPath);
  };

  //Watch all configured directories
  for (const directory of directories)
  {
    //Create the watcher
    const watcher = watch(resolve(source, directory));

    watcher.on('add', onModify);
    watcher.on('change', onModify);
    watcher.on('unlink', onUnlink);
  }
};