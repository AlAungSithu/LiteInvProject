const mysql = require('mysql');
const con = mysql.createConnection({
    host: 'liteinv.cwbgzf4cyva5.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: '256Team256',
    port: 3306,
    database: 'LiteInv'
});
 
con.connect((err) => {
    if (err) {
        throw err;
    } else {
        console.log('Connected!');
    }
});
 
module.exports = con;