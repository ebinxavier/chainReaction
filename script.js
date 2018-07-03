

function getParticleBox(count,color,translate){ //translate = [x,y]
    parent = new THREE.Object3D();

    parent.MyColors ={};
    var geometry = new THREE.SphereGeometry( 1,10,10 );
    var material1 = new THREE.MeshBasicMaterial( { color: parseInt(parent.MyColors.c1) } );
    var material2 = new THREE.MeshBasicMaterial( { color: parseInt(parent.MyColors.c2) } );
    var material3 = new THREE.MeshBasicMaterial( { color: parseInt(parent.MyColors.c3) } );

    var p1 = new THREE.Mesh( geometry, material1 );
    var p2 = new THREE.Mesh( geometry, material2 );
    var p3 = new THREE.Mesh( geometry, material3 );

    if(count>=1)
    parent.add( p1 );
    if(count>=2)
    parent.add( p2 );
    if(count==3)
    parent.add( p3);

    p1.translateX(1);
    p2.translateY(1);
    p3.translateZ(1);

    
    var x=translate[0];
    var y=translate[1];

    // geometry
    geometry = new THREE.Geometry();

    geometry.vertices.push( new THREE.Vector3( x+0, y+5, 0 ) );
    geometry.vertices.push( new THREE.Vector3( x+5, y+5, 0 ) );
    geometry.vertices.push( new THREE.Vector3( x+5, y+10, 0 ) );
    geometry.vertices.push( new THREE.Vector3( x+0, y+10, 0 ) ); 
    geometry.vertices.push( new THREE.Vector3( x+0, y+5, 0 ) ); // close the loop

    // material
    var material = new THREE.LineBasicMaterial( { color:  0xffffff, linewidth: 5 } );

    // line
    var box = new THREE.Line( geometry, material );

    //  parent.add(box);


    parent.translateX(translate[0]+.8)
    parent.translateY(translate[1]-.8)
    
    box.translateX(-1.75)
    box.translateY(-8.25)

    var geometry = new THREE.BoxBufferGeometry( 5, 5, 0 );
    var material = new THREE.MeshBasicMaterial( { color: 0xffff00,transparent: true} );
    material.opacity = .0;
    var mesh = new THREE.Mesh( geometry, material );

    mesh.translateX(translate[0]+2.5)
    mesh.translateY(translate[1]+7.6)
    mesh.translateZ(-.20)


    box.add(mesh);

    parent.handleClick=function(id){ //id = relative position in the grid
        this.positionId=id;
        var neighboursArray= getNeighbours(id);
        if(this.children.length==0 || this.children.length && this.children[0].material.color.getHex()==playerColors[currentPlayer]){
           addParticle(this,neighboursArray,null,currentPlayer,true); //firstCall=true
            var prevNoOfStacks=noOfStackCalls,prevPlayer=currentPlayer;
           var callAfter=()=>{
                while(true){
                   
                    currentPlayer++;
                    if(currentPlayer==noOfPlayers)firstRoundCompleted=true;
                    currentPlayer%=noOfPlayers;
                    // debugger;
                    if(isPlayerPresent() || !firstRoundCompleted)
                    break;
                }
                // console.log("After");
                setBoardColor();
                if(noOfStackCalls!=prevNoOfStacks){
                    setTimeout(callAfter,310); 
                    prevNoOfStacks=noOfStackCalls;
                    currentPlayer=prevPlayer;
                }
            }
            setTimeout(callAfter,10);
               
               
           
        }
    }
   UUIDMap[mesh.uuid]={parent:parent,id:UUID_Id++};
return {particle:parent,box:box,mesh:mesh};

}


function setBoardColor(){
    mArray.forEach(function(elem){
        elem.box.material.color.setHex(playerColors[currentPlayer]);
    })
}

function scrambleParticle(){
    // for(i in UUIDMap)
    // {
    //     for(j in UUIDMap[i].parent.children) 
    //         UUIDMap[i].parent.children[j].position.set(Math.random()*10-5,Math.random()*10-5,Math.random()*10-5)
    // }
    mArray.forEach(function(elem){
        elem.particle.children.forEach(function(child){
            child.position.set(Math.random()*10-5,Math.random()*10-5,Math.random()*10-5)
        })
    })
}

function isPlayerPresent(player){
    for(i in UUIDMap)
        if(UUIDMap[i].parent.children.length && UUIDMap[i].parent.children[0].material.color.getHex()==playerColors[player!=undefined?player:currentPlayer])
            return true
    return false;
}

