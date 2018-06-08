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
const helperFunctions = require('./helperFunctions')


app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser());

app.use('/',express.static(path.join(__dirname, 'public')) )

app.use(session({  secret: '34SDgsdgspxxxxxxxdfsG', // just a long random string
resave: false,
saveUninitialized: true}))

//hoooorible way of storing game state, there must be a better way. Perhapse redux on the backend? not sure
//but bsacially this object just gets really big holding everything together. I fill it with initial data as a template 
let badwayMasterGameState = {
    servers:{},
    waitingPlayers:[{name:'fakeplayer', id: '124u234fdsk932', inGame: false}]
} 
app.post('/createServer',(req,res,next)=>{ 
    badwayMasterGameState.servers[req.body.id]=(req.body)
    // console.log("the server being created!", badwayMasterGameState)
    res.sendStatus(201)
    next()
})
app.get('/getMaze/:mazeId',(req,res,next)=>{
    let mapOne = require('./mapOne')
    // console.log("sending back this, ", mapOne[req.params.mazeId], "this coming in",req.params.mazeId )
    res.send(mapOne[req.params.mazeId])
})
// io.use(cookierParser('hello there',{}))
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
    })
    socket.on('subscribeToServerState', (clientInfo)=>{
        let theServerInQuestion = badwayMasterGameState.servers[clientInfo.serverId]
        theServerInQuestion.cube = {}
        theServerInQuestion.cube.location = new THREE.Vector3(0,0,0)
        theServerInQuestion.cube.rotation = new THREE.Euler(0,0,0)
        theServerInQuestion.cube.color = 0xdcdcdc
        theServerInQuestion.won = false
        if(clientInfo.playing == true){
            theServerInQuestion.gameState.playing = true;
            io.emit('serversList', badwayMasterGameState.servers)
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
                if(player.id == socket.id){
                     if(clientData.keydown != false){
                        if(!player.voted){
                            theServerInQuestion.moveDirectionVote = require('./vote').vote(clientData.keydown, theServerInQuestion.moveDirectionVote) 
                            player.voted = true
                            if(helperFunctions.quorum(theServerInQuestion.moveDirectionVote,theServerInQuestion.connectedPlayers.length )){
                                // if everyone has voted
                                for(key in theServerInQuestion.moveDirectionVote){
                                    if(theServerInQuestion.moveDirectionVote[key] === theServerInQuestion.connectedPlayers.length){
                                        // if there is agreement
                                        theServerInQuestion.cube.location = require('./movement').movement(clientData.keydown,theServerInQuestion.cube.location)
                                        theServerInQuestion.won = require('./movement').winCheck(clientData.keydown,theServerInQuestion.cube.location)
                                    }
                                }
                                theServerInQuestion.moveDirectionVote = {forward:0,backward:0,left:0,right: 0,up:0, down:0}
                                //cycle through all the connected players are set their voted status to false 
                                theServerInQuestion.connectedPlayers.map((player)=>{
                                    player.voted = false 
                                })
                                
                            }
                        }
                    }
                }
                return player 
            })
            theServerInQuestion.keydown = undefined
            //sometimes I need this check, not sure why. 
            if(theServerInQuestion.moveDirectionVote == undefined){
                theServerInQuestion.moveDirectionVote = {forward:0,backward:0,left:0,right: 0,up:0, down:0}
            }
        }
        io.emit('gameState',theServerInQuestion)
    })
    //I think in this version there will be no camera control....
    socket.on('subscribeToCameraPosition',(camera)=>{
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
})
server.listen(process.env.PORT || 8081, ()=>{
    console.log("listening on port", server.address().port)
})
