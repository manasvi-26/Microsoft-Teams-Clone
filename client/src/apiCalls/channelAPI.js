import axios from 'axios'
import { v1 as uuid } from "uuid";


{/**
  DESCRIPTION: get data of specified channel
  METHOD: POST
  BODY: Channel ID
  RETURN VALUE: Channel Object
*/}

export const getChannelData = async ({ channelId }) => {
  
  try {

    const res = await axios.post('/api/channel/getChannel', { channelId })
    return { channel: res.data.channel, error: false }

  }
  catch (err) {
    return { error: true, errMsg: err }
  }
}

{/**
  DESCRIPTION: gets all conversations of specified channel
  METHOD: POST
  BODY: Channel ID
  RETURN VALUE: list of conversations
*/}

export const getAllConversations = async ({ channelId }) => {

  try {

    const res = await axios.post('/api/conversation/getAllConversations',
                                 { channelId }
                                )

    // all the conversations in the channel
    const convs = res.data.conversations;
    // User details who created the channels
    const users = res.data.users;


    var conversations = []

    //map each conversation to the users who created the conversation
    users.map((user, idx) => {
      convs.map((conv) => {
        if (user._id == conv.createdBy) {

          // obj contains conversation data and details of user who created it
          const obj = {
            conversation: conv,
            user: {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email
            }
          }
          conversations.push(obj);
        }
      })
    })

    console.log(conversations);
    return { conversations , error: false }

  }
  catch (err) {
    return { error: true, errMsg: err }
  }

}

{/**
  DESCRIPTION: starts a new meet in specified channel
  METHOD: POST
  BODY:{
        roomId (unique id where meet will take place)
        jamboardId (unique id where users in the meet can use a whiteboard to collaborate)
        channelId
        about ( descreption of the meet )
      }
  RETURN VALUE: Object {roomId,jamboardId, conversationId(created for chatting in the meet)}
*/}

export const startNewMeet = async ({ channelId, about }) => {

  
  try {

    const roomId = uuid();
    const jamboardId = uuid();
    const token = localStorage.getItem('token')
    const res = await axios.post( '/api/channel/startMeet', 
                                  { roomId, channelId, jamboardId, about }, 
                                  { headers: { 'x-auth-token': token } }
                                )

    return  { 
              roomId: res.data.roomId, 
              jamboardId: res.data.jamboardId, 
              conversationId: res.data.conversation._id, 
              error: false
            }

  }
  catch (err) {
    return { error: true, errMsg: err }
  }
}


{/**
  DESCRIPTION: create a new channel
  METHOD: POST
  BODY: Object of new channel 
  HEADER : JWT token
  RETURN VALUE: List of Members
*/}

export const createNewChannel = async({newChannel}) => {
  const token = localStorage.getItem('token')

  try{
  
    await axios.post(
                      '/api/channel/createNewChannel' , 
                      newChannel,  
                      {headers : {'x-auth-token': token}}
                    );

    return { error: false};

  }
  catch(err){
    return { error: true, errMsg: err }
  }

}