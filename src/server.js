const hapi = require('@hapi/hapi');
const notes = require('./api/notes');
const NotesServices = require('./services/postgres/NotesService');
const NotesValidator = require('./validator/notes');
require('dotenv').config();

const server = hapi.server({
    port : process.env.PORT,
    host : process.env.HOST,
    routes: {
        cors: {
            origin: ['*']         
        }
    }
})
async function start() {
    try{
        const notesServices = new NotesServices();

        await server.register({
            plugin: notes,
            options: {
                service: notesServices,
                validator: NotesValidator
            } 
        });
        await server.start();
    } catch(err) {
        console.log(err);
        process.exit(1)
    }
    console.log('Server running at ' + server.info.uri);
};
start()