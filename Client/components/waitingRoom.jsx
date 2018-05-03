import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {subscribeToServerWaitingRoomCapacity,subscribeToServerState } from './client.js'

export default class WaitingRoom extends Component{
  constructor(props){
    super(props)
    
    const serverId = props.match.params.id
    subscribeToServerState(serverId,(err,serverState)=>{
      console.log("this is the server state the server is receivening", serverState)
      this.setState(serverState)
    })
    this.state = {id:this.props.match.params, connectedPlayers:[],status:'closed', gameState:{}, name:'',}
    console.log("this is the state of the server waiting room", this.state)
  }
  render(){
    const players = [{name: 'fakename',id:'thisisafakeplayerid'},{name: 'seoncdfakename',id:'thisisasecondfakeplayerid'}]
  return (<div>
        <h1 >This is the waitingRoom</h1>
        <div>Theses are the players in the waiting room</div>
        {
          players.map(player =>{
            return(
                <li key={players.indexOf(player)}>{player.name}</li>
            )
          })
        }
      </div>)
    }
  }


