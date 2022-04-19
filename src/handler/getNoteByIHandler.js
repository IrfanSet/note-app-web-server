const notes = require('../notes');
const getNoteByIdHandler = (request,h) => {
    const {id} = request.params;

    const note = notes.filter((n) => n.id === id)[0];
    switch (note !== undefined) {
        case true:
            const response = h.response({
                status : 'success',
                data : {
                    note
                }
            });
            response.code(200);
            return response;
            break;
    }
    const response = h.response({
        status : 'fail',
        message : 'Catatan tidak ditemukan'
    });
    response.code(400);
    return response;
}


module.exports = getNoteByIdHandler;

