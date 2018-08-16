//var socket = io();

//Obtenemos los parametros
let params = new URLSearchParams(window.location.search)

if (!params.has('nombre') || !params.has('sala') || params.get('nombre') == '' || params.get('sala') == '') {
    window.location = 'index.html'
    throw new Error('El nombre y sala son necesarios')
}

//Creamos la conexion
var socket = io();

//Obtenemos el usuario
let usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

socket.on('connect', function() {
    console.log('Conectado al servidor');

    //Le dedicomos al servidor quien soy yo
    socket.emit('entrarChat', usuario, function(resp) {
        console.log('Usuarios conectados: ', resp);
    })
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
// socket.emit('crearMensaje', {
//     usuario: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('crearMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});

//Escuchar el evento de cuando un usuario entra o sale del chat
socket.on('listaPersonas', function(personas) {
    console.log(personas);
})

//Mensaje privados
socket.on('mensajePrivado', function(mensaje) {
    console.log('Mensaje privado : ', mensaje);
})