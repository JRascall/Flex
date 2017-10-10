const Flex = require("./src/Flex.js");

var flex = new Flex({
    host: "localhost",
    user: "root",
    password: "",
    database: "test"
},  __dirname + "/models");

flex.on('ready', function(){
    var user = flex.users.GetById(1);
    user.email = "j.mascall@hotmail.com";
    flex.users.UpdateById(1, user);
});
