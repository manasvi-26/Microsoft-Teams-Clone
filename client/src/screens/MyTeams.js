import React, {useContext, useState, useEffect} from 'react'
import { makeStyles } from "@material-ui/core/styles";
import * as Mui from '../collections';
import {ModalContext} from '../context/ModalContext';
import {UserContext} from '../context/UserContext';
import {AlertContext} from '../context/AlertContext';
import CreateTeamModal from '../components/CreateTeamModal';
import axios from 'axios'
import { useHistory } from "react-router-dom";
import ErrorAlert from '../components/ErrorAlert';
import { getAllTeams } from '../apiCalls/teamAPI';
import {useStyles} from '../styles/myTeamsStyles';

{/*

    My Teams Screen : Displays all the teams user is part of
    User can also create a new team.

*/}




const MyTeams = () => {

  const {getUserData} = useContext(UserContext);
  const {setAlert} = useContext(AlertContext);
  const history = useHistory();

  const [allTeams, setAllTeams] = useState([]);   {/* list fo all teams users is part off */}
  const [user, setUser] = useState(null);         {/* user details */}


  const classes = useStyles();
  const {showModal, setModal} = useContext(ModalContext);

  const [isLoading,setIsLoading] = useState(true);

  {/* array of images for aesthetics purpose */}
  const arr = [

    require('../images/bg1.jpeg').default,
    require('../images/bg2.jpeg').default,
    require('../images/bg3.jpeg').default,
    require('../images/bg4.jpeg').default,
    require('../images/bg5.jpg').default,

  ]


  useEffect( async() => {
          
      try{
        
        //get all user data
        let res = await getUserData();  
        updateUser(res.user);
        
        res = await getAllTeams();
        if(res.err){
          alert(res.errMsg); 
        }  
        setAllTeams(res.teams)
      }
      catch(err){
        alert(err);
      }
      finally{
        setIsLoading(false);
      }

  }, [])

  const updateUser = (user) =>{
    setUser(user);
  }

  
  {/*
      On selecting a team user gets navigated to 
      the "General" channel of that team 
  */}

  const navigate_channel = (e, team) => {
    
    {/* channelId is the id of the first(general) channel in the team */}
    const data = {
      channel : team.channels[0], 
      team : team
    }

    //navigating to the channel screen
    history.push({  
      pathname : '/channel', 
      state : data
    })
  }


  {/*

    function is used to render card 
    which displays team name 

  */}
  const renderCard = (team, idx) => {

    console.log(team);

    return (
      <Mui.Grid item xs={12} sm={6} md={4}>

        <Mui.CardActionArea 
          className={classes.actionArea}
          onClick = {(e) => {navigate_channel(e,team)}}
        >
          <Mui.Card raised="true" className={classes.card}>
            <Mui.CardMedia height="180px" component="img" image={arr[idx % 5]} />
            <Mui.Typography variant="h5" className={classes.teamName}>{team.teamName}</Mui.Typography>
          </Mui.Card>
        
        </Mui.CardActionArea>
      </Mui.Grid>
    )

  }

  const createNewTeam = (e) => {

    //this opens the create team modal component
    setModal(true);
    return;
  
  }

  return (
    <div >
      
      <br></br><br></br>

      <ErrorAlert/>
      <Mui.Button
        variant="contained"
        color="secondary"
        startIcon={<Mui.ExitToAppIcon />}
        size="medium"
        style={{ marginBottom: '50px', float: "left", marginLeft: "30px" }}
        onClick = {(e) => history.push('/')}
      >
        LOGOUT
      </Mui.Button>

      <Mui.Button
        variant="contained"
        color="secondary"
        startIcon={<Mui.GroupAddIcon />}
        size="medium"
        style={{ marginBottom: '50px', float: "right", marginRight: "30px" }}
        onClick = {createNewTeam}
      >
        CREATE A NEW TEAM
      </Mui.Button>

      <CreateTeamModal/>

      {isLoading ? <Mui.CircularProgress style={{marginLeft:'40%' , marginTop:'20%'}}/> :

        <Mui.Grid
          container
          spacing={4}
          className={classes.gridContainer}
          justify="center"
        >
          {allTeams.length == 0 ? 
            <Mui.Typography variant="h6" style={{textAlign:'center',marginTop:'20px'}}>
              Oops! You are not part of a team yet! Create a new team and add your friends to it!
            </Mui.Typography> :
          
            allTeams.map(renderCard)}
        </Mui.Grid>

      }
    </div>
  )
}

export default MyTeams

