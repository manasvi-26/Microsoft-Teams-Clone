import React from 'react'
import moment from 'moment'
import { useHistory } from "react-router-dom";
import * as Mui from '../collections'

{/**
    Conversation Card : Gives an overview about specified conversation
    
    Details provided :  
    Username who started conversation,
    Date the conversation was created,
    What the conversation is about

    Onclicking "show more", navigates user to conversation page, 
    where they can continue the conversation

    **NOTE** : conversation card also exists for chats that happened in meets

*/}


const ConversationCard = (props) => {

    const history = useHistory();   
    const conversation = props.conversation;
    const channel = props.channel;
    const team = props.team;

    // navigates user to respective conversation page
    const goToConversation = () =>{

        history.push({  
            pathname : '/conversation', 
            state : {
                conversationId : conversation.conversation._id,
                team : team,
                channel : channel
            }
        })
    }
    
    return (
        <Mui.Grid container spacing={3} justify="center">
            <Mui.Grid item xs={8} >
            <Mui.Paper 
                elevation={10} 
                style={{ height: '180px', padding: '5px' }}
            >
                {/** Header of Card */}
                <Mui.Typography 
                    variant="h7" 
                    style={{ fontWeight: 'bold', marginLeft: '10px' }}
                >
                    {conversation.user.firstName} {conversation.user.lastName}
                </Mui.Typography>
                <Mui.Typography 
                    variant="h7" 
                    style={{ fontWeight: 'bold', 
                            marginRight: '10px', float: 'right' 
                    }}
                >
                    {new Date(conversation.conversation.timeStamp).toLocaleDateString()}

                </Mui.Typography>
                
                <br></br>
                
                <Mui.Typography variant="h7" style={{ marginLeft: '10px' }}>
                    Started A Conversation
                </Mui.Typography>
                
                {/** Body Of Card */}
                <div 
                    style={{ 
                        height: '60px', backgroundColor: '#010334', 
                        marginTop: '10px', borderRadius: 2 
                    }}
                >
                    <Mui.Typography 
                        variant="h6" 
                        style={{ 
                                fontWeight: 'bold', 
                                marginLeft: '10px', color: 'white' 
                        }}
                    >
                        About : {conversation.conversation.about}
                    </Mui.Typography>
                </div>
                
                {/** Footer of Card */}
                <div 
                    style={{ 
                                display: 'flex', justifyContent: 'center', 
                                alignItems: 'center' 
                    }}
                >
                    <Mui.Button
                        variant="contained"
                        color="primary"
                        size="medium"
                        style={{ marginTop: '15px', backgroundColor: "#010334"}}
                        onClick ={goToConversation}                    
                    >
                        SHOW MORE
                    </Mui.Button>
                </div>
            </Mui.Paper>
            </Mui.Grid>
            
            <Mui.Grid item xs={12}></Mui.Grid>
            <Mui.Grid item xs={12}></Mui.Grid>
            <Mui.Grid item xs={12}></Mui.Grid>

        </Mui.Grid>
    )
}

export default ConversationCard

