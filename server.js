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
    waitingPlayers:[{name:'fakeplayer', id: '124u234fdsk932'}]
} 

app.post('/name',(req,res,next)=>{ 
    badwayMasterGameState.waitingPlayers.push({name: req.body.name,id:req.cookies.io})
    res.sendStatus(201)
    next()
})
app.post('/createServer',(req,res,next)=>{ 
    badwayMasterGameState.servers[req.body.id]=(req.body)
    console.log("the server being created!", badwayMasterGameState)
    res.sendStatus(201)
    next()
})
app.post('/joinServer',(req,res,next)=>{
    // //remove this player form the waiting players 
    // console.log("this is the request", req.body)
    // console.log("but this is the name of the reqeusting player", req)
    // const playerToMove = badwayMasterGameState.waitingPlayers.find((player)=>{return player.id === req.cookies.io})
    // console.log("player to move", playerToMove)
    // const indexOfPlayerToMove = badwayMasterGameState.waitingPlayers.indexOf(playerToMove)
    // badwayMasterGameState.waitingPlayers.splice(indexOfPlayerToMove,indexOfPlayerToMove+1)
    // //add this player to the game state server player
    // badwayMasterGameState.servers[req.body.serverToJoin].connectedPlayers.push(playerToMove)
    // console.log("-----------------------")
    // console.log("the SERVERS AFTER", badwayMasterGameState.servers)
    // console.log("THE PLAYERS CONNECTed",badwayMasterGameState.servers[req.body.serverToJoin].connectedPlayers)
    // res.sendStatus(200)
    // next()
})
app.get('/mazeOne',(req,res,next)=>{
//send back a red cube for testing
    const block = {
        rotation: new THREE.Euler(0,0,0),
        location: new THREE.Vector3(0,0,0),
        color: 0xff0000
    }
    res.send(block)
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
    socket.on('subscribeToJoinServer', (serverId)=>{
       //do the join stuff
       const playerToMove = badwayMasterGameState.waitingPlayers.find((player)=>{return socket.id === serverId})
       console.log("this is player ot move", playerToMove)
       const indexOfPlayerToMove = badwayMasterGameState.waitingPlayers.indexOf(playerToMove)
       badwayMasterGameState.waitingPlayers.splice(indexOfPlayerToMove,indexOfPlayerToMove+1)
       badwayMasterGameState.servers[serverId].connectedPlayers.push(playerToMove)
       console.log('this is the state afer the player has joined',badwayMasterGameState )
    })
    socket.on('subscribeToServerState', (clientInfo)=>{
        let theServerInQuestion = badwayMasterGameState.servers[clientInfo.serverId]
        if(clientInfo.playing == true){
            theServerInQuestion.gameState.playing = true;
            io.emit('serversList', badwayMasterGameState.servers)
            theServerInQuestion.connectedPlayers.map((player)=>{
                //this is where you can set the initial state of the play, such as color or location ect. 
                player.color = 0x00ff00
                player.rot= new THREE.Euler(0, 0,0) 
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
            theServerInQuestion.connectedPlayers.map((player)=>{
                //this is where each plays state can be updated
                const newRotation = newCoords(player.rot, 'rotation')
                player.rot = new THREE.Euler(newRotation.x, newRotation.y,newRotation.z)
                player.loc = new THREE.Vector3(1,2,0)
                return player 
            })
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