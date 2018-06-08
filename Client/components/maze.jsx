import React, { Component } from 'react';
// import { render, Link } from 'react-router-dom';
import { subscribeToTimer } from './client.js'
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import {subscribeToGameState, subscribeToCameraPosition } from './client.js'
import axios from 'axios'


export default class Landing extends Component{

  constructor(props) {
    super(props);
    subscribeToTimer((err,timestamp)=>{this.setState({
      timestamp
    })
  })
  this.state = {cube:this.props.location.cube, mazeType: this.props.location.mazeType,moveDirectionVote: {forward:0,backward:0,left:0,right: 0,up:0, down:0},cameraKey: false, cameraPostion:new THREE.Vector3(2, 2, 10),cameraRotation:new THREE.Euler(0, 0, 0),keydown:false,connectedPlayers: this.props.history.location.state.connectedPlayers,isMounted:false,timestamp:'no timestamp yet', value: '', serverId:this.props.match.params.id, maze: []}; 

    console.log("the connected player state initially ", this.state.connectedPlayers)
    // const clientData = this.state
    axios.get(`/getMaze/${this.state.mazeType}`)
    .then((res)=>{
      // console.log("the maze looks like this", res.data)
      const mazeData = res.data
      this.setState({maze:mazeData})
      // console.log("this is the state of the maze", this.state.maze)
    })
    this._onAnimate = () => {
      // console.log("this is the votes", this.state.moveDirectionVote)
      let clientInfo = this.state
      // let clientInfo.moveDirectionVote = this.state.moveDirectionVote
      //perform collision detection here. 
      // console.log("this is the moving player, ", )
      subscribeToGameState(this.state,(err,gameState)=>{
        // this.setState({connectedPlayers:gameState.connectedPlayers, keydown:false})
        // console.log("cube position from the sever",gameState.cube.location)
        this.setState({cube:gameState.cube, keydown:false, moveDirectionVote:gameState.moveDirectionVote })
      })
      const camera = {position:this.state.cameraPostion,rotation: this.state.cameraRotation, cameraKey:this.state.cameraKey, serverId: this.state.serverId}
      subscribeToCameraPosition(camera,(err,camera)=>{
        //uncomment the line below for camera movmenet with cube 
        // console.log("this is the positon", camera.position,"this is the rotation", this.state.cameraRotation)
        this.setState({cameraRotation: camera.rotation, cameraPosition: camera.position, cameraKey:false})
      })
    }
  }
  componentDidMount(){
    this.setState({isMounted: true})
    document.addEventListener("keydown", this.handleKeyDown.bind(this))
    document.addEventListener("wheel", this.wheel.bind(this))
  }
  // componentWillUnmount() {
  //   document.removeEventListener("keydown", this.handleKeyDown.bind(this));
  // }
  handleKeyDown (event){
      this.setState({keydown:event.keyCode})
  }
  wheel(event){
    
    // if (event.deltaY < 0) {
    //   // console.log('scrolling up');
    //   this.setState({cameraKey: 38})
    //   // console.log("this is the state", this.state.cameraKey)
      
    // }
    // if (event.deltaY > 0) {
    //   // console.log('scrolling down');
    //   this.setState({cameraKey: 40})
      
    // }
    // if (event.deltaX < 0) {
    //   // console.log('scrolling left');
    //   this.setState({cameraKey: 37})
      
    // }
    // if (event.deltaX > 0) {
    //   // console.log('scrolling right');
    //   this.setState({cameraKey: 39})
    // }
    // event.preventDefault();
    // event.stopPropagation();
  }

  render(){
    const width = window.innerWidth; // canvas width
    const height = window.innerHeight; // canvas height

        return (
          <div>
        <div className="mazeInformationContainer">
        <p className="App-intro">
        One day this will show how long you have been playing the game {this.state.timestamp}
        </p>
        <title>Game</title>
        <div className="mazeInformationText">The number of people who agree on a move:</div>
        <div className="mazeInformationText">forward:{this.state.moveDirectionVote.forward} backward:{this.state.moveDirectionVote.backward} left:{this.state.moveDirectionVote.left} right:{this.state.moveDirectionVote.right} up:{this.state.moveDirectionVote.up} down:{this.state.moveDirectionVote.down}</div>
      </div>
		
      <React3
      mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
      width={width}
      height={height}
      onAnimate={this._onAnimate}>
      <scene>
        <perspectiveCamera
          name="camera"
          fov={75}
          aspect={width / height}
          near={0.1}
          far={1000}
          position={this.state.cameraPostion}
          rotation={this.state.cameraRotation}
        />
        <axisHelper position ={new THREE.Vector3(-4,3,0)}/>
        {
          this.state.maze.map((blockObject)=>{
            // console.log(blockObject.location)
            return (<mesh
            rotation={blockObject.rotation} position={blockObject.location} >
            <boxGeometry width={blockObject.width} height={blockObject.height} depth={blockObject.depth} />
            <meshBasicMaterial wireframe={blockObject.wireframe} transparent={blockObject.transparent} opacity ={blockObject.opacity} color={blockObject.color}/>
            </mesh>)
          })
        }
        {
          <mesh rotation={this.state.cube.rotation} position={this.state.cube.location} >
              <boxGeometry width={1} height={1} depth={1} />
              <meshBasicMaterial color={this.state.cube.color}/>
            </mesh>
        }
      </scene>
    </React3>
</div>
     
  )}
}

