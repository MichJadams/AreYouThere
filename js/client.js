console.log("hereexport ")
export let Client = {}
Client.socket = io.connect()
Client.sendTest = (data)=>{
    console.log("test sent to the server")
    Client.socket.emit('test',data)
}

Client.playerJoined=()=>{
    console.log("a player joined")
    Client.socket.emit('playerJoined')
}
