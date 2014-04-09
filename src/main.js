function World(xSize, ySize, zSize) {

    this.grid = new Array();
    this.lights = new Array()
    
    for (var i = 0; i < xSize; i++){
        this.grid.push(new Array());
        for (var j = 0; j < ySize; j++){
            this.grid[i].push(new Array());
            for (var k = 0; k < zSize; k++){
                this.grid[i][j].push(null);
            }
        }
    }
    
    // Make a ground (x,z plane is the ground)
    for (var x = 0; x < xSize ; x++){
        for (var z = 0; z < zSize ; z++){
            this.grid[x][0][z] = new Voxel(x,0,z);
        }
    }
    
    // Add lights
    var light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(2,2,2);
    scene.add(light);
    
}


function render() {
	requestAnimationFrame(render);
	
	var now = Date.now()
	var delta = now - lastFrame;
	lastFrame = now;
	
	
	//update all of the things
	if (delta <= 100){
	    player.update(delta);
	}
	
	renderer.render(scene, camera);
}


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//var geometry = new THREE.CubeGeometry(1,1,1);
//var material = new THREE.MeshBasicMaterial( { c olor: 0x00ff00 } );
//var cube = new THREE.Mesh( geometry, material );
//scene.add( cube );

camera.position.z = 15;
camera.position.x = 5;
camera.position.y = 2;

var world = new World(10,10,10);
var player = new Player(5,4,5);

var lastFrame = Date.now();
render();
