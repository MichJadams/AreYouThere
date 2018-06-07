import React, { Component } from 'react';
import ReactDom from 'react-dom'
import { render, Link } from 'react-router-dom';
import lobby from './lobby.jsx'
import axios from 'axios';
import { subscribeToServerCookieID,subscribeToJoinServer } from './client.js';

export default class createServer extends Component{

  constructor() {
    super();
    subscribeToServerCookieID((err,serverCookieID)=>{
        //hash the cookie id here
        this.setState({id:serverCookieID})
    })
    this.state = {id:null,status: 'open', name: 'lost', capacity:2, gameState: {playing: false}, connectedPlayers:[], serverSubmitted: false};
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleCapacityChange = this.handleCapacityChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleNameChange(event) {
      this.setState({name: event.target.value});
      // console.log("this is the name", event.target.value)
  }
  handleStatusChange(event) {
    this.setState({status: event.target.value});
    // console.log("this is the status", event.target.value)
}
  handleCapacityChange(event) {
  this.setState({capacity: event.target.value});
  // console.log("this capacity", event.target.value)
}

  handleSubmit(event) {
    axios.post('/createServer',this.state)
    .then((res)=>{
      const tempid = this.state.id
      subscribeToJoinServer(tempid)
      this.props.history.push({pathname:`/${tempid}/waitingRoom`})
    })
    .catch((err)=>{console.log(err)})
  }

  render(){
  return (
    <div className='creatServerContainer'>
      <div className='createServerHeader'>
        Create your own room/server
      </div>
            <form onSubmit={this.handleSubmit} className='createServerForm'>
              <label>
                Name of Room:
                <input type="text" value={this.state.name} onChange={this.handleNameChange} />
              </label>
              <label>
                status?(open or closed to public):
                <select value={this.state.status} onChange={this.handleStatusChange}>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
                </label>
                <label>
                    number of people you want to host:
                  <input type="number" value={this.state.capacity} onChange={this.handleCapacityChange} />
                </label>
                <button autoFocus type="button" onClick={this.handleSubmit}>Create Server</button>
                </form>
                <div>
                </div>
                </div>
              )
            }
          }