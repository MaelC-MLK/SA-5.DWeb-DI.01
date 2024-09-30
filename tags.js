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
        radius: "0.5",
        color: "#EF2D5E",
        dragndrop: ""
      });
  
      const newText = this.createElement("a-text", {
        value: this.description,
        position: { x: this.position.x, y: this.position.y + 1.5, z: this.position.z },
        align: "center",
        scale: "3 3 3",
        color: "#FFFFFF",
        "follow-mover": { target: newSphere },
        "look-at-camera": ""
      });
  
      this.appendToScene(scene, [newSphere, newText]);
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
  