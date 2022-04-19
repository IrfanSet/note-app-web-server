const notes = require('../notes');

const deleteNoteByIdHandler = (request, h) => {
    const {id} = request.params;

    const index = notes.findIndex((note) => note.id === id);
    
    switch (index !== -1) {
        case true:
            notes.splice(index,1);
            const response = h.response({
                status : 'success',
                message: 'Catatan Berhasil Dihapus', 
            });
            response.code(200);
            return response;
            break;
    
        default:
            return h.response({
                status : 'fail',
                message : 'Catatan gagal dihapus, data tidak ditemukan!'
            }).code(400);
            break;
    }
}

module.exports = deleteNoteByIdHandler;