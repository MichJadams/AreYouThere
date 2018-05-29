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
  componentDidMount(){
    const controls = new THREE.OrbitControls(this.refs.camera);
    this.controls = controls
  }
  handleChange(event) {
    this.setState({value: event.target.value});
    console.log("this is the state", this.state)
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
    <div>
    <div className="welcomeContainer">
    <div className="welcomeText">
    <h1>Who's there?</h1>
    </div>
    <form onSubmit={this.handleSubmit}>
    <label className='nameForm'>
    <input className='nameInput' type="text" autoFocus value={this.state.value} onChange={this.handleChange} />
    </label>
    <button type="submit">Pick name</button>
    </form>
    </div>
    
    <React3 className='reactScene'      
    mainCamera="mainCamera" // this points to the perspectiveCamera which has the name set to "camera" below
    width={width}
    height={height}> 
    <scene>
    <perspectiveCamera ref = "camera" name = "mainCamera"
    fov={75}
    aspect={width / height}
    near={0.1}
    far={1000}
    position = {new THREE.Vector3(0, 0, 10)}
    />
    <mesh
              rotation={new THREE.Euler(20,0,15)} position={new THREE.Vector3(-5, -2, 0)} >
              <boxGeometry width={2} height={6} depth={2} />
              <meshBasicMaterial wireframe={false} transparent={true} opacity ={0.2} color={0xff0000}/>
            </mesh>
            <mesh
            rotation={new THREE.Euler(-20,0,-15)} position={new THREE.Vector3(3, -2, 0)} >
            <boxGeometry width={2} height={6} depth={2} />
            <meshBasicMaterial wireframe={false} transparent={true} opacity ={0.3} color={0xff0000}/>
          </mesh>

          <mesh
          rotation={new THREE.Euler(0,0,0)} position={new THREE.Vector3(-10, 0, 0)} >
          <boxGeometry width={2} height={9} depth={3} />
          <meshBasicMaterial wireframe={true} transparent={false} opacity ={0.5} color={0xa82f10}/>
          </mesh>
          <mesh
          rotation={new THREE.Euler(0,0,0)} position={new THREE.Vector3(-13, -3, 0)} >
          <boxGeometry width={2} height={6} depth={3} />
          <meshBasicMaterial wireframe={true} transparent={false} opacity ={0.5} color={0xa82f10}/>
          </mesh>
          <mesh
          rotation={new THREE.Euler(0,0,0)} position={new THREE.Vector3(-13, -3, 0)} >
          <boxGeometry width={2} height={6} depth={3} />
          <meshBasicMaterial wireframe={false} transparent={true} opacity ={0.5} color={0xa82f10}/>
          </mesh>
          <mesh
          rotation={new THREE.Euler(0,0,0)} position={new THREE.Vector3(-15, -6, 0)} >
          <boxGeometry width={2} height={3} depth={3} />
          <meshBasicMaterial wireframe={false} transparent={false} opacity ={0.5} color={0xa82f10}/>
          </mesh>


        <mesh
        rotation={new THREE.Euler(0,0,0)} position={new THREE.Vector3(0, -5, 0)} >
        <boxGeometry width={20} height={2} depth={20} />
        <meshBasicMaterial wireframe={false} transparent={true} opacity ={0.2} color={0xff0000}/>
      </mesh>
      <mesh
      rotation={new THREE.Euler(0,0,0)} position={new THREE.Vector3(0, -5, 0)} >
      <boxGeometry width={20} height={2} depth={20} />
      <meshBasicMaterial wireframe={true} transparent={false} opacity ={0.2} color={0xff0000}/>
    </mesh>
    </scene>
    </React3>
 
    </div>
  )
  }
}
