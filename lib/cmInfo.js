'use strict';
//
// CloudMine, Inc.
// 2015
//

var exports = module.exports = {};

var cloudmine = require('cloudmine');

var options = {
  'appid' : 'YOUR_APP_ID_HERE',
  'apikey' : 'YOUR_API_KEY_HERE'
}

var cmWebService = new cloudmine.WebService(options);

exports.ws = cmWebService;
