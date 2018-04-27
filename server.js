const express = require('express');
const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server)
const cookierParser = require('socket.io-cookie-parser')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const session = require('express-session')
const cookieParser = require("cookie-parser")
const generateLobby = require("./generatedLobby")
app.use('/public', express.static(__dirname+'/public'))
app.use('/assests', express.static(__dirname+'/assests'))
app.use('/js', express.static(__dirname+'/js'))
app.use(cookieParser());
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(session({  secret: '34SDgsdgspxxxxxxxdfsG', // just a long random string
resave: false,
saveUninitialized: true}))
let badway = {}
app.get('/', (req,res,next)=>{
    console.log("first session id",req.session.id)
    res.sendFile(__dirname +'/htmlGameStates/landing.html')
})

app.post('/',(req,res,next)=>{ 
    console.log("second session id",req.session.id)
    badway[req.session.id]={name: req.body.name}
    res.redirect("/lobby")
})

app.get('/lobby', (req,res,next)=>{
    
    res.send(generateLobby(badway))
    console.log("third redirect",req.session.id)
    console.log("the players in the lobby are,",badway[req.session.id].name)
    //generate lobby

    // const generateLobby =(badway)=>{
    //     Object.keys(badway).map((sessionID)=>{
    //         const playerlist = document.getElementsByClassName("waitingPlayers")[0] 
    //         const playerDiv = document.createElement("div")
    //         playerlist.appendChild(playerDiv)
    //         const playerName = document.createTextNode("name =",badway[sessionID].name)
    //         playerDiv.appendChild(playerName)
            
    //     })
    // }
    
    // res.sendFile(__dirname +'/htmlGameStates/lobby.html')
})

app.get('/waitingRoom', (req,res,next)=>{
    res.sendFile(__dirname +'/htmlGameStates/index.html')
})
app.get('/playing', (req,res,next)=>{
    res.sendFile(__dirname +'/htmlGameStates/index.html')
})


io.use(cookierParser())
io.on('connection',(socket)=>{
    socket.on('connection name',function(user){
        console.log("hitting here")
      io.sockets.emit('new user', user.name + " has joined.");
    })

    const gameLogic = require('./gameLogic.js')(app,io,socket)
})
server.listen(process.env.PORT || 8081, ()=>{
    console.log("listening on port", server.address().port)
})