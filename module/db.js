const Config = require('./config');
const MongoClient = require('mongodb').MongoClient;

class Db {
    static getInstance() {
        if (!Db.instance) {
            Db.instance = new Db();
        }
        return Db.instance;
    }
    constructor() {
        this.dbClient = '';
        this.connect();
    }
    connect() {
        return new Promise((resolve, reject) => {
            if (!this.dbClient) {
                MongoClient.connect(Config.url, { useNewUrlParser: true }, (err, client) => {
                    if (err) {
                        reject(err);
                    } else {
                        this.dbClient = client.db(Config.db);
                        resolve(this.dbClient);
                    }
                });
            } else {
                resolve(this.dbClient);
            }

        })

    }
    find(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                var res = db.collection(collectionName).find(json);
                res.toArray(function(err, docs) {
                    if (err) {
                        reject(err);
                        return
                    }
                    resolve(docs);
                })
            });
        })

    }
    update(collectionName, json, condition) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                db.collection(collectionName).update(json, { $set, condition }, (err, result) => {
                    if (err) {
                        reject(err);
                    } else
                        resolve(result);
                })
            })
        })
    }
    insert(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                db.collection(collectionName).insertOne(json, (err, result) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(result);
                    }
                })
            })
        })
    }
    remove(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                db.collection(collectionName).remove(json, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                })
            })
        })
    }
}
module.exports = Db.getInstance();