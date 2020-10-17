/**
 * @fileoverview File Plugin
 */

//Imports
const crypto = require('crypto');
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
      //Read
      const buffer = fs.readFileSync(path);

      const hash = crypto.createHash('sha256').update(buffer).digest('base64');

      //Convert to JSON
      const json = JSON.stringify(Array.from(buffer));

      console.log(`[readBinary] Read ${path} as a binary file, hash: ${hash}`);

      return json;
    }
    else
    {
      throw new Error(`[readBinary] The path ${path} does not exist!`);
    }
  }
};