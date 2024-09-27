AFRAME.registerComponent('follow-mover', {
    schema: {
      target: { type: 'selector' }
    },
    tick: function () {
      var spherePosition = this.data.target.getAttribute('position');
      
      this.el.setAttribute('position', { 
        x: spherePosition.x - 1, 
        y: spherePosition.y - 2, 
        z: spherePosition.z 
      });
    }
  });