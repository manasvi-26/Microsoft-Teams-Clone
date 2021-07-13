import React,{useState, useEffect, useRef, useContext} from 'react'
import {UserContext} from '../context/UserContext';
import axios from'axios';
import io from 'socket.io-client';
import Message from '../components/MessageCard'
import { useHistory } from "react-router-dom";
import * as Mui from '../collections';

{/*

    Conversation Screen : 

    Loads all the previous messages pertainig to this conversation
    User can have real time chats with members of the team
    Real time chatting accomplished by using socket.io

*/}

const Conversation = (props) => {

    console.log( props.history.location.state);
    const history = useHistory();


    const {conversationId, team, channel} =  props.history.location.state;
    console.log(team, channel);

    const messagesEndRef = useRef();

    const [user,setUser] = useState(null);
    const {getUserData} = useContext(UserContext);
    const [myId, setMyId] = useState("");
    const [conversation,setConversation] = useState(null);

    const [allMessages, setAllMessages] = useState([]);
    const socketRef = useRef();

    const [message, setMessage] = useState("");


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    

    useEffect(async() => {
        try{
        
            //get all user data
            let res = await getUserData();  
            setUser(res);
            console.log("user is",res)

            console.log(conversationId)
            let res1 = await axios.post('/api/conversation/getConversation' , {conversationId})
            setConversation(res1.data.conversation)
            setAllMessages(res1.data.conversation.messages)

            scrollToBottom()

            console.log(res1)
          }
          catch(err){
            console.log(err);
          }
    },[])

    useEffect(async() => {

        if(!user)return ;
        try{
            socketRef.current = io.connect("/")
            socketRef.current.on("client id", (socketId) => {
                setMyId(socketId)
                console.log("My id is ", socketId);
            })

            socketRef.current.emit("join conversation", {conversationId, user})

            socketRef.current.on("joined conversation", () => {
                console.log('joined!');
            })

            socketRef.current.on("recieve message" ,({message}) => {
                console.log(message)
                setAllMessages((prevState) => [...prevState, message]);
            })
        }
        catch(err){
            console.log(err);
        }
    },[user])

    const goBack = () => {

        history.push({  
            pathname : '/channel', 
            state : {
                team : team,
                channel
            }
        })

        return;
    }

    const sendMessage = () =>{
        if(message === "")return;
        const newMessage = {
            userId : user._id,
            userName : user.firstName + " " + user.lastName,
            content : message,
            timeStamp : new Date()
        }

        console.log(newMessage.timeStamp);

        socketRef.current.emit("send message", ({message : newMessage}));
        setAllMessages((prevState) => [...prevState, newMessage])
        setMessage("");

    }

    return (
        
        <div >
            <div style={{height:'50px'}}></div>
                <Mui.Button
                variant="contained"
                color="secondary"
                startIcon={<Mui.ExitToAppIcon />}
                size="medium"
                style={{ marginBottom: '50px', float: "left", marginLeft: "30px" }}
                onClick = {goBack}
                >
                    GO BACK
                </Mui.Button>
            {!user || !conversation ? "" :
                

                    <Mui.Grid container spacing={3} justify="center">
                    <Mui.Grid item xs = {10}>
                        <Mui.Paper style={{backgroundColor:'#e6f0f5',padding:'20px'}} elevation ={15} >
                            <br></br>
                            <Mui.Typography variant="h3" style={{textAlign:'center',marginTop:'20px'}}>{conversation.about}</Mui.Typography>
                            <br></br><br></br>

                            {!allMessages.length ? 
                                <Mui.Typography variant="h6" style={{textAlign:'center',marginTop:'20px'}}>
                                    Oops! Doesn't Seem like the conversation has started! Send your first Message here...
                                </Mui.Typography>:

                                allMessages.map((message) => {
                            {/* <Typography variant="h6" style={{textAlign:'center',marginTop:'20px'}}>Oops! Doesn't Seem like the conversation has started! Send your first Message here...</Typography> */}
                            return(
                                        <Message message={message} userId={user._id}/>
                                    )}
                                )
                            }
                            <br></br><br></br>
                            
                            <Mui.TextField
                                autoFocus
                                margin="dense"
                                label="Your Message"
                                variant="outlined"
                                fullWidth
                                value={message}
                                multiline="true"
                                onChange = {(e) => {setMessage(e.target.value)}}
                                InputProps={{endAdornment: <Mui.IconButton color="secondary" onClick = {sendMessage}><Mui.SendIcon/></Mui.IconButton>}}

                            />
                            
                            <br></br><br></br>
                        </Mui.Paper>
                        <div ref={messagesEndRef} />

                    </Mui.Grid>
                </Mui.Grid>
            }
        </div>
    )
}

export default Conversation
