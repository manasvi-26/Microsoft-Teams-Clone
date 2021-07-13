import React, { useEffect ,useContext, useState} from 'react'
import axios from 'axios';
import {ModalContext} from '../context/ModalContext';

import * as Mui from '../collections'

{/**

    Chat modal : Modal displaying the chats happening in the ongoing meet
    User can send realtime messages to the members in the meet. 
    Messages are displayed along with username and time of sending.
    Chats can be accessed even after the meet ends.

*/}

// Allows the modal to be a draggable component 
function PaperComponent(props) {
    return (
      <Mui.Draggable 
        handle="#draggable-dialog-title" 
        cancel={'[class*="MuiDialogContent-root"]'}
      >
        <Mui.Paper {...props} />
      </Mui.Draggable>
    );
}

// Message object that is displayed in the modal.
// Contains username and time of sending.
const Message = ({message}) => {
    console.log(message)
    return(

        <Mui.Paper 
            elevation={0} 
            // Handles word wrapping
            style={{ wordWrap: "break-word" ,margin:'10px',
                     marginBottom:'40px' ,padding:'5px'}}
        >
            <div style={{width:'100%'}}>
                <Mui.Typography variant="h7" style={{fontWeight:'bold'}}>
                    {message.userName}
                </Mui.Typography>
                <Mui.Typography variant="h7" style={{float:'right'}}>
                    {new Date(message.timeStamp).toLocaleTimeString()}
                </Mui.Typography>
            </div>
            <Mui.Divider/>
            <Mui.Typography>{message.content}</Mui.Typography>
        </Mui.Paper>
    )
      
}

// Modal component which contains 
// list of messages and a text field to send new message

const ChatModal = (props) => {

    let {user , allMessages} = props;
    const {showModal, setModal} = useContext(ModalContext);
    const [message, setMessage] = useState("");
    
    // Closes the modal ( state shared with the meet page)
    const handleClose = (e) => {
        setModal(false);
    };

    // Function for user to send a message
    const send = (e) => {
        
        const newMessage = {
            userId : user._id,
            userName : user.firstName + " " + user.lastName,
            content : message,
            timeStamp : new Date()
        }

        // SendMessage is a function in the parent component (Meet page) 
        
        // On calling the function and passing the new Message in this component, 
        // the parent component sends the message to the server
        props.sendMessage(newMessage);

        allMessages.push(newMessage);
        setMessage("");
    }
    
    return (

        <div>
            <Mui.Dialog
                onClose={handleClose} 
                open={showModal} 
                PaperComponent={PaperComponent}
                style={{maxHeight : '500px', maxWidth:'500px'}}
            >
                
            {/** header */}
            <Mui.DialogTitle style={{ cursor: 'move' }}
                id="draggable-dialog-title"
            >
                <Mui.Typography 
                    variant="h5" 
                    style={{textAlign:'center', fontWeight:'bold'}}
                >
                    CHAT
                </Mui.Typography>
            </Mui.DialogTitle>

            {/** Body  */}
            {!user || !allMessages? "" :
                  
                <Mui.DialogContent>

                    {/** Displays list of all the messages in the meet */}
                    {allMessages.map((message) => {
                        return(
                            <Message message={message}/>
                        )
                    })}

                    
                    {/** Text field to send your message */}
                    <Mui.TextField
                        margin="dense"
                        variant="outlined"
                        label="your message"
                        value = {message}
                        multiline
                        fullWidth
                        autoFocus
                        onChange = {(e) => {setMessage(e.target.value)}}
                        InputProps={{endAdornment: 
                                        <Mui.IconButton onClick={send}>
                                            <Mui.SendIcon/>
                                        </Mui.IconButton>
                        }}
                    />
                </Mui.DialogContent>
            }

            </Mui.Dialog>
        </div>
    
    )
}

export default ChatModal
