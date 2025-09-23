const sqlite = require('sqlite3').verbose();


exports.db = new sqlite.Database('./database/gamerater_db.db', sqlite.OPEN_READWRITE, (error) => {
    if (error) {
        return console.error(error.message);
    }
    console.log("Connected to DB.");
});

exports.fetchAll = async (db, sql, params) => {
    return new Promise ((resolve, reject) => {
        db.all(sql, params, (err, rows)=>{
            if (err) reject(err);
            resolve(rows);
        });
    });
};

exports.fetchFirst = async (db, sql, params) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
};

exports.runAsync = async(db, sql, params) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err){
            if (err) reject(err);
            resolve(this);
        })
    })
}

//example source https://www.digitalocean.com/community/tutorials/how-to-use-sqlite-with-node-js-on-ubuntu-22-04#step-2-connecting-to-an-sqlite-database
//method wrapper source https://www.sqlitetutorial.net/sqlite-nodejs/query/