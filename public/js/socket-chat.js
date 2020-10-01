let socket = io();

let params = new URLSearchParams(window.location.search);


if (!params.has('name') || !params.has('room')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesario');
};

let user = {
    name: params.get('name'),
    room: params.get('room')
};

socket.on('connect', () => {
    console.log('Conectado al servidor');
    socket.emit('entrarChat', user, resp => {
        console.log('Usuarios conectados', resp);
    });
});

// escuchar
socket.on('disconnect', () => {

    console.log('Perdimos conexión con el servidor');

});

// Escuchar información
socket.on('createMessage', message => {
    console.log(message);
});

socket.on('listPeople', people => {
    console.log(people);
});

socket.on('privateMessage', mensaje => {
    console.log(mensaje);
});