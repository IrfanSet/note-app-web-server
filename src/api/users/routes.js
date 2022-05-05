const {
    handler
} = require("@hapi/hapi/lib/cors");

const routes = (handler) => [{
        method: 'POST',
        path: '/users',
        handler: handler.postUserHandler
    },
    {
        method: 'GEt',
        path: '/users/{id}',
        handler: handler.getUserByIdHandler
    },
    {
        method: 'GET',
        path: '/users',
        handler: handler.getUsersByUsernameHandler,
    },
]

module.exports = routes;