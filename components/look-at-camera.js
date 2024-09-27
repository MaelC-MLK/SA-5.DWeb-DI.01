AFRAME.registerComponent('look-at-camera', {
    tick: function () {
      var sceneId = this.el.sceneEl.id; // Récupérer l'ID de la scène
      var camera = document.getElementById('camera-' + sceneId);
      if (!camera) {
        console.error('Camera not found.');
        return;
      }
      var cameraPosition = camera.object3D.position;
      this.el.object3D.lookAt(cameraPosition);
    }
  });