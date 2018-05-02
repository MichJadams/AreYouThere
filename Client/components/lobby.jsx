import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {subscribeToWaitingPlayers,subscribeToServers } from './client.js'

export default class Landing extends Component{
  constructor(){
    super()
    this.state={
      servers:[],
      waitingPlayers:[]
    }
    subscribeToWaitingPlayers((err,waitingPlayers)=>{
      this.setState({waitingPlayers})
    })
    subscribeToServers((err,servers)=>{
      this.setState({servers})
    })
    this.goingToServer =this.goingToServer.bind(this)
  }
 
  goingToServer(event){
    //sending out a socket call where the usered socket it is stuck to the server with the matching name
    // console.log("jkfdlsajflds",event.target.id)
    // console.log("these are the waiting players and thier ids", this.state.waitingPlayers)
    //add the player that cliked to the server they clicked on. 
    axios.post('/joinServer',{serverToJoin:event.target.id})
    .then(res=>{console.log("this player moved into a room")})
    .catch(err=>{console.log("err",err)})
  }

  render(){
    const players = this.state.waitingPlayers
    const servers = this.state.servers
    // console.log("the players", players)
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
                
                <Link to={`/${server.id}/waitingRoom`} >
                <div onClick={this.goingToServer} id={server.id}>{server.name}</div>
                </Link>
                
                
                </li>
              )
            })
          }
          <Link to={"/server/createServer"}><button>Create a Server</button></Link>
        </div>
      </div>)
  } 
}



