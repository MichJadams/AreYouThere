

const {generatePlayer, createScene} = require('./createScene')


//declare some local game variablesv

// let gamestate = 'player join'
let gamedata ={players:{},scene:{}}

module.exports = function(app,io,socket){
    // io.emit('test','this is a test')
    socket.on('playerJoined', ()=>{
        console.log("a new player joined, and thier ID is ", socket.request.cookies.io)
        if(Object.keys(gamedata.players).length <=1){
            console.log("this is the first player, and the world is being built")
            gamedata.scene = createScene()
            // io.emit('namePlayer')
        }
        
        gamedata.players[socket.request.cookies.io]={
            rot:{x:randomIntFromInterval(1,100),y:randomIntFromInterval(1,100)},
            loc:{
                x:randomIntFromInterval(1,10),
                y:randomIntFromInterval(1,10),
                z:randomIntFromInterval(1,10),}}
        console.log("the players in the waiting room are", gamedata.players)
        //chrisen the socket, there is probably a way better way to do this. 
     
        gamedata.scene.add(socket.request.cookies.io)
        socket.emit('namePlayer',scene,socket.request.cookies.io)

        if(Object.keys(gamedata.players).length ==2){
            console.log("starting the game with",Object.keys(gamedata.players).length, " players" )
            io.emit('startgame', gamedata.scene)
            gameloop(gamedata)
        }
        io.emit('loadInitialWorld',gamedata)

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
        
    },500)
    })

}
const randomIntFromInterval=(min,max)=>{
    return Math.floor(Math.random()*(max-min+1)+min);
}