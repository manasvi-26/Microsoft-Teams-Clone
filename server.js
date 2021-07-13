const express = require("express");
const cors = require("cors");
const connectToDB = require('./infrastructure/database')
const attachWebSockets = require('./infrastructure/webSockets')

//dotenv contains private information
require('dotenv').config({ path: __dirname + '/.env' })

const app = express();


app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 5000;

// get all routes
const userRoutes = require('./routes/userRoutes');
const tokenRoutes = require('./routes/tokenRoutes');
const teamRoutes = require('./routes/teamRoutes')
const channelRoutes = require('./routes/channelRoutes')
const conversationRoutes = require('./routes/conversationRoutes')


// add all routes
app.use('/api/user', userRoutes)
app.use('/api/token', tokenRoutes)
app.use('/api/team', teamRoutes)
app.use('/api/channel', channelRoutes)
app.use('/api/conversation', conversationRoutes)

//required for hosting on heroku
if (process.env.NODE_ENV === 'production') {

    app.use(express.static('client/build'));
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });

}

const main = async() =>{
    //connect to MongoDB
    await connectToDB();
    
    //attach socket code  
    const server = await attachWebSockets(app)

    //start server
    server.listen(PORT, () => console.log(`Server is running on port ${PORT}!!`));

}

main();


