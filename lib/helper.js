'use strict';
//
// CloudMine, Inc.
// 2015
//

var exports = module.exports = {};

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

exports.isValidJSON = isValidJSON;
exports.validateJSON = validateJSON;
