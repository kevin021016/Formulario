const mysql = require('mysql2');

//CONEXIÓN A LA BASE DE DATOS
/*const conexion = mysql.createConnection({
    host: "junction.proxy.rlwy.net", 
    user: "root",
    port: 19914, 
    password: "kvNxsezuJqqNIzogCsjqzerPoaFbXYna", 
    database: "railway" 
 
});*/

const conexion = mysql.createPool({
    host: "junction.proxy.rlwy.net", 
    user: "root",
    port: 19914, 
    password: "kvNxsezuJqqNIzogCsjqzerPoaFbXYna", 
    database: "railway",    
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

conexion.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.');
        }
    }

    if (connection) connection.release();
    return;
});


module.exports = conexion;