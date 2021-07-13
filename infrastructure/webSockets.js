const socket = require('socket.io')
const http = require('http')
const {addMessage} = require('../controllers/conversation');

{/*
    Socket.io : enables real-time, bidirectional and event-based communication.
*/}



//dictionary - key : roomId, value:List of Sockets which joined the room
const clients = {}

{/*
    Module Function - attachWebSockets - Wraps around the express app and makes available all the 
    socket functionalities
*/}

attachWebSockets = app => {

    const server = http.createServer(app);
    const io = socket(server)

    // On initialization of connection
    io.on("connection", (socket) => {
        
        console.log('connection has been made', socket.id);

        // Send the socket id to the client to identify/connect it with this server
        socket.emit("client id", socket.id);
        
        // On joining of the client
        socket.on("join room", ({roomId, user}) => {
            
            // Condition for max capacity of a room
            if(clients[roomId] && clients[roomId].length == 6){
                socket.emit("room full");
                return;
            }

            socket.roomId = roomId;

            const newClient = {
                id : socket.id, 
                email : user.email, 
                videoStatus : true, 
                audioStatus : true,
                userName : user.firstName + " " + user.lastName
            }
            
            if(clients[roomId])clients[roomId].push(newClient);
            else clients[roomId]=[newClient];

            // Adds socket to the room id
            socket.join(roomId);
            console.log(`${socket.id} joined room ${roomId}`);

            
            const usersInThisRoom = clients[roomId].filter(client => client.id !== socket.id)
            // Send list of all other users in this room to the newly joined client
            socket.emit("all users", {usersInThisRoom, me : newClient});

            console.log('users in this room', usersInThisRoom)
            console.log("emitted all users");
        })

        // On getting a request from the new user to signal already existing users via server
        socket.on("sending signal", payload => {

            console.log("recieved signal from incoming user -> sending to userin room", payload.userToSignal)

            // Sending the signal to the particular user already in the room (payload.userToSignal)
            io.to(payload.userToSignal.id).emit("new user joined", { signal: payload.signal, incomingUser: payload.me });
            console.log("emitted new user joined")
        
        });
    
        
        // On getting a request from the user(s) in the room to acknowledge the newly joined user via server
        socket.on("returning signal", payload => {

            console.log("recieved returning signal from user in the room-> sending ow to incoming user");

            // Sending final return signal to incoming user (Handshake complete)
            io.to(payload.incomingUser.id).emit("receiving returned signal", { signal: payload.signal, id: socket.id });
            console.log("emiited recieving returned signal to incoming User ", payload.incomingUser.id)
        
        });

       
        // On getting signal requests to mute/unmute or turn camera on/off
        socket.on("update my stream", payload => {

            // Broadcast the stream update to all other users
            socket.broadcast.to(socket.roomId).emit("update user stream", {otherUser : socket.id , type : payload.type , setTo : payload.setTo })
            let room = clients[socket.roomId];

            let index = room.findIndex(c => c.id === socket.id)
            user = room[index];
            if(payload.type === 'video')user.videoStatus = payload.setTo;
            if(payload.type === 'audio')user.audioStatus = payload.setTo;

            room[index] = user;
            clients[socket.roomId] = room;

         
        })

        // On getting request signal to leave call
        socket.on("leave call", () => {

            console.log('user leaving call', socket.id);
            let room = clients[socket.roomId];
            console.log(room);
            if(room){
                room = room.filter(c => c.id !== socket.id)
                clients[socket.roomId] = room;
            }
            
            // Broadcast leaving signal to all other users
            socket.broadcast.to(socket.roomId).emit("user leaving call", {otherUser : socket.id})
        })

        
        // On getting signal to join a conversation 
        socket.on("join conversation", ({conversationId, user}) =>{


            socket.conversationId = conversationId;
            const newClient = {
                id : socket.id, 
                email : user.email, 
                userName : user.firstName + " " + user.lastName
            }
            
            if(clients[conversationId])clients[conversationId].push(newClient);
            else clients[conversationId]=[newClient];

            // Adds socket to the room id
            socket.join(conversationId);

            // Sending confirmation of joining the room
            socket.emit("joined conversation");
            console.log("joined convo", socket.conversationId);

        })

        // On getting signal to join a whiteboard
        socket.on("join canvas", ({jamboardId}) => {
            socket.join(jamboardId);
            socket.jamboardId = jamboardId;
        })

        // On getting a request to share the whiteboard data with other users
        socket.on('canvas-data', (data) => {
            
            // Broadcasting the data to other users
            socket.broadcast.to(socket.jamboardId).emit('canvas-data', data)
            
        });

        // On getting a request to send a chat message
        //message contains -> userName, sent time, content of message
        socket.on("send message", ({message}) =>{

            console.log("conversationId is ", socket.conversationId)
            console.log(clients)

            
            // Broadcasting the signal to other users
            socket.broadcast.to(socket.conversationId).emit("recieve message", {message});
            addMessage({message, conversationId : socket.conversationId})
            console.log("sent message", message)
        })

        // On getting request to leave the conversation
        socket.on("leave conversation", () =>{

            const conversationId = socket.conversationId;
            let room = client[conversationId];

            if(room){
                room = room.filter(c => c.id !== socket.id)
                clients[conversationId] = room;
            }
        })

    })

    return server;
}

module.exports = attachWebSockets;