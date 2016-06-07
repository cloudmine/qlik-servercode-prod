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

  var dataType_ObjectArray = "ObjectArray";
  var dataType_ArrayArray = "ArrayArray";

  //////////////////////////////////////////////////////////////////////////////
  //    Choose your data type! (Usually this would be passed into the snippet
  //    in the request body)
  //////////////////////////////////////////////////////////////////////////////
  var dataType = dataType_ObjectArray;

  var ws = new cloudmine.WebService(options);

  ws.get().on('success', function(data){

    // Switching on the data type you want returned
    if (dataType == dataType_ObjectArray) {
      reply(createObjectArray(data));
    } else if (data type == dataType_ArrayArray){
      reply(createArrayObjectRepresentation(data));
    }

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
  var cmObjectDict = validateJSON(cmGetResponse);

  // Initialize the return Array
  var objectArray = [];

  // Loop through the JSON, and place the actual objects into objectArray
  for (var key in cmObjectDict){
    objectArray.push(cmObjectDict[key]);
  }

  return objectArray;
}

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
  var cmJsonBlob = validateJSON(cmGetResponseBlob);

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

// Helper Functions

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

  var cmJsonBlob = validateJSON(input);

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

/**
 * Validates that a string input is actually a valid JSON representation.
 *
 * @param {string} stringInput - string to be tested for JSON validity
 * @return {bool} _ - either true, if the string is valid JSON, or false
 *
 * @function
 * @name isValidJSON
 */
function isValidJSON(stringInput){
  try {
    JSON.parse(stringInput);
  } catch (e) {
    return false;
  }
}


/**
 * Takes input and returns a valid JSON representation
 *
 * @param {object} input - object of indeterminite type that we're testing for JSON
 * @return {object} json - the object passed in, turned into JSON
 * @throws {error} e - error thrown if an invalid string is passed in
 *
 * @function
 * @name validateJSON
 */
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
