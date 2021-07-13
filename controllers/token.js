const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/User')

// Check validity of token
exports.isTokenValid = async(req,res) => {
    
    try{
        // Fetch header
        const token = req.header('x-auth-token');

        if(!token){

            return res.json({
                message : "Unautherized! No Token",
                isValid : false
            })
        }

        // Decode the fetched token (jwt)
        const decoded = jwt.verify(token , process.env.SECRET_KEY)
        
        if(!decoded) return res.json({
            message : "Invalid Token",
            isValid : false
        })

        // Fetch the user from the decoded id
        const user = await User.findById(decoded.id)

        if(!user) return res.json({
            message : "User Does Not Exist!",
            isValid : false
        })

        return res.json({
            isValid : true,
            user,
            message : "You Can Access this Page"
        })
        
    }
    catch(err){
        console.log(err);
        res.status(400).json({
            message:'Something Went Wrong! Try Again',
            isValid : false
        })
    }
}

