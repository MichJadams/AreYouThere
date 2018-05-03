import React, { Component } from 'react';
import ReactDom from 'react-dom'
import { render, Link } from 'react-router-dom';
import lobby from './lobby.jsx'
import axios from 'axios';
import { subscribeToServerCookieID } from './client.js';

export default class createServer extends Component{

  constructor(props) {
    super(props);
    subscribeToServerCookieID((err,serverCookieID)=>{
        //hash the cookie id here
        this.setState({id:serverCookieID})
    })
    this.state = {id:null,status: 'open', name: 'lost', capacity:2, gameState: {playing: false}, connectedPlayers:[]};
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleCapacityChange = this.handleCapacityChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleNameChange(event) {
      this.setState({name: event.target.value});
      console.log("this is the name", event.target.value)
  }
  handleStatusChange(event) {
    this.setState({status: event.target.value});
    console.log("this is the status", event.target.value)
}
  handleCapacityChange(event) {
  this.setState({capacity: event.target.value});
  console.log("this capacity", event.target.value)
}

  handleSubmit(event) {
    console.log("this state is", this.state)

    axios.post('/createServer',this.state)
    .then((res)=>{console.log("send create server request")})
    .catch((err)=>{console.log(err)})
    event.preventDefault();
    console.log("id to join!!!!!!", this.state.id)
    
    const tempid = this.state.id
    axios.post('/joinServer',{serverToJoin:tempid})
    .then((res)=>{console.log("this player joined the server(which they made)")})
    .catch((err)=>{console.log(err)})
    event.preventDefault();
  }

  render(){
  return (
    <div className="welcomeContainer">
      <div className="welcomeText">
        <h1>Create your own room/server</h1>
      </div>
            <form onSubmit={this.handleSubmit}>
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
                <button type="submit">submit</button>
              </form>
              <Link to={`/${this.state.id}/waitingRoom`}>Create Server</Link>
        <div>
        </div>
    </div>
  )
  }
}
