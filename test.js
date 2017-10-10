const Flex = require("./src/Flex.js");

var flex = new Flex({
    host: "localhost",
    user: "root",
    password: "",
    database: "test"
},  __dirname + "/models");

flex.on('ready', function(){
    setTimeout(function(){
        var user = flex.Repositories.users.GetById(2);
        console.log(user);
    }, 2000);
})
