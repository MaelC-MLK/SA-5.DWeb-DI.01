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
  const tagSelector = document.getElementById('tagSelector');
  const tagsByScene = {}; 


  // TAGS

  // Gestionnaire d'événements pour le bouton de création de Porte
  document.getElementById('addTagBtn').addEventListener('click', addTag);


  

  // Function création de Porte
  function addTag() {
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

    messageError.innerText = "";

    const cameraDirection = new THREE.Vector3();
    camera.object3D.getWorldDirection(cameraDirection);
    
    const distance = -10; // Distance (peut être réglée)

    // Récupere la position de la camera
    const tagPosition = new THREE.Vector3();
    tagPosition.copy(camera.object3D.position).addScaledVector(cameraDirection, distance);
    

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
    newBox.setAttribute('id', tagId);


    newBox.addEventListener('dblclick', function() {
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

// ajoute un tag au selecteur
function addTagToSelector(tagId, sceneId) {
  const selectedSceneId = sceneDropdown.value; // Récupérer l'ID de la scène sélectionnée

  // Vérifie si le tag appartient à la scène sélectionnée
  if (sceneId === selectedSceneId) {
    const option = document.createElement('option');
    option.value = tagId;
    option.textContent = `Tag ${tagId}`;
    tagSelector.appendChild(option);
  }
}


function changeScene(sceneId) {
  const scene = document.getElementById(sceneId); // Sélectionner la nouvelle scène

  if (!scene) {
      console.error("Scène non trouvée.");
      return;
  }

  // Cacher toutes les scènes existantes
  const allScenes = document.querySelectorAll('a-scene');
  allScenes.forEach(s => s.style.display = 'none');

  // Afficher la nouvelle scène
  scene.style.display = 'block';;
  sceneDropdown.value = sceneId; // Mettre à jour le sélecteur de scène

  // maj du selecteur de tag
  updateTagSelector(sceneId);
}

function updateTagSelector(sceneId) {
  // Vider le sélecteur de tags
  tagSelector.innerHTML = '';

  // Récupérer tous les tags de la scène sélectionnée
  const scene = document.getElementById(sceneId);
  const tags = scene.querySelectorAll('a-box'); // Supposant que les tags sont des `a-box`

  // Ajouter les tags au sélecteur
  tags.forEach(tag => {
    const option = document.createElement('option');
    option.value = tag.getAttribute('id');
    option.textContent = `Tag ${tag.getAttribute('id')}`;
    tagSelector.appendChild(option);
  });
}


function displayTagCount() {
  const selectedSceneId = sceneDropdown.value;
  const sceneTags = tagsByScene[selectedSceneId];

  if (sceneTags) {
    console.log(`Nombre de tags pour la scène ${selectedSceneId}: ${sceneTags.tags.length}`);
  } else {
    console.log(`Aucun tag pour la scène ${selectedSceneId}`);
  }
}
  // Gestionnaire d'événements pour le bouton de création de Porte
  document.getElementById('addInfoBtn').addEventListener('click', addInfo);


  function addInfo() {
    const selectedSceneId = sceneDropdown.value; // Récupérer l'ID de la scène sélectionnée
    const scene = document.getElementById(selectedSceneId); // Sélectionner la scène
    let camera = document.getElementById('camera');
    var cameraDirection = new THREE.Vector3();
    camera.object3D.getWorldDirection(cameraDirection);

    var distance = -10; // distance réglée
    
    // Calcul la position où le tag doit être créé
    var tagPosition = new THREE.Vector3();
    tagPosition.copy(camera.object3D.position).addScaledVector(cameraDirection, distance);

   //récupere le input
    var infoText = document.getElementById('infoInput').value;

    // Créer la bulle
    var newSphere = document.createElement('a-sphere');
    newSphere.setAttribute('position', tagPosition);
    newSphere.setAttribute('radius', '1.25'); 
    newSphere.setAttribute('color', '#FFC65D'); 
    newSphere.setAttribute('dragndrop', ''); 

    // Créer un texte lié à la sphère
    var newText = document.createElement('a-text');
    newText.setAttribute('value', infoText);
    newText.setAttribute('position', { x: tagPosition.x, y: tagPosition.y + 1.5, z: tagPosition.z }); // Position légèrement au-dessus de la sphère
    newText.setAttribute('align', 'center');
    newText.setAttribute('color', '#FFFFFF'); // Couleur du texte
    newText.setAttribute('follow-sphere', { target: newSphere });

    // Ajouter la sphère et le texte à la scène
    scene.appendChild(newSphere);
    scene.appendChild(newText);

    console.log("Sphère et texte créés :", newSphere, newText);
}


  // SCENE

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
        updateSceneMenu(selectedSceneId);
        fileName.textContent = selectedScene.fileName || '';
        editSceneForm.classList.remove('hidden');
      }
    } else {
      editSceneForm.classList.add('hidden');
      fileName.textContent = ''; 
    }
  });

  // maj du compteur, changement de scene
  sceneDropdown.addEventListener('change', displayTagCount);


  function updateSceneMenu(sceneId) {
    const selectedScene = scenes.find(scene => scene.id === sceneId);
    if (selectedScene) {
        sceneNameInput.value = selectedScene.name;
        fileName.textContent = selectedScene.fileName || '';
        editSceneForm.classList.remove('hidden');
    }
}

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
  sceneElement.setAttribute('cursor', 'rayOrigin: mouse');
  sceneElement.style.display = 'none';

  const cameraEntity = document.createElement('a-entity');
  cameraEntity.setAttribute('camera', '');
  cameraEntity.setAttribute('wasd-controls', 'enabled: false');
  cameraEntity.setAttribute('look-controls', 'enabled: true; reverseMouseDrag: true; reverseTouchDrag: true; reverseY: true;');
  cameraEntity.setAttribute('id', 'camera');
  sceneElement.appendChild(cameraEntity);

  const skyElement = document.createElement('a-sky');
  skyElement.setAttribute('src', src);
  skyElement.style.transform = 'scaleX(-1)';
  sceneElement.appendChild(skyElement);

  const pointer = document.createElement('a-sphere');
  pointer.setAttribute('position', '0 1.5 -3');
  pointer.setAttribute('radius', '0.02');
  pointer.setAttribute('color', '#FFFFFF');
  pointer.setAttribute('id', 'point-central');
  pointer.setAttribute('follow-camera', '');  
  sceneElement.appendChild(pointer);


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



