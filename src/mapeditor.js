// mapeditor.js

var voxelColors = {
    0 : 0x008800,
    1 : 0xff0000,
    2 : 0x0000ff,
    3 : 0xffff00,
    4 : 0x00ffff
}

function Voxel(x, y, z, voxelType){
    this.x = x;
    this.y = y;
    this.z = z;
    this.voxelType = voxelType;
    
    var geometry = new THREE.CubeGeometry(1,1,1);
    var material = new THREE.MeshPhongMaterial( {
        color: voxelColors[this.voxelType],
    });
    this.cube = new THREE.Mesh( geometry, material );
    this.cube.position.x = this.x;
    this.cube.position.y = this.y;
    this.cube.position.z = this.z;
    
    scene.add(this.cube);
}

function World(xSize, ySize, zSize) {
    this.xSize = xSize;
    this.ySize = ySize;
    this.zSize = zSize;

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
    // for (var x = 0; x < xSize ; x++){
    //     for (var z = 0; z < zSize ; z++){
    //         this.grid[x][0][z] = new Voxel(x,0,z);
    //     }
    // }
    
    // Add lights
    var light = new THREE.PointLight(0xffffff, 1, 0);
    light.position.set(5,5,0);
    scene.add(light);

    var dirLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight2.position.set(1, 1, 1)
    scene.add(dirLight2);

    var ambientLight = new THREE.AmbientLight(0x303030);
    scene.add(ambientLight);

    /**
     *  Level JSON Format
     * 
     *  {
     *      "xSize" : int,
     *      "ySize" : int,
     *      "zSize" : int,
     *      "blocks" : [],
     *          - each entry in "blocks" looks like:
     *              {"x": x, "y": y, "z": z, "blockType": type (char)}
     *      "lights" : [],
     *          - each entry in "lights" looks like:
     *              {"x": x, "y", y, "z": z, "lightType": type (string?), other light-specific things (intensity, color, etc.)}
     *  }
     * 
     * 
     */
    this.generateLevelData = function() {
        var blocks = new Array();
        for (var i = 0; i < this.xSize; i++) {
            for (var j = 0; j < this.ySize; j++) {
                for (var k = 0; k < this.zSize; k++) {
                    if (this.grid[i][j][k] != null) {
                        blocks.push({
                            "x" : i,
                            "y" : j,
                            "z" : k,
                            "blockType" : this.grid[i][j][k].voxelType
                        });
                    }
                }
            }
        }

        var levelJSON = JSON.stringify({
            "xSize" : this.xSize,
            "ySize" : this.ySize,
            "zSize" : this.zSize,
            "blocks" : blocks,
            "lights" : [
            ]
        });

        document.getElementById('level-output').value = levelJSON;
    }

    this.loadLevelData = function() {
        var levelJSON = JSON.parse(document.getElementById('level-output').value);
        this.xSize = levelJSON.xSize;
        this.ySize = levelJSON.ySize;
        this.zSize = levelJSON.zSize;

        this.grid = new Array();
        for (var i = 0; i < this.xSize; i++){
            this.grid.push(new Array());
            for (var j = 0; j < this.ySize; j++){
                this.grid[i].push(new Array());
                for (var k = 0; k < this.zSize; k++){
                    this.grid[i][j].push(null);
                }
            }
        }
        for (var i = 0; i < levelJSON.blocks.length; i++) {
            var block = levelJSON.blocks[i];
            this.grid[block.x][block.y][block.z] = new Voxel(block.x, block.y, block.z, block.blockType);
        }
    }
}

function updateSelectedBlock(curPos, selectedBlock) {
    selectedBlock.position.x = curPos.x;
    selectedBlock.position.y = curPos.y;
    selectedBlock.position.z = curPos.z;
}

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var controls = new THREE.OrbitControls( camera );
console.log(controls);

var curPos = new THREE.Vector3(0, 0, 0);

var selectedBlockGeometry = new THREE.CubeGeometry(1.1,1.1,1.1);
var selectedBlockMaterial = new THREE.MeshPhongMaterial( {
    color: 0x0000ff,
});
var selectedBlock = new THREE.Mesh(selectedBlockGeometry, selectedBlockMaterial);
selectedBlock.position.x = curPos.x;
selectedBlock.position.y = curPos.y;
selectedBlock.position.z = curPos.z;
scene.add(selectedBlock);

var canvas = document.getElementsByTagName('canvas')[0];

camera.position.z = 15;

var world = new World(10,10,10);

document.addEventListener('keydown', function(event) {
    onDocumentKeyDown(event);
}, false);

document.addEventListener('keyup', function(event) {
    onDocumentKeyUp(event);
}, false);

document.getElementById('loadbutton').onclick = function() {
    world.loadLevelData();
};

var curBlockId = BLOCK_TYPE.NORMAL;

var shiftDown = false;

function onDocumentKeyDown(event) {
    // Get the key code of the pressed key
    var keyCode = event.which;
    if (keyCode == 16) { // shift
        shiftDown = true;
    } else if (keyCode == 32) { // space
        world.generateLevelData();
    } else if (keyCode == 37) { // left
        var newX = curPos.x - 1 >= 0 ? curPos.x - 1 : 0;
        curPos.setX(newX);
        updateSelectedBlock(curPos, selectedBlock);
    } else if (keyCode == 38) { // up
        if (shiftDown) {
            var newY = curPos.y + 1 < world.ySize ? curPos.y + 1 : world.ySize - 1;
            curPos.setY(newY);
            updateSelectedBlock(curPos, selectedBlock);
        } else {
            var newZ = curPos.z - 1 >= 0 ? curPos.z - 1 : 0;
            curPos.setZ(newZ);
            updateSelectedBlock(curPos, selectedBlock);
        }
    } else if (keyCode == 39) { // right
        var newX = curPos.x + 1 < world.xSize ? curPos.x + 1 : world.xSize - 1;
        curPos.setX(newX);
        updateSelectedBlock(curPos, selectedBlock);
    } else if (keyCode == 40) { // down
        if (shiftDown) {
            var newY = curPos.y - 1 >= 0 ? curPos.y - 1 : 0;
            curPos.setY(newY);
            updateSelectedBlock(curPos, selectedBlock);
        } else {
            var newZ = curPos.z + 1 < world.zSize ? curPos.z + 1 : world.zSize - 1;
            curPos.setZ(newZ);
            updateSelectedBlock(curPos, selectedBlock);
        }
    } else if (keyCode == 13) { // enter
        // Fill in block or remove block if one is already there
        if (world.grid[curPos.x][curPos.y][curPos.z] == null) {
            world.grid[curPos.x][curPos.y][curPos.z] = new Voxel(curPos.x, curPos.y, curPos.z, curBlockId);
        } else {
            var obj = world.grid[curPos.x][curPos.y][curPos.z].cube;
            scene.remove(obj);
            world.grid[curPos.x][curPos.y][curPos.z] = null;
        }
    }
}

function onDocumentKeyUp(event) {
    var keyCode = event.which;

    if (keyCode == 16) { // shift
        shiftDown = false;
    }
}

render();
