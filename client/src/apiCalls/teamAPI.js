import axios from'axios'
import { createChainedFunction } from '@material-ui/core'


{/**
  DESCRIPTION: Gets the all the data of requested team
  METHOD: POST
  BODY: team ID
  RETURN VALUE: Team data
*/}

export const getTeamData = async({teamId})=>{
  
  const token = localStorage.getItem('token')

  try{
      const res = await axios.post('/api/team/getTeam' , {teamId})
      return {team : res.data.team, error : false}
    }
    catch(err){
      return { err : true, errMsg : err}
    }
}

{/**
  DESCRIPTION: get all the teams user is part of
  METHOD: GET
  HEADER: JWT Token
  RETURN VALUE: List of Teams
*/}

export const getAllTeams = async() => {

  const token = localStorage.getItem('token')
  try{
    let res = await axios.get('/api/team/getAllTeams' , 
                                {headers : {'x-auth-token': token}
                            })
    return {teams : res.data.myTeams, error : false}
  }
  
  catch(err){
    return { err : true, errMsg : err}
  }
}

{/**
  DESCRIPTION: exit specified team
  METHOD: POST
  HEADER: JWT Token
  BODY: Team ID
*/}
export const leaveTeam = async({teamId}) => {
  const token = localStorage.getItem('token')

  try{
    let res = await axios.post('/api/team/leaveTeam', 
                                {teamId},
                                {headers : {'x-auth-token': token}
                              })
    return {err : false}
  }

  catch(err){
    return { err : true, errMsg : err}
  }
}

{/**
  DESCRIPTION: create a new team
  METHOD: POST
  HEADER: JWT Token
  BODY: Object of Team that is being created
  RETURN VALUE: NULL
*/}
export const createNewTeam = async({newTeam}) =>{
  const token = localStorage.getItem('token')

  try{
    let res = await axios.post('/api/team/createNewTeam' , 
                                newTeam,
                                {headers : {'x-auth-token': token}
                              });

    return { err : false }
  }
  
  catch(err){
    return { err : true, errMsg : err}
  }
}

{/**
  DESCRIPTION: get all members in specified team
  METHOD: POST
  BODY: Team ID
  RETURN VALUE: List of Members
*/}

export const getAllMembers = async({teamId}) =>{
  const token = localStorage.getItem('token')

  try{
    let res = await axios.post('/api/team/getAllMembers', {teamId});
    return { err : false , allMembers : res.data.users}
  }
  
  catch(err){
    return { err : true, errMsg : err}
  }
}

{/**
  DESCRIPTION: adds a new member to the specified team
  METHOD: POST
  BODY: Object containing email of new member and team Id 

*/}

export const addNewMember = async({email, teamId}) =>{
  const token = localStorage.getItem('token')

  try{
    const res = await axios.post('/api/team/addMember', {email, teamId});

    return { err : false}
  }
  
  catch(err){
    return { err : true, errMsg : err}
  }
}