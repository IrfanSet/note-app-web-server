const {
    nanoid
} = require('nanoid');
const {
    Pool
} = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const mapDBToModel = require('../../utils');

class NotesServices {
    constructor() {
        this._pool = new Pool;
    }

    async addNote({
        title,
        body,
        tags
    }) {

        const id = nanoid(16);
        const created_at = new Date().toISOString();
        const updated_at = created_at;

        const query = {
            text: 'insert into notes values($1, $2, $3, $4, $5, $6) returning id',
            values: [id, title, body, tags, created_at, updated_at]
        }

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Catatan gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getNotes() {
        const result = await this._pool.query('select * from notes');
        console.log(result.rows.map(mapDBToModel));
        return result.rows.map(mapDBToModel);
    }

    async getNoteById(id) {
        const query = {
            text: 'select * from notes where id = $1',
            values: [id]
        }

        const result = await this._pool.query(query);
        
        if (!result.rows.length) {
            throw new NotFoundError('Catatan tidak ditemukan.')
        }

        return result.rows.map(mapDBToModel)[0];
    }

    async editNoteById(id, {title, tags, body}) {
        const updatedAt = new Date().toISOString();

        const query = {
            text: 'update notes set title=$1, body=$2, tags=$3, updated_at=$4 where id=$5 returning id',
            values: [title, body, tags, updatedAt, id]
        }

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Gagal mempebarui catatan. Id tidak ditemukan')
        }
        // return result.rows[0].id;
    }

    async deleteNoteById(id){
        const query = {
            text: 'delete from notes where id=$1 returning id',
            values: [id]
        }

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan');
        }
        // return result.rows[0].id;
    }
}

module.exports = NotesServices;