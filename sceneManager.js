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

  document.getElementById('sceneContainer').appendChild(sceneElement);

  document.getElementById('ExportSceneBtn').disabled = false;

  updateSceneDropdown();

  // Forcer une mise à jour de l'affichage
  requestAnimationFrame(() => {
    sceneElement.style.display = 'block';
    window.dispatchEvent(new Event('resize'));
  });
}

export function displayScene(sceneId) {
  const scene = document.getElementById(sceneId); // Sélectionner la nouvelle scène

  if (!scene) {
    console.error("Scène non trouvée.");
    return;
  }

  // Cacher toutes les scènes existantes
  const allScenes = document.querySelectorAll('a-scene');
  allScenes.forEach(s => s.style.display = 'none');

  // Afficher la nouvelle scène
  scene.style.display = 'block';
  document.getElementById('sceneDropdown').value = sceneId; // Mettre à jour le sélecteur de scène

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