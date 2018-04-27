const express = require('express');
const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server)
const cookierParser = require('socket.io-cookie-parser')
const bodyParser = require('body-parser')
const morgan = require('morgan')

app.use('/public', express.static(__dirname+'/public'))
app.use('/assests', express.static(__dirname+'/assests'))
app.use('/js', express.static(__dirname+'/js'))

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.get('/', (req,res,next)=>{
    res.sendFile(__dirname +'/htmlGameStates/landing.html')
})
app.post('/',(req,res,next)=>{
    console.log("the name the player picked is", req.body)
    res.redirect("/lobby")
    
})

app.get('/lobby', (req,res,next)=>{
    console.log("player connected to the lobby")
    res.sendFile(__dirname +'/htmlGameStates/lobby.html')
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