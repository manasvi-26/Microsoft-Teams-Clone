import React,{useRef, useEffect, useContext, useState} from 'react'
import Peer from 'simple-peer'
import * as io from "socket.io-client";
import {UserContext} from '../context/UserContext';
import {ModalContext} from '../context/ModalContext';
import axios from 'axios';
import styled from "styled-components";
import { makeStyles} from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import ChatModal from '../components/ChatModal';
import ErrorAlert from '../components/ErrorAlert';
import * as Mui from '../collections';
import { AlertContext } from '../context/AlertContext';


{/**

    Video Meet Screen Features
    - Max Upto 6 people can be on call 
    - Mute/Unmute 
    - Video on/off
    - real time messaging on chat
    - Use shared whiteboard
    - leave call

*/}


const useStyles = makeStyles({

    gridContainer: {

      paddingLeft: "40px",
      paddingRight: "40px"
    
    },
    videoContainer : {
        backgroundColor:'#1c1919',
        display: 'flex',
        justifyContent: 'center',
        alignItems:'center'
    }

});

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
  
{/** Displays Other Users's video player */}

const Video = (props) => {
    const{n,ht,ht1, peer, peerInfo} = props;
    const ref = useRef();
    
    {/** Get the user's audio and video stream using the peer connection made */}
    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, [props]);

    console.log(peerInfo.videoStatus);
    return (

        <Mui.Grid item xs={n}>
            <Mui.Paper 
            style={{ 
                height : ht,
                backgroundColor:'#1c1919',
                display: 'flex',
                justifyContent: 'center',
                alignItems:'center'
            }} 
            >
                <video controls ref={ref} autoPlay playsInline
                    style={{
                        height : ht1,
                        opacity : peerInfo.videoStatus ? "1" :"0"
                    }}/>
            </Mui.Paper>
        </Mui.Grid> 
    );
}

 

