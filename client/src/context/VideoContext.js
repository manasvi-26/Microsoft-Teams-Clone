import React, {createContext, useState, useRef}  from 'react'

export const VideoContext = createContext()

const VideoContextProvider = ({children}) => {

    
    
    return(
        <UserContext.Provider value = {{
          
        }}>
            {children}
        </UserContext.Provider>
    )
}


export default UserContextProvider;

