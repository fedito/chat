const { io } = require('../server');
const { Usuarios } = require('../classes/users')
const { crearMensaje } = require('../utilities/utilities');

const usuarios = new Usuarios;

io.on('connection', (client) => {

    console.log('Usuario conectado');

    client.on('entrarChat', (data, callback) => {

        if (!data.nombre || !data.sala) {
            return {
                error: true,
                mensaje: 'El nombre o sala son necesarios'
            }
        };

        client.join(data.sala);

        usuarios.agregarPersona(client.id, data.nombre, data.sala)
        client.broadcast.to(data.sala).emit('listarPersonas', usuarios.getPersonasPorSala(data.sala));
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('', `${data.nombre} entro al chat`));
        callback(usuarios.getPersonasPorSala(data.sala));

    });

    client.on('crearMensaje', (data, callback) => {

        let persona = usuarios.getPersona(client.id)

        let mensaje = crearMensaje(persona.nombre, data.mensaje);

        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);


        callback(mensaje);
    })

    client.on('disconnect', () => {

        let personaBorrada = usuarios.borrarPersona(client.id);

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('', `${personaBorrada.nombre} abandono el chat`));
        client.broadcast.to(personaBorrada.sala).emit('listarPersonas', usuarios.getPersonasPorSala(personaBorrada.sala));
    });

    client.on('mensajePrivado', data => {
        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });
});