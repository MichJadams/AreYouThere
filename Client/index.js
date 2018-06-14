import React from 'react' 
import ReactDom from 'react-dom'
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'
//components
import landing from './components/landing.jsx'
import lobby from './components/lobby.jsx'
import waitingRoom from './components/waitingRoom.jsx'
import createServer from './components/createServer.jsx'
import maze from './components/maze.jsx'
ReactDom.render(
    <Router>
    <Switch>
        <Route exact path='/' component={landing}/>
        <Route path='/lobby' component={lobby}/>
        <Route path='/server/createServer' component={createServer} />
        <Route exact path='/:id/waitingRoom' component={waitingRoom}/>
        <Route exact path='/:id/maze' component={maze}/>
        </Switch>
    </Router>
   ,
    document.getElementById('root'))