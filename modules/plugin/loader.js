/**
 * @fileoverview Automatic portal-loader Webpack-loader
 * 
 * Based on https://github.com/nuxt/components/blob/main/src/loader.ts
 */

//Imports
const {parse} = require('path');

/**
 * Generate a random name
 * @param {string} prefix Name prefix
 * @returns Random name
 */
const randomName = prefix =>
{
  //Generate a large random integer
  const integer = Math.round(Math.random() * (10 ** 6));

  //Convert to string
  const str = integer.toString();

  return prefix + str;
};

/**
 * Webpack loader
 * @this {import('webpack').loader.LoaderContext}
 * @param {string} content 
 */
const loader = async function (content)
{
  //Configure the loader
  this.cacheable();

  /**
   * Portal targets
   * @type {Map<string, string>}
   */
  const targets = this.query.targets;

  //Filter out non targets
  if (this.resourceQuery.length == 0 && targets.has(this.resourcePath))
  {
    //Get the portal component path
    const portalPath = targets.get(this.resourcePath);

    //Generate unique name
    const name = randomName(parse(portalPath).name);

    //Add import code
    content = `import ${name} from ${JSON.stringify(portalPath)};\n${content}`;

    //Generate loader code
    const loaderCode = `\n/* portal loader */\nif(process.browser == true)\n{\n  new ${name}().$mount();\n}\n\n`;

    //Insert loader code
    const hmrIndex = content.indexOf('/* hot reload */');
    if (hmrIndex > -1)
    {
      content = content.slice(0, hmrIndex) + loaderCode + content.slice(hmrIndex);
    }
    else
    {
      content += loaderCode;
    }
  }

  return content;
};

//Export
module.exports = loader;