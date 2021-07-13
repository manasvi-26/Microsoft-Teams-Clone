import React, {createContext, useState}  from 'react'
import { useHistory } from "react-router-dom";
import axios from'axios';


export const UserContext = createContext()

const UserContextProvider = ({children}) => {

    const getUserData = async() => {

        try{
            
            const token = localStorage.getItem('token');
            
            const res = await axios.get('/api/token/isTokenValid' , {headers : {'x-auth-token': token}})
            
            console.log(res.data.user)
            return (res.data.user)
            
        }
        catch(err){
            console.log(err)
            return (err);
            
        }
    }
    
    return(
        <UserContext.Provider value = {{
          getUserData
        }}>
            {children}
        </UserContext.Provider>
    )
}


export default UserContextProvider;

