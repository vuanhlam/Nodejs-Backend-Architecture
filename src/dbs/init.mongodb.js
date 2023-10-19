"use strict";

const mongoose = require("mongoose");

const connectionString = `mongodb://127.0.0.1/shopDev`;

class Database {
  constructor() {
    console.log('in constructor');
    this.connect();
  }

  // connect
  connect(type = "mongodb") {
    if (1 === 1) { // giả sử môi trường dev
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectionString)
      .then((_) => console.log(`Connected Mongodb Success PRO`))
      .catch((err) => console.log(`Error Connect!`));
  }

  static getInstance() {
    console.log(Database.instance);
    if(!Database.instance) {
        console.log('init instance');
        Database.instance = new Database()
    }
    console.log(Database);
    return Database.instance 
  }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb
