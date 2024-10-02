// Composant personnalisé qui modifie la taille de l'élément cible en alternant entre les dimensions
AFRAME.registerComponent('resize-on-click', {
    schema: {
      target: { type: 'selector' }, // L'élément que l'on souhaite redimensionner
      defaultWidth: { type: 'number', default: 5 }, // Largeur par défaut
      defaultHeight: { type: 'number', default: 3 }, // Hauteur par défaut
      reducedWidth: { type: 'number', default: 2 }, // Largeur réduite
      reducedHeight: { type: 'number', default: 1.2 } // Hauteur réduite
    },
  
    init: function () {
      this.isExpanded = true; // État initial : l'élément est agrandi
  
      this.el.addEventListener('click', () => {
        if (this.data.target) {
          // Alterner entre les dimensions d'origine et réduites
          const newWidth = this.isExpanded ? this.data.reducedWidth : this.data.defaultWidth;
          const newHeight = this.isExpanded ? this.data.reducedHeight : this.data.defaultHeight;
  
          // Modifier la largeur et la hauteur de l'élément cible
          this.data.target.setAttribute('width', newWidth);
          this.data.target.setAttribute('height', newHeight);
  
          // Inverser l'état
          this.isExpanded = !this.isExpanded;
        }
      });
    }
  });
  