function getNeighbours(id){

    var x= parseInt(id/playBox),y=id%playBox;

     // Finding neighbours
        var neighbours={left:{},right:{},top:{},bottom:{}};
            neighbours.left.x = x-1>=0?x-1:null;
            neighbours.left.x!=null?neighbours.left.y = y:neighbours.left=null;

            neighbours.right.x = x+1<playBox?x+1:null;
            neighbours.right.x!=null?neighbours.right.y = y:neighbours.right=null;

            neighbours.top.y = y-1>=0?y-1:null;
            neighbours.top.y!=null?neighbours.top.x = x:neighbours.top=null;

            neighbours.bottom.y = y+1<playBox?y+1:null;
            neighbours.bottom.y!=null?neighbours.bottom.x = x:neighbours.bottom=null;

            var neighboursArray=[];

            if(neighbours.left)
                neighboursArray.push(neighbours.left.x*playBox+neighbours.left.y);
            if(neighbours.right)
                neighboursArray.push(neighbours.right.x*playBox+neighbours.right.y);
            if(neighbours.top)
                neighboursArray.push(neighbours.top.x*playBox+neighbours.top.y);
            if(neighbours.bottom)
                neighboursArray.push(neighbours.bottom.x*playBox+neighbours.bottom.y);
        return neighboursArray;
}
function isGameOver(){
    var players=0;
    for(var i=0;i<noOfPlayers;i++)
        if(isPlayerPresent(i))
            players++;
    return players==1;
}
var noOfStackCalls=0;
function addParticle(parent,neighbours,from,currentPlayer,firstCall){

      if(firstCall) noOfStackCalls=0;
      

    var color=playerColors[currentPlayer];
    
    if(parent.children.length<neighbours.length-1){

            var geometry = new THREE.SphereGeometry( 1,20,20 );
            parent.MyColors={c1:parseInt(color,16),c2:parseInt(color.replace("ff","ef"),16),c3:parseInt(color.replace("ff","df"),16)}

            var material = new THREE.MeshBasicMaterial( {  color:parent.children.length==0?parent.MyColors.c1:parent.children.length==1?parent.MyColors.c2:parent.children.length==2?parent.MyColors.c3:parent.MyColors.c1c1} );
            
            var p = new THREE.Mesh( geometry, material );

            if(parent.children.length==0)
            p.translateX(1);
            if(parent.children.length==1)
            p.translateY(1);
            if(parent.children.length==2)
            p.translateZ(1);

            parent.rotation._x=parent.rotation._y=parent.rotation._z=0;

            if(from){
            p.position.x=from.x;
            p.position.y=from.y;
            
                if(parent.children.length==0)
                 {
                    if(p.position.x!=0){
                        let incX= (1-p.position.x)/100;
                        let xId=setInterval(function(){
                            p.position.x+=incX;
                            if(Math.round(p.position.x*100)/100==1){
                                clearInterval(xId);
                                p.position.x=1;
                                p.position.y=0;
                            }
                        })
                    }
                    if(p.position.y!=0){
                        let incY= (0-p.position.y)/100;
                        let yId=setInterval(function(){
                            p.position.y+=incY;
                            if(Math.round(p.position.y*100)/100==0){
                                clearInterval(yId);
                                p.position.y=0;
                                p.position.x=1;
                            } 
                        })
                    }
                 }
                 if(parent.children.length==1)
                 {
                    if(p.position.x!=0){
                        let incX= (0-p.position.x)/100;
                        let xId=setInterval(function(){
                            p.position.x+=incX;
                            if(Math.round(p.position.x*100)/100==0){
                                clearInterval(xId);
                                p.position.x=0;
                                p.position.y=1;
                            }
                        })
                    }
                    if(p.position.y!=0){
                        let incY= (1-p.position.y)/100;
                        let yId=setInterval(function(){
                            p.position.y+=incY;
                            if(Math.round(p.position.y*100)/100==1){
                                clearInterval(yId);
                                p.position.y=1;
                                p.position.x=0;
                            } 
                        })
                    }
                 }
                 if(parent.children.length==2)
                 {
                    if(p.position.x!=0){
                        let incX= (0-p.position.x)/100;
                        let xId=setInterval(function(){
                            p.position.x+=incX;
                            if(Math.round(p.position.x*100)/100==0){
                                clearInterval(xId);
                                p.position.x=0;
                                p.position.y=0;
                                p.position.z=1;
                            }
                        })
                    }
                    if(p.position.y!=0){
                        let incY= (0-p.position.y)/100;
                        let yId=setInterval(function(){
                            p.position.y+=incY;
                            if(Math.round(p.position.y*100)/100==0){
                                clearInterval(yId);
                                p.position.y=0;
                                p.position.x=0;
                                p.position.z=1;
                            } 
                        })
                    }
                 }
            }

            for(i=0;i<parent.children.length;i++){
                parent.children[i].material.color.setHex(parent.MyColors['c'+(i+1)]);
            }
            parent.add( p );

           
            
        }
        else {  //explode
            
           setTimeout(function(){
               // console.log("fCall:"+firstCall);
               noOfStackCalls++;
               if(noOfStackCalls > playBox*playBox*playBox) {
                   console.log("stack overflow");
                   return;
                }
            parent.children=[];
            for(var i in neighbours){
                  addParticle(mArray[neighbours[i]].particle,getNeighbours(neighbours[i]),getAnimationDirection(parent.positionId,neighbours[i]),currentPlayer)
             }
                if(!isPlayerPresent()){
                    currentPlayer++;
                    currentPlayer%=noOfPlayers;
                }
           },firstCall?0:300)
            
        }
        
          
}

