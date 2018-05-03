import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {subscribeToServerState } from './client.js'

export default class WaitingRoom extends Component{
  constructor(props){
    super(props)
    
    const serverId = props.match.params.id
    subscribeToServerState(serverId,(err,serverState)=>{
      // console.log("this is the server state the server is sending and the client in recievning", serverState)
      this.setState(serverState)
    })
    this.state = {id:this.props.match.params, connectedPlayers:[],status:'closed', gameState:{}, name:'', capacity:5}
    // console.log("this is the state of the server waiting room", this.state)
  }
  render(){
  return (<div>
        <h1 >This is the waitingRoom</h1>
        <div>Theses are the players in the waiting room</div>
        <div>There are {this.state.connectedPlayers.length} players connected and this room can fit {this.state.capacity}</div>
        {
          this.state.connectedPlayers.map(player =>{
            return(
              <div>
                <li key={this.state.connectedPlayers.indexOf(player)}>{player.name} has the id of {player.id}</li>
              </div>
            )
          })
        }
        <button>Start the game</button>
        <Link to={`this.state.id}/maze`}></Link>
      </div>)
    }
  }


