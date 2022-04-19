const addNoteHandler = require('./handler/addNoteHandler');
const getAllNotesHandler = require('./handler/getAllNotesHandler');
const getNoteByIdHandler = require('./handler/getNoteByIHandler');
const editNoteByIdHandler = require('./handler/editNoteByIdHandler');
const deleteNoteByIdHandler = require('./handler/deleteNoteByIdHandler');


const route = [{
        path: '/notes',
        method: 'POST',
        handler: addNoteHandler
    },
    {
        path: '/notes',
        method: 'GET',
        handler: getAllNotesHandler
    },
    {
        path: '/notes/{id}',
        method: 'GET',
        handler: getNoteByIdHandler
    },
    {
        path: '/notes/{id}',
        method: 'PUT',
        handler: editNoteByIdHandler
    },
    {
        path: '/notes/{id}',
        method: 'DELETE',
        handler: deleteNoteByIdHandler
    }
];

module.exports = route;