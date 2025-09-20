const sqlite = require('sqlite3').verbose();


const db = new sqlite.Database('gamerater_db.db', (error) => {
    if (error) {
        return console.error(error.message);
    }
});

console.log("Connected to DB.");

module.exports = db;