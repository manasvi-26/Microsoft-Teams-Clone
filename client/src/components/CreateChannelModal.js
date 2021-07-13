import React, { useContext ,useState} from 'react';
import axios from 'axios'

import {ModalContext} from '../context/ModalContext';
import {UserContext} from '../context/UserContext';
import {AlertContext} from '../context/AlertContext';

import * as Mui from '../collections';
import { createNewChannel } from '../apiCalls/channelAPI';

{/**

    Modal that allows user to enter name of the new channel.
    After submitting a new channel gets created in the team

*/}


export default function CreateChannelModal(props) {
    
    const {teamId} = props;    

    {/** Shared state to toggle modal */}
    const {showModal3, setModal3} = useContext(ModalContext);
    const {setAlert}  = useContext(AlertContext);


    const [channelName, setChannelName] = useState("")

    const handleClose = (e) => {
        setModal3(false);
    };

    {/** Creates the new Channel */}
    const handleSubmit = async(e) => {

        const newChannel = {teamId, channelName}

        try{

            const token = localStorage.getItem('token');
            // Api call to server
            let res = await createNewChannel({newChannel});
            if(res.err){
                alert(res.errMsg);
            }
        }
        catch(err){
            
            alert(err);
        }

        setModal3(false);
        window.location.reload();
    }

    return (
        <div>
            <Mui.Dialog 
                open={showModal3} 
                onClose={handleClose} 
                aria-labelledby="form-dialog-title"
            >
                
                <Mui.DialogTitle 
                    id="form-dialog-title" 
                    style={{ textAlign: "center" }}
                >
                    Create A New channel
                </Mui.DialogTitle>
                
                <Mui.DialogContent>
                   
                    <br></br>
                    
                    <Mui.TextField
                        autoFocus
                        margin="dense"
                        label="channel Name"
                        variant="outlined"
                        fullWidth
                        inputProps={{ maxLength: 20 }}
                        onChange = {(e) => {setChannelName(e.target.value)}}
                        
                    />
                    <br></br>
                    <br></br>
                    
                </Mui.DialogContent>
                    <Mui.DialogActions>
                        <Mui.Button onClick={handleClose} color="primary">
                            Cancel
                        </Mui.Button>
                        <Mui.Button onClick={handleSubmit} color="primary">
                            Create Channel
                        </Mui.Button>
                </Mui.DialogActions>
            </Mui.Dialog>
        </div>
    );
}
