import React from 'react' 
import ReactDom from 'react-dom'
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'
//components
import landing from './components/landing.jsx'
import lobby from './components/lobby.jsx'
import waitingRoom from './components/waitingRoom.jsx'
import createServer from './components/createServer.jsx'

ReactDom.render(
    <Router>
    <Switch>
        <Route exact path='/' component={landing}/>
        <Route path='/lobby' component={lobby}/>
        <Route exact path='/server/createServer' component={createServer} />
        <Route path='/server/:id/waitingRoom' component={waitingRoom}/>
        </Switch>
    </Router>
   ,
    document.getElementById('root'))