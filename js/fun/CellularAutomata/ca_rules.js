
function conwayNextState(x,y){

    state = grid.mGridData[x][y]; // This is the state that will be returned in the end. Initialized to the original state of the cell(x,y)
    neighbors = grid.countNeighbors(x,y);
    if(state){
        if(neighbors < 2)//RULE 1 GAME OF LIFE:  A live cell with fewer than two live neighbors dies
            state= 0;
        else if(neighbors > 3)//RULE 2 GAME OF LIFE:  A live cell with more than three live neighbors also dies.
            state = 0;
        else if(neighbors == 2 || neighbors ==3)//RULE 3 GAME OF LIFE:  A live cell with exactly two or three live neighbors lives.
            state = 1;
    }else{
        if(neighbors == 3)//RULE 4 GAME OF LIFE:  A dead cell with exactly three live neighbors becomes alive
            state= 1;
    }
    return state;

}


function wireworldNextState(x,y){
    
        state = grid.mGridData[x][y]; 
        if(state == 1){  //Electron head
            return 2;
        }else if(state == 2){ //Electron tail
            return 3;
        }else if(state == 3){ //Conductor
            headcount = 0;
            neighbors = grid.getNeighbors(x,y);
            for(i = 0; i < neighbors.length; ++i){
                if(neighbors[i] == 1){
                    headcount++;
                }
            }
            if(headcount ==1 || headcount ==2)
                return 1;
        }

        return state;
    
}

function wireworldDetermineColor(x,y){
    state = grid.mGridData[x][y];
    if(state == 1){  //Electron head
        return new THREE.Color(0, 0, 1);
    }else if(state == 2){ //Electron tail
        return new THREE.Color(1, 0, 0);
    }else if(state == 3){ //Conductor 
        return new THREE.Color(1, 1, 0);
    }

}