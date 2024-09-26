AFRAME.registerComponent('look-at-camera', {
    tick: function () {
      var camera = document.getElementById('camera');
      if (!camera) {
        console.error('Camera not found.');
        return;
      }
      var cameraPosition = camera.object3D.position;
      this.el.object3D.lookAt(cameraPosition);
    }
  });