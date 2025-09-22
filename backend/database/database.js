const sqlite = require('sqlite3').verbose();


const db = new sqlite.Database('gamerater_db.db', (error) => {
    if (error) {
        return console.error(error.message);
    }
    console.log("Connected to DB.");
});

module.exports = db;

//example source https://www.digitalocean.com/community/tutorials/how-to-use-sqlite-with-node-js-on-ubuntu-22-04#step-2-connecting-to-an-sqlite-database