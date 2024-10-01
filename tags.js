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
        radius: "0.5",
        color: "#EF2D5E",
        dragndrop: "",
        "look-at-camera": ""
      });
  
      const newBox = this.createElement("a-box", {
        position: this.position,
        color: "#4CC3D9",
        id: this.id,
        "follow-mover": { target: newSphere },
        width: "2",
        height: "4",
        depth: "0.5",
        "look-at-camera": "",
        class: "door",
        "data-target-scene": this.targetSceneId
      });
  
      newBox.addEventListener("click", () => {
        if (this.targetSceneId) {
          changeScene(this.targetSceneId);
        } else {
          console.warn("Aucune scène sélectionnée pour la navigation.");
        }
      });
  
      this.appendToScene(scene, [newBox, newSphere]);
    }
  }
  
  class InfoTag extends Tag {
    constructor(sceneId, title, position, description) {
      super(sceneId, title, position);
      this.description = description;
    }
  
    create() {
      const scene = document.getElementById(this.sceneId);
      const newSphere = this.createElement("a-sphere", {
        position: this.position,
        radius: "0.2",
        color: "#EF2D5E",
        dragndrop: "",
        "look-at-camera": ""
      });
  
      const infoBox = document.createElement("a-entity");
        infoBox.setAttribute("position", {
            x: this.position.x - 1,
            y: this.position.y,
            z: this.position.z,
        });
        infoBox.setAttribute("follow-mover", { target: newSphere });
        infoBox.setAttribute("look-at-camera", "");

        // créer le bg noir
        const backgroundPlane = document.createElement("a-plane");
        backgroundPlane.setAttribute("width", "2");
        backgroundPlane.setAttribute("height", "1.4");
        backgroundPlane.setAttribute("color", "#000000");
        backgroundPlane.setAttribute("material", "opacity: 0.8; transparent: true");
        backgroundPlane.setAttribute("position", "0 0 0.05");
        infoBox.appendChild(backgroundPlane);

        // titre 
        const titleText = document.createElement("a-text");
        titleText.setAttribute("value", this.title); // Utilise le titre de l'objet
        titleText.setAttribute("position", "0 0.4 0.1"); // Position du titre dans le conteneur
        titleText.setAttribute("width", "1.8");
        titleText.setAttribute("scale", "1.8 1.8 1.8");
        titleText.setAttribute("align", "center");
        titleText.setAttribute("color", "#EF2D5E");
        titleText.setAttribute("font", "https://cdn.aframe.io/fonts/mozillavr.fnt");
        infoBox.appendChild(titleText);

        // Création de la description stylisée
        const descriptionText = document.createElement("a-text");
        descriptionText.setAttribute("value", this.description); // Utilise la description de l'objet
        descriptionText.setAttribute("position", "0 0.1 0.1"); // Position de la description
        descriptionText.setAttribute("scale", "1.4 1.4 1.4");
        descriptionText.setAttribute("width", "1.6");
        descriptionText.setAttribute("align", "center");
        descriptionText.setAttribute("color", "#FFFFFF");
        descriptionText.setAttribute("font", "https://cdn.aframe.io/fonts/mozillavr.fnt");
        infoBox.appendChild(descriptionText);

        // Ajouter la sphère et l'infoBox dans la scène
        this.appendToScene(scene, [newSphere, infoBox]);
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
  
  export { Tag, DoorTag, InfoTag, PhotoTag };
  