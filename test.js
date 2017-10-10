const Flex = require("./src/Flex.js");

var flex = new Flex({
    host: "localhost",
    user: "root",
    password: "",
    database: "test"
},  __dirname + "/models");

flex.on('ready', function(){
    
});
