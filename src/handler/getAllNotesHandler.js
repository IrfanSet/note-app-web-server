const notes = require('../notes');

const getAllNotesHandler = () => ({
    status : 'success',
    data : {
        notes
    }
});

module.exports = getAllNotesHandler;