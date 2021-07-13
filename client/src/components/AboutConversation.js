import React, { useContext ,useState} from 'react';
import axios from 'axios'
import {ModalContext} from '../context/ModalContext';
import { useHistory } from "react-router-dom";
import * as Mui from '../collections';
import {startNewMeet} from '../apiCalls/channelAPI';
import { createNewConversation } from '../apiCalls/conversationAPI';

{/**
    Modal opens up when the user wants to start a new meet or a new conversation on the channels screen
    
    User must enter details regarding what the conversation/meet is about.
    
    After submitting the modal, creates a new conversation/meet in the database,
    and navigates user to respective meet/ convertaion screen
*/}

const AboutConversation = (props) => {
    
    const {channelId, team, type, channel} = props;
    const history = useHistory();

    // state shared between channel page and this component (toggles the modal)
    const {showModal2, setModal2} = useContext(ModalContext);
    
    // description of conversation/meet
    const [about,setAbout] = useState('');
    const handleClose = (e) => {
        setModal2(false);
    };
    
    const handleSubmit = async(e) =>{
        const token = localStorage.getItem('token');
        
        // This is for when a user is starting a new meet
        if(props.type === 'meet'){
            try{
                    
                const res = await startNewMeet({channelId, about})
                if (res.error) {
                    alert(res.errMsg);
                    return;
                }

                // navigates user to meet screen   
                history.push({
                    pathname: '/meet',
                    state: {
                      roomId: res.roomId,
                      conversationId: res.conversationId,
                      jamboardId: res.jamboardId,
                      channelId,
                    }
                })
            }
            catch(err){
                console.log(err);
            }
        }

        // This is for when the user starts a conversation
        else if(type === 'conversation'){
            try{
                const res = await createNewConversation({channelId, about});
                if(res.err){
                    alert(res.errMsg);
                    return;
                }
                // navigates user to conversation screen 
                history.push({  
                    pathname : '/conversation', 
                    state : {
                        conversationId : res.conversation._id,
                        team : team,
                        channel : channel,
                    }
                })
            }
            catch(err){
                console.log(err);
            }
        }
        // close the modal component
        setModal2(false);
    } 

    return (
        <div>
            <Mui.Dialog 
                    open={showModal2} onClose={handleClose} 
                    aria-labelledby="form-dialog-title"
            >
                <Mui.DialogContent>
                    <Mui.DialogContentText>
                        {props.type == 'meet' ? 
                            "Tell Your Teammates What This Meet Is About!" 
                            : "Tell Your Teammates What This Conversation Is About!"
                        }
                    </Mui.DialogContentText>      
                    <br></br>
                    
                    <Mui.TextField
                        autoFocus
                        margin="dense"
                        label="About"
                        variant="outlined"
                        fullWidth
                       
                        onChange = {(e) => {setAbout(e.target.value)}}
                    />
                </Mui.DialogContent>   
                <Mui.DialogActions>      
                    <Mui.Button onClick={handleSubmit} color="primary">
                        {props.type == 'meet' ? 
                            "Create Meet" 
                            : "Create Conversation"
                        }
                    </Mui.Button>
                </Mui.DialogActions>   
            </Mui.Dialog> 
        </div>
    )
}

export default AboutConversation
