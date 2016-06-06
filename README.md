# Qlik Servercode

This repository is designed to supply a CloudMine endpoint that the Qlik system can use to more easily consume CloudMine data.

The snippet contained exposes an endpoint, `/run/array` that returns all of the objects associated with a normal `/text` call (i.e., it retrieves all objects for an application), but formatted as an array instead of a {UUID : Object} dictionary.

Currently, you have to explicitly set the Application ID and API Key within the snippet. You also have a choice of return types within the snippet. You can either do the simple:

```
[
  Object,
  Object,
  Object
]
```

return style, where each `Object` is a key-value JSON store, or you can opt to convert your objects into arrays themselves. This return type will send back an array of arrays in the following fashion:

```
[
  [field_name1, field_name2, field_name3, ..., field_nameN],
  [f1_obj1, f2_obj1, f3_obj1, ... , fN_obj1],
  ...
  [f1_objM, f2_objM, f3_objM, ... , fN_objM]
]
```

for `M` objects returned, each of which contain at most `N` fields.
