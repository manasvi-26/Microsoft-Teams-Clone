import React, {useState, useContext, useEffect} from 'react';
import axios from 'axios'
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import * as Mui from '../collections';
import ErrorAlert from '../components/ErrorAlert';
import { AlertContext } from '../context/AlertContext';
import { useStyles } from '../styles/LoginStyles';


{/*

    LogIn/SignIn Screen : User must enter registered EMAIL and PASSWORD to sign in

*/}


const Login = () => {

    const classes = useStyles();
    const history = useHistory();
    const {setAlert} = useContext(AlertContext);


    const [Email,setEmail] = useState('')
    const [Password,setPassword] = useState('')

    useEffect(() => {

        document.body.style.zoom = "120%";
        localStorage.removeItem('token');

    })

    {/* 
        On Submitting the resgistered email and password - 
        api call is made to the server which checks for  
        validity of account, i.e if user exists in the database.
    */}
    const handleSubmit = async (e) =>{

        
        e.preventDefault()
        const newUser = {email:Email, password:Password}

        
        try{
            
            const res = await axios.post('/api/user/login' , newUser)
            
            //if user exists in the db, a unique JWT token gets sent back 
            // user is next taken to his all teams screen
            localStorage.setItem('token', res.data.token);
            if(res.data.token){
                history.push('/myTeams')
            }

        }
        catch(err)
        {
            //send error alert
            setAlert(true, err.response.data.message, 0);
        }
    }

    return (
        <>
            <ErrorAlert/>
            <Mui.Container component="main" maxWidth="xs">
                <Mui.CssBaseline />
                
                <div className={classes.paper}>
                    
                    <Mui.Avatar className={classes.avatar}>
                        <Mui.LockOutlinedIcon />
                    </Mui.Avatar>
                    
                    <Mui.Typography component="h1" variant="h5">
                        Sign in
                    </Mui.Typography>
                    
                    <form className={classes.form} onSubmit={handleSubmit}>
                        
                        <Mui.TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Email Address"
                            autoFocus
                            value = {Email}
                            onChange = {(e) => {setEmail(e.target.value)}}
                        />
                        
                        <Mui.TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            type="password"
                            value = {Password}
                            onChange = {(e) => {setPassword(e.target.value)}}
                        />

                        <Mui.Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Sign In
                        </Mui.Button>
                        
                        <Mui.Grid container>
                            <Mui.Grid item>
                                <Mui.Link href="/register" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Mui.Link>
                            </Mui.Grid>
                        </Mui.Grid>
                    
                    </form>
                </div>
            </Mui.Container>
        </>
    );
}

export default Login
