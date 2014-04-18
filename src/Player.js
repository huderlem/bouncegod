function Player(x, y, z){
    
    // Create the Mesh
    this.radius = 0.75

    this.geometry = new THREE.SphereGeometry(this.radius, 32, 32)
    this.material = new THREE.MeshPhongMaterial( {
        color: 0x00ff00,
    });
    this.mesh = new THREE.Mesh( this.geometry, this.material);
    
    // Set the position and veloctiy
    this.mesh.position.x = x;
    this.mesh.position.y = y;
    this.mesh.position.z = z;
    this.velocity = new THREE.Vector3(0,0,0);
    
    // Add the mesh to the scene
    scene.add(this.mesh);
}

Player.prototype.attachCamera = function(camera){
    camera.position.z = 4;
    camera.position.x = 0;
    camera.position.y = 2;
    
    console.log(camera.rotation);
    
    //camera.lookAt(this.mesh.position);
    
    console.log(camera.rotation);
    
    this.mesh.add(camera);
    
    console.log(camera.rotation);
}

Player.prototype.update = function(delta, world){ // Delta is in milliseconds
    
    // Update the velocities
    //this.velocity.y -= .000001 * delta; // "Gravity"
    
    var moveConst = .000007
    
    if (keyboard.pressed("right")) {
        this.velocity.x += moveConst * delta;
    }
    if (keyboard.pressed("left")) {
        this.velocity.x -= moveConst * delta;
    }
    if (keyboard.pressed("up")) {
        this.velocity.z -= moveConst * delta;
    }
    if (keyboard.pressed("down")) {
        this.velocity.z += moveConst * delta;
    }
        
    //Update the position
    this.mesh.position.x += this.velocity.x * delta;
    this.mesh.position.y += this.velocity.y * delta;
    this.mesh.position.z += this.velocity.z * delta;

    this.checkCollision(world);
}
Player.prototype.checkCollision = function(world) {
    // get the 8 voxels that it could possibly be colliding with
    var possibleColliders = [];

    var xPos = this.mesh.position.x - this.radius/2.0;
    var yPos = this.mesh.position.y - this.radius/2.0;
    var zPos = this.mesh.position.z - this.radius/2.0;
    
    // left bottom close
    possibleColliders.push(world.getVoxelAt(Math.floor(xPos), Math.floor(yPos), Math.floor(zPos)));
    // right bottom close
    possibleColliders.push(world.getVoxelAt(Math.floor(xPos + 1), Math.floor(yPos), Math.floor(zPos)));
    // left bottom far
    possibleColliders.push(world.getVoxelAt(Math.floor(xPos), Math.floor(yPos), Math.floor(zPos + 1)));
    // right bottom far
    possibleColliders.push(world.getVoxelAt(Math.floor(xPos + 1), Math.floor(yPos), Math.floor(zPos + 1)));
    // left top close
    possibleColliders.push(world.getVoxelAt(Math.floor(xPos), Math.floor(yPos + 1), Math.floor(zPos)));
    // right top close
    possibleColliders.push(world.getVoxelAt(Math.floor(xPos + 1), Math.floor(yPos + 1), Math.floor(zPos)));
    // left top far
    possibleColliders.push(world.getVoxelAt(Math.floor(xPos), Math.floor(yPos + 1), Math.floor(zPos + 1)));
    // right top far
    possibleColliders.push(world.getVoxelAt(Math.floor(xPos + 1), Math.floor(yPos + 1), Math.floor(zPos + 1)));

    var voxel;
    for (var i = 0; i < possibleColliders.length; i++) {
        voxel = possibleColliders[i]
        if (voxel != null) {
            // do bounding boxes intersect?
            if (!((xPos >= voxel.mesh.position.x + voxel.width ) || 
                  (xPos + this.radius <= voxel.mesh.position.x) || 
                  (yPos >= voxel.mesh.position.y + voxel.width ) || 
                  (yPos + this.radius <= voxel.mesh.position.y) || 
                  (zPos >= voxel.mesh.position.z + voxel.width ) || 
                  (zPos + this.radius <= voxel.mesh.position.z) ) ) {
                this.material.color.setHex( Math.random() * 0xffffff );
                // yes, they intersect, now make it bounce correctly...
            }
        }
    }

}