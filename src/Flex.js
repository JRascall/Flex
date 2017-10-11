'use strict'
const Events = require('events');
const MYSQL = require('mysql');
const FS = require('fs');

const Repository = require('./Repository.js');
const Database = require('./Database.js');

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
                while(self.indexOf('{'+ i + '}') != -1) self = self.replace('{' + i + '}', arguments[i]);   
            }
            return self;
        }        

        self.Models = [];
        self.ReadyRepos = 0;
        self.DB = new Database(connection); 
        self.DB.on('ready', function() {
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
                var repo = new Repository(self.DB.Conn, self.Models[i]);   
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
}

module.exports = Flex;