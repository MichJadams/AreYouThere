import React, { Component } from 'react';
import ReactDom from 'react-dom'
import { render, Link } from 'react-router-dom';
import lobby from './lobby.jsx'
import axios from 'axios';
import React3 from 'react-three-renderer';
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
    // console.log("this is the state", this.state)
  }
  
  handleSubmit(event) {
    this.setState({nameSelected:true})
    const name = this.state.value
      subscribeToName(name)
      this.props.history.push({pathname:`/lobby`})
  }

  render(){
    const width = window.innerWidth -10 ; // canvas width
    const height = window.innerHeight -10 ; // canvas height
    let aspectratio = width / height;

    let cameraprops = {fov : 75, aspect : aspectratio,
                      near : 0.1, far : 1000,
                      position : new THREE.Vector3(300,400,600),
                      lookAt : new THREE.Vector3(0,0,0) };
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
