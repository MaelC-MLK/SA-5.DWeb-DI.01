import { changeScene } from "./main.js";

export let tagsByScene = {};

class Tag {
    constructor(sceneId, title, position) {
      this.sceneId = sceneId;
      this.title = title;
      this.position = position;
      this.id = `${Date.now()}`;
    }
  
    createElement(type, attributes) {
      const element = document.createElement(type);
      for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
      }
      return element;
    }
  
    appendToScene(scene, elements) {
      elements.forEach(element => scene.appendChild(element));
    }
  }
  
  class DoorTag extends Tag {
    constructor(sceneId, title, position, targetSceneId) {
      super(sceneId, title, position);
      this.targetSceneId = targetSceneId;
    }
  
    create() {
      const scene = document.getElementById(this.sceneId);
      const newSphere = this.createElement("a-sphere", {
        position: this.position,
        id: this.id,
        radius: "0.3",
        color: "#EF2D5E",
        dragndrop: "",
        "look-at-camera": ""
      });

      const newSphereIcon = this.createElement("a-plane");
      newSphereIcon.setAttribute("position", { x: 0, y: 0, z: 0.35 });
      newSphereIcon.setAttribute("width", "0.3");
      newSphereIcon.setAttribute("height", "0.3");
      newSphereIcon.setAttribute("src", "#icon-grab");
      newSphereIcon.setAttribute("look-at-camera", ""); 
      newSphereIcon.setAttribute("material", "shader: flat; transparent: true;");


      newSphere.appendChild(newSphereIcon);

      const infoBox = document.createElement("a-entity");
      
 
      const infoBoxOffset = { x: -2, y: 4, z: 0 }; // Décalage basé sur la taille du `backgroundPlane`
      infoBox.setAttribute("position", {
          x: this.position.x + infoBoxOffset.x,
          y: this.position.y + infoBoxOffset.y,
          z: this.position.z + infoBoxOffset.z,
      });

      // Ajouter les composants de suivi
      infoBox.setAttribute("follow-mover", { target: newSphere });
      infoBox.setAttribute("look-at-camera", "");

    
    const newBox = this.createElement("a-box", {
      position: "1 -2 0",
      color: "#4CC3D9",
      id: this.id,
      width: "2",
      height: "4",
      depth: "0.5",
      "look-at-camera": "",
      class: "door",
      "data-target-scene": this.targetSceneId
    });
    infoBox.appendChild(newBox);

    // Ajout d'un écouteur d'événements pour la boîte
    newBox.addEventListener("click", () => {
      if (this.targetSceneId) {
        changeScene(this.targetSceneId);
      } else {
        console.warn("Aucune scène sélectionnée pour la navigation.");
      }
    });

    // Ajouter la sphère et la boîte à la scène
    this.appendToScene(scene, [newSphere, infoBox ]);
  }
}
class InfoTag extends Tag {
  constructor(sceneId, title, position, description) {
    super(sceneId, title, position);
    this.description = description;
  }

