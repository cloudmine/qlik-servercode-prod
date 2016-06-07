'use strict';
//
// CloudMine, Inc.
// 2015
//

var cm = require('./cmInfo');
var helper = require('./helper');

module.exports = function(req, reply) {

  cm.ws.get().on('success', function(data){
    reply(createObjectArray(data));
  }).on('error', function(error){
    reply(error);
  });

};

/**
 * Takes typical CloudMine response and just puts the objects into an Array
 * All we're doing is looping through the normal return object, and converting it
 * from an {id : object} dictionary into an [object, object, object, ...] array.
 *
 * @param {object} cmGetResponse - CloudMine GET request response data; {id: object} format
 * @return {array} objectArray - an array containing all of the objects
 *
 * @function
 * @name createObjectArray
 */

function createObjectArray(cmGetResponse) {

  // Make sure that we're dealing with JSON
  var cmObjectDict = helper.validateJSON(cmGetResponse);

  // Initialize the return Array
  var objectArray = [];

  // Loop through the JSON, and place the actual objects into objectArray
  for (var key in cmObjectDict){
    objectArray.push(cmObjectDict[key]);
  }

  return objectArray;
}
