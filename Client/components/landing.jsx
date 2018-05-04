import React, { Component } from 'react';
import ReactDom from 'react-dom'
import { render, Link } from 'react-router-dom';
import lobby from './lobby.jsx'
import axios from 'axios';

export default class Landing extends Component{

  constructor(props) {
    super(props);
    this.state = {timestamp:'no timestamp yet', value: '', nameSelected: false};
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
    this.setState({nameSelected:true})
    axios.post('/name',{name: this.state.value})
    .then((res)=>{console.log(res)})
    .catch((err)=>{console.log(err)})
    event.preventDefault();
  }

  render(){
  return (
    <div className="welcomeContainer">
      <div className="welcomeText">
        <h1>who are you there?</h1>
      </div>
            <form onSubmit={this.handleSubmit}>
              <label>
                Name:
                <input type="text" value={this.state.value} onChange={this.handleChange} />
              </label>
              {
                this.state.nameSelected?
                (<div><h5>That name is available!</h5><Link to={"/lobby"} params={{userName:this.state.value}}>Proceed to the Lobby</Link></div>)
                :<button type="submit">Pick name</button>
              }
              </form>
        <div>
        </div>
    </div>
  )
  }
}
