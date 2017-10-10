'use strict'
const Events = require('events');

class Repository extends Events {
    constructor(conn, model) {
        super();
        const self = this;
        self.Repository = true;
        self.Conn = conn;
        self.Model = model;
        self.Data = [];
        self.Columns = Object.keys(self.Model.Columns);
        self.PrimaryKey = ModelPrimaryKey(self.Model);

        var getAllQuery = "SELECT * FROM {0}".format(model.Name);
        self.Conn.query(getAllQuery, function(err, res, fields){
            if(err) 
            {
                console.log(err);
                return;
            }

            for(var i = 0; i < res.length; i++)
            {
                var row = res[i];
                var dataRow = {};
                for(var k = 0; k < self.Columns.length; k++)
                {
                    var column = self.Columns[k];
                    dataRow[column] = row[column];
                }
                self.Data.push(dataRow);
            }

            self.emit("ready");
        });
    }

    GetById(id) {
        const self = this;
        for(var i = 0; i < self.Data.length; i++)
        {
           if(self.Data[i][self.PrimaryKey] == id) return self.Data[i];   
        }

        return null;
    }

    UpdateById(id, model) {
        const self = this;
        var item = null;
        for(var i = 0; i < self.Data.length; i++)
        {
            if(self.Data[i][self.PrimaryKey] == id)
            {
                item = self.Data[i]; 
                break;
            }
        }

        if(item != null)
        {
            item = model;   
            var columnNum = self.Columns.length;
            var updateQuery = "UPDATE {0} SET ".format(self.Model.Name);
            for(var i = 0; i < columnNum; i++)
            {
                if(i == columnNum - 1) updateQuery += "{0} = '{1}' ".format(self.Columns[i], item[self.Columns[i]]);
                else updateQuery += "{0} = '{1}', ".format(self.Columns[i], item[self.Columns[i]]);
            } 
            updateQuery += "WHERE {0} = {1}".format(self.PrimaryKey, item[self.PrimaryKey]);
            self.Conn.query(updateQuery, function(err, res, fields){
                if(err) console.log(err);
            });
        }

        return item;

    }

    DeleteById(id) {

    }
}

function ModelPrimaryKey(model) {
    var keys = Object.keys(model.Columns);
    for(var i = 0; i < keys.length; i++)
    {
        var column = model.Columns[keys[i]];
        if(column.Primary == true) return keys[i];
    }
}

module.exports = Repository;