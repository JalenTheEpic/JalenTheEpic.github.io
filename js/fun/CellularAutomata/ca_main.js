//---------CONTROL FUCNTIONS---------//
$(document).on("keypress", function (e) {
    if(e.which === 'p'.charCodeAt(0) || e.which ===  'P'.charCodeAt(0) ){
        runSimulation = !runSimulation;
    }

    else if(e.which === ' '.charCodeAt(0) || e.which ===  ' '.charCodeAt(0) ){
        runSimulation = false;
        grid.computeNextFrame();
    }

    else if(e.which === 'r'.charCodeAt(0) || e.which ===  'R'.charCodeAt(0) ){
        runSimulation = false;
        grid.clearGrid();
        grid.addToGrid($("#sli der")[0].valueAsNumber);
    }

    else if(e.which === '0'.charCodeAt(0)){
        addValue = 0;
    }
    else if(e.which === '1'.charCodeAt(0)){
        addValue = 1;
    }

    else if(e.which === '2'.charCodeAt(0) ){
        addValue = 2;
    }

    else if(e.which === '3'.charCodeAt(0)){
        addValue = 3;
    }
});

$("#conways").click(function(){ 
    runSimulation = false;
    grid.resetDetermineColor();
    grid.nextState = conwayNextState;
    $("#controlText")[0].innerHTML = "Controls: Pause/Play(P)  Step Simulation(Space) Reset(R)";

});

$("#wireworld").click(function(){ 
    runSimulation = false;
    grid.resetDetermineColor();
    grid.nextState = wireworldNextState;
    grid.determineColor = wireworldDetermineColor;
    $("#controlText")[0].innerHTML = "Controls: Pause/Play(P)  Step Simulation(Space) Reset(R) <br/>Color Change: 1(Head) 2(Tail) 3(Conductor)";
});

$("#play").click(function(){ 
    runSimulation = !runSimulation; 
});


$("#add").click(function(){ 
    grid.addToGrid($("#slider")[0].valueAsNumber);
});


$("#reset").click(function(){ 
    runSimulation = false;
    grid.clearGrid();
    grid.addToGrid($("#slider")[0].valueAsNumber);
});

$("#clear").click(function(){ 
    runSimulation = false;
    grid.clearGrid();
});

$("#save").click(function(){ 
    runSimulation = false;
    grid.fileSave();
});


$('#drawingCanvas').mousedown(function(e){        
    paint = true;
    if(paint){
        grid.addCell(Math.floor(mousepos.x/4), Math.floor(mousepos.y/4), addValue);
    }
});

$('#drawingCanvas').mousemove(function(e){
    if(paint){
        grid.addCell(Math.floor(mousepos.x/4), Math.floor(mousepos.y/4), addValue);
    }
});


$('#drawingCanvas').mouseup(function(e){
    paint = false;
});

$('#drawingCanvas').mouseleave(function(e){
    paint = false;
});


$("input:file").change(function (){
    runSimulation = false;
    var files = this.files;
    if(files.length ==1){

        var saveFile = files[0];
        console.log(saveFile);
    
        var reader = new FileReader();
        reader.onload = function(e) {
            grid.fileLoad(this.result);
        }
        
        reader.readAsText(saveFile,"UTF-8");
    }
    
});


$("#load").click(function (){
    
    runSimulation = false;
    var files = $("input:file")[0].files;
    if(files.length ==1 ){

        var saveFile = files[0];
        console.log(saveFile);
    
        var reader = new FileReader();
        reader.onload = function(e) {
            grid.fileLoad(this.result);
        }
        
        reader.readAsText(saveFile,"UTF-8");
    }else{
        $("input:file").click();
    }
   
    
});

function getMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    mousepos = {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };

}

window.addEventListener('mousemove', getMousePos, false);

//---------Main---------//
var fps = 30;
var delay = 1000/fps;
function update() {
    now = Date.now();
    dt = now - lastUpdate;
    lastUpdate = now;
    timeSinceUpdate += dt;
    //console.log(dt);
    if(runSimulation && timeSinceUpdate >= delay){
        grid.computeNextFrame();
        timeSinceUpdate =0;
        
    }
    //console.log(timeSinceUpdate)
    grid.fillScene();
    
    grid.drawMouse(mousepos.x,mousepos.y);
        
}

function mainLoop() {
    update();
    requestAnimationFrame( mainLoop);
    renderer.render( grid.mCurScene, camera );
}


//---------SETUP ---------//

var paint = false;
var canvas = document.getElementById("drawingCanvas");
var scene = new THREE.Scene();
var camera = new THREE.OrthographicCamera(0, 2560, 0, 1440, -1, 1);
var mousepos = {x:0, y:0};
scene.add(camera);

var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
renderer.setClearColor( 0xffffff, 0);
renderer.setSize(2560, 1440);

var grid = new Grid(640, 360);
var addValue = 1;
var runSimulation = false;
var timeSinceUpdate = delay;
var now = 0;
var dt=0;
var lastUpdate = Date.now();

mainLoop();