function getAnimationDirection(from,to){
    var x1=parseInt(from/playBox),y1=from%playBox;
    var x2=parseInt(to/playBox),y2=to%playBox;

        if(x2-x1>0) return {x:-5,y:0};
        if(x2-x1<0) return {x:5,y:0};
        if(y2-y1>0) return {x:0,y:5};
        if(y2-y1<0) return {x:0,y:-5}; 

}
function resetGame(){
    UUIDMap={},UUID_Id=0;
    mArray=[];
    playBox=5,noOfPlayers=3,currentPlayer=0,firstRoundCompleted=false,gameOver=false;

    scene = new THREE.Scene();

    for(i=-2.5*playBox;i<2.5*playBox;i+=5)
    for(j=2.5*playBox;j>-2.5*playBox;j-=5)
        mArray.push(getParticleBox(0,'0x00ff00',[i,j]))
  
    setBoardColor();


    for(var i in mArray){
        scene.add( mArray[i].particle);
        scene.add( mArray[i].box); 
    }
}
  
function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
       
        
    } 
     window.addEventListener('resize', onResize, false);
    

            var UUIDMap={},UUID_Id=0;
            var mArray=[];
            var playBox=5,noOfPlayers=3,currentPlayer=0,firstRoundCompleted=false,gameOver=false;
            var playerColors=['0xff0e0e','0x00ff16','0x2900ff','0xfaff20','0xff8f00','0xfd00ff','0xffffff','0x03ffd3']; // g,b,r,y,o,p,w,c
            

            var scene = new THREE.Scene();
			var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 200 );

			var renderer = new THREE.WebGLRenderer();
			renderer.setSize( window.innerWidth, window.innerHeight );
            document.body.appendChild( renderer.domElement );
            

            for(i=-2.5*playBox;i<2.5*playBox;i+=5)
            for(j=2.5*playBox;j>-2.5*playBox;j-=5)
                mArray.push(getParticleBox(0,'0x00ff00',[i,j]))
          
            setBoardColor();


            for(var i in mArray){
                scene.add( mArray[i].particle);
                scene.add( mArray[i].box); 
            }
            
            

			camera.position.z = 30;






            //  Click event handler
            
            var raycaster = new THREE.Raycaster();
            var mouse = new THREE.Vector2();

            function onMouseMove( event ) {
               

                // calculate mouse position in normalized device coordinates
                // (-1 to +1) for both components

                mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
                mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

                raycaster.setFromCamera(mouse, camera);
                var intersects = raycaster.intersectObjects(scene.children, true);

                // console.log(intersects);
                // debugger;
                for (i=0; i<intersects.length;i++)
                    if(UUIDMap[intersects[i].object.uuid])
                    {
                        UUIDMap[intersects[i].object.uuid].parent.handleClick(UUIDMap[intersects[i].object.uuid].id);
                        break;
                    }



            }
            


            
            
            
			var animate = function () {
				requestAnimationFrame( animate );

                 for(var i in mArray){
                    mArray[i].particle.rotation.x+=Math.random()/20;
                    mArray[i].particle.rotation.y+=Math.random()/20;
                    mArray[i].particle.rotation.z+=Math.random()/20;
                    }
				renderer.render(scene, camera);
			};

			animate();

        window.addEventListener( 'click', onMouseMove, false );