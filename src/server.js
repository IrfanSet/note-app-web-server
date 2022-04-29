const hapi = require('@hapi/hapi');
const notes = require('./api/notes');
const NotesServices = require('./services/inMemory/NotesService');

const server = hapi.server({
    port : 5000,
    host : process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
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
                service: notesServices
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