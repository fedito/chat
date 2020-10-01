const { io } = require('../server');
const { Users } = require('../classes/users')
const { createMessage } = require('../utilities/utilities');

const users = new Users;

io.on('connection', (client) => {

    console.log('Usuario conectado');

    client.on('entrarChat', (data, callback) => {

        if (!data.name || !data.room) {
            return {
                error: true,
                message: 'El nombre o sala son necesarios'
            }
        };

        client.join(data.room);

        users.addPerson(client.id, data.name, data.room)
        client.broadcast.to(data.room).emit('listPeople', users.getPeoplePerRoom(data.room));

        callback(users.getPeoplePerRoom(data.room));

    });

    client.on('createMessage', (data) => {

        let person = users.getPerson(client.id)

        let message = createMessage(person.name, data.message);

        client.broadcast.to(person.room).emit('createMessage', message);
    })

    client.on('disconnect', () => {

        let deletedPerson = users.deletePerson(client.id);

        client.broadcast.to(deletedPerson.room).emit('createMessage', createMessage('Admin', `${deletedPerson.name} abandono el chat`));
        client.broadcast.to(deletedPerson.room).emit('listPeople', users.getPeoplePerRoom(deletedPerson.room));
    });

    client.on('privateMessage', data => {
        let person = users.getPerson(client.id);
        client.broadcast.to(data.for).emit('privateMessage', createMessage(person.name, data.message));
    });
});