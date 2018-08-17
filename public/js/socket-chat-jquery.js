//Obtenemos los parametros que vienen en el url
let params = new URLSearchParams(window.location.search)
var nombre = params.get('nombre')
var sala = params.get('sala')

//Referencias JQuery
var formEnviar = $("#formEnviar")
var txtMensaje = $("#txtMensaje")
var divChatBox = $("#divChatbox")



//Funciones para renderizar usuarios
function renderizarUsuarios(personas) { //[{},{},{}]
    console.log(personas);

    let html = '<li>' +
        '<a href="javascript:void(0)" class="active"> Chat de <span> ' + sala + '</span></a>' +
        '</li>'

    //Agregamos las personas al chat
    for (let i = 0; i < personas.length; i++) {
        html += '<li>' +
            '<a data-id="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + '<small class = "text-success" > online </small></span></a>' +
            '</li>'
    }

    //Agregamos loa datos al div
    $('#divUsuarios').html(html)
}

//Creamos una funcion para renderizar los mensaje
function renderizarMensajes(mensaje, yo) {

    let html = ''
    var fecha = new Date(mensaje.fecha)
    var hora = fecha.getHours() + ':' + fecha.getMinutes()
    var adminInfo = 'info'
    if (mensaje.nombre === 'Administrador') {
        adminInfo = 'danger'
    }


    if (yo) {
        html = '<li class="reverse">' +
            '<div class="chat-content">' +
            '<h5>' + mensaje.nombre + '</h5>' +
            '<div class="box bg-light-inverse">' + mensaje.mensaje + '</div>' +
            '</div>' +
            '<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>' +
            '<div class="chat-time">' + hora + '</div>' +
            '</li>'
    } else {
        html += '<li class="animated fadeIn">'

        if (mensaje.nombre !== 'Administrador') {
            html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>'
        }
        html += '<div class="chat-content">'
        html += '<h5>' + mensaje.nombre + '</h5>'
        html += '<div class="box bg-light-' + adminInfo + '">' + mensaje.mensaje + '</div>'
        html += '</div>'
        html += '<div class="chat-time">' + hora + '</div>'
        html += '</li>'
    }

    divChatBox.append(html)
}


//Funcion del scroll
function scrollBottom() {

    // selectors
    var newMessage = divChatBox.children('li:last-child');

    // heights
    var clientHeight = divChatBox.prop('clientHeight');
    var scrollTop = divChatBox.prop('scrollTop');
    var scrollHeight = divChatBox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatBox.scrollTop(scrollHeight);
    }
}

//Listener escuchar cuando se de click en cualquier etiqueta a de divUsuarios
$('#divUsuarios').on('click', 'a', function() {
    //Accedemos al elemento con this
    var id = $(this).data('id')

    if (id) {
        console.log(id);
    }
})

formEnviar.on('submit', function(e) {
    e.preventDefault()

    //Checamos que no  mande texto vacio
    if (txtMensaje.val().trim().length === 0) {
        return
    }

    // Enviar información
    socket.emit('crearMensaje', {
        usuario: nombre,
        mensaje: txtMensaje.val()
    }, function(mensaje) {
        //Limpiamos el txtMensaje
        txtMensaje.val('').focus()
        renderizarMensajes(mensaje, true)
        scrollBottom()
    });
})