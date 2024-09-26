AFRAME.registerComponent('follow-mover', {
    schema: {
      target: { type: 'selector' } // Sélecteur de l'objet cible (la sphère)
    },
    tick: function () {
      // Récupérer la position de la sphère
      var spherePosition = this.data.target.getAttribute('position');
      
      // Mettre à jour la position de l'élément qui suit la sphère
      this.el.setAttribute('position', { 
        x: spherePosition.x - 1, 
        y: spherePosition.y - 2, 
        z: spherePosition.z 
      });
    }
  });