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
        self.ReadyRepos = 0;
        self.ConnInfo = connection;
        self.Conn = MYSQL.createConnection(self.ConnInfo);
        self.Connect(function(){
            self.LoadModels(modelsPath);
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
                var repo = new Repository(self.Conn, self.Models[i]);   
                repo.on('ready', () => { self.IsReady() });
                self[self.Models[i].Name] = repo;
            }
        }
        else
        {
            console.error("Path does not exists");
        }

        return;
    }

    IsReady() {
        const self = this;

        self.ReadyRepos++;
        var keys = Object.keys(self);
        var repos = 0;
        for(var i = 0; i < keys.length; i++)
        {
            if(self[keys[i]] == null) continue;
            if(self[keys[i]].Repository == true)
            {
                repos++;
            }   
        }

        if(self.ReadyRepos == repos) self.emit("ready");
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

function test() {

}

module.exports = Flex;