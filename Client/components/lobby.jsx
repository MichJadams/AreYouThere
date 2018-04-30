import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// const servers={}
// const players = {'stringofletter':{name: 'tim'}, 'randomanotherstring': {name: 'allan'}}



export default class Lobby extends Component{
  constructor(props){
    super(props)
    this.setState(props)
    console.log("the props inside the lobby", this.props)
    console.log("this is the state", this.state)
  }  
  render(){
    // const players = this.props.players
  return(  
        <div className="lobbyContainer"> 
        <div>Theses are players waiting to join or start a maze</div>
        <div className ="waitingPlayers">
          {<li>testing</li>}
        </div>
        <button>Create a Server</button>
        <div className ="waitingServers">Theses are servers waiting for players</div>
      </div>)
    }
  }


