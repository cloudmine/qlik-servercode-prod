'use strict';
//
// CloudMine, Inc.
// 2015
//

var stats = require('simple-statistics');
var cloudmine = require('cloudmine');

module.exports = function(req, reply) {

  var options = {
    'appid' : 'c9d4c770f12e8d46232bd2e0fecbfb0e',
    'apikey' : '5E0188E228844D1D85B3DB379A8E0853'
  }

  var ws = new cloudmine.WebService(options);

  ws.get().on('success', function(data){
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
 * @param {object} input - CloudMine GET request response data; {id: object} format
 * @return {array} array - an array containing all of the objects
 *
 * @function
 * @name createObjectArray
 */

function createObjectArray(cmGetResponse) {

  // Make sure that we're dealing with JSON
  var cmObjectDict = validateJSON(cmGetResponse);

  // Initialize the return Array
  var objectArray = [];

  // Loop through the JSON, and place the actual objects into objectArray
  for (var key in cmObjectDict){
    delete cmObjectDict[key]['__class__'];
    objectArray.push(cmObjectDict[key]);
  }

  return objectArray;
}

/**
Takes a string or JSON value and creates array representations of it

@param input - String or JSON object representation
@return arrayObjectRepresentation - an array representing the input data
*/
function createArrayObjectRepresentation(input, properties){

  var json = validateJSON(input);

  // var properties = getPropertiesArray(json);

  var allArray = [];

  // Looping through the objects returned by CloudMine
  for (var key in json) {
    var object = json[key];
    var objArray = [];
    for (var property in object){
      if (properties.indexOf(property) >= 0){
        objArray.push(object[property]);
      }
    }
    if (objArray.length > 0){
      allArray.push(objArray);
    }
  }

  return allArray;

}

// Helper Functions

/**
Takes a CloudMine response object and parses the important properties across the returned objects

@param input - the CMResponse object that hopefully contains some objects to check out
@return significantProperties - the properties across all objects determined to be significant.
*/
function getPropertiesArray(input) {

  var json = validateJSON(input);

  var propCounts = {}
  var rawCounts = []
  var objectCount = Object.keys(json).length

  // looping through every object returned by CloudMine, going through its
  // properties, and counting how many times each occurs. Also keeping a parallel
  // raw counts array for stats purposes.
  for (var key in json) {
    var obj = json[key]; // an actual CloudMine object
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

//------------------------------------------------------------------------------
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
//------------------------------------------------------------------------------

  // Return only the actual properties, we don't care about the counts
  return significantProperties;

}

function isValidJSON(stringInput){
  try {
    JSON.parse(stringInput);
  } catch (e) {
    return false;
  }
}

function validateJSON(input){
  var json;

  if (input instanceof String){
    if (isValidJSON(input)) {
      json = JSON.parse(input);
    } else {
      throw "Invalid JSON String sent to createArrayObjectRepresentation, ya JERK!";
    }
  } else {
    json = input
  }

  return json;
}
