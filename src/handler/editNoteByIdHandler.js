const { response } = require('@hapi/hapi/lib/validation');
const notes = require('../notes');

const editNoteByIdHandler = (request, h) => {
    const {id} = request.params;

    const {title, tags, body} = request.payload;
    const updatedAt = new Date().toISOString();

    const index = notes.findIndex((notes) => notes.id ===id);

    switch (index !== -1) {
        case true:
            notes[index] = {...notes[index], title, tags, body, updatedAt
            }

            const response = h.response({
                status : 'success',
                message : 'Catatan Berhasil Diperbarui!'
            })
            response.code(200);
            return response;
            break;
    
        default:
            return h.response({
                status : 'fail',
                message: 'Gagal memperbarui catatan. data tidak ditemukan!'
            }).code(400);
            break;
    }
}

module.exports = editNoteByIdHandler;