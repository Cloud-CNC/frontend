/**
 * @fileoverview Utilities
 */

//Imports
import {copy, remove} from 'fs-extra';
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

    throw new Error(`Unlinking ${newPath} (Old: ${oldPath})`);

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