const mongoose = require('mongoose');
const Schema = mongoose.Schema

{/*
    Channel Collection Schema
*/}

const ChannelSchema = new Schema({

    teamId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teams'
    },
    
    channelName : {

        type : String
    },

    conversations : [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'conversations'  ,
          default : []
        }
    ],

    currentMeet : {
        
        isMeet : {type:Boolean, default : false},
        roomId : String,
        conversationId : String,
        jamboardId : String
    }

});

module.exports = User = mongoose.model('Channel', ChannelSchema);