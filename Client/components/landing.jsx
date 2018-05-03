import React, { Component } from 'react';
import ReactDom from 'react-dom'
import { render, Link } from 'react-router-dom';
import lobby from './lobby.jsx'
import axios from 'axios';

export default class Landing extends Component{

  constructor(props) {
    super(props);
    this.state = {timestamp:'no timestamp yet', value: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    // console.log("this is the state", this.state)
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    // console.log("this state is", this.state)
    // Client.playerJoined()

    axios.post('/name',{name: this.state.value})
    .then((res)=>{console.log(res)})
    .catch((err)=>{console.log(err)})
    event.preventDefault();
//I want something like this to work


  }

  render(){
  return (
    <div className="welcomeContainer">
      <div className="welcomeText">
        <h1>who are you there?</h1>
        <div className="App">
        <p className="App-intro">
        This is the timer value: {this.state.timestamp}
        </p>
      </div>
      </div>
            <form onSubmit={this.handleSubmit}>
              <label>
                Name:
                <input type="text" value={this.state.value} onChange={this.handleChange} />
              </label>
              <button type="submit">Pick this name</button>
              </form>
              <Link to={"/lobby"} params={{userName:this.state.value}}><button type="submit">Proceed to the lobby (must first pick a name)</button></Link>
        <div>
        </div>
    </div>
  )
  }
}
