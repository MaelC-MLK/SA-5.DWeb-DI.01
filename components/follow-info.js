// Composant pour suivre la position de la sphère
AFRAME.registerComponent('follow-sphere', {
    schema: {
      target: { type: 'selector' } // Sélecteur de l'objet cible (la sphère)
    },
    tick: function () {
  
      // position de la sphere
      var spherePosition = this.data.target.getAttribute('position'); 
  
      // position du texte
      this.el.setAttribute('position', { x: spherePosition.x, y: spherePosition.y + 1.5, z: spherePosition.z });
  
  
      var camera = document.getElementById('camera');
      var cameraPosition = camera.getAttribute('position');
  
      // Crée un vecteur pour la position de la sphère et de la caméra
      var cameraVector = new THREE.Vector3(cameraPosition.x, cameraPosition.y, cameraPosition.z);
  
      // lookAt pour que le texte soit toujours face à la caméra
      this.el.object3D.lookAt(cameraVector);
    }
  });