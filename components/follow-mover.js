AFRAME.registerComponent('follow-mover', {
  schema: {
    target: { type: 'selector' }
  },
  tick: function () {
    var targetEl = this.data.target;
    if (!targetEl) {
      return;
    }
    
    var spherePosition = targetEl.getAttribute('position');
    if (!spherePosition) {
      return;
    }
    
    
    this.el.setAttribute('position', { 
      x: spherePosition.x, 
      y: spherePosition.y, 
      z: spherePosition.z,
    });
  }
});