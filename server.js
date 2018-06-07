const express = require('express');
const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server)
const cookierParser = require('socket.io-cookie-parser') //gah, which of these is the real cookieParser?
const bodyParser = require('body-parser')
const morgan = require('morgan')
const session = require('express-session')
const cookieParser = require("cookie-parser")
const path = require('path')
const THREE = require('three')
// app.use('/assests', express.static(__dirname+'/assests'))
// app.use('/js', express.static(__dirname+'/js'))

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser());

app.use('/',express.static(path.join(__dirname, 'public')) )

app.use(session({  secret: '34SDgsdgspxxxxxxxdfsG', // just a long random string
resave: false,
saveUninitialized: true}))

//hoooorible way of storing game state, there must be a better way. Perhapse redux on the backend? not sure
//bu bsacially this object just gets really big holding everything together
let badwayMasterGameState = {
    servers:{},
    waitingPlayers:[{name:'fakeplayer', id: '124u234fdsk932', inGame: false}]
} 
app.post('/createServer',(req,res,next)=>{ 
    badwayMasterGameState.servers[req.body.id]=(req.body)
    console.log("the server being created!", badwayMasterGameState)
    res.sendStatus(201)
    next()
})
app.get('/mazeOne',(req,res,next)=>{

    let mapOne = require('./mapOne')
    // console.log("kjfdklsjflkjsdfjdsljfkds",mapOne.mazeOne)
    res.send(mapOne.mapTwo)
})

