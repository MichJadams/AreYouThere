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

//hoooorible way of storing game state, there must be a better way. Perhapse redux on the backend? 
let badwayMasterGameState = {
    servers:{},
    waitingPlayers:[{name:'fakeplayer', id: '124u234fdsk932'}]
} 

app.post('/name',(req,res,next)=>{ 
    // console.log("a person has selected a name", req.body.name)
    // console.log("this is the socket id?", req.cookies.io)
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
    //remove this player form the waiting players 
    const playerToMove = badwayMasterGameState.waitingPlayers.find((player)=>{return player.id === req.cookies.io})
    // console.log("this is the player we are removeing from the waiting player list",playerToMove)
    const indexOfPlayerToMove = badwayMasterGameState.waitingPlayers.indexOf(playerToMove)
    // console.log("this is the index of the player to remove", badwayMasterGameState.waitingPlayers.indexOf(playerToMove))
    // console.log("this is the current list of waiting players BEFORE", badwayMasterGameState.waitingPlayers)
    badwayMasterGameState.waitingPlayers.splice(indexOfPlayerToMove,indexOfPlayerToMove+1)
    // console.log("this is the current list of waiting players AFTER", badwayMasterGameState.waitingPlayers)

    //add this player to the game state server player
    console.log("this is the id of the server they want to join", req.body.serverToJoin)
    // const theServerInQuestion = badwayMasterGameState.servers[req.body.serverToJoin] 
    // console.log("the server in question", theServerInQuestion)
    // const indexOfServerToJoin = badwayMasterGameState.servers.indexOf(theServerInQuestion)
    // console.log("index of the server they want to join", indexOfServerToJoin)
    // console.log("the SERVERS BEFORE", badwayMasterGameState.servers)
    badwayMasterGameState.servers[req.body.serverToJoin].connectedPlayers.push(playerToMove)
    // console.log("-----------------------")
    console.log("the SERVERS AFTER", badwayMasterGameState.servers)
    console.log("THE PLAYERS CONNECTed",badwayMasterGameState.servers[req.body.serverToJoin].connectedPlayers)
    res.sendStatus(200)
    next()
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
        // console.log("client is subscribing to timer with interval,", interval)
        setInterval(() => {
            socket.emit('timer', new Date());
      }, interval);
    })
    socket.on('subscribeToWaitingPlayers', ()=>{
        // console.log("client is subscribing to player list")
        io.emit('waitingPlayerList',badwayMasterGameState.waitingPlayers)
        
    })
    socket.on('subscribeToServers', ()=>{
        // console.log("client is subscribing to server list,")
        io.emit('serversList', badwayMasterGameState.servers);
      
    })
    //createserver sockets
    socket.on('subscribeToServerCookieID', ()=>{
        // console.log("fjdkslajfldksa",socket.id)
        // console.log("client is subscribing to server cookie id,", Object.keys(io.sockets.connected))
        socket.emit('serverCookieID', socket.id);
    })
    //waiting room sockets
    // socket.on('subscribeToServerWaitingRoomCapacity', ()=>{
    //     // console.log("looking for the connected players of this server",socket.id)
    //     //var obj = objArray.find(function (obj) { return obj.id === 3; })
    //     // console.log("client is subscribing to server cookie id,", Object.keys(io.sockets.connected))
    //     // io.emit('serverCookieID', socket.id);
    // })

    socket.on('subscribeToServerState', (clientInfo)=>{
        // console.log("-------------------")
        // console.log("this is the game state", badwayMasterGameState)
        // console.log("-------------------")
        // console.log("client information", clientInfo)
        let theServerInQuestion = badwayMasterGameState.servers[clientInfo.serverId]
            // console.log("this is the server in question", theServerInQuestion)
        if(clientInfo.playing == true){
            theServerInQuestion.gameState.playing = true;
            io.emit('serversList', badwayMasterGameState.servers)
            //assign each player a astarting position
            
            // console.log("Are we getting here?  is this the server asking for information?", theServerInQuestion)
            theServerInQuestion.connectedPlayers.map((player)=>{
                //have the players start at a random location
                player.color = 0x00ff00
                // player.loc= new Euler 
                // console.log("this is the rotation assined to the player", player)
                // player.rot= new THREE.Euler(newRotation.x, newRotation.y,newRotation.z)  
                

                // return player
            })
            // console.log("Starting playing on this server the server in question,",theServerInQuestion)
            // console.log("this is the client infor we first receive, eventually we want to put something like a scene on the server", clientInfo)
            // console.log("this is the player conneting, thier socket id = ",socket.id )
            //also generate a map? who knows....
        }
        // console.log("overall array of connected players")
        for(let i = 0; i < theServerInQuestion.connectedPlayers.length; i ++){
            if(theServerInQuestion.connectedPlayers[i]){
                const playerSocket =theServerInQuestion.connectedPlayers[i].id
                // console.log("an string of the id of the sockets we want to emit events to", playerSocket)
                
                // console.log("connected players socket ids are, here", theServerInQuestion.connectedPlayers)
                io.to(playerSocket).emit('serverState',theServerInQuestion);
            }
        }
        // console.log("the server id is", serverID)
        //if this is a new socket for this server, add it
        // console.log("sending back this info for this server", theServerInQuestion)
        // console.log("fjdkslajfldksa",socket.id)
        // console.log("client is subscribing to server cookie id,", Object.keys(io.sockets.connected))
        //this should only go tho the connected players of the serverID

        // console.log("the waiting players on the master state",badwayMasterGameState.waitingPlayers)
        // console.log("the waiting servers on the master state",badwayMasterGameState.servers)
        //these have to emitted to everyone
        
        io.emit('waitingPlayerList',badwayMasterGameState.waitingPlayers)
        io.emit('serversList', badwayMasterGameState.servers)
    })
    socket.on('subscribeToGameState',(clientData)=>{
        console.log("this is the cilent data", clientData)
        let theServerInQuestion = badwayMasterGameState.servers[clientData.serverId]
            // console.log("this is the client state", clientData)
            clientData.connectedPlayers.map((player)=>{
                // console.log("I would like to set this value"+player.rot+"to be a new euler object")
                console.log("")
                player.rot = new THREE.Euler(0,0,0)
                // const block = {
                //     rotation: new THREE.Euler(0,0,0),
                //     location: new THREE.Vector3(0,0,0),
                //     color: 0xff0000
                // }

                return player 
            })
        // console.log("and this is the server id and information stored on the sever side",theServerInQuestion)
        io.emit('gameState',theServerInQuestion)
    })


    socket.on('connection name',function(user){
        // console.log("hitting here")
      io.sockets.emit('new user', user.name + " has joined.");
    })
    const gameLogic = require('./gameLogic.js')(app,io,socket)
})

server.listen(process.env.PORT || 8081, ()=>{
    console.log("listening on port", server.address().port)
})

function randomLocation (max){
    location = {x:0,y:0,z:0}
    for(var value in location){
        location[value] = Math.floor(Math.random() * Math.floor(max));
    }
    return location
}