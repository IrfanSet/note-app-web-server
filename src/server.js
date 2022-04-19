const hapi = require('@hapi/hapi');
const route = require('./route');


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
        server.route(route);
        await server.start();
    } catch(err) {
        console.log(err);
        process.exit(1)
    }
    console.log('Server running at ' + server.info.uri);
};
start()