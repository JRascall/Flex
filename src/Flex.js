'use strict'
const Events = require('events');
const MYSQL = require('mysql');
const FS = require('fs');

const Repository = require('./Repository.js');

class Flex extends Events {
    constructor(connection, modelsPath) {
        super();
        const self = this;

        if(connection == null) throw "Provide database info";
        if(modelsPath == null) throw "Provide path to defined models";

        String.prototype.format = function() {
            var self = this;
            var count = arguments.length;
            for(var i = 0; i < count; i++)
            {
                self = self.replace('{' + i + '}', arguments[i]);   
            }
            return self;
        }        

        self.Models = [];
        self.Repositories = [];
        self.ConnInfo = connection;
        self.Conn = MYSQL.createConnection(self.ConnInfo);
        self.Connect(function(){
            self.LoadModels(modelsPath);
            self.emit("ready");
        });
    }

    LoadModels(path) {
        const self = this;
        if(FS.existsSync(path))
        {
            var files = FS.readdirSync(path); 
            for(var i = 0; i < files.length; i++)
            {
                var model = JSON.parse(FS.readFileSync(path + "/" + files[i]));
                self.Models.push(model);
            }

            for(var i = 0; i < self.Models.length; i++)
            {
                self.Repositories[self.Models[i].Name] = new Repository(self.Conn, self.Models[i]);   
            }
        }
        else
        {
            console.error("Path does not exists");
        }

        return;
    }

    Connect(cb) {
        const self = this;
        self.Conn.connect(function(err) {
            if(err) {
                console.error("ERROR CONNECTING TO DATABASE");
                return;
            }
            console.log("CONNECTED TO DATABASE");
            cb();
        });
    }

    Disconnect() {
        const self = this;
        self.Conn.end();
    }


}

module.exports = Flex;