const Meet = (props)=> {
    
    const [user, setUser] = useState(null);
    
    const {setAlert} = useContext(AlertContext);
    const {getUserData} = useContext(UserContext);
    const {setModal,showModal} = useContext(ModalContext);

    const history = useHistory();


    const {roomId,conversationId,channelId, jamboardId} = props.history.location.state;
    const classes =useStyles();

    const socketRef = useRef(); {/** Client side socket ref */}
    const myVideo = useRef(); {/** User Stream */}
    const peersRef = useRef([]); {/** list of peer refs (other users in the room) */}
    const screenRef = useRef();    
    screenRef.current = {};
    
    const [myId, setMyId] = useState("");
    const [myStream, setMyStream] = useState();
    const [me, setMe]=useState();

    const[myMic, setMyMic] = useState(true);
    const[myVideoCam, setMyVideoCam] = useState(true);
    const [allMessages, setAllMessages] = useState([]);
    const [conversation, setConversation] = useState(null);
    const [inMeet, setInMeet] = useState(false);
    const [isScreenShare, setIsScreenShare] = useState(false);

    //get user data and all messages in the chat
    useEffect(async() => {

        //get all user data
        let res = await getUserData();  
        setUser(res);

        res = await axios.post('/api/conversation/getConversation' , {conversationId});
        setConversation(res.data.conversation);
        setAllMessages(res.data.conversation.messages)

        document.body.style.zoom = "100%";


    },[])

    useEffect(()=> {
        if(!user) return;

        // on reloading page user gets disconnected
        window.addEventListener("beforeunload", disconnect)

        try{
            //initiate connection to server
            socketRef.current = io.connect("/");

            // Getting the user stream and devices (varies with browser)
            navigator.mediaDevices.getMedia = navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            navigator.mediaDevices.getMedia({video : true, audio : true})
                .then(stream => {

                    //set stream object
                    setMyStream(stream);
                    myVideo.current.srcObject = stream;

                    
                    socketRef.current.on("client id", (socketId) => {
                        setMyId(socketId)
                    })
                    
                    // send a join room signal to server -> join the roomId room
                    socketRef.current.emit("join room", {roomId, user})
                    
                    // send a join conversation room signal to server -> join the conversationId room                   
                    socketRef.current.emit("join conversation", {conversationId, user})
                    
                    // on room full display error message then redirect back to channels page
                    socketRef.current.on("room full", async() =>{
                        setAlert(true,"Room is full! Cannot join, try again later", 0);
                        await sleep(5000);
                        history.goBack();
                    })

                    // On recieving list of all other users already in the room
                    socketRef.current.on("all users", ({usersInThisRoom, me}) => {
                        setInMeet(true)
                        setMe(me);

                        // Creating a peer array
                        usersInThisRoom.forEach(otherUser => {
                            const peer = createPeer(otherUser,me, stream);
                            peersRef.current.push({
                                peerInfo : otherUser,
                                peer 
                            })
                        })
                    })  

                    // Recieving a signal from the newly joined user
                    socketRef.current.on("new user joined", payload => {
                        
                        
                        // Adding to the peer array
                        const peer = addPeer(payload.signal, payload.incomingUser, stream);
                        peersRef.current.push({
                            peerInfo : payload.incomingUser,
                            peer,
                        })
        
                        setAlert(true,"New User Joined!" , 0);

                    });
                    
                    // On recieving an update in a users stream
                    socketRef.current.on("update user stream" , payload => {
                        let index = peersRef.current.findIndex(p => p.peerInfo.id === payload.otherUser);
                        let item = peersRef.current[index];
                        if(payload.type === 'video'){
                            item.peerInfo.videoStatus = payload.setTo;
                        }
                        if(payload.type === 'audio'){
                            item.peerInfo.audioStatus = payload.setTo;
                        }

                        peersRef.current[index] = item;
                    })
                    
                    // when a user in the room leaves call
                    socketRef.current.on("user leaving call", payload =>{

                        //destory peer connection
                        const peerObj = peersRef.current.find(p => p.peerInfo.id === payload.otherUser);
                        if(peerObj){
                            peerObj.peer.destroy();
                        }
                        // remove user from peersRef and peers array
                        let index = peersRef.current.findIndex(p => p.peerInfo.id === payload.otherUser);
                        peersRef.current.splice(index,1)

                        //send an alert notifying user that someone left
                        setAlert(true,"User Left!" , 0);

                    })
                    
                    // incoming user recieves this sginal from each user in the room
                    socketRef.current.on("receiving returned signal", payload => {
                    
                        //completes the handshake
                        const item = peersRef.current.find(p => p.peerInfo.id === payload.id);
                        item.peer.signal(payload.signal);

                        setInMeet(true);
                    });

                    //recieve message sent by user in the room
                    socketRef.current.on("recieve message" ,({message}) => {
                        // add it to all messages
                        setAllMessages((prevState) => [...prevState, message]);
                    })
                    
                    
                })
                .catch(err => {
                    alert(err);
                    console.log(err);
                    sleep(5000);
                    history.goBack();

                    return ;
                })            
        }
        catch(err){
            setAlert(true,"User Media Devices Not Found! Cannot Join the Meet! " , 0);
            sleep(5000);
            history.goBack();
            return;
        }

    },[user])


    // create a peer object for connecting newly joined user to other users
    const createPeer = (userToSignal, me, myStream)=>{
        

        const peer = new Peer({
            initiator : true,
            trickle:false,
            stream : myStream
        })

        // On signal event (peer signals automatically as initiator is set to true)
        peer.on("signal", signal => {

            // Send request to other users
            socketRef.current.emit("sending signal", {userToSignal , me , signal })
        })
        
        
        return peer;
    }

    // add new peer connection for every user already in the room
    const addPeer  = (incomingSignal, incomingUser ,myStream) => {
        
        const peer = new Peer({
        
            initiator : false,
            trickle:false,
            stream : myStream
        })

        // Signal to the new user to acknowledge
        peer.signal(incomingSignal);
        
        // On signal event
        peer.on("signal", signal => {

            // Last acknowledge signal from the user already present in the room
            socketRef.current.emit("returning signal", { signal, incomingUser })
            
        })

        return peer;        
    }

    // update the mic settings
    const updateMic = () => {
        setMyMic((currentStatus) =>{
            //change to NOT of currentStus
            myStream.getAudioTracks()[0].enabled = !currentStatus;
            return !currentStatus;
        })
    }

    // update the video settings
    const updateVideo = () => {
        setMyVideoCam((currentStatus) =>{
            //change to NOT of currentStus           
            myStream.getVideoTracks()[0].enabled = !currentStatus;
            return !currentStatus;
        })
    }


    // send signal request for sending a chat message to server
    const sendMessage = (newMessage) => {

        socketRef.current.emit("send message", ({message : newMessage}));
        
    }

    // to open whiteboard window
    const openJamboard = () => {
        const win = window.open("/whiteboard"+"?sid=" + jamboardId, "_blank");
        win.focus();
    }


    // screen share
    const screenShare = () =>{
        // getting audio and video tracks ( works with chrome web browser)
        navigator.mediaDevices.getDisplayMedia( {
            video: {
                cursor: "always"
            },
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: 44100
            }
        }).then(stream => {
            setIsScreenShare(true)

            const screenTrack = stream.getTracks()[0];

            //iterate through the peer connections and replace the video stream
            peersRef.current.forEach(peerObj => {
                peerObj.peer.replaceTrack(myStream.getVideoTracks()[0] , screenTrack , myStream);
            })
            //set my video to the screen stream
            myVideo.current.srcObject = stream;

            
            // when screen share ends 
            screenTrack.onended = function() {

                ("CONSOLE LOG SHOULD CALL ME")
                // iterated through the peer connections and replace screen stream back to user video stream
                peersRef.current.forEach(peerObj => {
                    peerObj.peer.replaceTrack(screenTrack , myStream.getVideoTracks()[0] , myStream);
                })

                // reset my video to user video
                myVideo.current.srcObject = myStream;

                setIsScreenShare(false)
            
            }
        })
        
    }

   

    // End/Leave call
    const disconnect = async(e) => {
        if(peersRef.current.length == 0){
            try{
                await axios.post("/api/channel/endMeet", {channelId : channelId})
            }
            catch(err){
            }           
        }
        else{
            socketRef.current.emit("leave call");
        }
        
        document.body.style.zoom = "150%";
        history.goBack()
        
    }

    

    var ht , ht1, n;

    // video layout 
    if(peersRef.current.length == 0){ht = 0.7*window.innerHeight ; ht1 =0.6* window.innerHeight; n = 8}
    if(peersRef.current.length == 1){ht = 0.5* window.innerHeight; ht1 = 0.4*window.innerHeight; n = 6}
    if(peersRef.current.length > 1){ht = 0.3*window.innerHeight; ht1 = 0.2* window.innerHeight; n = 4}

    return (
            <div style={{backgroundColor:'#232426', height: '100vh', backgroundSize:'cover'}}>
            <div style={{height:'50px'}}></div>

                
            <Mui.Grid
                container
                spacing={5}
                className={classes.gridContainer}
                justify="center"
            >
                <Mui.Grid item xs={12}>
                    {/**  **TOOLBAR**  */}
             
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems:'center',
                        marginTop:'10px'
                    }}>

                        {/** MIC (AUDIO) BUTTON */}
                        <Mui.IconButton 
                            size = 'medium'
                            style= {{
                                marginLeft:'10px' ,
                                color :'white', 
                                backgroundColor: myMic ? "black" : "red"
                            }}
                            onClick={updateMic}
                        >
                            {myMic && <Mui.MicIcon/>}
                            {!myMic && <Mui.MicOffIcon/>}

                        </Mui.IconButton>
                            
                        {/** VIDEO CAM BUTTON */}

                        <Mui.IconButton 
                            size = 'medium' 
                            style= {{
                                marginLeft:'30px', 
                                color:'white', 
                                backgroundColor:myVideoCam ? "black" : "red"
                            }}
                            onClick = {updateVideo}
                        >
                            {myVideoCam && <Mui.VideocamIcon />}
                            {!myVideoCam && <Mui.VideocamOffIcon/>}
                        </Mui.IconButton>   
                            
                        {/** CHAT BUTTON */}

                        <Mui.IconButton 
                            size = 'medium' 
                            style= {{marginLeft:'30px', color:'white', backgroundColor:'black'}}
                            onClick ={() => setModal(!showModal)}
                        >
                            <Mui.ChatIcon />
                        </Mui.IconButton>  

                        {/** WHITEBOARD BUTTON */}

                        <Mui.IconButton 
                            size = 'medium' 
                            style= {{marginLeft:'30px', color:'white', backgroundColor:'black'}}
                            onClick ={openJamboard}
                        >
                            <Mui.BrushIcon />
                        </Mui.IconButton> 

                        {/** SCREEN SHARE BUTTON */}


                        {!isScreenShare && <Mui.IconButton 
                            size = 'medium' 
                            style= {{marginLeft:'30px', 
                                    color:'white', 
                                    backgroundColor: "red"

                            }}
                            onClick ={screenShare}
                        >
                               {<Mui.PresentToAllIcon />}
                        </Mui.IconButton> } 


                        {/** LEAVE CALL BUTTON */}

                        <Mui.IconButton 
                            size = 'medium' 
                            style= {{marginLeft:'30px', color:'white', backgroundColor:'red'}}
                            onClick ={disconnect}
                        >
                                <Mui.CallEndIcon />
                        </Mui.IconButton>  

                        

                    </div>
                </Mui.Grid>

                <ChatModal sendMessage={sendMessage} user={user} allMessages = {allMessages}/>
                
                {/** my Video player */}
                <Mui.Grid item xs={n}>            
                <Mui.Paper style={{height : ht}} className ={classes.videoContainer}>
                    <video 
                        ref={myVideo}
                        autoPlay 
                        controls
                        playsInline
                        muted="muted"
                        style={{
                            height : ht1,
                            backgroundColor:'#1c1919',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems:'center',
                            opacity: myVideoCam ? "1" : "0"   
                        }}
                    />

                </Mui.Paper>
                </Mui.Grid> 

                {/** list of other users video player  */}
                {peersRef.current.map((peerObj, index) => {
                    return (
                        <Video  n = {n} ht = {ht} ht1 = {ht1} peer={peerObj.peer} peerInfo = {peerObj.peerInfo}/>
                    );
                })}
            
            </Mui.Grid>
            <ErrorAlert/>
        
        </div>
    )
}

export default Meet
