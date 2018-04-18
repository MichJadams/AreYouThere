

//declare some local game variablesv

// let gamestate = 'player join'
let gamedata ={players:{}}
module.exports = function(app,io,socket){



    socket.on('playerJoined', ()=>{
        console.log("a new player joined, and thier ID is ", socket.request.cookies.io)
        if(Object.keys(gamedata.players).length==0){
            console.log("this is the first player, and the world is being built")
            io.emit('generateScene')
        }
        gamedata.players[socket.request.cookies.io]={rot:{x:randomIntFromInterval(1,70),y:randomIntFromInterval(1,100)}}
        console.log("the players in the waiting room are", gamedata.players)
        //christen the socket, there is probably a way better way to do this. 
        socket.emit('namePlayer',socket.request.cookies.io)

        if(Object.keys(gamedata.players).length >=2){
            console.log("starting the game with",Object.keys(gamedata.players).length, " players" )
            io.emit('startgame')
            gameloop(gamedata)
        }
    })

    const gameloop=(gamedata)=>{
        //emit a command to render

        io.emit('redraw',gamedata)

        //receive a response that the client has rendered
    }
    socket.on('updated',(updatedData)=>{
        // console.log("the returned updated data is", updatedData)
    //    wait a second 
    //convert the updated data into new gamedata
    gamedata.players[socket.request.cookies.io].rot.x += 0.1
    gamedata.players[socket.request.cookies.io].rot.y += 0.1
    // console.log("server can see that the state was updated")
    setTimeout(()=>{
        //after 3000 seconds, call the game loop again
        // console.log("are we getting in here??")

        gameloop(gamedata)
        
    },5000)
    })

}
const randomIntFromInterval=(min,max)=>{
    return Math.floor(Math.random()*(max-min+1)+min);
}