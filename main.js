import { closeAllMenus } from './domUtils.js';
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
  const tagsByScene = {};

  // syncRangeAndValue('photoTagRange', 'photoTagRangeValue');

  // ['doorTag', 'photoTag', 'videoTag', 'tag'].forEach(tag => {
  //   syncRangeAndValue(`${tag}Range`, `${tag}RangeValue`);
  // });

  let selectedImage = null;

  // Gestionnaire d'événements pour sélectionner une image
  document.addEventListener('click', function (event) {
      if (event.target.tagName === 'A-IMAGE') {
          if (selectedImage) {
              selectedImage.classList.remove('selected'); 
          }
          selectedImage = event.target;

      }
  });
  
  // Gestionnaire d'événements pour supprimer l'image sélectionnée
  document.addEventListener('keydown', function (event) {
      if (event.key === 'Delete' && selectedImage) {
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

    // Créer un nouveau document HTML
    let exportContent = '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Exported Scenes</title>';
    exportContent += '<script src="https://aframe.io/releases/1.6.0/aframe.min.js"></script>';
    exportContent += '<style>a-scene { width: 100vw; height: 100vh; position: absolute; top: 0; left: 0;  }</style></head><body>';

    scenes.forEach(scene => {
      // Ajouter les contrôles de caméra
      const cameraEntity = scene.querySelector('[camera]');
      if (cameraEntity) {
        cameraEntity.setAttribute('wasd-controls', 'enabled: false');
        cameraEntity.setAttribute('look-controls', 'enabled: true');
      }
      exportContent += scene.outerHTML;
    });

    exportContent += '</body></html>';

    // Créer un blob et ouvrir l'URL dans une nouvelle fenêtre
    const blob = new Blob([exportContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    URL.revokeObjectURL(url);
  });


  function updateSceneName(sceneId, newName) {
    const sceneElement = document.getElementById(sceneId);
    if (sceneElement) {
      sceneElement.setAttribute('data-name', newName);
      const option = doorSceneSelect.querySelector(`option[value="${sceneId}"]`);
      if (option) {
        option.textContent = newName;
        option.setAttribute('data-name', newName);
      }
    }
  }

  document.getElementById('sceneNameInput').addEventListener('input', function (event) {
    const sceneId = document.getElementById('sceneDropdown').value;
    const newName = event.target.value;
    if (sceneId) {
      updateSceneName(sceneId, newName);
    }
  });

  document.getElementById('createPhotoTagBtn').addEventListener('click', function () {
    createPhotoTag();
  });

  function resetPhotoTagForm() {
    document.getElementById('photoTagTitle').value = '';
    document.getElementById('photoTagRange').value = 5;
    document.getElementById('photoTagRangeValue').value = 5;
    document.getElementById('photoFileInput').value = '';
  }

  function createPhotoTag() {
    const selectedSceneId = document.getElementById('sceneDropdown').value;
    const scene = document.getElementById(selectedSceneId);
    if (!scene) {
        console.error('Scene not found.');
        return;
    }

    const title = document.getElementById('photoTagTitle').value;
    if (!title) {
        alert('Le titre est obligatoire.');
        return;
    }

    const fileInput = document.getElementById('photoFileInput');
    const file = fileInput.files[0];

    if (!file) {
        console.error('No file selected.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const imageUrl = e.target.result;

        // Créer l'image 2D
        const image = document.createElement('a-image');
        const imageId = `image-${Date.now()}`; 
        image.setAttribute('id', imageId);
        image.setAttribute('src', imageUrl);
        image.setAttribute('position', '0 1.6 -2'); 
        image.setAttribute('width', '2');
        image.setAttribute('height', '2');
        image.setAttribute('dragndrop', '');
        image.setAttribute('look-at-camera', ''); 
        scene.appendChild(image);
        resetPhotoTagForm();
    };
    reader.readAsDataURL(file);
}
  

  function resetPhotoTagForm() {
    document.getElementById('photoTagTitle').value = '';
    document.getElementById('photoFileInput').value = '';
  }
  // TAGS 

  createDoorBtn.addEventListener('click', function () {
    const selectedSceneId = sceneDropdown.value; // Récupérer l'ID de la scène sélectionnée
    const scene = document.getElementById(selectedSceneId); // Sélectionner la scène
    let messageError = document.getElementById('error');

    if (!scene) {
      messageError.innerText = "Erreur : Scène non trouvée.";
      console.error("Scène non trouvée.");
      return;
    }

    const camera = scene.querySelector('#camera');
    if (!camera) {
      console.error("Caméra non trouvée dans la scène.");
      return;
    }

    // messageError.innerText = "";
    const cameraDirection = new THREE.Vector3();
    camera.object3D.getWorldDirection(cameraDirection);

    const distance = -10; // Distance (peut être réglée)

    // Récupere la position de la camera
    const tagPosition = new THREE.Vector3();
    tagPosition.copy(camera.object3D.position).addScaledVector(cameraDirection, distance);


    // sinon ajouter un au compteur de tag
    // ajouter un au compteur de tag
    if (!tagsByScene[selectedSceneId]) {
      tagsByScene[selectedSceneId] = [];
    }


    // Récupérer le compteur de tags pour cette scène
    const tagCounter = tagsByScene[selectedSceneId].length + 1;  // Le compteur est la taille actuelle + 1
    const tagId = `${tagCounter}`;


    // Création de l'objet
    const newBox = document.createElement('a-box');
    newBox.setAttribute('position', tagPosition);
    newBox.setAttribute('rotation', '0 45 0');
    newBox.setAttribute('color', '#4CC3D9');
    newBox.setAttribute('dragndrop', '');
    newBox.setAttribute('color', '#4CC3D9');
    newBox.setAttribute('dragndrop', '');
    newBox.setAttribute('id', tagId);



    newBox.addEventListener('dblclick', function () {
      // Appeler la fonction de changement de scène
      console.log("doubleclik okj")
      changeScene('scene-2'); // Exemple : vers la scène 2
      updateSceneMenu('scene-2');
    });

    // Ajout de l'objet a la scene
    scene.appendChild(newBox);

    tagsByScene[selectedSceneId].push(tagId);
    console.log(tagsByScene[selectedSceneId]);

    // ajoute le tag au selecteur 
    addTagToSelector(tagId, selectedSceneId);

  }


    );


displayDefaultScene();
});