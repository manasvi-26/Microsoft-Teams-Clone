const Channel = require('../models/Channel');
const Conversation = require('../models/Conversation');
const User = require('../models/User')

{/**
    CREATE A NEW CONVERSATION IN SPECIFIED CHANNEL
*/}

exports.createConversation = async(req,res) => {

    const {channelId, about , user} = req.body;
    const newConversation = {
        channelId,
        about,
        createdBy : user._id
    }
    
    try{

        //create new conversation
        const conv = await new Conversation(newConversation).save();
        
        //push conversation to channel's conversation list
        const channel = await Channel.findOne({"_id" : channelId});
        if(channel.conversation == null)channel.conversations = []
        channel.conversations.push(conv.Id)

        //save changes
        await channel.save()

        return res.status(200).json({
            message : 'Conversation Has been created!',
            conversation : conv
        })

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message : 'Something went wrong, Please try again'
        })
    }
}

{/**
    GET CONVERSATION DATA
*/}

exports.getConversation = async(req,res) =>{

    const {conversationId} = req.body;

    try{
        
        //find conversation in the db using its mongoDB id
        const conversation = await Conversation.findOne({"_id" : conversationId});
        return res.status(200).json({
            conversation 
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message : 'Something went wrong, Please try again'
        })
    }
}


{/**
    Utility function for socket code when client sends a message.
    ADD MESSAGE TO SPECIFIED CONVERSATION DB

*/}

exports.addMessage = async({message, conversationId}) => {
    
    try{
        //Find conversation and push the new message to ist messages list 
        const conversation = await Conversation.findById(conversationId)
        conversation.messages.push(message);

        const conv = await conversation.save()
    }

    catch(err){

        console.log(err);
    }   
}



{/*
    GET ALL CONVERSATIONS IN A CHANNEL
*/}

exports.getAllConversations = async(req,res) => {
    
    try{
        //find the conversations
        const {channelId} = req.body;
        const conversations = await Conversation.find({"channelId" : channelId})

        //get users list who created the channels
        const userIds = conversations.map(conv => conv.createdBy);        
        const users = await User.find({_id : {"$in" : userIds}});

        
        res.status(200).json({
            conversations,
            users,
        })
    }
    
    catch(err){
        return res.status(500).json({  
            message : 'Something went wrong, Please try again'
        })
    }
}
