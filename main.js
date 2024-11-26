const db = require('./config/config_mysql');

/* Este componente sirve  para levantar o iniciar el sevidor */
const app = require('./app');
const server = app.listen(app.get('port'));
//Websockets
const socketIO = require('socket.io');
/* const db = require('express-myconnection'); */
const io = socketIO(server);

io.of('/index').on('db', (socket)=>{
    /* Listar avisos */
    db.query('SELECT * from avisos',(err, results) =>{
        if (err) {
            console.error('Error en la consulta:', err);
        }
        let listadoGeneralAvisos
        for (let i = 0; i < results.length; i++) {
            listadoGeneralAvisos = results[i];
        }
        
        io.of('/index').to(socket.id).emit('/index/listarAvisos', listadoGeneralAvisos)
    })

    /* Editar avisos */

    /* Resgitrar avisos */
});
io.of('/login').on('db', (socket)=>{

});
io.of('/administrador').on('db', (socket)=>{

});

/* SERVIDOR DE COSULTA A DB CON SOCKET PARA EL LADO CLIENTE (backend) */
io.of('/cliente').on('db', (socket)=>{

});

console.log('Servidor inicializado en puerto', app.get('port'));
console.log(db);

