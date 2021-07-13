import React,{useState,useContext, useEffect} from 'react'
import axios from 'axios'
import ErrorAlert from '../components/ErrorAlert';
import { AlertContext } from '../context/AlertContext';
import { makeStyles } from '@material-ui/core/styles';
import * as Mui from '../collections'
import { useStyles } from '../styles/RegisterStyles';

{/*

    Register Screen : Register 

*/}


const Register = () => {
    const classes = useStyles();
    const {show,msg,type,setAlert} = useContext(AlertContext);


    const [FirstName,setFirstName] = useState('')
    const [LastName,setLastName] = useState('')
    const [Email,setEmail] = useState('')
    const [Password,setPassword] = useState('')

    useEffect(() => {

        document.body.style.zoom = "120%";
        localStorage.removeItem('token');

    })


    const handleSubmit = async (e) =>{

        e.preventDefault()

        const newUser = { firstName:FirstName,  lastName:LastName, email:Email, password:Password }
        console.log(newUser);
        try{
            const res = await axios.post('/api/user/register' , newUser)
            console.log(res.data)    
            
            //send confirmation alert
            setAlert(true,res.data.message, 1);


            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');

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
                        Sign up
                    </Mui.Typography>
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <Mui.Grid container spacing={2}>
                            <Mui.Grid item xs={12} sm={6}>
                                <Mui.TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    label="First Name"
                                    autoFocus
                                    value = {FirstName}
                                    onChange = {(e) => {setFirstName(e.target.value)}}
                                />
                            </Mui.Grid>
                            <Mui.Grid item xs={12} sm={6}>
                                <Mui.TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    label="Last Name"
                                    value = {LastName}
                                    onChange = {(e) => {setLastName(e.target.value)}}
                                />
                            </Mui.Grid>
                            <Mui.Grid item xs={12}>
                                <Mui.TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    label="Email"
                                    type = "email"
                                    value = {Email}
                                    onChange = {(e) => {setEmail(e.target.value)}}
                                />
                            </Mui.Grid>
                            <Mui.Grid item xs={12}>
                                <Mui.TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    value = {Password}
                                    onChange = {(e) => {setPassword(e.target.value)}}
                                />
                            </Mui.Grid>
                            <Mui.Grid item xs={12}>
                                <Mui.FormControlLabel
                                    control={<Mui.Checkbox value="allowExtraEmails" color="primary" />}
                                    label="I want to receive updates via email."
                                />
                            </Mui.Grid>
                        </Mui.Grid>
                        <Mui.Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Sign Up
                        </Mui.Button>
                        <Mui.Grid container justify="flex-end">
                            <Mui.Grid item>
                                <Mui.Link href="/login" variant="body2">
                                    Already have an account? Sign in
                                </Mui.Link>
                            </Mui.Grid>
                        </Mui.Grid>
                    </form>
                </div>
                <Mui.Box mt={5}>
                </Mui.Box>
            </Mui.Container>
        </> 
    );
}

export default Register