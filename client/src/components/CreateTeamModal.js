import React, { useContext ,useState} from 'react';
import axios from 'axios'

import * as Mui from '../collections'

import {ModalContext} from '../context/ModalContext';
import {UserContext} from '../context/UserContext';
import {AlertContext} from '../context/AlertContext';
import {createNewTeam} from '../apiCalls/teamAPI';
import ErrorAlert from './ErrorAlert'

{/**

    Modal that allows user to enter name and brief description of the new team.
    After submitting a new team gets created and the user is now part of it.

*/}


export default function CreateTeamModal() {

    {/** Shared state to toggle Modal */}
    const {showModal, setModal} = useContext(ModalContext);
    const {setUserData} = useContext(UserContext);
    const {setAlert}  = useContext(AlertContext);


    const [teamName, setTeamName] = useState("")
    const [description,setDescription] = useState("")

    const handleClose = (e) => {
        setModal(false);
    };

    {/** Handles team creation */}
    const handleSubmit = async(e) => {

        const newTeam = {teamName, description}
        try{

            // Sends an api call to server to create the new team
            let res = await createNewTeam({newTeam});
            if(res.err){
                alert(res.errMsg);
                return
            }
        }
        catch(err){
            alert(err);
        }

        setModal(false);
        window.location.reload();
    }

    return (
        <div>
            <Mui.Dialog 
                open={showModal} 
                onClose={handleClose} 
                aria-labelledby="form-dialog-title"
            >
                {/** Header */}
                <Mui.DialogTitle 
                    id="form-dialog-title" 
                    style={{ textAlign: "center" }}
                >
                    Create A New Team
                </Mui.DialogTitle>

                {/** Body */}
                <Mui.DialogContent>
                    <Mui.DialogContentText>
                        Collaborate closely with a group of people based on 
                        project, initiative, or common interest
                    </Mui.DialogContentText>
                    <br></br>
                    
                    {/** Text field to enter Team Name */}
                    <Mui.TextField
                        autoFocus
                        margin="dense"
                        label="Team Name"
                        variant="outlined"
                        fullWidth
                        inputProps={{ maxLength: 20 }}
                        onChange = {(e) => {setTeamName(e.target.value)}}
                        
                    />
                    <br></br>
                    <br></br>
                    <br></br>
                    
                    {/** Text field to enter Team Description */}

                    <Mui.TextField
                        margin="dense"
                        label="Description : Let People Know 
                                What This Team Is All About"
                        variant="outlined"
                        multiline
                        rowsMax={4}
                        onChange = {(e) => {setDescription(e.target.value)}}
                        fullWidth
                    />

                    </Mui.DialogContent>

                    {/** Footer */}

                    <Mui.DialogActions>
                        <Mui.Button onClick={handleClose} color="primary">
                            Cancel
                    </Mui.Button>
                    <Mui.Button onClick={handleSubmit} color="primary">
                        Create Team
                    </Mui.Button>
                    
                </Mui.DialogActions>
            </Mui.Dialog>
        </div>
    );
}
