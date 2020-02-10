/**
 * @fileoverview Regex Filters
 */

export default {
  boolean: /^true|false$/,
  description: /^(.|\s){0,1000}$/,
  key: /^[A-z0-9+/]+={0,3}$/,
  name: /^.{3,30}$/,
  otp: /^\d{6}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-z0-9]).{12,256}$/,
  role: /^admin|user$/,
  status: /^0|1$/,
  tags: /^.{0,200}$/,
  username: /^.{3,30}$/
};