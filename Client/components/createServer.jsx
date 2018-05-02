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
    this.state = {id:null,status: 'open', name: '', capacity:2};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
      this.setState({name: event.target.value});
      console.log("this is the event", event.target.value)
  }

  handleSubmit(event) {
    console.log("this state is", this.state)

    axios.post('/createServer',this.state)
    .then((res)=>{console.log(res)})
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
                <input type="text" value={this.state.name} onChange={this.handleChange} />
              </label>
              <label>
              status?(open or closed to public):
              <input type="text" value={this.state.status} onChange={this.handleChange} />
            </label>
            <label>
            number of people you want to host:
            <input type="text" value={this.state.capacity} onChange={this.handleChange} />
          </label>
              <button type="submit">submit</button>
              </form>
              <Link to={"/lobby"} params={{userName:this.state.value}}>link</Link>
        <div>
        </div>
    </div>
  )
  }
}