io.use(cookierParser('hello there',{}))
io.on('connection',(socket)=>{
    socket.on('subscribeToTimer', (interval)=>{
        setInterval(() => {
            socket.emit('timer', new Date());
      }, interval);
    })
    socket.on('subscribeToWaitingPlayers', ()=>{
        io.emit('waitingPlayerList',badwayMasterGameState.waitingPlayers)
    })
    socket.on('subscribeToServers', ()=>{
        io.emit('serversList', badwayMasterGameState.servers);
    })
    socket.on('subscribeToServerCookieID', ()=>{
        socket.emit('serverCookieID', socket.id);
    })
    socket.on('subscribeToName',(name)=>{
        badwayMasterGameState.waitingPlayers.push({name: name,id:socket.id, inGame:false})
    })
    socket.on('subscribeToJoinServer', (serverId)=>{
    const playerToMove = badwayMasterGameState.waitingPlayers.find(player=> {console.log("player id", player.id, "server id", socket.id)
    return player.id ==socket.id})
    playerToMove.inGame = true;
    badwayMasterGameState.servers[serverId].connectedPlayers.push(playerToMove)
    //    console.log("this is the players in the servers", badwayMasterGameState.servers[serverId].connectedPlayers)
    //    console.log('this is the state afer the player has joined',badwayMasterGameState )
    })
    socket.on('subscribeToServerState', (clientInfo)=>{
        let theServerInQuestion = badwayMasterGameState.servers[clientInfo.serverId]
        if(clientInfo.playing == true){
            theServerInQuestion.gameState.playing = true;
            io.emit('serversList', badwayMasterGameState.servers)
            theServerInQuestion.connectedPlayers.map((player)=>{
                //this is where you can set the initial state of the play, such as color or location ect. 
                player.color = 0xdcdcdc
                player.rot= new THREE.Euler(0,0,0) 
            })
            //also generate a map? who knows....
        }
        for(let i = 0; i < theServerInQuestion.connectedPlayers.length; i ++){
            if(theServerInQuestion.connectedPlayers[i]){
                const playerSocket =theServerInQuestion.connectedPlayers[i].id
                io.to(playerSocket).emit('serverState',theServerInQuestion);
            }
        }
        io.emit('waitingPlayerList',badwayMasterGameState.waitingPlayers)
        io.emit('serversList', badwayMasterGameState.servers)
    })
    socket.on('subscribeToGameState',(clientData)=>{
        let theServerInQuestion = badwayMasterGameState.servers[clientData.serverId]
        if(theServerInQuestion){

            theServerInQuestion.connectedPlayers.map((player)=>{
                //this is where each plays state can be updated
                // const newRotation = newCoords(player.rot, 'rotation') //uncomment this for rotation
                // console.log("key down?", clientData.keydown)
                // player.rot = new THREE.Euler(newRotation.x, newRotation.y,newRotation.z)
                if(player.id == socket.id){
                    // console.log("this player is moving", player)
                    if(player.loc == undefined){
                        //this line means when a player stops pressing a key they snap back to the middle?
                        player.loc = new THREE.Vector3(0,3,4)
                        //send back new camera coords as well....
                    }else if(clientData.keydown != false){
                        player.loc = movement(clientData.keydown,player.loc)
                        // io.to(socket.id).emit('cameraPosition',player.loc)
                    }
                }

                // console.log("this is what the movement thing is returning",movement(clientData.keydown,player.loc) )
                // player.loc = new THREE.Vector3(0,0,0)
                // console.log("this player:", socket.id, "is pressing this button", clientData.keydown," and thier new location is", player.loc )
                return player 
            })
            theServerInQuestion.keydown = undefined
        }
        // console.log("this is the new player location",theServerInQuestion.connectedPlayers[0].loc)
        io.emit('gameState',theServerInQuestion)
    })
    socket.on('subscribeToCameraPosition',(camera)=>{
            //  const camera = {position:this.state.cameraPostion,rotation: this.state.cameraRotation, cameraKey:this.state.cameraKey, serverId: this.state.serverId}
        let theServerInQuestion = badwayMasterGameState.servers[camera.serverId]
        if(theServerInQuestion){
        theServerInQuestion.connectedPlayers.map((player)=>{
            //here we want to find the location of the cube 
            if(player.id == socket.id && player.loc != undefined){
                let cameraPosition = camera.position
                let cameraRotation = camera.rotation
                    if(camera.cameraKey != false){
                        // console.log("the player is trying to rotate the camera:", camera.rotation)
                        if(camera.cameraKey ==38){
                            cameraRotation = new THREE.Euler(camera.rotation._x + 0.1,camera.rotation._y,0)
                            
                        }
                        if(camera.cameraKey == 39){
                            cameraRotation = new THREE.Euler(camera.rotation._x,camera.rotation._y-0.1,0)
                            
                        }
                        if(camera.cameraKey ==37){
                            cameraRotation = new THREE.Euler(camera.rotation._x,camera.rotation._y+0.1,0)
                            
                        }
                        if(camera.cameraKey == 40){
                            cameraRotation = new THREE.Euler(camera.rotation._x - 0.1,camera.rotation._y,0)
                            
                        }
                        // console.log("changed the rotation to:", cameraRotation)
                    }else{
                        // console.log("the cub connected to the camera is moving, player location is", player.loc)
                        cameraPosition = new THREE.Vector3(player.loc.x,player.loc.y, player.loc.z+ 5)
                    }
                    const cameraUpdated = {position:cameraPosition, rotation:cameraRotation}
                    io.to(socket.id).emit('cameraPosition',cameraUpdated);
                }
            })
        }
    })
    socket.on('connection name',function(user){
      io.sockets.emit('new user', user.name + " has joined.");
    })
    // const gameLogic = require('./gameLogic.js')(app,io,socket)
})
server.listen(process.env.PORT || 8081, ()=>{
    console.log("listening on port", server.address().port)
})
//helper functions, currently not using new coords  
function newCoords(oldCoords, type){  
      
    if(type == 'rotation'){
      oldCoords.x += 0.1
      oldCoords.y += 0.1
      oldCoords.z += 0.1
      return oldCoords
    }else if (type == 'location'){
      return oldCoords
    }
  }
