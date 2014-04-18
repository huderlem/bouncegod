// GLOBALS
var scene, camera, renderer
var world, player
var lastFrame
var keyboard

function init(){
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xffffff, 1);
    keyboard = new THREEx.KeyboardState();
    
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    
    
    // Instantiate objects in the scene
    world = new World(10,10,10);
    player = new Player(1,4,1);
    
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    player.attachCamera(camera);
        
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