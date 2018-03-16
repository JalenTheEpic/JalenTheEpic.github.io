let Grid = function(width, height){

    //!----------------letiable Declarations----------------!
    this.mHeight = height;
    this.mWidth = width;
    //this.mCellSize = 2;
    this.mGridData = [];
    this.mCurScene = new THREE.Scene();
    this.mPointMat = new THREE.PointsMaterial( { vertexColors: THREE.VertexColors, sizeAttenuation:false, size: 3} );
    this.mPointGeometry = new THREE.Geometry();
    this.mVertexMatrix = {};
    this.mMouseGeometry = new THREE.Geometry();
    this.mMouseParticle = {};
    this.mMouseMat = new THREE.PointsMaterial( { color: 0xffffff, sizeAttenuation:false, size: 4} );
    this.mOriginalColor = new THREE.Color(.2, .6, .8);
    //!----------------Function Declarations----------------!
    this.clearGrid = function(){

        this.mGridData = []
        for(i = 0; i < this.mWidth; ++i){
        this.mGridData.push([]);

            for(j = 0; j < this.mHeight; ++j){
                this.mGridData[i].push(0);
            }
        }
        
    } 

    this.countGridItems = function(){

        let count = 0;
        for(y = 0; y < this.mHeight;++y){
            for(x = 0; x < this.mWidth; ++x){
                if(this.mGridData[x][y]){
                    ++count;
                }
            }
        } 
        return count;
    }

    this.fillGrid = function(){

        for(i = 0; i < this.mWidth; ++i){
            for(j = 0; j < this.mHeight; ++j){
                this.addCell(i,j,1);
            }
        }
    }

    this.addToGrid = function(amount){

        if( amount >= this.mWidth * this.mHeight || this.mWidth * this.mHeight - this.countGridItems() < amount){
            this.fillGrid();
            amount = 0;
        }
        //this is to prevent infinite loops
        //TODO(Come back and make a better random generator)
        tries = 0;
        while(amount>0){
            r =  getRandomInt(0, this.mWidth);
            r2 = getRandomInt(0, this.mHeight);
            if(!this.mGridData[r][r2]){
                this.addCell(r,r2,1);
                amount--;
            }
            if(tries++ > 100000){
                amount = 0;
            }
        }
    };

    this.clearScene = function(){
        this.mCurScene.remove(this.mPointGeometry);
        this.mCurScene.remove(this.mVertexMatrix);
        this.mCurScene.remove(this.mMouseParticle);
        this.mCurScene.remove(this.mMouseGeometry);

        this.mPointGeometry.dispose();
        this.mMouseGeometry.dispose();
    }
    this.fillScene = function(){
        
        this.clearScene();
        
        this.mPointGeometry = new THREE.Geometry();
        for(y = 0; y < this.mHeight;++y){
            for(x = 0; x < this.mWidth; ++x){
                if(this.mGridData[x][y]){
                    let vertex = new THREE.Vector3();
                    vertex.x = x*4;
                    vertex.x+=1.5;
                    vertex.y = y*4;
                    vertex.y+=1.5;
                    vertex.z = 0;
                    this.mPointGeometry.vertices.push( vertex );
                    this.mPointGeometry.colors.push(this.determineColor(x,y));
                }
            }
        } 
       
        this.mVertexMatrix = new THREE.Points( this.mPointGeometry, this.mPointMat);
        this.mCurScene.add( this.mVertexMatrix );

    };
    
    this.determineColor = function(x,y){

       return this.mOriginalColor;

    }
    this.addCell = function(x,y, value){

        value = (typeof value !== 'undefined') ?  value : 1;
        this.mGridData[x][y] = value;

    };

    this.countNeighbors = function(x,y){

        count=0;
        //Checks the surrounding cells of cell(x,y)
        for(i = -1;i<2;++i){
            for(j = -1;j<2;++j){
                x_ind = x+i;
                y_ind = y+j;
                if(x_ind >= 0 && x_ind < this.mWidth)//makes sure x_ind is not out of bounds
                    if(y_ind >= 0 && y_ind < this.mHeight)//makes sure y_ind is not out of bounds
                        if(this.mGridData[x_ind][y_ind])
                            count++;
            }
        }

        if(count > 0 && this.mGridData[x][y])//making sure we did not include the current cell in count
            count--;

        return count;
    }

    this.computeNextFrame = function(){       
        nextGrid = []
        for(i = 0; i < this.mWidth; ++i){
                nextGrid.push([]);
            for(j = 0; j < this.mHeight; ++j){
                nextGrid[i].push(0);
            }
        }

        for(x = 0; x < this.mWidth; ++x){
            for(y = 0; y < this.mHeight;++y){

            nextGrid[x][y]=this.nextState(x,y);
            }
        }

        this.mGridData = nextGrid;
    }

    this.nextState = function(x,y){
        //override for new rules
    }

    this.getNeighbors = function(x,y){
        
        neighbors = [];
        for(i = -1;i<2;++i){
            for(j = -1;j<2;++j){
                x_ind = x+i;
                y_ind = y+j;
                if(x_ind >= 0 && x_ind < this.mWidth){
                    if(y_ind >= 0 && y_ind < this.mHeight){
                        neighbors.push(this.mGridData[x_ind][y_ind]);
                    }else{
                        neighbors.push(0);
                    }
                }else{
                    neighbors.push(0);
                }      
            }
        }
        neighbors.splice(4,1);
        return neighbors;

    }
    this.drawMouse = function(x,y){

        this.mMouseGeometry = new THREE.Geometry();
        
        let vert = new THREE.Vector3();
        vert.x = x;
        vert.y = y;
    
        this.mMouseGeometry.vertices.push( vert );
         
        
        this.mMouseParticle = new THREE.Points(   this.mMouseGeometry, this.mMouseMat);
        this.mCurScene.add(  this.mMouseParticle );

    }

    //Saving and loading
    this.fileSave = function(){

        tempstr = "";
        for(y = 0; y < this.mHeight;++y){
            for(x = 0; x < this.mWidth; ++x){    
                tempstr += this.mGridData[x][y];
                if(x != this.mWidth -1)
                    tempstr += ',';
            }
            if(y!= this.mHeight-1)
                tempstr+='\n';
        }
        blob = new Blob([tempstr], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "save.txt");

    }

    this.fileLoad = function(fileText){

        
        let lines = fileText.split('\n');
        if(lines.length == this.mHeight){
            this.clearGrid();
            for(i = 0; i < lines.length; ++i){
                let values = lines[i].split(',');
                for(j = 0; j < values.length; ++j){
                    
                    this.mGridData[j][i] = parseInt(values[j]);
                    
                }

            }
        }
        //console.log(lines.length);


    }


    this.setupShader= function(){


        uniforms = {
            A: { type: "f", value: 1.0 },
            B: { type: "f", value: 1.0 },
            Da: { type: "f", value: 1.0 },
            Db: { type: "f", value: 1.0 },
            f: { type: "f", value: 1.0 },
            k: { type: "f", value: 1.0 },
            dt: { type: "f", value: 1.0 },
        };
        material = new THREE.ShaderMaterial( {
			uniforms: uniforms,
			vertexShader: document.getElementById( 'vertexShader' ).textContent,
			fragmentShader: document.getElementById( 'fragmentShader' ).textContent
		});

    }

    this.resetDetermineColor = function() {

        this.determineColor = function(){
            return this.mOriginalColor;
        }
    }

    //!----------------Init----------------!
    this.clearGrid();
    this.addToGrid(this.mWidth * this.mHeight * .25);
    this.nextState = conwayNextState;
}