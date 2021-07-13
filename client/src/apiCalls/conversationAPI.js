import axios from 'axios'
import { v1 as uuid } from "uuid";


{/**
  DESCRIPTION: create a new conversation
  METHOD: POST
  BODY: Object {channelId , about (description of converstaion)}
  HEADER : JWT token
  RETURN VALUE: Conversation object
*/}

export const createNewConversation = async({ channelId, about }) => {

    const token = localStorage.getItem('token')
    
    try {
        const res = await axios.post('/api/conversation/createConversation', 
                                        { channelId, about }, 
                                        { headers: { 'x-auth-token': token } }
                                    )
        return { conversation: res.data.conversation, error: false }
        
    }
    catch (err) {
        return { error: true, errMsg: err }
    }
}