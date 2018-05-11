import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {subscribeToWaitingPlayers,subscribeToServers, subscribeToServerState } from './client.js'

export default class Landing extends Component{
  constructor(props){
    super(props)
    this.state={
      servers:[],
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
    this.goingToServer =this.goingToServer.bind(this)
  }
 
  goingToServer(event){
    //sending out a socket call where the usered socket it is stuck to the server with the matching name
    // console.log("jkfdlsajflds",event.target.id)
    // console.log("these are the waiting players and thier ids", this.state.waitingPlayers)
    //add the player that cliked to the server they clicked on. 
    // this.setState({servers:{serverJoinable:true}})
    // console.log("the event", event)
    const serverID = event.target.id
    axios.post('/joinServer',{serverToJoin:serverID})
    .then(()=>{
      // console.log("here?")
      this.props.history.push({pathname:`/${serverID}/waitingRoom`})
    })
    .catch(err=>{console.log("err",err)})

  }

  render(){
  return(  
        <div className="lobbyContainer"> 
        <div className ="waitingPlayers">
        <h4>Theses are players waiting to join or start a maze</h4>
          {
            this.state.waitingPlayers.map(player =>{
              return(
                  <li key={this.state.waitingPlayers.indexOf(player)}>{player.name}</li>
              )
            })
          }
          </div>
          <div className ="waitingServers">
          <h4>Theses are servers waiting for players</h4>
          {
            this.state.servers.map(server =>{
              // console.log("server.gamestate.player",server.gameState.playing)
              if(server.gameState.playing === false){
                return(
                  <li key={server.id}>{server.name}
                  <button onClick={this.goingToServer} id={server.id}> Join Server</button>
                  </li>)
              }
            })
          }
          <Link to={"/server/createServer"}><button>Create a Server</button></Link>
        </div>
      </div>)
  } 
}

// <Link to={`/${server.id}/waitingRoom`}>{server.name}</Link>




