import { closeAllMenus, syncRangeAndValue, updateSceneDropdown } from './domUtils.js';
import { scenes, createSceneElement, displayScene, displayDefaultScene } from './sceneManager.js';

document.addEventListener('DOMContentLoaded', function () {
  const sceneDropdown = document.getElementById('sceneDropdown');
  const fileInput = document.getElementById('fileInput');
  const createSceneBtn = document.getElementById('createSceneBtn');
  const editSceneForm = document.getElementById('editSceneForm');
  const sceneNameInput = document.getElementById('sceneNameInput');
  const editFileInput = document.getElementById('editFileInput');
  const saveSceneBtn = document.getElementById('saveSceneBtn');
  const deleteSceneBtn = document.getElementById('deleteSceneBtn');
  const deleteModal = document.getElementById('deleteModal');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const customFileInputBtn = document.getElementById('customFileInputBtn');
  const fileName = document.getElementById('fileName');
  const OpenTagMenuText = document.getElementById('OpenTagMenuText');
  const doorSceneSelect = document.getElementById('doorSceneSelect');
  const createDoorBtn = document.getElementById('createDoorTagBtn');
  const createInfoBtn = document.getElementById('createTagBtnText');
  let tagsByScene = [];
  let selectedImage = null;
  let selectedDoor = null;
  let associatedBox = null;

  ['doorTag', 'photoTag', 'videoTag', 'tag'].forEach(tag => {
    syncRangeAndValue(`${tag}Range`, `${tag}RangeValue`);
  });


  document.addEventListener('keydown', function (event) {
    if ((event.key === 'Delete' || event.key === 'Backspace') && selectedDoor && associatedBox) {
      const selectedSceneId = sceneDropdown.value;
      const scene = document.getElementById(selectedSceneId);
      
      scene.removeChild(selectedDoor);
      scene.removeChild(associatedBox);
      
      tagsByScene[selectedSceneId] = tagsByScene[selectedSceneId].filter(tag => tag.id !== selectedDoor.id);
      console.log("Tags restants dans la scène : ", tagsByScene[selectedSceneId]);
      
      updateTagSelector(selectedSceneId);
      selectedDoor = null;
      associatedBox = null;
    }
  
    if (event.key === "Delete" && selectedImage) {
      selectedImage.parentNode.removeChild(selectedImage);
      selectedImage = null;
    }
  });

  
  document.addEventListener('keydown', function (event) {
    if ((event.key === 'Delete' || event.key === 'Backspace') && selectedDoor && associatedBox) {
      const selectedSceneId = sceneDropdown.value;
      const scene = document.getElementById(selectedSceneId);
      
      scene.removeChild(selectedDoor);
      scene.removeChild(associatedBox);
      
      tagsByScene[selectedSceneId] = tagsByScene[selectedSceneId].filter(tag => tag.id !== selectedDoor.id);
      console.log("Tags restants dans la scène : ", tagsByScene[selectedSceneId]);
      
      updateTagSelector(selectedSceneId);
      selectedDoor = null;
      associatedBox = null;
    }
  
    if (event.key === "Delete" && selectedImage) {
      selectedImage.parentNode.removeChild(selectedImage);
      selectedImage = null;
    }
  });

  
  [
    { button: OpenTagMenuText, containerId: 'textTagFormContainer' },
    { button: OpenTagMenuDoor, containerId: 'doorTagFormContainer' },
    { button: OpenTagMenuPhoto, containerId: 'photoTagFormContainer' },
    { button: OpenTagMenuVideo, containerId: 'videoTagFormContainer' }
  ].forEach(menu => {
    menu.button.addEventListener('click', function () {
      closeAllMenus();
      const formContainer = document.getElementById(menu.containerId);
      formContainer.classList.toggle('hidden');
    });
  });
  
  createSceneBtn.addEventListener('click', function () {
    fileInput.click();
  });
  
  fileInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const sceneId = `scene-${scenes.length + 1}`;
        scenes.push({ id: sceneId, name: `Scène ${scenes.length + 1}`, src: e.target.result, fileName: file.name });
  
        const option = document.createElement('option');
        option.value = sceneId;
        option.textContent = `Scène ${scenes.length}`;
        sceneDropdown.appendChild(option);
  
        createSceneElement(sceneId, e.target.result);
        sceneDropdown.value = sceneId;
        displayScene(sceneId);
        editSceneForm.classList.remove('hidden');
        sceneNameInput.value = `Scène ${scenes.length}`;
        fileName.textContent = file.name;
      };
      reader.readAsDataURL(file);
    }
  });
  
  sceneDropdown.addEventListener('change', function () {
    const selectedSceneId = sceneDropdown.value;
    if (selectedSceneId) {
      displayScene(selectedSceneId);
      updateTagSelector(selectedSceneId);
      const selectedScene = scenes.find(scene => scene.id === selectedSceneId);
      if (selectedScene) {
        sceneNameInput.value = selectedScene.name;
        fileName.textContent = selectedScene.fileName || '';
        editSceneForm.classList.remove('hidden');
      }
    } else {
      editSceneForm.classList.add('hidden');
      fileName.textContent = '';
    }
  });
  
  saveSceneBtn.addEventListener('click', function () {
    const selectedSceneId = sceneDropdown.value;
    const selectedScene = scenes.find(scene => scene.id === selectedSceneId);
    if (selectedScene) {
      selectedScene.name = sceneNameInput.value;
      const option = sceneDropdown.querySelector(`option[value="${selectedSceneId}"]`);
      if (option) {
        option.textContent = selectedScene.name;
      }
  
      const file = editFileInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          selectedScene.src = e.target.result;
          selectedScene.fileName = file.name;
          const skyElement = document.querySelector(`#${selectedSceneId} a-sky`);
          if (skyElement) {
            skyElement.setAttribute('src', selectedScene.src);
          }
          fileName.textContent = file.name;
        };
        reader.readAsDataURL(file);
      }
    }
  });
  
  deleteSceneBtn.addEventListener('click', function () {
    deleteModal.classList.add('show');
  });
  
  cancelDeleteBtn.addEventListener('click', function () {
    deleteModal.classList.remove('show');
  });
  
  confirmDeleteBtn.addEventListener('click', function () {
    const selectedSceneId = sceneDropdown.value;
    const selectedSceneIndex = scenes.findIndex(scene => scene.id === selectedSceneId);
    if (selectedSceneIndex !== -1) {
      scenes.splice(selectedSceneIndex, 1);
      const option = sceneDropdown.querySelector(`option[value="${selectedSceneId}"]`);
      if (option) {
        option.remove();
      }
      const sceneElement = document.getElementById(selectedSceneId);
      if (sceneElement) {
        sceneElement.remove();
      }
      sceneDropdown.value = '';
      editSceneForm.classList.add('hidden');
      fileName.textContent = '';
      displayDefaultScene();
    }
    deleteModal.classList.remove('show');
  });
  
  customFileInputBtn.addEventListener('click', function () {
    editFileInput.click();
  });
  
  editFileInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
      fileName.textContent = file.name;
    } else {
      fileName.textContent = '';
    }
  });
  
  document.getElementById('ExportSceneBtn').addEventListener('click', function () {
    const scenes = document.querySelectorAll('a-scene:not(#defaultScene)');
  
    let exportContent = '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Exported Scenes</title>';
    exportContent += '<script src="https://aframe.io/releases/1.6.0/aframe.min.js"></script>';
    exportContent += '<style>a-scene { width: 100vw; height: 100vh; position: absolute; top: 0; left: 0; transform: scaleX(-1); }</style></head><body>';
  
    scenes.forEach(scene => {
      const cameraEntity = scene.querySelector('[camera]');
      if (cameraEntity) {
        cameraEntity.setAttribute('wasd-controls', 'enabled: false');
        cameraEntity.setAttribute('look-controls', 'enabled: false');
      }
      exportContent += scene.outerHTML;
    });
  
    exportContent += '</body></html>';
  
    const blob = new Blob([exportContent], { type: 'text/html' });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'exported_scenes.html';
    downloadLink.click();
  });

  function createTag(tagType) {
    const selectedSceneId = sceneDropdown.value;
    const scene = document.getElementById(selectedSceneId);
    const camera = scene.querySelector('a-camera');
    const cameraPos = camera.getAttribute('position');
    const cameraRotation = camera.getAttribute('rotation');
  
    let tag;
    if (tagType === 'door') {
      const tagPosition = calculateTagPosition(cameraPos, cameraRotation, 5);
      tag = createDoorTag(tagPosition, doorSceneSelect.value);
    } else {
      const tagPosition = calculateTagPosition(cameraPos, cameraRotation, 2);
      tag = createInfoTag(tagPosition, tagType);
    }
  
    tag.id = generateTagId(tagType);
  
    scene.appendChild(tag);
  
    tagsByScene[selectedSceneId] = tagsByScene[selectedSceneId] || [];
    tagsByScene[selectedSceneId].push(tag);
  
    updateTagSelector(selectedSceneId);
  }
  
  function calculateTagPosition(cameraPos, cameraRotation, distance) {
    const rotationRad = (cameraRotation.y * Math.PI) / 180;
    const offsetX = distance * Math.sin(rotationRad);
    const offsetZ = -distance * Math.cos(rotationRad);
    return {
      x: cameraPos.x + offsetX,
      y: cameraPos.y,
      z: cameraPos.z + offsetZ,
    };
  }
  
  createDoorBtn.addEventListener('click', function () {
    createTag('door');
  });
  
  createInfoBtn.addEventListener('click', function () {
    createTag('info');
  });
  
  function updateTagSelector(sceneId) {
    const tagSelector = document.getElementById('tagSelector');
    tagSelector.innerHTML = '';
  
    const tags = tagsByScene[sceneId] || [];
    tags.forEach(tag => {
      const option = document.createElement('option');
      option.value = tag.id;
      option.textContent = tag.id;
      tagSelector.appendChild(option);
    });
  }

  document.addEventListener('click', function (event) {
    if (event.target.tagName === 'A-SPHERE' && event.target.classList.contains('door-tag')) {
      const targetSceneId = event.target.getAttribute('data-target-scene');
      displayScene(targetSceneId);
      updateTagSelector(targetSceneId);
    }
  });

});
  