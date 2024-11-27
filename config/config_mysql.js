/* Configuracion de conexion de DB */
/* import mysql from 'mysql'; */
var mysql = require('mysql');

var db = mysql.createConnection({
    host: 'localhost',
    database: 'db_avisos_innova',
    user: 'root',
    password: '',
})

db.connect((err) =>{
    if (err) {
        console.error('Error al conectar la base de datos', err);
        throw err;        
    }
    console.log('Conexión a base de datos exitosa');
    
})


module.exports = db;