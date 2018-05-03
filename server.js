const express = require('express');
const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server)
const cookierParser = require('socket.io-cookie-parser')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const session = require('express-session')
const cookieParser = require("cookie-parser")
const path = require('path')

// app.use('/assests', express.static(__dirname+'/assests'))
// app.use('/js', express.static(__dirname+'/js'))

app.use(cookieParser());
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use('/',express.static(path.join(__dirname, 'public')) )

app.use(session({  secret: '34SDgsdgspxxxxxxxdfsG', // just a long random string
resave: false,
saveUninitialized: true}))

//hoooorible
let badwayMasterGameState = {
    servers:[{ id: 1, name:"starterServer",status:'open',gameState:{}, connectedPlayers:[]}],
    waitingPlayers:[{name:'bill', id: '124u234fdsk932'}]

} //this is not how I actually want to store game info. there is a better way, just can't think of it rn. 

// app.get('/', (req,res,next)=>{
//     console.log("first session id",req.session.id)
//     res.sendFile(__dirname +'/Client/index.js')
// })

app.post('/name',(req,res,next)=>{ 
    // console.log("a person has selected a name", req.body.name)
    // console.log("this is the socket id?", req.cookies.io)
    badwayMasterGameState.waitingPlayers.push({name: req.body.name,id:req.cookies.io})
    res.sendStatus(201)
    next()
})
app.post('/createServer',(req,res,next)=>{ 
    req.body.gameState ={}
    req.body.connectedPlayers=[]
    badwayMasterGameState.servers.push(req.body)
    console.log("the server being created!", req.body)
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
    // console.log("this is the id of the server they want to join", req.body.serverToJoin)
    const theServerInQuestion = badwayMasterGameState.servers.find((server)=>{return (server.id).toString() === (req.body.serverToJoin).toString()})
    // console.log("the server in question", theServerInQuestion)
    const indexOfServerToJoin = badwayMasterGameState.servers.indexOf(theServerInQuestion)
    // console.log("index of the server they want to join", indexOfServerToJoin)
    // console.log("the SERVERS BEFORE", badwayMasterGameState.servers)
    badwayMasterGameState.servers[indexOfServerToJoin].connectedPlayers.push(playerToMove)
    // console.log("the SERVERS AFTER", badwayMasterGameState.servers)
    next()
})

io.use(cookierParser('hello there',{}))
io.on('connection',(socket)=>{
    socket.on('subscribeToTimer', (interval)=>{
        // console.log("client is subscribing to timer with interval,", interval)
        setInterval(() => {
            socket.emit('timer', new Date());
      }, interval);
    })
    socket.on('subscribeToWaitingPlayers', (playerName)=>{
        console.log("client is subscribing to player list", playerName)
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
    socket.on('subscribeToServerState', (serverID)=>{
        // console.log("the server id is", serverID)
        const theServerInQuestion = badwayMasterGameState.servers.find((server)=>{return server.id === serverID})
        //if this is a new socket for this server, add it
        // console.log("sending back this info for this server", theServerInQuestion)
        // console.log("fjdkslajfldksa",socket.id)
        // console.log("client is subscribing to server cookie id,", Object.keys(io.sockets.connected))

        socket.emit('serverState',theServerInQuestion);
        console.log("the waiting players on the master state",badwayMasterGameState.waitingPlayers)
        io.emit('waitingPlayerList',badwayMasterGameState.waitingPlayers)
        io.emit('serversList', badwayMasterGameState.servers)
    })


    socket.on('connection name',function(user){
        console.log("hitting here")
      io.sockets.emit('new user', user.name + " has joined.");
    })
    const gameLogic = require('./gameLogic.js')(app,io,socket)
})

server.listen(process.env.PORT || 8081, ()=>{
    console.log("listening on port", server.address().port)
})