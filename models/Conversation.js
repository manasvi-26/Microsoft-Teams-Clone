const mongoose = require('mongoose');
const Schema = mongoose.Schema

{/*
    Conversation Collection Schema
*/}

const ConversationSchema = new Schema({

    channelId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teams'
    },

    timeStamp: { 

        type: Date, 
        default: Date.now
    },

    about : {
        type : String,
    },

    createdBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },

    messages : {

        type : [{
            
            userId : {type: mongoose.Schema.Types.ObjectId,ref: 'users'},
            userName : String,
            content : String,
            timeStamp : String
            
        }],
        
        default : []
    }

});

module.exports = User = mongoose.model('Conversation', ConversationSchema);