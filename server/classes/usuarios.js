//Creamos una clase Usuarios

class Usuarios {

    constructor() {
        this.personas = []
    }

    //Creamos una funcion para agregar personas al chat
    agregarPersona(id, nombre, sala) {
        let persona = { id, nombre, sala }

        //Agregamos la persona al array de personas
        this.personas.push(persona)

        return this.personas //Regresamos todas las personas
    }

    //Obtenemos una persona
    getPersona(id) {
        let persona = this.personas.filter(persona => persona.id === id)[0] //[0] -> regresamos la primera posicion del array
        return persona
    }

    //Obtener todas las personas
    getPersonas() {
        return this.personas
    }

    //Obtenemos todas las personas que estan en la sala
    getPersonasPorSala(sala) {
        //...
        let personasPorSala = this.personas.filter(persona => persona.sala == sala)
        return personasPorSala
    }

    //Eliminamos personas del chat
    borrarPersona(id) {
        //Obtenemos la persona que sera borrada
        let personBorrada = this.getPersona(id)

        //Con filter regresamos un array con todas las personas menos la de este id
        this.personas = this.personas.filter(persona => persona.id != id)

        return personBorrada //Regresamos la persona eliminada
    }
}



module.exports = {
    Usuarios
}