function randomLocation (max){
    location = {x:0,y:0,z:0}
    for(var value in location){
        location[value] = Math.floor(Math.random() * Math.floor(max));
    }
    return location
}
function movement(keycode,playerlocation){
    //check for collision?? somehow....
    // console.log("player location", playerlocation),it needs to look ahead, collision detection after the augmentation fo movement. 
    const mapOne = require('./mapOne')
    // const collisionCheckPlayerLocation = playerlocation.x.toString().concat(playerlocation.y,playerlocation.z)
    // console.log("looking for ",collisionCheckPlayerLocation, "inside of map one collision hash:",mapOne.mapTwoCollisionHash[+collisionCheckPlayerLocation])
    
    // if(mapOne.mapTwoCollisionHash[+collisionCheckPlayerLocation] === true){
    //     console.log("moving allowed: this",collisionCheckPlayerLocation,"is equal to:", mapOne.mapTwoCollisionHash[+collisionCheckPlayerLocation])
    

    const deltMovement = 1 
        if(keycode == 87){
            //forward
            // console.log("old player location in terms of z", playerlocation.z)
            // console.log("forward, returning:",new THREE.Vector3(0,0,playerlocation.z+5))

            const collisionCheckPlayerLocation = playerlocation.x.toString().concat(playerlocation.y,playerlocation.z-deltMovement)
            if(mapOne.mapTwoCollisionHash[+collisionCheckPlayerLocation] === true){
                // console.log("moving allowed: this",collisionCheckPlayerLocation,"is equal to:", mapOne.mapTwoCollisionHash[+collisionCheckPlayerLocation])
                return new THREE.Vector3(playerlocation.x,playerlocation.y,playerlocation.z-1)
            }
        }
        if(keycode == 65){
            //left
            // console.log("left")
            const collisionCheckPlayerLocation = (playerlocation.x-deltMovement).toString().concat(playerlocation.y,playerlocation.z)
            if(mapOne.mapTwoCollisionHash[+collisionCheckPlayerLocation] === true){
                // console.log("moving allowed: this",collisionCheckPlayerLocation,"is equal to:", mapOne.mapTwoCollisionHash[+collisionCheckPlayerLocation])
                return new THREE.Vector3(playerlocation.x-deltMovement,playerlocation.y,playerlocation.z)
            }
        }
        if(keycode == 83){
            //backwards
            // console.log("backwards")
            const collisionCheckPlayerLocation = playerlocation.x.toString().concat(playerlocation.y,playerlocation.z+deltMovement)
            if(mapOne.mapTwoCollisionHash[+collisionCheckPlayerLocation] === true){
                // console.log("moving allowed: this",collisionCheckPlayerLocation,"is equal to:", mapOne.mapTwoCollisionHash[+collisionCheckPlayerLocation])
                return new THREE.Vector3(playerlocation.x,playerlocation.y,playerlocation.z+deltMovement)
            }
        }
        if(keycode == 68){
            //right
            // console.log("right")
            const collisionCheckPlayerLocation = (playerlocation.x+deltMovement).toString().concat(playerlocation.y,playerlocation.z)
            if(mapOne.mapTwoCollisionHash[+collisionCheckPlayerLocation] === true){
                // console.log("moving allowed: this",collisionCheckPlayerLocation,"is equal to:", mapOne.mapTwoCollisionHash[+collisionCheckPlayerLocation])
                return new THREE.Vector3(playerlocation.x+deltMovement,playerlocation.y,playerlocation.z)
            }
        }
        if(keycode == 69){
            //up
            // console.log("right")
            const collisionCheckPlayerLocation = playerlocation.x.toString().concat(playerlocation.y+deltMovement,playerlocation.z)
            if(mapOne.mapTwoCollisionHash[+collisionCheckPlayerLocation] === true){
                // console.log("moving allowed: this",collisionCheckPlayerLocation,"is equal to:", mapOne.mapTwoCollisionHash[+collisionCheckPlayerLocation])
                return new THREE.Vector3(playerlocation.x,playerlocation.y+deltMovement,playerlocation.z)
            }
        }
        if(keycode == 81){
            //down
            // console.log("right")
            const collisionCheckPlayerLocation = playerlocation.x.toString().concat(playerlocation.y-deltMovement,playerlocation.z)
            if(mapOne.mapTwoCollisionHash[+collisionCheckPlayerLocation] === true){
                // console.log("moving allowed: this",collisionCheckPlayerLocation,"is equal to:", mapOne.mapTwoCollisionHash[+collisionCheckPlayerLocation])
                return new THREE.Vector3(playerlocation.x,playerlocation.y-deltMovement,playerlocation.z)
            }
        }
        console.log("movmenet not allowed")
        return playerlocation
    
}
