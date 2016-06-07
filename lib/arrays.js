'use strict';
//
// CloudMine, Inc.
// 2015
//

var stats = require('simple-statistics');
var cm = require('./cmInfo');
var helper = require('./helper');

module.exports = function(req, reply) {

  cm.ws.get().on('success', function(data){
    reply(createArrayObjectRepresentation(data));
  }).on('error', function(error){
    reply(error);
  });

};


/**
 * Takes a CloudMine GET response object, converts all of the returned objects
 * into an array representation, and then returns them in an array. The first
 * array in the top level array will always be a field-name array.
 *
 * @param {object} cmGetResponseBlob - String or JSON object representation
 * @return {array} arrayRepresentation - an array representing the input data
 *
 * @function
 * @name createArrayObjectRepresentation
 */
function createArrayObjectRepresentation(cmGetResponseBlob, properties){

  // Validating the cmGetResponseBlob
  var cmJsonBlob = helper.validateJSON(cmGetResponseBlob);

  // Getting the properties of the object
  // @see getPropertiesArray
  var properties = getPropertiesArray(cmJsonBlob);

  // Initialize the arrayRepresentation array
  var arrayRepresentation = [properties];

  // Looping through the objects returned by CloudMine
  for (var key in cmJsonBlob) {

    var object = cmJsonBlob[key];
    var objArray = [];

    for (var property in object){
      // Making sure that the property we're looking at was determined to be
      // significant by the getPropertiesArray function
      if (properties.indexOf(property) >= 0){
        objArray.push(object[property]);
      }
    }

    if (objArray.length > 0){
      arrayRepresentation.push(objArray);
    }

  }

  return arrayRepresentation;

}

/**
 * Takes a CloudMine response object and parses the important properties across
 * the returned objects
 *
 * @param {object} input - the CMResponse object that hopefully contains some objects to check out
 * @return {array} significantProperties - the properties across all objects determined to be significant.
 *
 * @function
 * @name getPropertiesArray
 */
function getPropertiesArray(input) {

  var cmJsonBlob = helper.validateJSON(input);

  // How many times each property occurs
  var propCounts = {}
  // Just the count values. For statistical purposes; associated fields are not necessary
  var rawCounts = []
  // The number of objects in the cmJsonBlob
  var objectCount = Object.keys(cmJsonBlob).length

  // looping through every object returned by CloudMine, going through its
  // properties, and counting how many times each occurs. Also keeping a parallel
  // raw counts array for stats purposes.
  for (var key in cmJsonBlob) {
    var obj = cmJsonBlob[key]; // an actual CloudMine object
    for (var property in obj) {
      // Incrementing the propCounts dict
      if (propCounts[property]) {
        propCounts[property]++;
      } else {
        propCounts[property] = 1;
      }
      // updating the rawCounts array
      rawCounts[Object.keys(propCounts).indexOf(property)] = propCounts[property];
    }
  }

  for (var prop in propCounts){
    rawCounts[Object.keys(propCounts).indexOf(prop)] = propCounts[prop];
  }

  // TODO - abstract the significance method so that you can create your own measure of sig.

  // getting some simple statistics
  var meanCounts = stats.mean(rawCounts);
  var medianCounts = stats.median(rawCounts);
  var sdCounts = stats.standardDeviation(rawCounts);

  // The minimum and maximum allowable counts
  var min = meanCounts - sdCounts;
  var max = meanCounts + sdCounts;

  // Culling the properties dictionary
  for (var property in propCounts) {
    if (propCounts[property] < min || propCounts[property] > max) {
      delete propCounts[property];
    }
  }

  var significantProperties = Object.keys(propCounts);

  // Return only the actual properties, we don't care about the counts
  return significantProperties;

}
