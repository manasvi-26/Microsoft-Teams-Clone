import React, {createContext, useState}  from 'react'

export const ModalContext = createContext()

const ModalContextProvider = ({children}) => {
    
    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [showModal3, setShowModal3] = useState(false);


    const setModal = (val) =>{
        setShowModal(val)
    }

    const setModal2 = (val) =>{
        setShowModal2(val)
    }

    const setModal3 = (val) => {
        setShowModal3(val)

    }

    return(
        <ModalContext.Provider value = {{
            
            showModal,
            setModal,
            showModal2,
            setModal2,
            showModal3,
            setModal3,
            
        }}>
            {children}
        </ModalContext.Provider>
    )
}


export default ModalContextProvider;