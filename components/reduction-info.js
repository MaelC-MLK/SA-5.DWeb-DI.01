AFRAME.registerComponent('resize-on-click', {
  schema: {
    target: { type: 'selector' }, // L'élément à redimensionner (le `backgroundPlane`)
    textTitle: { type: 'selector' }, // Sélecteur du texte du titre à redimensionner
    textDescription: { type: 'selector' }, // Sélecteur du texte de la description à redimensionner
    defaultWidth: { type: 'number', default: 5 }, // Largeur par défaut du `backgroundPlane`
    defaultHeight: { type: 'number', default: 3 }, // Hauteur par défaut du `backgroundPlane`
    reducedWidth: { type: 'number', default: 0.1 }, // Largeur réduite (taille minimale)
    reducedHeight: { type: 'number', default: 0.1 }, // Hauteur réduite (taille minimale)
    defaultTitleScale: { type: 'vec3', default: { x: 2.4, y: 2.4, z: 2.4 } }, // Taille par défaut du texte du titre
    reducedTitleScale: { type: 'vec3', default: { x: 0.01, y: 0.01, z: 0.01 } }, // Taille réduite du texte du titre
    defaultDescriptionScale: { type: 'vec3', default: { x: 2.0, y: 2.0, z: 2.0 } }, // Taille par défaut du texte de la description
    reducedDescriptionScale: { type: 'vec3', default: { x: 0.01, y: 0.01, z: 0.01 } }, // Taille réduite du texte de la description
    reductionBoxPos: { type: 'vec3', default: { x: 0.4, y: 0.4, z: 0 } } // Position du `reductionBox` pour l'animation
  },

  init: function () {
    this.isExpanded = true; // État initial : l'élément est agrandi

    // Stocker les positions d'origine pour les restaurer après la réduction
    this.originalPositions = {
      target: this.data.target.getAttribute('position'),
      textTitle: this.data.textTitle ? this.data.textTitle.getAttribute('position') : null,
      textDescription: this.data.textDescription ? this.data.textDescription.getAttribute('position') : null
    };

    this.el.addEventListener('click', () => {
      if (this.data.target) {
        // Alterner entre les dimensions d'origine et réduites pour le `backgroundPlane`
        const newWidth = this.isExpanded ? this.data.reducedWidth : this.data.defaultWidth;
        const newHeight = this.isExpanded ? this.data.reducedHeight : this.data.defaultHeight;

        // Modifier la largeur et la hauteur de l'élément cible (`backgroundPlane`)
        this.data.target.setAttribute('animation__width', {
          property: 'width',
          to: newWidth,
          dur: 500,
          easing: 'easeInOutQuad'
        });
        this.data.target.setAttribute('animation__height', {
          property: 'height',
          to: newHeight,
          dur: 500,
          easing: 'easeInOutQuad'
        });

        // Déplacer le `backgroundPlane` vers le `reductionBox` puis le restaurer à sa position initiale
        const targetNewPosition = this.isExpanded
          ? `${this.data.reductionBoxPos.x} ${this.data.reductionBoxPos.y} ${this.data.reductionBoxPos.z}`
          : `${this.originalPositions.target.x} ${this.originalPositions.target.y} ${this.originalPositions.target.z}`;
          console.log(targetNewPosition);
        this.data.target.setAttribute('animation__position', {
          property: 'position',
          to: targetNewPosition,
          dur: 500,
          easing: 'easeInOutQuad'
        });

        // Animation d'échelle et de position pour le texte du titre (si spécifié)
        if (this.data.textTitle) {
          const newTitleScale = this.isExpanded ? this.data.reducedTitleScale : this.data.defaultTitleScale;
          this.data.textTitle.setAttribute('animation__scale', {
            property: 'scale',
            to: `${newTitleScale.x} ${newTitleScale.y} ${newTitleScale.z}`,
            dur: 500,
            easing: 'easeInOutQuad'
          });

          const textTitleNewPosition = this.isExpanded
            ? `${this.data.reductionBoxPos.x} ${this.data.reductionBoxPos.y} ${this.data.reductionBoxPos.z}`
            : `${this.originalPositions.textTitle.x} ${this.originalPositions.textTitle.y} ${this.originalPositions.textTitle.z}`;
          this.data.textTitle.setAttribute('animation__position', {
            property: 'position',
            to: textTitleNewPosition,
            dur: 500,
            easing: 'easeInOutQuad'
          });
        }

        // Animation d'échelle et de position pour le texte de la description (si spécifié)
        if (this.data.textDescription) {
          const newDescriptionScale = this.isExpanded ? this.data.reducedDescriptionScale : this.data.defaultDescriptionScale;
          this.data.textDescription.setAttribute('animation__scale', {
            property: 'scale',
            to: `${newDescriptionScale.x} ${newDescriptionScale.y} ${newDescriptionScale.z}`,
            dur: 500,
            easing: 'easeInOutQuad'
          });

          const textDescriptionNewPosition = this.isExpanded
            ? `${this.data.reductionBoxPos.x} ${this.data.reductionBoxPos.y} ${this.data.reductionBoxPos.z}`
            : `${this.originalPositions.textDescription.x} ${this.originalPositions.textDescription.y} ${this.originalPositions.textDescription.z}`;
          this.data.textDescription.setAttribute('animation__position', {
            property: 'position',
            to: textDescriptionNewPosition,
            dur: 500,
            easing: 'easeInOutQuad'
          });
        }

        // Inverser l'état
        this.isExpanded = !this.isExpanded;
      }
    });
  }
});