  create() {
    const scene = document.getElementById(this.sceneId);
    
    // Créer la sphère
    const newSphere = this.createElement("a-sphere", {
      position: this.position,
      radius: "0.3",
      color: "#EF2D5E",
      dragndrop: "",
      "look-at-camera": ""
    });

    const newSphereIcon = this.createElement("a-plane");
    newSphereIcon.setAttribute("position", { x: 0, y: 0, z: 0.35 });
    newSphereIcon.setAttribute("width", "0.3");
    newSphereIcon.setAttribute("height", "0.3");
    newSphereIcon.setAttribute("src", "#icon-grab");
    newSphereIcon.setAttribute("look-at-camera", "");
    newSphereIcon.setAttribute("material", "shader: flat; transparent: true;");
    
    // Créer la boîte de réduction
    const reductionBox = this.createElement("a-box", {
      position: { x: 0.4, y: 0.4, z: 0},
      depth: "0.5",
      height: "0.5",
      width: "0.5",
      color: "#EF2D5E"
    });

    // Créer l'infoBox avec un décalage par rapport à la sphère
    const infoBox = document.createElement("a-entity");
    const infoBoxOffset = { x: -2, y: 0.7, z: 0 }; // Décalage basé sur la taille du `backgroundPlane`
    infoBox.setAttribute("position", {
      x: this.position.x + infoBoxOffset.x,
      y: this.position.y + infoBoxOffset.y,
      z: this.position.z + infoBoxOffset.z,
    });
    
    // Ajouter les composants de suivi
    infoBox.setAttribute("follow-mover", { target: newSphere });
    infoBox.setAttribute("look-at-camera", "");

    // Créer le fond noir de la boîte
    const backgroundPlane = document.createElement("a-plane");
    backgroundPlane.setAttribute("width", "5"); // Largeur agrandie
    backgroundPlane.setAttribute("height", "3"); // Hauteur agrandie
    backgroundPlane.setAttribute("color", "#000000");
    backgroundPlane.setAttribute("material", "opacity: 0.8; transparent: true");
    backgroundPlane.setAttribute("position", "2.5 -1.5 0.05"); // Alignement ajusté avec la sphère
    infoBox.appendChild(backgroundPlane);

    // Ajouter le titre avec une position ajustée et un texte plus grand
    const titleText = document.createElement("a-text");
    titleText.setAttribute("value", this.title);
    titleText.setAttribute("position", "2.5 -0.5 0.1"); // Position ajustée pour le titre
    titleText.setAttribute("width", "4.5"); // Largeur augmentée
    titleText.setAttribute("scale", "2.4 2.4 2.4"); // Taille du texte augmentée
    titleText.setAttribute("align", "center");
    titleText.setAttribute("color", "#EF2D5E");
    titleText.setAttribute("font", "https://cdn.aframe.io/fonts/mozillavr.fnt");
    infoBox.appendChild(titleText);

    // Ajouter la description stylisée avec une position ajustée et un texte plus grand
    const descriptionText = document.createElement("a-text");
    descriptionText.setAttribute("value", this.description);
    descriptionText.setAttribute("position", "2.5 -1.8 0.1"); // Position ajustée pour être en dessous du titre
    descriptionText.setAttribute("scale", "2.0 2.0 2.0"); // Taille du texte augmentée
    descriptionText.setAttribute("width", "2.4"); // Largeur augmentée pour le texte
    descriptionText.setAttribute("align", "center");
    descriptionText.setAttribute("color", "#FFFFFF");
    infoBox.appendChild(descriptionText);

    reductionBox.setAttribute("resize-on-click", {
      target: backgroundPlane,
      textTitle: titleText,
      textDescription: descriptionText,
      defaultWidth: 5, // Largeur d'origine du `backgroundPlane`
      defaultHeight: 3, // Hauteur d'origine du `backgroundPlane`
      reducedWidth: 0,  // Largeur réduite
      reducedHeight: 0, // Hauteur réduite
      defaultTitleScale: { x: 2.4, y: 2.4, z: 2.4 }, // Échelle d'origine du titre
      reducedTitleScale: { x: 0, y: 0, z: 0 }, // Échelle réduite du titre
      defaultDescriptionScale: { x: 2.0, y: 2.0, z: 2.0 }, // Échelle d'origine de la description
      reducedDescriptionScale: { x: 0, y: 0, z:0 } // Échelle réduite de la description
    });


    // Ajouter la sphère et l'infoBox dans la scène
    this.appendToScene(scene, [newSphere, infoBox]);
    newSphere.appendChild(reductionBox); // Ajouter `reductionBox` à la sphère
    newSphere.appendChild(newSphereIcon); // Ajouter l'icône de la sphère
  }
}

  
  class PhotoTag extends Tag {
    constructor(sceneId, title, position, imageUrl) {
      super(sceneId, title, position);
      this.imageUrl = imageUrl;
    }
  
    create() {
      const scene = document.getElementById(this.sceneId);
      const image = this.createElement("a-image", {
        id: this.id,
        src: this.imageUrl,
        position: "0 1.6 -2",
        width: "2",
        height: "2",
        dragndrop: "",
        "look-at-camera": ""
      });
  
      this.appendToScene(scene, [image]);
    }
  }
  // Classe pour les tags de type vidéo
  class VideoTag extends Tag {
    constructor(sceneId, title, position, videoUrl) {
      super(sceneId, title, position);
      this.videoUrl = videoUrl; // URL de la vidéo pour le tag vidéo
    }
  
    // Méthode pour créer un tag de type vidéo
    create() {
      const scene = document.getElementById(this.sceneId);
  
      
      const camera = scene.camera;
      const cameraDirection = new THREE.Vector3();
      camera.getWorldDirection(cameraDirection);
      const cameraPosition = camera.position.clone();
      const distance = 2; 
      const targetPosition = cameraPosition.add(cameraDirection.multiplyScalar(distance));
  
  
      const video = this.createElement("a-video", {
        id: this.id,
        src: this.videoUrl,
        position: `${targetPosition.x} ${targetPosition.y} ${targetPosition.z}`,
        width: "4",
        height: "2.25",
        autoplay: "true", // Ajoutez cet attribut pour lancer automatiquement la vidéo
        loop: "true", // Ajoutez cet attribut pour boucler la vidéo
        dragndrop: "", 
        "look-at-camera": "" 
      });
  
      this.appendToScene(scene, [video]);
    }
  }

export { Tag, DoorTag, InfoTag, PhotoTag, VideoTag };
  