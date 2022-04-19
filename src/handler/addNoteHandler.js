const {
    nanoid
} = require("nanoid");
const notes = require('../notes');

const addNoteHandler = (request, h) => {
    const {
        title,
        tags,
        body
    } = request.payload

    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const newnote = {
        id,
        title,
        tags,
        body,
        createdAt,
        updatedAt
    }

    notes.push(newnote);

    const isSucces = notes.filter((note) => note.id === id).length > 0;
    // return h.response(isSucces);
    switch (isSucces) {
        case true:
            const response = h.response({
                status: 'success',
                message: 'Catatan berhasil ditambahkan',
                data: {
                    noteId: id
                }
            })
            response.code(201);
            return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal ditambahkan'
    })
    response.code(500);
    return response;
}

module.exports = addNoteHandler;