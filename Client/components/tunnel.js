import React, { Component } from 'react';
import React3 from 'react-three-renderer';
import * as THREE from 'three';


export default class Tunnel extends Component{
    constructor(props) {
        super(props);
        // this.state ={
        //     position: new THREE.Vector3(0,-5,0),
        //     rotation: new THREE.Euler(props.location)
        // }
        console.log("in here, making a block", props.location)
    }


    render(){

        return(
            <mesh
            rotation={new THREE.Euler(90,0,0)} position={new THREE.Vector3(0,-5,0)} >
            <boxGeometry width={20} height={2} depth={20} />
            <meshBasicMaterial wireframe={true} transparent={false} opacity ={0.2} color={0xff0000}/>
            </mesh>
        )
    }
}

// <mesh
// rotation={new THREE.Euler(0,0,0)} position={new THREE.Vector3(0, -5, 0)} >
// <boxGeometry width={20} height={2} depth={20} />
// <meshBasicMaterial wireframe={true} transparent={false} opacity ={0.2} color={0xff0000}/>
// </mesh>