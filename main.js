import { closeAllMenus, syncRangeAndValue } from './domUtils.js';
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

  

  ['doorTag', 'photoTag', 'videoTag', 'tag'].forEach(tag => {
    syncRangeAndValue(`${tag}Range`, `${tag}RangeValue`);
  });


  let selectedDoor = null;
  let associatedBox = null;

  // ecouteur selection door
  document.addEventListener('click', function (event) {
    if (event.target.tagName === "A-IMAGE") {
      if (selectedImage) {
        selectedImage.classList.remove("selected");
      }
      selectedImage = event.target;
    }
    if (event.target.tagName === 'A-SPHERE') {
      if (selectedDoor) {
        selectedDoor.classList.remove('selected'); // retire selected si il y en a 
        if (associatedBox) {
          associatedBox.classList.remove('selected'); // retire selected si il y en a de la box
        }
      }
      
      selectedDoor = event.target; // shere est selected door
      selectedDoor.classList.add('selected');
  
      const boxId = selectedDoor.getAttribute('id'); // id  de la sphère
      associatedBox = document.querySelector(`a-box[id="${boxId}"]`);

      if (associatedBox) {
        associatedBox.classList.add('selected');
      }
    }
  });
  
  // Gestionnaire d'événements pour supprimer l'image sélectionnée
  document.addEventListener('keydown', function (event) {
    if ((event.key === 'Delete' || event.key === 'Backspace') && selectedDoor && associatedBox) {
  
      const selectedSceneId = sceneDropdown.value; // ID de la scène actuelle
      const scene = document.getElementById(selectedSceneId); // Élément de la scène
      
      // supprime la door spher et box
      scene.removeChild(selectedDoor);
      scene.removeChild(associatedBox);
  
      // supprime le tag de tagsByScene
      tagsByScene[selectedSceneId] = tagsByScene[selectedSceneId].filter(tag => tag.id !== selectedDoor.id);
      console.log("Tags restants dans la scène : ", tagsByScene[selectedSceneId]);
  
      // maj du seletc
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

    // Créer un nouveau document HTML
    let exportContent = '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Exported Scenes</title>';
    exportContent += '<script src="https://aframe.io/releases/1.6.0/aframe.min.js"></script>';
    exportContent += '<style>a-scene { width: 100vw; height: 100vh; position: absolute; top: 0; left: 0; transform: scaleX(-1); }</style></head><body>';

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


  // TAGS 

  createDoorBtn.addEventListener('click', function () {
      // récupere la scene selectionné
      const selectedSceneId = sceneDropdown.value;
      const scene = document.getElementById(selectedSceneId);
      let messageError = document.getElementById('error');
    
      if (!scene) {
        messageError.innerText = "Erreur : Scène non trouvée.";
        console.error("Scène non trouvée.");
        return;
      }
      
      const doorTagTitle = document.getElementById('doorTagTitle').value; // Titre
      const doorTagRange = document.getElementById('doorTagRange').value; // Profondeur

      const cameraId = 'camera-' + selectedSceneId; // Construire l'ID de la caméra
      const camera = document.getElementById(cameraId);

      if (!camera || !camera.object3D) {
          console.error("Caméra non trouvée ou non initialisée.");
          return; // Sortir si la caméra n'est pas trouvée
      }

      const cameraDirection = new THREE.Vector3();
      camera.object3D.getWorldDirection(cameraDirection);

      // récupere la profondeur sélectionné par l'utilisateur 
      const distance = -doorTagRange;
    
      const tagPosition = new THREE.Vector3();
      tagPosition.copy(camera.object3D.position).addScaledVector(cameraDirection, distance);
    
      if (!tagsByScene[selectedSceneId]) {
        tagsByScene[selectedSceneId] = [];
      }
    
      const tagCounter = tagsByScene[selectedSceneId].length + 1;
      const tagId = `${tagCounter}`;
      
      
      const doorSceneSelect = document.getElementById('doorSceneSelect');
      const targetSceneId = doorSceneSelect.value;

      // Création de la sphère à côté de la box
      const newSphere = document.createElement('a-sphere');
      newSphere.setAttribute('position', tagPosition);
      newSphere.setAttribute('id', tagId)
      newSphere.setAttribute('radius', '0.5'); // Rayon de la sphère (peut être modifié)
      newSphere.setAttribute('color', '#EF2D5E'); // Couleur de la sphère (peut être modifié)
      newSphere.setAttribute('dragndrop', '')
      newSphere.setAttribute('look-at-camera', '')
      
      
    

      const newBox = document.createElement('a-box');
      newBox.setAttribute('position', tagPosition);
      // newBox.setAttribute('rotation', '0 45 0');
      newBox.setAttribute('color', '#4CC3D9');
      newBox.setAttribute('id', tagId);
      newBox.setAttribute('follow-mover', { target: newSphere })
      newBox.setAttribute('width', '2');   
      newBox.setAttribute('height', '4');  
      newBox.setAttribute('depth', '0.5'); 
      newBox.setAttribute('look-at-camera', ''); 

      newBox.addEventListener('click', function () {
        // Récupérer la scène sélectionnée dans le select
        // Vérifier si une scène a été sélectionnée dans le select
        if (targetSceneId) {
          changeScene(targetSceneId); 
          updateSceneMenu(targetSceneId);
        } else {
          console.warn("Aucune scène sélectionnée pour la navigation.");
        }
      });

      // Ajout de la box à la scène
      scene.appendChild(newBox);
      //ajout de la sphere a la scene
      scene.appendChild(newSphere);
    
      const tagInfo = {
        id: tagId,
        name: doorTagTitle || `Tag ${tagId}`, // Utiliser le nom fourni ou un nom par défaut
        depth: doorTagRange,
        currentScene: selectedSceneId,
        targetScene: targetSceneId || 'None',
        position: tagPosition
      };


      tagsByScene[selectedSceneId].push(tagInfo);

      console.log(tagsByScene)
      console.log(`Tag créé:`, tagInfo);
    
      updateTagSelector(selectedSceneId);

      document.getElementById('doorTagTitle').value = ''; // Réinitialise le champ du titre du tag
      document.getElementById('doorTagRange').value = '15'; // Réinitialise la profondeur à une valeur par défaut (par ex: 1)
      document.getElementById('doorTagRangeValue').value = '15'; // Réinitialise la profondeur à une valeur par défaut (par ex: 1)
      doorSceneSelect.value = ''; // Réinitialise la sélection de la scène cible
      messageError.innerText = '';


});

createInfoBtn.addEventListener('click', function () {
  // récupere la scene selectionné
  const selectedSceneId = sceneDropdown.value;
  const scene = document.getElementById(selectedSceneId);
  let messageError = document.getElementById('error');

  if (!scene) {
    messageError.innerText = "Erreur : Scène non trouvée.";
    console.error("Scène non trouvée.");
    return;
  }
  
  const infoTagTitle = document.getElementById('tagTitle').value; // Titre
  const infoTagDescription = document.getElementById('tagDescription').value; // Profondeur

  const cameraId = 'camera-' + selectedSceneId; // Construire l'ID de la caméra
  const camera = document.getElementById(cameraId);

  if (!camera || !camera.object3D) {
      console.error("Caméra non trouvée ou non initialisée.");
      return; // Sortir si la caméra n'est pas trouvée
  }

  const cameraDirection = new THREE.Vector3();
  camera.object3D.getWorldDirection(cameraDirection);

  // récupere la profondeur sélectionné par l'utilisateur 
  const distance = - 10;

  const tagPosition = new THREE.Vector3();
  tagPosition.copy(camera.object3D.position).addScaledVector(cameraDirection, distance);

  
  const doorSceneSelect = document.getElementById('doorSceneSelect');
  const targetSceneId = doorSceneSelect.value;

  // Création de la sphère 
  var newSphere = document.createElement('a-sphere');
  newSphere.setAttribute('position', tagPosition);
  newSphere.setAttribute('radius', '0.5'); 
  newSphere.setAttribute('color', '#EF2D5E'); 
  newSphere.setAttribute('dragndrop', ''); 
  
  
  var newText = document.createElement('a-text');
  newText.setAttribute('value', infoTagDescription);
  newText.setAttribute('position', { x: tagPosition.x, y: tagPosition.y + 1.5, z: tagPosition.z }); // Position légèrement au-dessus de la sphère
  newText.setAttribute('align', 'center');
  newText.setAttribute('scale', '3 3 3');
  newText.setAttribute('color', '#FFFFFF'); // Couleur du texte
  newText.setAttribute('follow-mover', { target: newSphere });
  newText.setAttribute('look-at-camera', '');


  // Ajout de la box à la scène
  scene.appendChild(newSphere);
  //ajout de la sphere a la scene
  scene.appendChild(newText);


  // document.getElementById('doorTagTitle').value = ''; // Réinitialise le champ du titre du tag
  // document.getElementById('doorTagRange').value = '15'; // Réinitialise la profondeur à une valeur par défaut (par ex: 1)
  // document.getElementById('doorTagRangeValue').value = '15'; // Réinitialise la profondeur à une valeur par défaut (par ex: 1)
  // doorSceneSelect.value = ''; // Réinitialise la sélection de la scène cible
  // messageError.innerText = '';


});


function updateTagSelector(sceneId) {
  // Sélectionner le menu déroulant par son ID
  const tagSelector = document.getElementById('tagSelector');

  // Vider le contenu précédent
  tagSelector.innerHTML = '<option value="" disabled selected>Sélectionnez un tag</option>';

  // Vérifier s'il y a des tags pour la scène sélectionnée
  if (tagsByScene[sceneId] && tagsByScene[sceneId].length > 0) {
    // Parcourir les tags de la scène et les ajouter comme options dans le `select`
    tagsByScene[sceneId].forEach(tag => {
      const option = document.createElement('option');
      option.value = tag.id; // Valeur de l'option : id du tag
      option.text = `Tag ${tag.id} : ${tag.name} (Profondeur: ${tag.depth}, Scene Cible: ${tag.targetScene})`;
      tagSelector.appendChild(option);
    });
  } else {
    // Si aucun tag n'est trouvé pour la scène, afficher un message
    const noTagsOption = document.createElement('option');
    noTagsOption.value = "";
    noTagsOption.text = "Aucun tag disponible pour cette scène";
    noTagsOption.disabled = true;
    tagSelector.appendChild(noTagsOption);
  }
}

const tagSelector = document.getElementById('tagSelector');
tagSelector.addEventListener('change', function () {
  const selectedTagId = tagSelector.value; // Récupère l'ID du tag sélectionné
  const selectedSceneId = sceneDropdown.value; // Récupère l'ID de la scène actuelle

  // Si un tag est sélectionné et qu'il appartient bien à la scène actuelle
  if (selectedTagId && tagsByScene[selectedSceneId]) {
    for (let i = 0; i < tagsByScene[selectedSceneId].length; i++) {
      if (tagsByScene[selectedSceneId][i] === selectedTagId) {
        // Remplir les champs du formulaire avec les informations du tag
        const tagInfo = tagsByScene[selectedSceneId][i]; // Récupère l'ID du tag sélectionné

        // Exemples de champs à remplir (ajuste en fonction de tes champs de formulaire)
        document.getElementById('tagIdInput').value = tagInfo; // ID du tag
        document.getElementById('doorTagName').value = name;
        document.getElementById('doorTagRange').value = depth; // Profondeur (ajuste selon ta logique)

        console.log(`Tag sélectionné : ${tagInfo}`);
      }
    }
  }
});


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


    // Tags image 2D
    document
    .getElementById("createPhotoTagBtn")
    .addEventListener("click", function () {
      createPhotoTag();
    });

    function resetPhotoTagForm() {
      document.getElementById("photoTagTitle").value = "";
      document.getElementById("photoTagRange").value = 5;
      document.getElementById("photoTagRangeValue").value = 5;
      document.getElementById("photoFileInput").value = "";
    }
  
    function createPhotoTag() {
      const selectedSceneId = document.getElementById("sceneDropdown").value;
      const scene = document.getElementById(selectedSceneId);
      if (!scene) {
        console.error("Scene not found.");
        return;
      }
  
      const title = document.getElementById("photoTagTitle").value;
      if (!title) {
        alert("Le titre est obligatoire.");
        return;
      }
  
      const fileInput = document.getElementById("photoFileInput");
      const file = fileInput.files[0];
  
      if (!file) {
        console.error("No file selected.");
        return;
      }
  
      const reader = new FileReader();
      reader.onload = function (e) {
        const imageUrl = e.target.result;
  
        // Créer l'image 2D
        const image = document.createElement("a-image");
        const imageId = `image-${Date.now()}`;
        image.setAttribute("id", imageId);
        image.setAttribute("src", imageUrl);
        image.setAttribute("position", "0 1.6 -2");
        image.setAttribute("width", "2");
        image.setAttribute("height", "2");
        image.setAttribute("dragndrop", "");
        image.setAttribute("look-at-camera", "");
        scene.appendChild(image);
        resetPhotoTagForm();
      };
      reader.readAsDataURL(file);
    }
  
    function resetPhotoTagForm() {
      document.getElementById("photoTagTitle").value = "";
      document.getElementById("photoFileInput").value = "";
    }
  


displayDefaultScene();
});