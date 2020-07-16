/**
 * @fileoverview Account helper
 */

//Imports
const config = require('config');
let mongoose = require('mongoose');

//Shared variables
let id;
let model;

//Export
module.exports = {
  /**
   * Create the test account
   * @returns {Promise<null>}
   */
  create: async () =>
  {
    //Warn user
    console.warn('[--------------------]');
    console.warn('');
    console.warn('⚠️\tYou are generating a test account with known defaults!');
    console.warn('⚠️\tIf this is running in production, you are likely being attacked!');
    console.warn('');
    console.warn('[--------------------]');

    //Connect to the database
    mongoose = await mongoose.connect(config.get('core.database'), {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    //Schema
    const schema = new mongoose.Schema({
      role: {type: String, validate: role => ['admin', 'user'].includes(role), default: 'user', required: true},
      username: {type: String, validate: /^.{3,30}$/, unique: true, required: true},
      hash: {type: String, required: true},
      mfa: {type: Boolean, required: true, default: false},
      secret: {type: String}
    });

    //Model
    model = mongoose.model('account', schema);

    //Document
    const doc = new model({
      username: 'Test Account',
      //Testingpassword123!
      hash: '$argon2id$v=19$m=65536,t=3,p=4$mHeetLRUe/vOIbWHxm8/AA$yNWvrqIJZZsCTTp1mDt25WXOBaF/NWRaCSLKLGRfxd4',
      mfa: false,
      secret: null,
      role: 'admin'
    });

    //Save ID for removal
    id = doc._id;

    await doc.save();

    //Must return a value
    return null;
  },

  /**
   * Remove the test account
   * @returns {Promise<null>}
   */
  remove: async () =>
  {
    await model.findByIdAndDelete(id);

    //Warn user
    console.warn('[--------------------]');
    console.warn('');
    console.warn('⚠️\tYou have removed the unsafe test account!');
    console.warn('⚠️\tYou should be safe to run in production now, but please double check to make sure the test account was removed!');
    console.warn('');
    console.warn('[--------------------]');

    //Must return a value
    return null;
  }
};