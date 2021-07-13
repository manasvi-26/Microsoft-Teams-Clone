const Team = require('../models/Team');
const User = require('../models/User');
const Channel = require('../models/Channel');

//INSERT A NEW TEAM

exports.createNewTeam = async(req,res) => {
    
    const {user, teamName, description} = req.body;

    const newTeam = {
        users : [user._id],
        teamName,
        description,
    }
    
    try{

        // save the new team
        const team = await new Team(newTeam).save()
        
        // push the new team in the User's teams field
        await User.updateOne({_id : user._id},{$push : {teams : team._id}});

        newChannel = {

            teamId : team._id,
            channelName : "General",
        
        }
        

        // Add default General channel
        const channel = await new Channel(newChannel).save() 
        
        await Team.updateOne({_id : team._id}, {$push : {channels : {channelId : channel._id, channelName : "General"}}})

        return res.status(201).json({
            message: 'Your Team has been created!',
            team
        })

    }
    catch(err){

        console.log(err);
        return res.status(500).json({

            message : 'Something went wrong, Please try again'
        })
    }
   
}

//GET TEAM DATA 

exports.getTeam = async( req, res) => {

    const {teamId} = req.body;
    console.log("team called", teamId)
    try{

        // Fetch the row
        const team = await Team.findOne({"_id" : teamId});
        if(!team){
            return res.status(400).json({
                
                message : 'Team Does not exist'

            })
        }
        console.log(team);
        return res.status(200).json({
            message : 'Success',
            team

        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({  
            message : 'Something went wrong, Please try again'
        })
    }
}


//GET ALL TEAMS OF USER:

exports.getAllTeams = async(req,res) => {

    const {user} = req.body

    const teams = user.teams
    

    try{
        // Fetch the required rows
        const myTeams = await Team.find({"_id" : {"$in" : teams}});

        res.status(200).json({
            myTeams
        })
    }
    catch(err){

        return res.status(500).json({  
            message : 'Something went wrong, Please try again'
        })
    }

}

//GET ALL USERS OF TEAM 

exports.getAllMembers = async(req, res) => {

    const {teamId} = req.body;
    // console.log(teamId)
    try{

        // Fetch the row
        const team = await Team.findOne({_id : teamId});
        
        // Get all users from the users field
        const users = await User.find({"_id" : {"$in" : team.users}});

        res.status(200).json({
            users
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({  
            message : 'Something went wrong, Please try again'
        })
        
    }
}

//ADD MEMBER TO TEAM

exports.addMember = async(req,res) => {
    
    const { email, teamId} = req.body;

    // console.log('want to add user', {email, teamId})

    try{
        // Fetch row by email
        const user = await User.findOne({email})
        if(!user){

            return res.status(400).json({
                message : 'User does not exist!'
            })   
        }

        // Check for already existing
        if(user.teams.includes(teamId)){
            return res.status(400).json({
                message : 'User in Team already'
            }) 
        }

        // Push the user id 
        await Team.updateOne({_id : teamId},{$push : {users : user._id}})
        
        // Push the team id
        await User.updateOne({_id : user._id}, {$push : {teams : teamId}})
    
        return res.status(200).json({
            message : 'Succesfully Added User To The Team',
            user
        })   
    }
    catch(err){
        console.log(err);
        return res.status(500).json({  
            message : 'Something went wrong, Please try again'
        })

    }
}

// DELETE MEMBER FROM TEAM

exports.deleteMember = async(req,res) => {

    const {email, teamId} = req.body;
    try{
        // Fetch and update by deleting from teams field
        let user = User.findOne({email})
        User.updateOne({email},{"$pull" : {teams : teamId}})

        // Pull the user id
        Team.updateOne({"_id" : teamId}, {"$pull"  : {users : user._id}})


        return res.status(200).json({
            message : 'Succesfully Removed User From The Team',
        }) 

    }
    catch(err){

        console.log(err);
        return res.status(500).json({  
            message : 'Something went wrong, Please try again'
        })
    }
}

//CREATE NEW CHANNEL

exports.createChannel = async(req,res) =>{

    const {teamId, channelName} =req.body;

    const newChannel = {
        teamId,
        channelName
    }

    try{
        
        // Save the new channel
        const channel = await new Channel(newChannel).save();

        // Update Team add in channels
        await Team.updateOne({_id : teamId}, {$push : {channels : {channelId : channel._id, channelName }}});

        return res.status(201).json({
            message: 'Your Channel has been created!',
            channel
        })

    }
    catch(err){
        console.log(err);
        return res.status(500).json({  
            message : 'Something went wrong, Please try again'
        })
    }
}


//LEAVE TEAM

exports.leaveTeam = async(req,res)=>{

    const {teamId, user} = req.body;

    try{
        //delete user from teamId's users list
        await Team.updateOne({_id : teamId}, {$pull : {users : user._id}})


        //delete teamId from users's team list
        await User.updateOne({_id : user.id}, {$pull : {teams : teamId}})
        return res.status(201).json({
            message: 'Left Team',
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({  
            message : 'Something went wrong, Please try again'
        })
    }
}
