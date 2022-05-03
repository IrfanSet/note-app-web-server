const hapi = require('@hapi/hapi');
const notes = require('./api/notes');
const NotesServices = require('./services/postgres/NotesService');
const NotesValidator = require('./validator/notes');
require('dotenv').config();

// user
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

const server = hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
        cors: {
            origin: ['*']
        }
    }
})
async function start() {
    try {
        const notesServices = new NotesServices();

        await server.register([{
            plugin: notes,
            options: {
                service: notesServices,
                validator: NotesValidator
            }
        },
        {
            plugin: users,
            options: {
                service: UsersService,
                validator: UsersValidator
            }
        }
     ]);
        await server.start();
    } catch (err) {
        console.log(err);
        process.exit(1)
    }
    console.log('Server running at ' + server.info.uri);
};
start()