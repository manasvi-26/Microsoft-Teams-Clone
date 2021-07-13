import React ,{useContext, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';
import ErrorAlert from '../components/ErrorAlert';
import axios from 'axios'
import {ModalContext} from '../context/ModalContext';
import { AlertContext } from '../context/AlertContext';
import * as Mui from '../collections'
import { addNewMember , getAllMembers} from '../apiCalls/teamAPI';

{/**

    Modal component contains list of all members in the team
    User can add new members to the team via entering respective emailId.

*/}


const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
  dialog : {
      maxHeight : '80vh'
  }
});

const  MembersModal = (props) => {

    console.log(props)
    const classes = useStyles();
    const {showModal, setModal} = useContext(ModalContext);
    const {setAlert} = useContext(AlertContext);
    const {team} = props;
    {/** Email of new member user wants to add */}
    const [newMember, setNewMember] = useState("");
    {/**Lit of all members in the team */} 
    const [allMembers, setAllMembers] = useState([]);

    
    {/**  function to get all members currently in the team */}
    const getMembers = async() => {

        try{
            const res = await getAllMembers({teamId : team._id})
            if(res.err){
                alert(res.errMsg);
                return;
            }
            console.log(res)
            setAllMembers(res.allMembers)           
        }
        catch(err){
            alert(err);
        }
    }
    
    
    useEffect (async() => {
        try{
            await getMembers();
        }
        catch(err){
            console.log(err);
        }
        
    },[])

    {/**  function to add new member to the team */}
    const addMember = async() => {
        try{
            let res = await addNewMember({email : newMember, teamId : team._id})
            if(res.err){
                alert(res.errMsg);
                return;
            }

            {/** get the updated list of members */}
            res = await getAllMembers({teamId : team._id});
            setAllMembers(res.allMembers)           

            
        }

        catch(err){
            alert(err);
        }
        setNewMember("");
    }

    const handleClose = (e) => {
        setModal(false);
    };

    return (
        <Mui.Dialog onClose={handleClose} open={showModal} className = {classes.dialog}>
            {/** Header */}
        <Mui.DialogTitle style = {{textAlign:'center'}}>All Members</Mui.DialogTitle>

            {/** Body */}
        <Mui.DialogContent>
            <Mui.List>
                <Mui.ListItem >
                    {/** Text filed to enter new user's email*/}
                <Mui.TextField
                        autoFocus
                        margin="dense"
                        label="Add Account"
                        variant="outlined"
                        fullWidth
                        value = {newMember}
                        onChange = {(e) => {setNewMember(e.target.value)}}
                        
                    />
                    {/** add member to team button */}
                <Mui.IconButton style= {{marginLeft:'5px'}} onClick={addMember}>
                        <Mui.AddCircleIcon />
                </Mui.IconButton>
                </Mui.ListItem>

                    {/** list of all members currently in the team */}
                {allMembers.map((member) => (
                <Mui.ListItem >
                    <Mui.ListItemAvatar>
                    <Mui.Avatar className={classes.avatar}>
                        <Mui.PersonIcon />
                    </Mui.Avatar>
                    </Mui.ListItemAvatar>
                    <Mui.ListItemText primary={member.email} />
                </Mui.ListItem>

                ))}
            
            </Mui.List>
        </Mui.DialogContent>

        <ErrorAlert/>
        </Mui.Dialog>
        
    );
}

export default MembersModal;
    