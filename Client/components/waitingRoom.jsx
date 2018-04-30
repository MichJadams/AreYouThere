import React, { Component } from 'react';
import { Link } from 'react-router-dom';


export default class WaitingRoom extends Component{
  render(){
  return (<div>
        <h1 >This is the waitingRoom</h1>
        <div >Theses are players waiting to join or start a maze</div>
        <table className ="waitingPlayers">
        </table>
        <button>Create a Server</button>
        <div className ="waitingServers">Theses are servers waiting for players</div>
        <table className ="waitingServers">

        </table>
    
      </div>)
    }
  }


