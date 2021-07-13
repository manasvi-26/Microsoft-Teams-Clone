import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import Home from './screens/Home'
import Register from './screens/Register'
import Login from './screens/Login'
import MyTeams from './screens/MyTeams'
import Channel from './screens/Channel'
import Meet from './screens/Meet'
import Conversation from './screens/Conversation'
import Container from './screens/Container'


import AlertContextProvider from './context/AlertContext' 
import UserContextProvider from './context/UserContext' 
import ModalContextProvider from './context/ModalContext' 


const App = () => {
    
    return(
        
        <AlertContextProvider>
            <UserContextProvider>
                <ModalContextProvider>
                <Router>
                    
                    <Route path='/' exact component={Home}/>
                    <Route path='/register' component={Register}/>
                    <Route path='/login' component={Login}/>
                    <Route path='/myTeams' component={MyTeams}/>
                    <Route path = '/channel' component={Channel} />
                    <Route path = '/meet' component={Meet} />
                    <Route path = '/conversation' component={Conversation} />
                    <Route path='/whiteboard' exact component={Container}/>
                    
                    
                </Router>
                </ModalContextProvider>
            </UserContextProvider>
        </AlertContextProvider>
       
    )
}

export default App;