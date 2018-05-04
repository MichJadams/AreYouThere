import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {subscribeToServerState } from './client.js'

export default class WaitingRoom extends Component{
  constructor(props){
    super(props)
    
    const clientInfo = {id:props.match.params.id, playing: false}
    subscribeToServerState(clientInfo,(err,serverState)=>{
      console.log("this is the server state the server is sending and the client in recievning", serverState)
      this.setState(serverState)
    })
    this.state = {id:this.props.match.params, connectedPlayers:[],status:'closed', gameState:{ playing: false}, name:'', capacity:5, proceedToMaze:false}
    // console.log("this is the state of the server waiting room", this.state)
    this.startingAGame = this.startingAGame.bind(this)
  }
  startingAGame(event){
    const clientInfo = {id:this.state.id, playing: true}
    //here I want to emit and event to the server that changes the gamestate to "starting!" 
    subscribeToServerState(clientInfo,(err,serverState)=>{
      console.log("starting the game!", serverState)
      serverState.proceedToMaze = true
      this.setState(serverState)
    })
  }
  render(){
  return (<div>
        <h1 >This is the waitingRoom</h1>
        <div>Theses are the players in the waiting room</div>
        <div>There are {this.state.connectedPlayers.length} players connected and this room can fit {this.state.capacity}</div>
        {
          this.state.connectedPlayers.map(player =>{
            return(
              <div key={this.state.connectedPlayers.indexOf(player)}>
                <li >{player.name} has the id of {player.id}</li>
              </div>
            )
          })
        }
        {
          this.state.proceedToMaze?
          <Link to={`/{this.state.id}/maze`}>Continue into the maze</Link>
          :<button onClick={this.startingAGame}>Start the Game</button>
        }
      </div>)
    }
  }


