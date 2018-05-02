import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {subscribeToWaitingPlayers,subscribeToServers } from './client.js'

export default class Landing extends Component{
  constructor(){
    super()
    subscribeToWaitingPlayers((err,waitingPlayers)=>{
      console.log("whus is this never called???")
      console.log("updating the state of the waiting players", waitingPlayers)
      this.setState({waitingPlayers})
    })
    subscribeToServers((err,servers)=>{
      console.log("whus is this never called???")
      console.log("updating the state of the servers", servers)
      this.setState({servers})
    })
    this.state={
      servers:[],
      waitingPlayers:[]
    }    
  }

  render(){
    const players = this.state.waitingPlayers
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
                <Link to={`\servers\${server.id}\waitingRoom`}>
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



