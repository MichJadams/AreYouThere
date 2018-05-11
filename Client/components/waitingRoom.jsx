import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {subscribeToServerState } from './client.js'
import maze from './maze.jsx'
export default class WaitingRoom extends Component{
  constructor(props){
    super(props)
    
    const clientInfo = {serverId:props.match.params.id, playing: false}
    this.state = {isMounted: false,id:this.props.match.params, connectedPlayers:[],status:'closed', gameState:{ playing: false}, name:'', capacity:5, proceedToMaze:false}
      if(this.state.isMounted){
        console.log("this is the server state the server is sending and the client in recievning", clientInfo)
        subscribeToServerState(clientInfo,(err,serverState)=>{
        this.setState(serverState)
        // let passingState = this.state
        if(this.state.gameState.playing){
          console.log("THE GAME IS A FOOT")
          // console.log(`going here /${this.state.id}/maze`)
          this.props.history.push({pathname:`/${this.state.id}/maze`})
  
        }
      })
    }
    this.startingAGame = this.startingAGame.bind(this)
  }
  componentDidMount(){
    this.setState({isMounted: true})
    const clientInfo = {serverId:this.state.id, playing: this.state.gameState.playing}

    subscribeToServerState(clientInfo,(err,serverState)=>{
      console.log("this is the server state the server is sending and the client in recievning", clientInfo)
      this.setState(serverState)
      // let passingState = this.state
      if(this.state.gameState.playing){
        console.log("THE GAME IS A FOOT")
        // this.props.match.params.connectedPlayers = this.state.connectedPlayers
        // console.log("the params", this.props.match.params)
        const connectedPlayers = this.state.connectedPlayers
        this.props.history.push({pathname:`/${this.state.id}/maze`, state: {connectedPlayers}})

      }
    })
  }
  componentWillUnmount(){
    this.setState({isMounted: false})
  }
  startingAGame(event){
    if(this.state.isMounted){
      const clientInfo = {serverId:this.state.id, playing: true}
      //here I want to emit and event to the server that changes the gamestate to "starting!" 
      subscribeToServerState(clientInfo,(err,serverState)=>{
        // console.log("starting the game!", serverState)
        // serverState.proceedToMaze = true
        this.setState(serverState)
        
        })
    }
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


