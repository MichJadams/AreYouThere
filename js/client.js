console.log("hereexport ")
export let Client = {}
Client.socket = io.connect()
Client.sendTest = ()=>{
    console.log("test sent to the server")
    Client.socket.emit('test')
}
Client.playerJoined = function(){
    console.log("player joined")
    Client.Socket.emit('playerJoined')
}
Client.socket.on('newPlauer', (data)=>{
    console.log("NEW PLAYER")
})