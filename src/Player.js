function Player(x, y, z){
    
    // Create the Mesh
    var geometry = new THREE.SphereGeometry(.75, 32, 32)
    var material = new THREE.MeshPhongMaterial( {
        color: 0x00ff00,
    });
    this.mesh = new THREE.Mesh( geometry, material);
    
    // Set the position and veloctiy
    this.mesh.position.x = x;
    this.mesh.position.y = y;
    this.mesh.position.z = z;
    this.velocity = new THREE.Vector3(0,0,0);
    
    // Add the mesh to the scene
    scene.add(this.mesh);
}
Player.prototype.update = function(delta){ // Delta is in milliseconds
    
    // Update the velocities
    this.velocity.y -= .00005 * delta // "Gravity"
        
    //Update the position
    this.mesh.position.x += this.velocity.x * delta;
    this.mesh.position.y += this.velocity.y * delta;
    this.mesh.position.z += this.velocity.z * delta;
}