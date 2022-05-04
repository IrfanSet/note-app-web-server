const hapi = require('@hapi/hapi');
const notes = require('./api/notes');
const NotesServices = require('./services/postgres/NotesService');
const NotesValidator = require('./validator/notes');
require('dotenv').config();
const Jwt = require('@hapi/jwt');

// user
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

// authentications
const Authentications = require('./api/authentications');
const AuthenticationService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications')

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
        const usersService = new UsersService();
        const authenticationService = new AuthenticationService()

        await server.register([
            {
                plugin: Jwt
            },
        ]);
        server.auth.strategy('notesapp_jwt', 'jwt', {
            keys: process.env.ACCESS_TOKEN_KEY,
            verify: {
              aud: false,
              iss: false,
              sub: false,
              maxAgeSec: process.env.ACCESS_TOKEN_AGE,
            },
            validate: (artifacts) => ({
              isValid: true,
              credentials: {
                id: artifacts.decoded.payload.id,
              },
            }),
          });

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
                    service: usersService,
                    validator: UsersValidator
                }
            },
            {
                plugin: Authentications,
                options: {
                    authenticationService,
                    usersService,
                    TokenManager,
                    AuthenticationsValidator
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