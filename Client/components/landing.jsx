import React, { Component } from 'react';
import * as THREE from 'three';
import {subscribeToName} from './client.js'

// let OrbitControls = require('three-orbit-controls')(THREE)

export default class Landing extends Component{

  constructor(props) {
    super(props);
    this.state = {timestamp:'no timestamp yet', value: '', nameSelected: false};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event) {
    this.setState({value: event.target.value});
  }
  handleSubmit(event) {
    this.setState({nameSelected:true})
    const name = this.state.value
      subscribeToName(name)
      this.props.history.push({pathname:`/lobby`})
  }

  render(){
  return (
      <div className="welcomeContainer">
        <div className="welcomeText">
          <h1>Who's there?</h1>
        </div>
        <form onSubmit={this.handleSubmit}>
          <label className='nameForm'>
          <input className='nameInput' type="text" autoFocus value={this.state.value} onChange={this.handleChange} />
          </label>
          <button type="submit" className = 'pickNameBtn'>Pick name</button>
        </form>
      </div>
  )}
}
