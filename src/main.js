function Voxel(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
    
    var geometry = new THREE.CubeGeometry(1,1,1);
    var material = new THREE.MeshPhongMaterial( {
        color: 0xffff00,
        wireframe: true,
        linewidth: .01,
    });
    this.cube = new THREE.Mesh( geometry, material );
    this.cube.position.x = this.x;
    this.cube.position.y = this.y;
    this.cube.position.z = this.z;
    
    scene.add(this.cube);
    
}

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
	
	//cube.rotation.x += 0.01;
    //cube.rotation.y += 0.01;
	
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

render();
