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
    servers:[{ id: 1, name:"starterServer",status:'open',gameState:{}}],
    waitingPlayers:[{name:'bill'}]

} //this is not how I actually want to store game info. there is a better way, just can't think of it rn. 

// app.get('/', (req,res,next)=>{
//     console.log("first session id",req.session.id)
//     res.sendFile(__dirname +'/Client/index.js')
// })

app.post('/name',(req,res,next)=>{ 
    console.log("a person has selected a name", req.body.name)
    badwayMasterGameState.waitingPlayers.push({name: req.body.name})
    res.sendStatus(201)
    next()
})
io.use(cookierParser())
io.on('connection',(socket)=>{
    socket.on('subscribeToTimer', (interval)=>{
        console.log("client is subscribing to timer with interval,", interval)
        setInterval(() => {
            socket.emit('timer', new Date());
      }, interval);
    })
    socket.on('subscribeToWaitingPlayers', ()=>{
        console.log("client is subscribing to player list")
        io.emit('waitingPlayerList',badwayMasterGameState.waitingPlayers)
        
    })
    socket.on('subscribeToServers', ()=>{
        console.log("client is subscribing to server list,")
        io.emit('serversList', badwayMasterGameState.servers);
      
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