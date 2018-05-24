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
//send back a red cube for testing
const mazeArray = buildMaze([]) 

    // const block = {
    //     rotation: new THREE.Euler(0,0,0),
    //     location: new THREE.Vector3(0,-5,0),
    //     color: 0xff0000
    // }
    res.send(mazeArray)
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
        // app.post('/name',(req,res,next)=>{ 
            //     res.sendStatus(201)
            //     next()
            //     badwayMasterGameState.waitingPlayers.push({name: req.body.name,id:req.cookies.io, inGame:false})
        // })
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
                player.color = 0x00ff00
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
                console.log("key down?", clientData.keydown)
                // player.rot = new THREE.Euler(newRotation.x, newRotation.y,newRotation.z)
                if(player.loc == false|| player.loc == undefined){
                    //this line means when a player stops pressing a key they snap back to the middle?
                    player.loc = new THREE.Vector3(0,0,0)
                }else{
                    player.loc = movement(clientData.keydown,player.loc)
                }

                // console.log("this is what the movement thing is returning",movement(clientData.keydown,player.loc) )
                // player.loc = new THREE.Vector3(0,0,0)
                console.log("this player:", socket.id, "is pressing this button", clientData.keydown," and thier new location is", player.loc )
                return player 
            })
        }
        theServerInQuestion.keydown = undefined
        // console.log("this is the new player location",theServerInQuestion.connectedPlayers[0].loc)
        io.emit('gameState',theServerInQuestion)
    })
    socket.on('connection name',function(user){
      io.sockets.emit('new user', user.name + " has joined.");
    })
    const gameLogic = require('./gameLogic.js')(app,io,socket)
})
server.listen(process.env.PORT || 8081, ()=>{
    console.log("listening on port", server.address().port)
})
//helper functions 
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
    if(keycode == 87){
        //forward
        // console.log("old player location in terms of z", playerlocation.z)
        // console.log("forward, returning:",new THREE.Vector3(0,0,playerlocation.z+5))
        return new THREE.Vector3(0,0,playerlocation.z+1)
    }
    if(keycode == 65){
        //left
        // console.log("left")

        return new THREE.Vector3(playerlocation.x-1,0,0)
    }
    if(keycode == 83){
        //backwards
        // console.log("backwards")

        return new THREE.Vector3(0,0,playerlocation.z-1)
    }
    if(keycode == 68){
        //right
        // console.log("right")

        return new THREE.Vector3(playerlocation.x+1,0,0)
    }
    // if(keycode == undefined){
    //     return 
    // }
}
function buildMaze(mazeArray){
//open sides is an array with a max of 6 numbers, each representing the side that is missing from the block
//btmrcoords is an array of three numbers representing the btm right coords of the block, each block is 5 long

    mazeArray.push({
        openSides:[1,3],
        btmRCoords:[0,0,0] //origin
    })
    // mazeArray.push({
    //     openSides:[1,3],
    //     btmRCoords:[0,0,5]
    // })
    // mazeArray.push({
    //     openSides:[1,3],
    //     btmRCoords:[0,0,10]
    // })

    return mazeArray
}