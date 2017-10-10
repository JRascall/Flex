# Flex
## An attempt at creating something similar to SQL-To-Linq in .Net

Trying to make it easier to create a DB connection and start querying data. Its really basic at the moment so be warned also no escaping on the values.

### Using flex
```javascript
const Flex = require("./src/Flex.js");

var flex = new Flex({
    host: "localhost",
    user: "root",
    password: "",
    database: "test"
},  __dirname + "/models");

flex.on('ready', function(){
    //Put Query Code Here.
});

```

### Create A Model - Example a users table
```javascript
{
    "Name": "users",
    "Columns": {
        "Id" : {
            "Type": "int",
            "Primary": true
        },
        "email" : {
            "Type": "varchar",
            "Length": "255"
        },
        "password" : {
            "Type" : "varchar",
            "Length": "255"
        },
        "createdOn" : {
            "Type": "timestamp"
        }
    }
}
```
Match the columns to the database columns and make sure your priamry key is marked with "Primary:true".

### Query data - Example query a user
```javascript
var user = flex.users.GetById(1);
```
the flex instance will contain the collections of your tables so if you had a model with the name "games" which models your "games" table it will be in flex.games so you can do flex.games.GetById(2) to get a record with the Id of 2.

