import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import style from '../assests/styes/landing.css';

export default class WaitingRoom extends Component{
  render(){
  return (<div>
        <h1 >This is the waitingRoom</h1>
        <div >Theses are players waiting to join or start a maze</div>
        <table class ="waitingPlayers">
        </table>
        <button>Create a Server</button>
        <div class ="waitingServers">Theses are servers waiting for players</div>
        <table class ="waitingServers">

        </table>
    
      </div>)
    }
  }


