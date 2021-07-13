const mongoose = require('mongoose')

// Module Function to initiate connection with MongoDB
const connectToDB = async() => {
    try{
        await mongoose.connect(process.env.MONGODB_URI,{
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        })
        
        console.log("Database connected!")
    }
    catch(err){

        console.log('Cannot Connect to Database!')   
    }
}

module.exports = connectToDB;