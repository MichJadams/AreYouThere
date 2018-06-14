import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {subscribeToWaitingPlayers,subscribeToServers, subscribeToHighScores, subscribeToJoinServer } from './client.js'

export default class Landing extends Component{
  constructor(props){
    super(props)
    this.state={
      servers:{},
      waitingPlayers:[],
      serverJoinable: false,
      highScores:[{players:[{name:'bestplayer'}],score:100}] //an array of objects with players and score keys. The players are the players in the map
    }
    subscribeToWaitingPlayers((err,waitingPlayers)=>{
      this.setState({waitingPlayers})
    })
    subscribeToServers((err,servers)=>{
      this.setState({servers})
    })
    subscribeToHighScores((err,highScores)=>{
      console.log("scores I got back")
      this.setState({highScores})
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
        <div className ="waitingServers">
        <h4>High scores</h4>
        {
          this.state.highScores.map((game)=>{
            return <div className="lobbyText">players: {game.players.map(player=>player.name.concat(",  "))} scored {game.score}</div>
          })
        }
        </div>
      </div>)
  } 
}




