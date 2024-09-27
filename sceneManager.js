import { updateSceneDropdown } from './domUtils.js';


export const scenes = [];

export function createSceneElement(sceneId, src) {
  const sceneElement = document.createElement('a-scene');
  sceneElement.setAttribute('id', sceneId);
  sceneElement.setAttribute('embedded', '');
  sceneElement.setAttribute('cursor', 'rayOrigin: mouse');
  sceneElement.style.display = 'none';

  const cameraEntity = document.createElement('a-entity');
  cameraEntity.setAttribute('camera', '');
  cameraEntity.setAttribute('wasd-controls', 'enabled: false');
  cameraEntity.setAttribute('look-controls', 'enabled: true; reverseMouseDrag: true; reverseTouchDrag: true; reverseY: true;');
  cameraEntity.setAttribute('id', 'camera-' + sceneId);
  sceneElement.appendChild(cameraEntity);

  const skyElement = document.createElement('a-sky');
  skyElement.setAttribute('src', src);
  skyElement.style.transform = 'scaleX(-1)';
  sceneElement.appendChild(skyElement);

  const pointer = document.createElement('a-sphere');
  pointer.setAttribute('position', '0 1.5 -3');
  pointer.setAttribute('radius', '0.02');
  pointer.setAttribute('color', '#FFFFFF');
  pointer.setAttribute('follow-camera', '');  
  sceneElement.appendChild(pointer);

  // Ajouter les entités de contrôleur VR
  const leftHand = document.createElement('a-entity');
  leftHand.setAttribute('id', 'leftHand');
  leftHand.setAttribute('laser-controls', 'hand: left');
  leftHand.setAttribute('super-hands', '');
  leftHand.setAttribute('raycaster', 'objects: .door');
  sceneElement.appendChild(leftHand);

  const rightHand = document.createElement('a-entity');
  rightHand.setAttribute('id', 'rightHand');
  rightHand.setAttribute('laser-controls', 'hand: right');
  rightHand.setAttribute('super-hands', '');
  rightHand.setAttribute('raycaster', 'objects: .door');
  sceneElement.appendChild(rightHand);

  document.getElementById('sceneContainer').appendChild(sceneElement);

  document.getElementById('ExportSceneBtn').disabled = false;

  updateSceneDropdown();
}

export function displayScene(sceneId) {
  const scene = document.getElementById(sceneId); 

  if (!scene) {
    console.error("Scène non trouvée.");
    return;
  }
  const allScenes = document.querySelectorAll('a-scene');
  allScenes.forEach(s => s.style.display = 'none');
  scene.style.display = 'block';
  document.getElementById('sceneDropdown').value = sceneId; 
  requestAnimationFrame(() => {
    window.dispatchEvent(new Event('resize'));
  });
}

export function displayDefaultScene() {
  const allScenes = document.querySelectorAll('a-scene');
  allScenes.forEach(scene => {
    scene.style.display = 'none';
  });

  const defaultScene = document.getElementById('defaultScene');
  if (defaultScene) {
    defaultScene.style.display = 'block';
  }
}