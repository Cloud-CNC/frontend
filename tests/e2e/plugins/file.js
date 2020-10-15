/**
 * @fileoverview File Plugin
 */

//Imports
const fs = require('fs');

//Exports
module.exports = {
  /**
   * Read the file at the path via Binary
   */
  readBinary: path =>
  {
    const exists = fs.statSync(path).isFile();

    if (exists)
    {
      console.log(`[readBinary] The path ${path} exists, reading as binary file.`);

      //Read
      const buffer = fs.readFileSync(path);

      //Convert to JSON
      const json = JSON.stringify(Array.from(buffer));

      return json;
    }
    else
    {
      throw new Error(`[readBinary] The path ${path} does not exist!`);
    }
  }
};