const ClientError = require("../../exceptions/ClientError");
const { instance } = require("../../validator/notes/schema");

class NotesHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postNoteHandler = this.postNoteHandler.bind(this);
        this.getNotesHandler = this.getNotesHandler.bind(this);
        this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
        this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
        this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
    }

    async postNoteHandler(request, h) {
        try {
            this._validator.validateNotePayload(request.payload);
            const {
                title = 'untitled', body, tags
            } = request.payload;

            const { id: credentialId } = request.auth.credentials;
            console.log({
                title,
                body,
                tags,
                credentialId
            });
            return false;
            const noteId = await this._service.addNote({
                title,
                body,
                tags,
                credentialId
            });

            const response = h.response({
                status: 'success',
                message: 'Catatan berhasil ditambahkan',
                data: {
                    noteId,
                },
            });
            response.code(201);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            // server error
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.'
            })

            response.code(500);
            console.log(error);
            return response;
        }
    }

    async getNotesHandler(request, h) {
        const {id:credentialId} = request.auth.credentials;
        const notes = await this._service.getNotes(credentialId);
        const response = h.response({
            status: 'success',
            data: {
                notes
            }
        });
        response.code(200);
        return response;
    }

    async getNoteByIdHandler(request, h) {
        try {
            const {
                id
            } = request.params;
            const {id:credentialId} = request.auth.credentials;
            await this._service.verifyNoteOwner(id, credentialId);

            const note = await this._service.getNoteById(id);
            return {
                status: 'success',
                data: {
                    note,
                },
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            // server error
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.'
            })

            response.code(500);
            console.error(error);
            return response;
        }
    }

    async putNoteByIdHandler(request, h) {
        try {
            this._validator.validateNotePayload(request.payload);
            const {
                id
            } = request.params;
            const {id:credentialId} = request.auth.credentials;
            await this._service.verifyNoteOwner(id, credentialId);

            await this._service.editNoteById(id, request.payload);

            return {
                status: 'success',
                message: 'Catatan berhasil diperbarui',
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }
            // server error
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.'
            })

            response.code(500);
            console.error(error);
            return response;
        }
    }

    async deleteNoteByIdHandler(request, h) {
        try {
            const {
                id
            } = request.params;
            
            const {id:credentialId} = request.auth.credentials;
            await this._service.verifyNoteOwner(id, credentialId);

            await this._service.deleteNoteById(id);
            return {
                status: 'success',
                message: 'Catatan berhasil dihapus',
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: 'Catatan gagal dihapus. Id tidak ditemukan',
                });
                response.code(404);
                return response;
            }
            // server error
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.'
            })

            response.code(500);
            console.error(error);
            return response;
        }
    }
}

module.exports = NotesHandler;