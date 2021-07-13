import React, { useContext } from 'react'
import MuiAlert from '@material-ui/lab/Alert'
import {Snackbar} from '@material-ui/core'
import {AlertContext} from '../context/AlertContext';

{/**
    Component that Displays Error/Success Messages
*/}


const ErrorAlert = (props) => {
    
    // Shared state 
    // ( parent component sets the value of show, msg, type(success/error))
    const {show,msg,type,setAlert} = useContext(AlertContext);
    
    
    const handleErrorClose = (e) =>{
        setAlert(false,'',type)
    }

    return (
        //Default display time set to 5 seconds
        <Snackbar 
            open={show} 
            autoHideDuration={5000} 
            onClose={handleErrorClose}
        >
            <MuiAlert 
                onClose={handleErrorClose} 
                severity={type === 0 ? "error" : "success"} 
                elevation={6} 
                variant= "filled" 
            >
                {msg}
            </MuiAlert>
        </Snackbar>
      
    )
}

export default ErrorAlert
