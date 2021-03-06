function Player(x, y, z){
    
    // Create the Mesh
    this.radius = 0.5

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
    this.velocity.y -= .000001 * delta; // "Gravity"
    
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

    var xPos = this.mesh.position.x;
    var yPos = this.mesh.position.y;
    var zPos = this.mesh.position.z;
    
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
            var halfVoxelWidth = voxel.width / 2.0;
            // do bounding boxes intersect?
            if (!((xPos - this.radius >= voxel.mesh.position.x + halfVoxelWidth ) || 
                  (xPos + this.radius <= voxel.mesh.position.x - halfVoxelWidth ) || 
                  (yPos - this.radius >= voxel.mesh.position.y + halfVoxelWidth ) || 
                  (yPos + this.radius <= voxel.mesh.position.y - halfVoxelWidth ) || 
                  (zPos - this.radius >= voxel.mesh.position.z + halfVoxelWidth ) || 
                  (zPos + this.radius <= voxel.mesh.position.z - halfVoxelWidth ) ) ) {
                // get cube's closest point to player
                var closestX;
                var closestY;
                var closestZ;
                // get closest point's x value
                if (this.mesh.position.x < voxel.mesh.position.x - halfVoxelWidth) {
                    closestX = voxel.mesh.position.x - halfVoxelWidth;
                } else if (this.mesh.position.x > voxel.mesh.position.x + halfVoxelWidth) {
                    closestX = voxel.mesh.position.x + halfVoxelWidth;
                } else {
                    closestX = this.mesh.position.x;
                }
                // get closest point's y value
                if (this.mesh.position.y < voxel.mesh.position.y - halfVoxelWidth) {
                    closestY = voxel.mesh.position.y - halfVoxelWidth;
                } else if (this.mesh.position.y > voxel.mesh.position.y + halfVoxelWidth) {
                    closestY = voxel.mesh.position.y + halfVoxelWidth;
                } else {
                    closestY = this.mesh.position.y;
                }
                // get closest point's z value
                if (this.mesh.position.z < voxel.mesh.position.z - halfVoxelWidth) {
                    closestZ = voxel.mesh.position.z - halfVoxelWidth;
                } else if (this.mesh.position.z > voxel.mesh.position.z + halfVoxelWidth) {
                    closestZ = voxel.mesh.position.z + halfVoxelWidth;
                } else {
                    closestZ = this.mesh.position.z;
                }

                // is it actually intersecting?
                if (Math.pow(closestX - this.mesh.position.x, 2) + Math.pow(closestY - this.mesh.position.y, 2) + Math.pow(closestZ - this.mesh.position.z, 2) < this.radius*this.radius) {
                    // get normal vector to cube
                    var normal = new THREE.Vector3( this.mesh.position.x - closestX,
                                                    this.mesh.position.y - closestY,
                                                    this.mesh.position.z - closestZ );
                    // project the velocity onto the normal
                    var projection = new THREE.Vector3( this.velocity.x, 
                                                        this.velocity.y, 
                                                        this.velocity.z).projectOnVector(normal).multiplyScalar(2);
                    // substract 2*projection from current velocity
                    this.velocity.sub( projection );

                    // maybe return something useful?
                    return;
                }
            }
        }
    }

}