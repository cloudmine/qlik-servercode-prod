'use strict';
//
// CloudMine, Inc.
// 2015
//

var exports = module.exports = {};

var cloudmine = require('cloudmine');

var options = {
  'appid' : 'c9d4c770f12e8d46232bd2e0fecbfb0e',
  'apikey' : '5E0188E228844D1D85B3DB379A8E0853'
}

var cmWebService = new cloudmine.WebService(options);

exports.ws = cmWebService;
