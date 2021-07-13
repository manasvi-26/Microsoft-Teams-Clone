const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/User')

{/**
    REGISTER NEW USER
*/}
exports.register = async(req,res) => {

    const {firstName , lastName, email , password } = req.body;

    try{
        // check if email already exists in the users db
        const user = await User.findOne({email})
        if(user){
            return res.status(409).json({
                message : "Email already Exists"
            })
        }

        //hash the password using bcrypt - save this hashed password in the db
        //(bcrypt is a password-hashing function) 
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt)

        //save user
        const new_user = await new User({
            firstName,
            lastName,
            email,
            password: hash,
            teams : [],
            privateChannels : []
        }).save()
        return res.status(201).json({
            message: 'Your account has been created ! Please Sign In'
        })

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message : 'Something went wrong, Please try again'
        })
    }
    
}

{/**
    USER LOGIN
 */}
 exports.login = async(req,res) => {

    const {email , password } = req.body
    try{
        //check if user exists using email (only unique emails stored in db)
        const user = await User.findOne({email})
        if(!user){
            return res.status(409).json({
                message : "User doesn't exist",
            })
        }
        
        //compare the hashed password stored in db and password sent from client side
        const isMatch = await bcrypt.compare(password , user.password)
        if(!isMatch)  {
            return res.status(400).json({
                message:"Invalid Credentials"
            })
        }

        //send back a JWT token to the client
        //this token will be used for authorization when client requests a method ( checkauth.js middleware )
        //JWT token created using users email, mongo id,firstName, and jwt secret key
        jwt.sign(
            {
                id: user.id , email:user.email
            },
            process.env.SECRET_KEY,
            (err , token) => {
                if(err) throw err;

                res.status(200).json({
                    token,
                    user:{
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email:user.email
                    }
                })
            }
        )
    }
    catch(err){
        return res.status(500).json({
            message : 'Something went wrong, Please try again'
        })
    }
    
}


{/*
    GET USER DATA 
*/}

exports.getUser = async(req,res) => {
    
    const {email} = req.body;

    try{
        //get user data using email (email is unique in db)
        const userData = await User.findOne({email})
        if(!userData){
            return res.status(400).json({
                message : 'User does not exist!'
            })
        }
        return res.status(200).json({
            message : 'Valid User',
            userData
        })
    }
    catch(err){
        return  res.status(500).json({
            message : 'Something went wrong, Please try again'
        })
    }
}
