import React,{useEffect, useContext} from 'react'
import { Grid, Typography} from '@material-ui/core';
import { Button} from '@material-ui/core'
import * as Mui from '../collections';
import { useHistory } from "react-router-dom";

{/*

    Home Screen : The onboarding screen when user loads the app
    Here The User is presented with 2 options : Sign Up or Sign In

*/}


const Home = () => {
    
    const history = useHistory();

    useEffect(() => {


        document.body.style.zoom = "120%";
        localStorage.removeItem('token');

    })
    
    
    return (
        <div style={{padding:20,}}>
            <Mui.Grid container spacing={3}>
               
                <Mui.Grid item xs={6} >
                     <img 
                         src={require('../images/about.jpg').default} 
                         height='500px' 
                         width='600px'
                     />
                </Mui.Grid>
               
                <Mui.Grid item xs = {6}>
                    <Mui.Typography 
                        variant="h1"
                        color = 'primary'
                        align = "center"
                    >
                        Microsoft Teams
                    </Mui.Typography>
                    <br></br><br/>
                    <Mui.Typography 
                        variant="h4"
                        color = 'primary'
                        align = "center"    
                    >
                        Meet, chat, call, and collaborate in just one place
                    </Mui.Typography>

                    
                        <Mui.Button 
                            variant="contained"
                            color="primary"
                            endIcon={<Mui.HowToRegIcon/>}
                            style={{marginLeft:'5.5rem' , marginTop:'5rem'}}
                            onClick={() => {history.push('/register')}}
                        >
                            Sign Up
                        </Mui.Button>
                    

                    <Mui.Button 
                        variant="contained"
                        endIcon={<Mui.VpnKeyIcon/>}
                        style={{marginLeft:'10rem' , marginTop:'5rem' , backgroundColor:'#5cd65c' , width:'8rem'}}
                        onClick={() => {history.push('/login')}}
                    >
                        Login
                    </Mui.Button>

                </Mui.Grid>
            </Mui.Grid>
       </div>
    )
}

export default Home

