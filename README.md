# Qlik Servercode

This repository is designed to supply a CloudMine endpoint that the Qlik system can use to more easily consume CloudMine data.

##Overview

The snippet contained exposes an endpoint, `/array` that returns all of the objects associated with a normal `/text` call (i.e., it retrieves all objects for an application), but formatted as an array instead of a {UUID : Object} dictionary.

To get started with the Qlik Servercode snippet, go into the `lib/array.js` file, and update the Application ID and the API Key in lines 12-15. Once you do this, you're able to choose exactly which kind of result you'd like to receive from the snippet: an array of object dictionaries, or an array of object arrays.

##Return Types

The array of objects will return in the following manner:

```
[
  {field_name1: f1_obj1, field_name2: f2_obj1, ...},  
  {field_name1: f1_obj2, field_name2: f2_obj2, ...},
  {field_name1: f1_obj3, field_name2: f2_obj3, ...},
  ...
]
```

As you can see, each object remains a key -> value dictionary.

The array of arrays, on the other hand, will return like so:

```
[
  [field_name1, field_name2, field_name3, ..., field_nameN],
  [f1_obj1, f2_obj1, f3_obj1, ... , fN_obj1],
  ...
  [f1_objM, f2_objM, f3_objM, ... , fN_objM]
]
```

In this second return type, objects are represented as arrays rather than key -> value stores, and returned in a `return array`. The snippet goes through all of your objects, checks how common each field is, and removes particularly uncommon fields. On returning, the first array in the `return array` contains the fields of the objects to follow. The remaining arrays are the array representation of each object's value.

##Changing the Result Format

To change the result format, update the `dataType` variable on line 24 of `lib/array.js`. The two options are currently `dataType_ObjectArray` and `dataType_ArrayArray`.

##Running the Snippet

This project is based on the CloudMine github repository [node-snippet-base](https://github.com/cloudmine/node-snippet-base). Check out the README.md to get more information on how to run this snippet locally for testing, and how to upload it to your CloudMine project for use with Qlik.

##Ephemera

For any questions or concerns, please contact `support@cloudmineinc.com`.
