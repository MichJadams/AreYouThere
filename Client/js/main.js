import 'three';
import 'three/OrbitControls';
// import {createScene, generatePlayer} from './createScene.js'
import {update} from './initScene.js'
import {Client} from './client.js'
let scene
// Client.socket.on('test',(data)=>{
//   console.log(data)
// })

Client.playerJoined()

// Client.socket.on('generateScene',()=>{
//   scene = createScene();
//   console.log("the scene picked from the create scene file", scene)
//   Client.sendCreatedScene(scene)
// })



Client.socket.on('namePlayer',(newSceneAndPlayer,playerID)=>{
  Client.socket.name = playerID
  scene = newSceneAndPlayer
  console.log("this is the scene sent from the server", newSceneAndPlayer)
  console.log("this is the players id", Client.socket.name)
})

Client.socket.on('startgame',(scene)=>{
  scene = scene
  console.log("The scene passed from the server is", scene)
})

//recieve a command from the server to redraw the scene
Client.socket.on('redraw',(gamedata)=>{
  //here is where we want to turn the gamedata into the rendering update data
  let updatData = gamedata;

  update(updatData,Client.socket.name)
  .then((updatedData)=>{
    //console.log("this si the updated data from the update function", updatedData)
    Client.updated(updatedData)
  })
  .catch((error)=>{
    console.log(error.message)
  })

})
