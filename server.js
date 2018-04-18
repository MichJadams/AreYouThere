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


io.use(cookierParser())
io.on('connection',(socket)=>{
    const gameLogic = require('./gameLogic.js')(app,io,socket)
})
server.listen(process.env.PORT || 8081, ()=>{
    console.log("listening on port", server.address().port)
})