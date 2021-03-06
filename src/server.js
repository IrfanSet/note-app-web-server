const hapi = require('@hapi/hapi');
const notes = require('./api/notes');
const NotesServices = require('./services/postgres/NotesService');
const NotesValidator = require('./validator/notes');
require('dotenv').config();
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');

// user
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

// authentications
const Authentications = require('./api/authentications');
const AuthenticationService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

// collaborations
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const collaboartionsValidator = require('./validator/collaborations');

//exports
const _exports = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports')

// uploads
const uploads = require('./api/uploads');
const StorageService = require('./services/storage/StorageService');
const UploadsValidator = require('./validator/uploads');

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
        const collaborationsService = new CollaborationsService()
        const notesServices = new NotesServices(collaborationsService);
        const usersService = new UsersService();
        const authenticationService = new AuthenticationService();
        const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'));


        await server.register([{
                plugin: Jwt
            },
            {
                plugin: Inert,
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
                    tokenManager: TokenManager,
                    validator: AuthenticationsValidator
                }
            },
            {
                plugin: collaborations,
                options: {
                    collaborationsService,
                    usersService,
                    validator: collaboartionsValidator
                }
            },
            {
                plugin: _exports,
                options: {
                    service: ProducerService,
                    validator: ExportsValidator
                }
            },
            {
                plugin: uploads,
                options: {
                    service: storageService,
                    validator: UploadsValidator,
                },
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