function World(xSize, ySize, zSize) {
    this.xSize = xSize;
    this.ySize = ySize;
    this.zSize = zSize;

    this.lights = new Array()
    
    this.grid = new Array();
    // Populate the grid Array(s)
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
World.prototype.getVoxelAt = function(xPos, yPos, zPos) {
    if (xPos >= 0 && xPos < this.xSize &&
        yPos >= 0 && yPos < this.ySize &&
        zPos >= 0 && zPos < this.zSize) {
        return this.grid[xPos][yPos][zPos];
    } else {
        return null;
    }
};