import React from 'react' 
import ReactDom from 'react-dom'
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'
//components
import Landing from './components/landing.jsx'
import Lobby from './components/lobby.jsx'
import WaitingRoom from './components/waitingRoom.jsx'


ReactDom.render(
    <Router>
    <Switch>
        <Route path='/' component={Landing}/>
        <Route path='/lobby' component={Lobby}/>
        <Route path='/waitingRoom' component={WaitingRoom}/>
    </Switch>
    </Router>
   ,
    document.getElementById('root'))