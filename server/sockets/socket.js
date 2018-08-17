//Estamos trabajando del lado del servidor
const { io } = require('../server');

//Importamos la clase de usuarios
const { Usuarios } = require('../classes/usuarios')

//Importamos la utilidades
const { crearMensaje } = require('../utilidades/utilidades')

const usuarios = new Usuarios()

io.on('connection', (client) => {

    //Creamos el escuchador en el server
    client.on('entrarChat', (usuario, callback) => {

        //Creamos un nuevo usuario
        if (!usuario.nombre || !usuario.sala) {
            return callback({
                ok: false,
                mensaje: 'El nombre/sala es necesario'
            })
        }

        //Metemos al usuario a una sala
        client.join(usuario.sala)

        //Esta funcion retorna un array con todas las personas
        usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala)

        //Emitimos un evento mostrando todas las personas conectadas en esa sala
        //Agregamos un .to(sala) para mandarlo a todos las personas que estan en esa sala
        client.broadcast.to(usuario.sala).emit('listaPersonas', usuarios.getPersonasPorSala(usuario.sala))

        //Mandamos mensaje para decir que una persona se unio
        client.broadcast.to(usuario.sala).emit('crearMensaje', crearMensaje('Administrador', `${usuario.nombre} se unio al chat`))

        callback(usuarios.getPersonasPorSala(usuario.sala))
    })

    //Escuchamos cuando un usuario mande un mensaje
    client.on('crearMensaje', (data, callback) => {
        //Obtenemos la persona
        let persona = usuarios.getPersona(client.id)

        let mensaje = crearMensaje(persona.nombre, data.mensaje)

        //Mandamos el mensaje a todos los usuarios conectados
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje)

        //Regresamos el mensaje al cliente
        callback(mensaje)
    })

    //Eliminamos la duplicidad
    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id)

        //Le enviamos un mensaje a todos los usuarios de que se ha ido el usuario
        //client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} abandono el chat`))

        //Emitimos un evento mostrando todas las personas conectadas
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala))
    })

    //Mensaje privado a un cliente
    client.on('mensajePrivado', (data) => {
        //Validar que si venga la data es obligatoria
        //nombre y para
        //.....

        //Obtenemos la persona que enviara el mensaje
        let persona = usuarios.getPersona(client.id)

        //para es el id del usuario al que le queremos mandar el mensaje
        //Enviamos el mensaje
        //Para enviar un mensaje a un usuario necesitamos su id y se lo pasamos al broadcats como .to(id)
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje))
    })

});