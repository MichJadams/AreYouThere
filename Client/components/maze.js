import React, { Component } from 'react';
import ReactDom from 'react-dom'
import { render, Link } from 'react-router-dom';
import lobby from './lobby.jsx'
import Client, { subscribeToTimer } from './client.js'


export default class Landing extends Component{

  constructor(props) {
    super(props);
    subscribeToTimer((err,timestamp)=>{this.setState({
      timestamp
    })})
    this.state = {timestamp:'no timestamp yet', value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    console.log("this state is", this.state)
    // Client.playerJoined()
    event.preventDefault();
  }

  render(){
  return (
      
        
        
        <div className="App">
        <p className="App-intro">
        This is the timer value: {this.state.timestamp}
        </p>
      </div>
     
  )
  }
}
