const mysql = require('mysql2')
require('dotenv').config()

// can also use import 

const access = process.env

// create the connection first

const db = mysql.createConnection({
    host: access.DB_HOST,
    port: Number(access.DB_PORT) || 3306,
    database: access.DB_NAME,
    user: access.DB_USER,
    password: access.DB_PASSWORD,
})

// actually connect the thing lol
db.connect((err)=>{
    if(err){
        console.log('DB failed! shit 😭');
        return;
    }
    console.log('Yupiee mysql connected lessgoo ✅');
})

module.exports = db
