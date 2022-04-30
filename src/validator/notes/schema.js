const joi = require('joi');

const NotePayloadSchema = joi.object({
    title: joi.string().required(),
    body: joi.string().required(),
    tags: joi.array().items(joi.string()).required() 
});

module.exports = NotePayloadSchema;