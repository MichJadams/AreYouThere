import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
// const servers={}
// const players = {'stringofletter':{name: 'tim'}, 'randomanotherstring': {name: 'allan'}}



export default class Landing extends Component{
  constructor(){
    super()
    this.state={
      servers:[{id:3, name:'hardcoded'},{id:6, name:'nest'}],
      players:[{name: 'tester'},{name: 'bettername'}]
    }
 
    console.log("this is the state from the lobby", this.state)
  }
   componentDidMount(){
    axios.get('/lobby/servers')
    .then(res=>res.data)
    .then(servers=>{
      this.setState({servers:servers})
      console.log("what the client got back from the server, servers", servers)
      console.log("this is the state now", this.state)
    })
    axios.get('/lobby/players')
    .then(res=>res.data)
    .then(players=>{
      this.setState({players:players})
      console.log("what the client got back from the server, players", players)
      console.log("this is the state now", this.state)
    })
   }
  render(){
    const players = this.state.players
    const servers = this.state.servers
    console.log("the players", players)
  return(  
        <div className="lobbyContainer"> 
        <div className ="waitingPlayers">
        <h4>Theses are players waiting to join or start a maze</h4>
          {
            players.map(player =>{
              return(
                  <li key={players.indexOf(player)}>{player.name}</li>
              )
            })
          }
          </div>
          <div className ="waitingServers">
          <h4>Theses are servers waiting for players</h4>
          {
            servers.map(server =>{
              return(
                <li key={server.id}>
                <Link to={`\servers\${server.id}`}>
                <div>{server.name}</div>
                </Link>
                </li>
              )
            })
          }
          <button>Create a Server</button>
        </div>
      </div>)
  } 
}



