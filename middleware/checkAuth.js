const jwt = require('jsonwebtoken')
const User = require('../models/User');

{/*

    auth is used as a middleware.
    Checks if the Json Web Token passed in the headers from the client side,
    is valid or not.

    If not valid, requested method cannot be accessed.

*/}

module.exports = async(req , res  , next) => {

    //aquire JWT token
    const token = req.header('x-auth-token')
    
    console.log("SHOULD COME HERE", token);

    //if token does not exist return invalid
    if(token === null){
        return res.status(401).json({message : 'Unauthorized! No token'})
    }

    

    try{

        console.log("JWT ERRORSSSS")
        console.log(token)
        //Verify if its a valid JWT token
        //decoded contains users unique id and password
        const decoded = jwt.verify(token ,process.env.SECRET_KEY)

       
       
        if(!decoded) return res.status(401).json({
            message : "Invalid Token"
        })

       
        //check if user exists in database
        const user = await User.findById(decoded.id);
        

        if(!user){
            return res.status(401).json({message : 'User does not exist'})
        }
        
        req.body.user = user

        //authorization done!
        next()
    }
    catch(e){

        console.log(e)
        res.status(400).json({
            message:'Token not valid'
        })
    }
}
