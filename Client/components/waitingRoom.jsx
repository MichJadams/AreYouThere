import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {subscribeToServerState, subscribeToServerCookieID } from './client.js'
import maze from './maze.jsx'
export default class WaitingRoom extends Component{
  constructor(props){
    super(props)
    
    const clientInfo = {serverId:props.match.params.id, playing: false}
    this.state = {mazeType:'one',isMounted: false,id:this.props.match.params, connectedPlayers:[],status:'closed', gameState:{ playing: false}, name:'', capacity:5, proceedToMaze:false}
      if(this.state.isMounted){
        // console.log("this is the server state the server is sending and the client in recievning", clientInfo)
        subscribeToServerState(clientInfo,(err,serverState)=>{
          // console.log("")
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
      console.log("this is the server state the server is sending and the client in recievning", serverState)
      this.setState(serverState)
      // let passingState = this.state
      if(this.state.gameState.playing){
        console.log("THE GAME IS A FOOT")
        // this.props.match.params.connectedPlayers = this.state.connectedPlayers
        // console.log("this is", this.props.match.params)
        const connectedPlayers = this.state.connectedPlayers
        this.props.history.push({pathname:`/${this.state.id}/maze`, state: {connectedPlayers}, mazeType:serverState.mazeType, cube: serverState.cube})

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
  return (<div className='waitingRoomContainer'>
        <div className='waitingRoomTextBanner'>This is the waitingRoom</div>
        <div className='waitingRoomText'>Theses are the players in the waiting room</div>
        <div className='waitingRoomText'>There are {this.state.connectedPlayers.length}/{this.state.capacity} players connected</div>
        {
          this.state.connectedPlayers.map(player =>{
            return(
              <div className='waitingRoomText' key={this.state.connectedPlayers.indexOf(player)}>
                <ul>{player.name} has the id of {player.id}</ul>
              </div>
            )
          })
        }
        {
          this.state.proceedToMaze?
          <Link to={`/${this.state.id}/maze`}>Continue into the maze</Link>
          :<button className='waitingRoombtn'onClick={this.startingAGame} autoFocus>Start the Game</button>
        }
        {
          this.state.gameState.playing?<h1>The server has failed to start</h1>: <div className='waitingRoomText'>ServerStatus: waiting for friends</div>
        }
      </div>)
    }
  }


