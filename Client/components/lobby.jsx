import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {subscribeToWaitingPlayers,subscribeToServers, subscribeToServerState, subscribeToJoinServer } from './client.js'

export default class Landing extends Component{
  constructor(props){
    super(props)
    this.state={
      servers:{},
      waitingPlayers:[],
      serverJoinable: false
    }
    subscribeToWaitingPlayers((err,waitingPlayers)=>{
      // console.log("waiting players on the server", waitingPlayers)
      this.setState({waitingPlayers})
      // console.log("waiting players", this.state.waitingPlayers)
      // this.forceUpdate()
    })
    subscribeToServers((err,servers)=>{
      this.setState({servers})
    })
    this.goingToServer = this.goingToServer.bind(this)
  }
  goingToServer(event){
    const serverID = event.target.id
    subscribeToJoinServer(serverID)
      this.props.history.push({pathname:`/${serverID}/waitingRoom`})
  }

  render(){
  return(  
        <div className="lobbyContainer"> 
        <div className ="waitingPlayers">
        <h4>Theses are players waiting to join or start a maze</h4>
          {
            this.state.waitingPlayers.map(player =>{
                if(player.inGame === false){
                  return <li className ="lobbyText" key={this.state.waitingPlayers.indexOf(player)}>{player.name}</li>
                }
              
            })
          }
          </div>
          <div className ="waitingServers">
          <h4>Theses are servers waiting for players</h4>
          {
            Object.keys(this.state.servers).map(server =>{
              console.log("server.gamestate.player",this.state.servers)
              if(this.state.servers[server].gameState.playing === false){
                return(
                  <li className ="lobbyText" key={this.state.servers[server].id}>{this.state.servers[server].name}
                  <button onClick={this.goingToServer} id={this.state.servers[server].id}> Join Server</button>
                  </li>)
              }
            })
          }
          <Link to={"/server/createServer"}><button className="serverButton" autoFocus>Create a Server</button></Link>
        </div>
      </div>)
  } 
}

// <Link to={`/${server.id}/waitingRoom`}>{server.name}</Link>




