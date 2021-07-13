const mongoose = require('mongoose');
const Schema = mongoose.Schema

{/*
    User Collection Schema
*/}


const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName : {
        type: String,
        required: true,
    },
    lastName :{
        type: String,
        required: true,
    },
    teams : [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'teams',
            default: []
    }], 
    
});

module.exports = User = mongoose.model('User', UserSchema);