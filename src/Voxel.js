function Voxel(x, y, z){
    
    // Create the Mesh
    this.width = 1;

    var geometry = new THREE.CubeGeometry(this.width, this.width, this.width);
    var material = new THREE.MeshPhongMaterial( {
        color: 0xffff00,
        wireframe: true,
        linewidth: .01,
    });
    this.mesh = new THREE.Mesh( geometry, material );
    
    // Set the position
    this.mesh.position.x = x;
    this.mesh.position.y = y;
    this.mesh.position.z = z;
    
    // Add the mesh to the scene
    scene.add(this.mesh);
}

Voxel.prototype.getBounceEffect = function(){
    return 1;    
}