function vote(keycode,moveDirectionVote){
    
    if(keycode == 87){
        moveDirectionVote.forward+=1
        
    }
    if(keycode == 65){
        //left
        moveDirectionVote.left+=1
        
    }
    if(keycode == 83){
        //backwards
        moveDirectionVote.backward+=1
        
    }
    if(keycode == 68){
        //right
        moveDirectionVote.right+=1
        
    }
    if(keycode == 69){
        //up
        moveDirectionVote.up+=1
        
    }
    if(keycode == 81){
        //down
        moveDirectionVote.down+=1
        
    }
    return moveDirectionVote
}
module.exports ={vote}