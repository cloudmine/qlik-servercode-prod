# Qlik Servercode

This repository is designed to supply a CloudMine endpoint that the Qlik system can use to more easily consume CloudMine data.

##Overview

The snippet contained exposes two endpoints, `/arrays` and `/objects` that return all of the objects associated with a normal `/text` call (i.e., it retrieves all objects for an application), but in an array return format.

To get started with the Qlik Servercode snippet, go into the `lib/cmInfo.js` file, and update the Application ID and the API Key in lines 12-15. Once you do this, you're ready to start using the `qlik-servercode` endpoints.

*Currently only the array of objects return type has been tested with the Qlik system. Look for updates soon!*

##Array of Objects

File location: `/lib/objects`

Hitting the `/run/objects` endpoint (or, the `/code/objects` endpoint when testing lcoally), you can get a return array containing your JSON objects as they appear in the CloudMine system:

```
[
  {field_name1: f1_obj1, field_name2: f2_obj1, ...},  
  {field_name1: f1_obj2, field_name2: f2_obj2, ...},
  {field_name1: f1_obj3, field_name2: f2_obj3, ...},
  ...
]
```

As you can see, each object remains a key -> value dictionary.

##Array of Arrays

File location: `/lib/arrays`

*The array of arrays return type has only been tested on single-layer CloudMine objects. Look for updates soon!*

Hitting the `/run/arrays` (`/code/arrays`) endpoint, on the other hand, will take the objects you have stored on CloudMine, analyze which fields appear most often, and turn your objects into array representations of values, as seen below. As you can see, the first array will always be field names, while the following arrays will be values:

```
[
  [field_name1, field_name2, field_name3, ..., field_nameN],
  [f1_obj1, f2_obj1, f3_obj1, ... , fN_obj1],
  ...
  [f1_objM, f2_objM, f3_objM, ... , fN_objM]
]
```

##Running the Snippet

This project is based on the CloudMine github repository [node-snippet-base](https://github.com/cloudmine/node-snippet-base). Check out the README.md to get more information on how to run this snippet locally for testing, and how to upload it to your CloudMine project for use with Qlik.

##Ephemera

For any questions or concerns, please contact `support@cloudmineinc.com`.
