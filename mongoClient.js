const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PersonModel = new Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    date: Date
});

module.exports = mongoClient = mongoose.model('PersonModel', PersonModel);