const express = require('express');
const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server)
const cookierParser = require('socket.io-cookie-parser')



app.use('/public', express.static(__dirname+'/public'))
app.use('/assests', express.static(__dirname+'/assests'))
app.use('/js', express.static(__dirname+'/js'))


app.get('/', (req,res,next)=>{

    res.sendFile(__dirname +'/index.html')
})

server.players = {}

io.use(cookierParser())
io.on('connection',(socket)=>{
    console.log("connection")
    socket.on('test', (data)=>{
        console.log("connected!", )
        console.log("sent this string", data)
    })

    socket.on('playerJoined', ()=>{
        console.log("a new player joined, and thier ID is ", socket.request.cookies.io)
        server.players[socket.request.cookies.io] = {}
        console.log("the players in the waiting room are", server.players)
        console.log(Object.keys(server.players))
        if(Object.keys(server.players) >=2){
            console.log("starting the game with",Object.keys(server.players).length, " players" )
            io.emit('startgame')
        }
    })

    
    
})
server.listen(process.env.PORT || 8081, ()=>{
    console.log("listening on port", server.address().port)
})