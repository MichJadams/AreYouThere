import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {subscribeToServerState } from './client.js'
import maze from './maze.jsx'
export default class WaitingRoom extends Component{
  constructor(props){
    super(props)
    
    const clientInfo = {id:props.match.params.id, playing: false}
    subscribeToServerState(clientInfo,(err,serverState)=>{
      // console.log("this is the server state the server is sending and the client in recievning", serverState)
      this.setState(serverState)
      let passingState = this.state
      if(this.state.gameState.playing){
        console.log("THE GAME IS A FOOT")
        // console.log(`going here /${this.state.id}/maze`)
        this.props.history.push({pathname:`/${this.state.id}/maze`, state:{state:passingState}})

      }
    })
    this.state = {id:this.props.match.params, connectedPlayers:[],status:'closed', gameState:{ playing: false}, name:'', capacity:5, proceedToMaze:false}
    this.startingAGame = this.startingAGame.bind(this)
  }
  startingAGame(event){
    const clientInfo = {id:this.state.id, playing: true}
    //here I want to emit and event to the server that changes the gamestate to "starting!" 
    subscribeToServerState(clientInfo,(err,serverState)=>{
      // console.log("starting the game!", serverState)
      serverState.proceedToMaze = true
      this.setState(serverState)
      
      })
  }
  render(){
    const id = this.state.id
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
          <Link to={`/${this.state.id}/maze`}>Continue into the maze</Link>
          :<button onClick={this.startingAGame}>Start the Game</button>
        }
        {
          this.state.gameState.playing?<h1>PLAYING</h1>: <h1>not playing</h1>
        }
      </div>)
    }
  }


