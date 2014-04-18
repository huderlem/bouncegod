// GLOBALS
var scene, camera, renderer
var world, player
var lastFrame
var keyboard

function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    renderer = new THREE.WebGLRenderer();
    keyboard = new THREEx.KeyboardState();
    
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    
    
    camera.position.z = 15;
    camera.position.x = 5;
    camera.position.y = 2;
    
    // Instantiate objects in the scene
    world = new World(10,10,10);
    player = new Player(1,4,1);
    
}
function update(){

    var now = Date.now()
	var delta = now - lastFrame;
	lastFrame = now;	
	
	//update all of the things
	if (delta <= 100){
	    player.update(delta, world);
	} else {
        console.log(delta);
    }
}

function render() {
	requestAnimationFrame(render);
	update();
	renderer.render(scene, camera);
}


init();
render();