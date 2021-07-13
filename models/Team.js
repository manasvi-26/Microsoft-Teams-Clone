const mongoose = require('mongoose');
const Schema = mongoose.Schema

{/*
    Team Collection Schema
*/}


const TeamSchema = new Schema({

    users : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    ],
    channels : [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'channels'  
        }
    ],

    channels : [

        {
            channelId : { type: mongoose.Schema.Types.ObjectId,ref: 'channels' },
            channelName : String
        
        }
    ],


    teamName : {
        type : String,
        Required : true
    },

    description :{
        type: String
    }

});

module.exports = User = mongoose.model('Teams', TeamSchema);