// Permet de s'asurer que tout le DOM est chargé avant d'exécuter le script
document.addEventListener('DOMContentLoaded', function() {
  const scenes = [];
  const sceneDropdown = document.getElementById('sceneDropdown');
  const fileInput = document.getElementById('fileInput');
  const createSceneBtn = document.getElementById('createSceneBtn');
  const sceneContainer = document.getElementById('sceneContainer');
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

  // Gestionnaire d'événements pour le bouton de création de scène
  createSceneBtn.addEventListener('click', function() {
    fileInput.click();
  });

  // Gestionnaire d'événements pour le changement de fichier
  fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
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

  // Gestionnaire d'événements pour le changement de scène dans le dropdown (liste déroulante)
  sceneDropdown.addEventListener('change', function() {
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

  // Gestionnaire d'événements pour le bouton de sauvegarde de la scène
  saveSceneBtn.addEventListener('click', function() {
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
        reader.onload = function(e) {
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

  // Gestionnaire d'événements pour le bouton de suppression de la scène
  deleteSceneBtn.addEventListener('click', function() {
    deleteModal.classList.add('show');
  });

  // Gestionnaire d'événements pour le bouton d'annulation de la suppression
  cancelDeleteBtn.addEventListener('click', function() {
    deleteModal.classList.remove('show');
  });

  // Gestionnaire d'événements pour le bouton de confirmation de la suppression
  confirmDeleteBtn.addEventListener('click', function() {
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
  // Gestionnaire d'événements pour le bouton personnalisé de sélection de fichier
  customFileInputBtn.addEventListener('click', function() {
    editFileInput.click();
  });

  // Gestionnaire d'événements pour le changement de fichier dans le formulaire d'édition
  editFileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
      fileName.textContent = file.name;
    } else {
      fileName.textContent = '';
    }
  });

// Gestionnaire d'événements pour le bouton d'exportation de la scène
document.getElementById('ExportSceneBtn').addEventListener('click', function() {
  const scenes = document.querySelectorAll('a-scene:not(#defaultScene)');

  // Créer un nouveau document HTML
  let exportContent = '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Exported Scenes</title>';
  exportContent += '<script src="https://aframe.io/releases/1.6.0/aframe.min.js"></script>';
  exportContent += '<style>a-scene { width: 100vw; height: 100vh; position: absolute; top: 0; left: 0;     transform: scaleX(-1); }</style></head><body>';
  
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

function createSceneElement(sceneId, src) {
  const sceneElement = document.createElement('a-scene');
  sceneElement.setAttribute('id', sceneId);
  sceneElement.setAttribute('embedded', '');
  sceneElement.style.display = 'none';

  const cameraEntity = document.createElement('a-entity');
  cameraEntity.setAttribute('camera', '');
  cameraEntity.setAttribute('wasd-controls', 'enabled: false');
  cameraEntity.setAttribute('look-controls', 'enabled: true; reverseMouseDrag: true; reverseTouchDrag: true; reverseY: true;');
  sceneElement.appendChild(cameraEntity);

  const skyElement = document.createElement('a-sky');
  skyElement.setAttribute('src', src);
  skyElement.style.transform = 'scaleX(-1)';
  sceneElement.appendChild(skyElement);

  sceneContainer.appendChild(sceneElement);

  document.getElementById('ExportSceneBtn').disabled = false;
}


  function displayScene(sceneId) {
    const allScenes = document.querySelectorAll('a-scene');
    allScenes.forEach(scene => {
      scene.style.display = 'none';
    });

    const selectedScene = document.getElementById(sceneId);
    if (selectedScene) {
      selectedScene.style.display = 'block';
    }
  }


  function displayDefaultScene() {
    const allScenes = document.querySelectorAll('a-scene');
    allScenes.forEach(scene => {
      scene.style.display = 'none';
    });

    const defaultScene = document.getElementById('defaultScene');
    if (defaultScene) {
      defaultScene.style.display = 'block';
    }
  }


  displayDefaultScene();
});