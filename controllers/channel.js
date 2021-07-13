const Channel = require('../models/Channel');
const Team = require('../models/Team');
const Conversation = require('../models/Conversation');

//INSERT NEW CHANNEL INTO A TEAM

exports.createNewChannel = async(req,res) =>{

    //get teamId in which channel is to be added ,and the new channel's name
    const {teamId, channelName} = req.body;

    console.log(teamId, channelName);
    const newChannel = {
        teamId,
        channelName
    }

    try{
        //add channel to db
        const channel = await new Channel(newChannel).save()

        //add the channel to teams list
        await Team.updateOne({_id : teamId}, {$push : {channels : {channelId : channel._id, channelName}}})

        return res.status(200).json({
            message : 'Channel has been created!',
            channel
        })
    }
    catch(err){

        return res.status(500).json({
            message : 'Something went wrong, Please try again',
            error : err
        })
    }
}



//GET REQUESTED CHANNEL'S DATA


exports.getChannel = async(req, res) => {
    const {channelId} = req.body

    try{
        //find requested channel 
        const channel = await Channel.findById(channelId)
        if(!channel)
        {
            // 409 error code : requested channel not found
            return res.status(409).json({
                message: "Channel doesn't exist"
            })
        }

        return res.status(200).json({
            channel
        })
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).json({
            message: "Something went wrong!"
        })
    }
}



//START A NEW MEET IN SPECIFIED CHANNEL


exports.startMeet = async(req,res) => {

    //roomId(meet room) , jamboardId(whiteboard) : unique id created using uuid in client side
    //channelId : channel where meet is started
    const {roomId, channelId, jamboardId ,about, user} = req.body 
    
    try{
        //get channel 
        const channel = await Channel.findById(channelId)
        if(!channel)
        {
            return res.status(409).json({
                message: "Channel doesn't exist"
            })
        }

        //create the meet 
        channel.currentMeet.isMeet = true
        channel.currentMeet.roomId = roomId
        channel.currentMeet.jamboardId = jamboardId

            
        //create a new conversation which will be linked to the meet's chat
        const newConversation = {
            channelId,
            about,
            createdBy : user._id
        }

        //save the new conversation thread
        const conv = await new Conversation(newConversation).save();
        
        //push it to the channels conversation list
        channel.conversations.push(conv._id);

        // link the newly created conversation thread to the meet
        channel.currentMeet.conversationId = conv._id
        
        //save the new meet information in the channel db
        await channel.save()

        return res.status(200).json({
            roomId: roomId,
            conversation : conv,
            jamboardId,
        })
    }
    catch(err){

        return res.status(500).json({
            message : 'Something went wrong, Please try again'
        })    
    }

}


//END MEET IN SPECIFIED CHANNEL


exports.endMeet = async(req,res) => {

    const {channelId} = req.body
    
    try{
        let channel = await Channel.findById(channelId)

        if(!channel){
            return res.status(409).json({
                message : "Channel doesnt exist"
            })
        }

        //nullify all meet information in the channel
        channel.currentMeet.isMeet = false;
        channel.currentMeet.roomId = ""; 
        
        {/* **NOTE** : conversation can still be accesed after the meet*/}
        channel.currentMeet.conversationId = "";      
        channel.currentMeet.jamboardId = "";

        
        //save the changes
        await channel.save()
        console.log("end meet")

        return res.status(200).json({
            message : "success"
        })
    }
    catch(err){
        
        return res.status(500).json({
            message : 'Something went wrong, Please try again'
        })

    }
}


