import React, {createContext, useState}  from 'react'

export const AlertContext = createContext()

const AlertContextProvider = ({children}) => {
    
    const [show,setShow] = useState(false);
    const [msg,setMsg] = useState('');
    const [type,setType] = useState(2);


    const setAlert = (show, msg, type) =>{
        
        setShow(show);
        setMsg(msg);
        setType(type);
    }


    return(
        <AlertContext.Provider value = {{
            show,
            msg,
            type,
            setAlert
        }}>
            {children}
        </AlertContext.Provider>
    )
}


export default AlertContextProvider;