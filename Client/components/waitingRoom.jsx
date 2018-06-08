import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {subscribeToServerState, subscribeToServerCookieID } from './client.js'
import maze from './maze.jsx'
export default class WaitingRoom extends Component{
  constructor(props){
    super(props)

    this.state = {mazeType:'one',
    isMounted: false,
    id:this.props.match.params, 
    connectedPlayers:[],
    status:'closed', 
    gameState:{ playing: false}, 
    name:'', 
    capacity:5, 
    proceedToMaze:false}
    if(this.state.isMounted){
      const clientInfo = {serverId:props.match.params.id, playing: false}
        subscribeToServerState(clientInfo,(err,serverState)=>{
        this.setState(serverState)
        if(this.state.gameState.playing){
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
      this.setState(serverState)
      if(this.state.gameState.playing){
        const connectedPlayers = this.state.connectedPlayers
        this.props.history.push({pathname:`/${this.state.id}/maze`, state: {connectedPlayers}, mazeType:serverState.mazeType, cube: serverState.cube})
      }
    })
  }
  componentWillUnmount(){
    this.setState({isMounted: false})
  }
  startingAGame(){
    if(this.state.isMounted){
      const clientInfo = {serverId:this.state.id, playing: true}
      subscribeToServerState(clientInfo,(err,serverState)=>{
        this.setState(serverState)
        })
    }
  }

  render(){
    const id = this.state.id
  return (<div className='waitingRoomContainer'>
        <div className='waitingRoomTextBanner'>This is the waitingRoom</div>
        <div className='waitingRoomTextinstructions'>Objective: Navigate the white box in a little time as possible </div>
        <div className='waitingRoomTextinstructions'>rules: vote for a move direction using w,a,s,d,e and q. </div>
        <div className='waitingRoomTextinstructions'>w = forward, a = left, s = backward,d = right, e = up, q = down </div>
        <div className='waitingRoomTextinstructions'>Once all the players have voted, if they agree the cube moves. If not, you may recast your votes</div>
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


