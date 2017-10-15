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
            "Primary": true
        },
        "email" : {},
        "password" : {},
        "createdOn" : {}
    }
}
```
Match the columns to the database columns and make sure your priamry key is marked with "Primary:true".

### Query data - Example query a user
```javascript
var user = flex.users.GetById(1);
```
the flex instance will contain the collections of your tables so if you had a model with the name "games" which models your "games" table it will be in flex.games so you can do flex.games.GetById(2) to get a record with the Id of 2.

### WHERE Query data - Example query all by email
```javascript
var users = flex.users.Where(function(x){
    if(x.email == "jamie@hotmail.com") return true;
    else return false;
}); 
```
You can pass lambda expressions to the where to query the data even more. So in this example its going to bring back any data that has the email of jamie@hotmail.com