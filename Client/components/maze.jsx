import React, { Component } from 'react';
import { render, Link } from 'react-router-dom';
import Client, { subscribeToTimer } from './client.js'
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import {subscribeToGameState } from './client.js'
import axios from 'axios'


export default class Landing extends Component{

  constructor(props) {
    super(props);
    subscribeToTimer((err,timestamp)=>{this.setState({
      timestamp
    })})
    this.cameraPosition = new THREE.Vector3(0, 0, 5);
    // console.log("this is the props",this.props.history.location.state.connectedPlayers)
    
    this.state = {connectedPlayers: this.props.history.location.state.connectedPlayers,isMounted:false,timestamp:'no timestamp yet', value: '', serverId:this.props.match.params.id, maze: undefined}; 
    // this.state.connectedPlayers.map((Player)=>{
    //   player.cubeRotation = new THREE.Euler()
    //   this.setState(player.)
    // })

    let connectedPlayers = []
        this.state.connectedPlayers.map((player)=>{
          const nextPlayer = player
          nextPlayer.rot = new THREE.Euler()
          nextPlayer.loc = new THREE.Vector3(1,1,0)
          connectedPlayers.push(nextPlayer)
        })
        console.log("the connected player state initially ", this.state.connectedPlayers)
        this.setState({connectedPlayers})
    const clientData = this.state
    // console.log("this is the state", this.state)
    axios.get('/mazeOne')
    .then((res)=>{
      console.log("the maze looks like this", res.data)
      const maze = res.data
      this.setState({maze})
      console.log("this is the state of the maze", this.state.maze)
    })
    // subscribeToGameState(clientData,(err, gameState)=>{
    //   console.log("shouting out from the playing game state updates function",gameState)
    // })

  //calculate movement
    // const newCoords=(oldCoords, type)=>{  
      
    //   if(type == 'rotation'){
    //     oldCoords.x += 0.1
    //     oldCoords.y += 0.1
    //     oldCoords.z += 0.1
    //     // console.log("these are the old cords", oldCoords)
    //     return oldCoords
    //   }else if (type == 'location'){
    //     return oldCoords
    //   }
    // }
    this._onAnimate = () => {

      const clientInfo = this.state
      subscribeToGameState(clientInfo,(err,gameState)=>{
        // console.log("Is this firing?", clientInfo)
        console.log("this is the information the server is sending back", gameState.connectedPlayers)
        console.log("this is the current connected players state", this.state.connectedPlayers)
        // console.log("hopefully one day I can jsut set one to the other")
        this.setState({connectedPlayers:gameState.connectedPlayers})
      })
      // let connectedPlayers = []
      // for(let i =0; i< this.state.connectedPlayers.length; i ++){
      //   //send out a socket request for informationregarding this player
      //   //update the client state with the information sent back


      //   const nextplayer = this.state.connectedPlayers[i]
      //   const newRotation = newCoords(nextplayer.rot, 'rotation') //takes an object and spits out a new obejct with keys x,y,z. uses the string to determin which coords to mutate
      //   nextplayer.rot = newRotation
      //   const newLocation = newCoords(nextplayer.loc, 'location') //takes an object and spits out a new obejct with keys x,y,z
      //   nextplayer.loc = newLocation
      //   nextplayer.rot = new THREE.Euler(newRotation.x, newRotation.y,newRotation.z)  
      //   // nextplayer.loc = new THREE.Vector3(newLocation.x,newLocation.y,newLocation.z)
      //   connectedPlayers.push(nextplayer)
      // }
      // this.setState({connectedPlayers})
    }
    
  }
 componentDidMount(){
   this.setState({isMounted: true})
 }


  
  render(){
    const width = window.innerWidth; // canvas width
    const height = window.innerHeight; // canvas height

        return (<div>
        <div className="App">
        <p className="App-intro">
        This is the timer value: {this.state.timestamp}
        </p>
      </div>

      <title>Game</title>
		
		
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

          position={this.cameraPosition}
        />
        {
          this.state.mazze && <mesh>
          <bufferGeometry position={new THREE.bufferAttribute([-1.0, -1.0,  1.0,
            1.0, -1.0,  1.0,
            1.0,  1.0,  1.0,
            1.0,  1.0,  1.0,
           -1.0,  1.0,  1.0,
           -1.0, -1.0,  1.0],3)} />
          <meshBasicMaterial wireframe={true} transparent={true} opacity ={0.2} color={0xfff000}/>
        </mesh>
        }
        <axisHelper position ={new THREE.Vector3(-4,3,0)}/>
        {this.state.maze && <mesh
              rotation={this.state.maze.rotation} position={this.state.maze.location} >
              <boxGeometry width={6} height={6} depth={3} />
              <meshBasicMaterial wireframe={true} transparent={true} opacity ={0.2} color={this.state.maze.color}/>
            </mesh>
          }

        {
          this.state.connectedPlayers.map((player)=>{
            // console.log("this is the player location", player.color)
            return(<mesh
              rotation={player.rot} position={player.loc} >
              <boxGeometry width={1} height={2} depth={1} />
              <meshBasicMaterial color={player.color}/>
            </mesh>)
          })
        }
      </scene>
    </React3>
</div>
     
  )}
}

