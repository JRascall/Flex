'use strict'

const Events = require('events');
const MYSQL = require('mysql');

class Database extends Events  {
    constructor(options){
        super();
        const self = this;
        self.Conn = MYSQL.createConnection(options);
        self.Connect();
    }

    Connect() {
        const self = this;
        self.Conn.connect(function(err) {
            if(err) {
                console.error("ERROR CONNECTING TO DATABASE");
                return;
            }
            console.log("CONNECTED TO DATABASE");
            self.emit('ready');
        });
    }

    Disconnect() {
        const self = this;
        self.Conn.end();
    }
}

module.exports = Database;