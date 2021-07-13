import React, { useEffect, useState, useContext, useRef } from 'react';
import clsx from 'clsx';
import { useStyles } from '../styles/ChannelStyles';
import * as Mui from '../collections';
import { useHistory } from "react-router-dom";
import { ModalContext } from '../context/ModalContext';
import MembersModal from '../components/MembersModal';
import AboutConversation from '../components/AboutConversation';
import {useTheme } from '@material-ui/core/styles';
import ConversationCard from '../components/ConversationCard';
import CreateChannelModal from '../components/CreateChannelModal';
import { getChannelData, getAllConversations} from '../apiCalls/channelAPI';
import { getTeamData, leaveTeam } from '../apiCalls/teamAPI';


export default function Channel(props) {

  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const { setModal, setModal2, setModal3 } = useContext(ModalContext);

  const [channelId, setChannelId] = useState(props.history.location.state.channel.channelId)
  const [channelName, setChannelName] = useState(props.history.location.state.channel.channelName)
  const teamId = props.history.location.state.team._id


  const [channel, setChannel] = useState(null);
  const [team, setTeam] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [conversations, setConversations] = useState(null);
  const [isLoading,setIsLoading] = useState(true);
  const [conversationType, setConversationType] = useState("");
  const conversationsEndRef = useRef();
  
  // get the team's data 
  useEffect(async () => {
      try{
        
        let res = await getTeamData({teamId});
        if(res.error){
          alert(res.errMsg)
        }
        setTeam(res.team)
      }
      catch(err){
        alert(err);
      }

  },[])

  //get the channel's data and all coversations in the channel
  //useEffect gets called only when theres a change in channelId's state(i.e when we change channels)
  useEffect(async () => {

    try {
      console.log("HEEEREE",channelId, channelName)
      let res = await getChannelData({ channelId });
        if (res.error) {
          alert(res.errMsg);
          return;
        }
      setChannel(res.channel);
      

      res = await getAllConversations({ channelId });
      if (res.error) {
        alert(res.errMsg);
        return;
      }
      console.log(res);
      setConversations(res.conversations)

    }
    catch (err) {
      alert(err);
      return;
    }
    finally{
      // loader turn off

      setIsLoading(false);
      scrollToBottom();
    }

  }, [channelId])


  // start a new meet
  const startMeet = async (e) => {
    // sets the type of connversation
    setConversationType("meet");
    setModal2(true)
  }

  // navigate user to meet screen
  const joinMeet = () => {

    history.push({
      pathname: '/meet',
      // roomId (meet room), conversationId (chat), jamboardId ( whiteboard )
      state: {
        roomId: channel.currentMeet.roomId,
        conversationId: channel.currentMeet.conversationId,
        jamboardId: channel.currentMeet.jamboardId,
        channelId,
      }
    })
  }

  //navigates user to new channel 
  
  //here set the new channelId -> which calls useEffect to run again =>
  //getting new channel's data and conversations
  const navigateToChannel = async(newChannel) => {
    if(newChannel.channelId == channelId)return;
    setIsLoading(true);
    setChannelId(newChannel.channelId)
    setChannelName(newChannel.channelName)

  }

  // calls api which helps user to leave the team
  const exitTeam = async() => {
    try{
      let res = await leaveTeam({teamId});
      if(res.err){
        alert(res.errMsg);
      }
      else {
        history.push('/myTeams')
      }
    }
    catch(err){
      alert(err);
    }
  }

  // sidebar open
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  //sidebar close
  const handleDrawerClose = () => {
    setOpen(false);
  };

  // opens all members in the team modal (shared state via Modal context)
  const Members = () => {
    setModal(true);
  }

  //start a new conversation (opens about conversation modal)
  const startConversation = () => {
    setConversationType("conversation")
    setModal2(true)
    
  }

  //opens create a new channel modal
  const createChannel = () => {
    setModal3(true);
  }

  //scroll to the bottom of the screen( to messagesRef div) on loading the page
  const scrollToBottom = () => {
    conversationsEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const goBack = () => {
    history.push('/myTeams')
  }

  //!channel || !team || !conversations
  
  return (isLoading) ? 
  <Mui.CircularProgress style={{marginLeft:'45%' , marginTop:'20%'}}/> 
  : (
    <div className={classes.root} style={{ backgroundColor: 'white' }}>

      <Mui.CssBaseline />
      {/** ***APP BAR***  */}
      <Mui.AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
        style={{ backgroundColor: "#010334", color:'white' }}
      >
        <Mui.Toolbar>
          {/** Opens Sidebar */}
          <Mui.IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <Mui.MenuIcon />
          </Mui.IconButton>

          {/** current channel's Name */}
          <Mui.Typography variant="h5" className={classes.title}>
            Channel : {channelName} 
          </Mui.Typography>

          {/** If a meet is going on join meet else create a new meet */}
          <Mui.Button
            color="inherit"
            endIcon={<Mui.VideoCallIcon />}
            variant="outlined"
            style={{ marginRight: '35px' }}
            onClick={!channel.currentMeet.isMeet ? startMeet : joinMeet}
          >
            {!channel.currentMeet.isMeet ? "Create Meet" : "Join Meet"}
          </Mui.Button>

          {/** Opens Members modal */}
          <Mui.Button
            color="inherit"
            endIcon={<Mui.PeopleAltIcon />}
            variant="outlined"
            onClick={Members}
          >
            Members
          </Mui.Button>

        </Mui.Toolbar>
      </Mui.AppBar>

      
      <MembersModal team={team} />
      
      {/** ***SIDE BAR*** */}
      <Mui.Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        {/** Content of Sidebar */}
        <div className={classes.drawerHeader}>
          <Mui.IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? 
              <Mui.ChevronLeftIcon style={{ color: 'white' }} /> : 
              <Mui.ChevronRightIcon />}
          </Mui.IconButton>
        </div>

        <Mui.IconButton onClick={goBack}>
            <Mui.ExitToAppIcon style={{ color: 'white' }} />
            <Mui.Typography 
              style={{ textAlign: 'center', color: 'white', 
                    marginLeft: '5px' }}
            > Go Back To All Teams</Mui.Typography>
        </Mui.IconButton>
        <Mui.Divider className={classes.divider} />

        
        <Mui.Typography style={{ textAlign: 'center' }}>
          ABOUT TEAM : 
        </Mui.Typography>
        <Mui.Typography style={{ textAlign: 'center' }}>
          {team.description}
        </Mui.Typography>
        

        <Mui.Divider className={classes.divider} />
        <Mui.Divider className={classes.divider} />
        <br></br>
        
        <Mui.Typography style={{ textAlign: 'center' }}>ALL CHANNELS</Mui.Typography>
        
        {/** List all the channels */}
        <Mui.List style={{ textAlign: 'center' }}  >
          {
            team.channels.map((newChannel, idx) => {
              return (
              
                <div>
                  
                  <Mui.IconButton 
                    style={{ textAlign: 'center' }} 
                    onClick={(e) => navigateToChannel(newChannel)}
                  >
                    <Mui.ChromeReaderModeIcon style={{ color: 'white' }} />
                    <Mui.Typography 
                      style={{ textAlign: 'center', color: 'white',
                           marginLeft: '5px' }}
                    >
                      {newChannel.channelName}
                    </Mui.Typography>
                  </Mui.IconButton>

                </div>
              )
            })
          }

          {/** Create a new channel */}
          <Mui.IconButton onClick={createChannel}>
            <Mui.AddCircleIcon style={{ color: 'white' }} />
            <Mui.Typography 
              style={{ textAlign: 'center', color: 'white', 
                marginLeft: '5px' }}
            > Create Channel</Mui.Typography>
          </Mui.IconButton>

          <Mui.Divider className={classes.divider} />

          {/** Leave team button */}
          <Mui.IconButton onClick={exitTeam}>
            <Mui.CancelIcon style={{ color: 'white' }} />
            <Mui.Typography 
              style={{ textAlign: 'center', color: 'white',
                 marginLeft: '5px' }}
            >
              Leave Team
            </Mui.Typography>
          </Mui.IconButton>

        

        </Mui.List>

      </Mui.Drawer>
      <CreateChannelModal teamId={team._id} />
      
      {/** BODY OF CHANNEL'S PAGE */}
      {/** Responsive to sidebar */}
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        
        
        <Mui.Grid container spacing={3} justify="center">
          <Mui.Grid item xs={6} >

            <img
              src={require('../images/channel.jpg').default}
              height='500px'
              width='600px'
            />
          </Mui.Grid>
        </Mui.Grid>

        {/** List all conversations in the channel */}
        {
          conversations.map((conversation, idx) => {
            return (
              <ConversationCard 
                  conversation={conversation} 
                  team={team} 
                  channel={{channelId, channelName}} 
              />
            )
          })
        }

        {/** Start New Conversation button */}
        <Mui.Grid container spacing={3} justify="center">
          <Mui.Grid item>
            <Mui.Button
              variant="contained"
              color="primary"
              startIcon={<Mui.ChatIcon />}
              size="medium"
              style={{ marginBottom: '50px', marginRight: "30px", backgroundColor: "#010334" }}
              onClick={startConversation}
            >
              START NEW CONVERSATION
            </Mui.Button>
            {/** About Conversation Modal */}
            <AboutConversation 
                channelId={channelId} 
                team={team} type={conversationType} 
                channel={{channelId, channelName}}
              />
          </Mui.Grid>
        </Mui.Grid>

        <div ref={conversationsEndRef} />
      </main>
    </div>
  );
}





