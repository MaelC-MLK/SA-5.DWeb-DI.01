import { closeAllMenus, updateSceneDropdown } from "./domUtils.js";
import {
  Tag,
  DoorTag,
  InfoTag,
  PhotoTag,
  tagsByScene,
  VideoTag,
} from "./tags.js";
import {
  scenes,
  createSceneElement,
  displayScene,
  displayDefaultScene,
  saveAllScenes,
  loadScenesFromJson,
} from "./sceneManager.js";

// Exécute le code une fois que le DOM est complètement chargé
document.addEventListener("DOMContentLoaded", function () {
  // Récupère les éléments du DOM
  const sceneDropdown = document.getElementById("sceneDropdown");
  const fileInput = document.getElementById("fileInput");
  const createSceneBtn = document.getElementById("createSceneBtn");
  const editSceneForm = document.getElementById("editSceneForm");
  const sceneNameInput = document.getElementById("sceneNameInput");
  const editFileInput = document.getElementById("editFileInput");
  const saveSceneBtn = document.getElementById("saveSceneBtn");
  const deleteSceneBtn = document.getElementById("deleteSceneBtn");
  const deleteModal = document.getElementById("deleteModal");
  const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  const customFileInputBtn = document.getElementById("customFileInputBtn");
  const fileName = document.getElementById("fileName");
  const OpenTagMenuText = document.getElementById("OpenTagMenuText");
  const doorSceneSelect = document.getElementById("doorSceneSelect");
  const createDoorBtn = document.getElementById("createDoorTagBtn");
  const createInfoBtn = document.getElementById("createTagBtnText");
  const menuRight = document.getElementById("menuRight");
  const leftHand = document.getElementById("leftHand");
  const rightHand = document.getElementById("rightHand");
  const infoToggle = document.getElementById("info-toggle");
  const infoToggleDoor = document.getElementById("info-toggle-door");
  const infoTogglePhoto = document.getElementById("info-toggle-photo");
  const popup = document.getElementById("popup");
  const closePopup = document.getElementById("close-popup");
  const createVideoTagBtn = document.getElementById("createVideoTagBtn");

  // Tableau pour stocker les boutons de tag et leurs conteneurs associés
  let tagButtons = [
    { button: OpenTagMenuText, containerId: "textTagFormContainer" },
    { button: OpenTagMenuDoor, containerId: "doorTagFormContainer" },
    { button: OpenTagMenuPhoto, containerId: "photoTagFormContainer" },
    { button: OpenTagMenuVideo, containerId: "videoTagFormContainer" },
  ];
  let tagsByScene = [];
  let selectedDoor = null;
  let associatedBox = null;
  let selectedImage = null;
  let selectedVideoTag = null;


  // Ajoute des écouteurs d'événements pour les boutons d'information
  infoToggle.addEventListener("click", function (event) {
    event.preventDefault();
    popup.classList.toggle("hidden");
  });

  infoToggleDoor.addEventListener("click", function (event) {
    event.preventDefault();
    popup.classList.toggle("hidden");
  });

  infoTogglePhoto.addEventListener("click", function (event) {
    event.preventDefault();
    popup.classList.toggle("hidden");
  });

  closePopup.addEventListener("click", function (event) {
    event.preventDefault();
    popup.classList.add("hidden");
  });

  // Ajoute des écouteurs d'événements pour les mains gauche et droite
  leftHand.addEventListener("triggerdown", () => {
    const intersectedEl = leftHand.components.raycaster.intersectedEls[0];
    if (intersectedEl && intersectedEl.classList.contains("door")) {
      intersectedEl.emit("click");
    }
  });

  rightHand.addEventListener("triggerdown", () => {
    const intersectedEl = rightHand.components.raycaster.intersectedEls[0];
    if (intersectedEl && intersectedEl.classList.contains("door")) {
      intersectedEl.emit("click");
    }
  });

  // Ajoute des écouteurs d'événements pour les portes
  const doors = document.querySelectorAll(".door");
  doors.forEach((door) => {
    door.addEventListener("click", () => {
      console.log("Door clicked");
      const targetSceneId = door.getAttribute("data-target-scene");
      if (targetSceneId) {
        changeScene(targetSceneId);
      } else {
        console.warn("Aucune scène cible définie pour cette porte.");
      }
    });
  });

  // Ajoute un écouteur d'événements pour la sélection des images et des portes
  document.addEventListener("click", function (event) {
    if (event.target.tagName === "A-IMAGE") {
      if (selectedImage) {
        selectedImage.classList.remove("selected");
      }
      selectedImage = event.target;
    }
    if (event.target.tagName === "A-SPHERE") {
      if (selectedDoor) {
        selectedDoor.classList.remove("selected");
        if (associatedBox) {
          associatedBox.classList.remove("selected");
        }
      }

      selectedDoor = event.target;
      selectedDoor.classList.add("selected");

      const boxId = selectedDoor.getAttribute("id");
      associatedBox = document.querySelector(`a-box[id="${boxId}"]`);

      if (associatedBox) {
        associatedBox.classList.add("selected");
      }
    }
    if (event.target.tagName === "A-VIDEO") {
      if (selectedVideoTag) {
        selectedVideoTag.classList.remove("selected");
      }
      selectedVideoTag = event.target;
      selectedVideoTag.classList.add("selected");
    }
  });


  // Ajoute un écouteur d'événements pour la suppression des éléments sélectionnés
  document.addEventListener("keydown", function (event) {
    if (
      (event.key === "Delete" || event.key === "Backspace") &&
      selectedDoor &&
      associatedBox
    ) {
      const selectedSceneId = sceneDropdown.value;
      const scene = document.getElementById(selectedSceneId);

      if (!selectedDoor.classList.contains("door")) {
        scene.removeChild(selectedDoor);
        scene.removeChild(associatedBox);

        tagsByScene[selectedSceneId] = tagsByScene[selectedSceneId].filter(
          (tag) => tag.id !== selectedDoor.id
        );
        console.log(
          "Tags restants dans la scène : ",
          tagsByScene[selectedSceneId]
        );

        updateTagSelectorDoor(selectedSceneId);

        selectedDoor = null;
        associatedBox = null;
      }
    }

    if (event.key === "Delete" && selectedImage) {
      selectedImage.parentNode.removeChild(selectedImage);
      selectedImage = null;
    }

    if (event.key === "Delete" && selectedVideoTag) {
      selectedVideoTag.parentNode.removeChild(selectedVideoTag);
      selectedVideoTag = null;
    }
  });
  // Ajoute un écouteur d'événements pour le bouton de téléchargement de JSON
  document.getElementById("uploadJsonBtn").addEventListener("click", () => {
    document.getElementById("uploadJsonInput").click();
  });

  // Ajoute un écouteur d'événements pour le téléchargement de JSON
  document
    .getElementById("uploadJsonInput")
    .addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const scenesJson = e.target.result;
          loadScenesFromJson(scenesJson);
        };
        reader.readAsText(file);
      }
    });

  // Ajoute un écouteur d'événements pour le bouton de sauvegarde de l'expérience
  document.getElementById("saveExperienceBtn").addEventListener("click", () => {
    const scenesJson = saveAllScenes();
    const blob = new Blob([scenesJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "scenes.json";
    a.click();
    URL.revokeObjectURL(url);
  });

  // Ajoute des écouteurs d'événements pour les boutons de tag
  tagButtons.forEach((menu) => {
    menu.button.addEventListener("click", function () {
      closeAllMenus();
      const formContainer = document.getElementById(menu.containerId);
      formContainer.classList.toggle("hidden");
    });
  });

  tagButtons.forEach(({ button }) => {
    button.addEventListener("click", function () {
      menuRight.classList.remove("hidden");
    });
  });

  // Ajoute un écouteur d'événements pour le bouton de création de scène
  createSceneBtn.addEventListener("click", function () {
    fileInput.click();
  });

  // Ajoute un écouteur d'événements pour le téléchargement de fichier de scène
  fileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const sceneId = `scene-${scenes.length + 1}`;
        scenes.push({
          id: sceneId,
          name: `Scène ${scenes.length + 1}`,
          src: e.target.result,
          fileName: file.name,
        });

        const option = document.createElement("option");
        option.value = sceneId;
        option.textContent = `Scène ${scenes.length}`;
        sceneDropdown.appendChild(option);

        createSceneElement(sceneId, e.target.result);
        sceneDropdown.value = sceneId;
        displayScene(sceneId);
        editSceneForm.classList.remove("hidden");
        sceneNameInput.value = `Scène ${scenes.length}`;
        fileName.textContent = file.name;
      };
      reader.readAsDataURL(file);
    }
  });

  // Ajoute un écouteur d'événements pour le changement de scène
  sceneDropdown.addEventListener("change", function () {
    const selectedSceneId = sceneDropdown.value;
    if (selectedSceneId) {
      displayScene(selectedSceneId);
      updateTagSelectorDoor(selectedSceneId);
      const selectedScene = scenes.find(
        (scene) => scene.id === selectedSceneId
      );
      if (selectedScene) {
        sceneNameInput.value = selectedScene.name;
        fileName.textContent = selectedScene.fileName || "";
        editSceneForm.classList.remove("hidden");
      }
    } else {
      editSceneForm.classList.add("hidden");
      fileName.textContent = "";
    }
  });

  // Ajoute un écouteur d'événements pour le bouton de sauvegarde de scène
  saveSceneBtn.addEventListener("click", function () {
    const selectedSceneId = sceneDropdown.value;
    const selectedScene = scenes.find((scene) => scene.id === selectedSceneId);
    if (selectedScene) {
      selectedScene.name = sceneNameInput.value;
      const option = sceneDropdown.querySelector(
        `option[value="${selectedSceneId}"]`
      );
      if (option) {
        option.textContent = selectedScene.name;
      }

      const file = editFileInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          selectedScene.src = e.target.result;
          selectedScene.fileName = file.name;
          const skyElement = document.querySelector(
            `#${selectedSceneId} a-sky`
          );
          if (skyElement) {
            skyElement.setAttribute("src", selectedScene.src);
          }
          fileName.textContent = file.name;
        };
        reader.readAsDataURL(file);
      }
    }
  });

  // Ajoute un écouteur d'événements pour le bouton de suppression de scène
  deleteSceneBtn.addEventListener("click", function () {
    deleteModal.classList.add("show");
  });

  // Ajoute un écouteur d'événements pour le bouton d'annulation de suppression
  cancelDeleteBtn.addEventListener("click", function () {
    deleteModal.classList.remove("show");
  });

  // Ajoute un écouteur d'événements pour le bouton de confirmation de suppression
  confirmDeleteBtn.addEventListener("click", function () {
    const selectedSceneId = sceneDropdown.value;
    const selectedSceneIndex = scenes.findIndex(
      (scene) => scene.id === selectedSceneId
    );
    if (selectedSceneIndex !== -1) {
      scenes.splice(selectedSceneIndex, 1);
      const option = sceneDropdown.querySelector(
        `option[value="${selectedSceneId}"]`
      );
      if (option) {
        option.remove();
      }
      const sceneElement = document.getElementById(selectedSceneId);
      if (sceneElement) {
        sceneElement.remove();
      }
      sceneDropdown.value = "";
      editSceneForm.classList.add("hidden");
      fileName.textContent = "";
      displayDefaultScene();
    }
    deleteModal.classList.remove("show");
  });

  // Ajoute un écouteur d'événements pour le bouton de sélection de fichier personnalisé
  customFileInputBtn.addEventListener("click", function () {
    editFileInput.click();
  });

  // Ajoute un écouteur d'événements pour le changement de fichier d'édition
  editFileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      fileName.textContent = file.name;
    } else {
      fileName.textContent = "";
    }
  });

  // Fonction pour mettre à jour le nom de la scène
  function updateSceneName(sceneId, newName) {
    const sceneElement = document.getElementById(sceneId);
    if (sceneElement) {
      sceneElement.setAttribute("data-name", newName);
      const option = doorSceneSelect.querySelector(
        `option[value="${sceneId}"]`
      );
      if (option) {
        option.textContent = newName;
        option.setAttribute("data-name", newName);
      }
    }
  }

  // Ajoute un écouteur d'événements pour la mise à jour du nom de la scène
  document
    .getElementById("sceneNameInput")
    .addEventListener("input", function (event) {
      const sceneId = document.getElementById("sceneDropdown").value;
      const newName = event.target.value;
      if (sceneId) {
        updateSceneName(sceneId, newName);
      }
    });

  // TAGS

  createVideoTagBtn.addEventListener("click", (e) => {
    e.preventDefault();
    createVideoTag();
  });

  // Ajoute un écouteur d'événement pour le bouton de création de porte
  createDoorBtn.addEventListener("click", function () {
    const selectedSceneId = sceneDropdown.value;
    const scene = document.getElementById(selectedSceneId);
    let messageError = document.getElementById("error");

    if (!scene) {
      messageError.innerText = "Erreur : Scène non trouvée.";
      console.error("Scène non trouvée.");
      return;
    }

    const doorTagTitle = document.getElementById("doorTagTitle").value;
    const cameraId = "camera-" + selectedSceneId;
    const camera = document.getElementById(cameraId);

    if (!camera || !camera.object3D) {
      console.error("Caméra non trouvée ou non initialisée.");
      return;
    }

    const cameraDirection = new THREE.Vector3();
    camera.object3D.getWorldDirection(cameraDirection);
    const distance = -8;
    const tagPosition = new THREE.Vector3()
      .copy(camera.object3D.position)
      .addScaledVector(cameraDirection, distance);
    const doorSceneSelect = document.getElementById("doorSceneSelect");
    const targetSceneId = doorSceneSelect.value;

    const doorTag = new DoorTag(
      selectedSceneId,
      doorTagTitle,
      tagPosition,
      targetSceneId
    );
    doorTag.create();
    resetDoorTagForm();

    document.getElementById("doorTagTitle").value = "";
    doorSceneSelect.value = "";
    messageError.innerText = "";
  });

  // Ajoute un écouteur d'événement pour le bouton de création d'information
  createInfoBtn.addEventListener("click", function () {
    const selectedSceneId = sceneDropdown.value;
    const scene = document.getElementById(selectedSceneId);
    let messageError = document.getElementById("error");

    if (!scene) {
      messageError.innerText = "Erreur : Scène non trouvée.";
      console.error("Scène non trouvée.");
      return;
    }

    const infoTagTitle = document.getElementById("tagTitle").value;
    const infoTagDescription = document.getElementById("tagDescription").value;
    const cameraId = "camera-" + selectedSceneId;
    const camera = document.getElementById(cameraId);

    if (!camera || !camera.object3D) {
      console.error("Caméra non trouvée ou non initialisée.");
      return;
    }

    const cameraDirection = new THREE.Vector3();
    camera.object3D.getWorldDirection(cameraDirection);
    const distance = -8;
    const tagPosition = new THREE.Vector3()
      .copy(camera.object3D.position)
      .addScaledVector(cameraDirection, distance);

    const infoTag = new InfoTag(
      selectedSceneId,
      infoTagTitle,
      tagPosition,
      infoTagDescription
    );
    infoTag.create();
    resetInfoTagForm();
  });

  // Ajoute un écouteur d'événement pour le bouton de création de photo
  document
    .getElementById("createPhotoTagBtn")
    .addEventListener("click", function () {
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
        const photoTag = new PhotoTag(
          selectedSceneId,
          title,
          "0 1.6 -2",
          imageUrl
        );
        photoTag.create();
        resetPhotoTagForm();
      };
      reader.readAsDataURL(file);
    });

  // Ajoute un écouteur d'événement pour le sélecteur de tags de porte
  const tagSelectorDoor = document.getElementById("tagSelectorDoor");
  tagSelectorDoor.addEventListener("change", function () {
    const selectedTagId = tagSelectorDoor.value;
    const selectedSceneId = sceneDropdown.value;
    if (selectedTagId && tagsByScene[selectedSceneId]) {
      for (let i = 0; i < tagsByScene[selectedSceneId].length; i++) {
        if (tagsByScene[selectedSceneId][i] === selectedTagId) {
          const tagInfo = tagsByScene[selectedSceneId][i];
          document.getElementById("tagIdInput").value = tagInfo;
          document.getElementById("doorTagName").value = name;
          document.getElementById("doorTagRange").value = depth;
          console.log(`Tag sélectionné : ${tagInfo}`);
        }
      }
    }
  });

  displayDefaultScene();
  updateSceneDropdown();
});

// Fonction pour changer de scène
export function changeScene(sceneId) {
  const scene = document.getElementById(sceneId);

  if (!scene) {
    console.error("Scène non trouvée.");
    return;
  }
  const allScenes = document.querySelectorAll("a-scene");
  allScenes.forEach((s) => (s.style.display = "none"));
  scene.style.display = "block";
  document.getElementById("sceneDropdown").value = sceneId;
  updateTagSelectorDoor(sceneId);
  requestAnimationFrame(() => {
    window.dispatchEvent(new Event("resize"));
  });
}

// Fonction pour réinitialiser le formulaire de tag photo
function resetPhotoTagForm() {
  document.getElementById("photoTagTitle").value = "";
  document.getElementById("photoFileInput").value = "";
}

// Fonction pour réinitialiser le formulaire de tag d'information
function resetInfoTagForm() {
  document.getElementById("tagTitle").value = "";
  document.getElementById("tagDescription").value = "";
}

// Fonction pour réinitialiser le formulaire de tag de porte
function resetDoorTagForm() {
  document.getElementById("doorTagTitle").value = "";
  document.getElementById("doorSceneSelect").value = "";
}

// Fonction pour mettre à jour le sélecteur de tags de porte
export function updateTagSelectorDoor(sceneId) {
  const tagSelectorDoor = document.getElementById("tagSelectorDoor");
  tagSelectorDoor.innerHTML =
    '<option value="" disabled selected>Sélectionnez un tag</option>';
  if (tagsByScene[sceneId] && tagsByScene[sceneId].length > 0) {
    tagsByScene[sceneId].forEach((tag) => {
      const option = document.createElement("option");
      option.value = tag.id;
      option.text = `Tag ${tag.id} : ${tag.name} (Profondeur: ${tag.depth}, Scene Cible: ${tag.targetScene})`;
      tagSelectorDoor.appendChild(option);
    });
  } else {
    const noTagsOption = document.createElement("option");
    noTagsOption.value = "";
    noTagsOption.text = "Aucun tag disponible pour cette scène";
    noTagsOption.disabled = true;
    tagSelectorDoor.appendChild(noTagsOption);
  }
}

// Fonction pour vérifier les scènes et afficher ou masquer le sous-menu
export function checkScenesAndToggleSubMenu() {
  const allScenes = document.querySelectorAll("a-scene");
  const subMenuCreateTag = document.getElementById("subMenuCreateTag");
  const exportSaveBtn = document.getElementById("exportSaveBtn");
  if (allScenes.length > 0) {
    subMenuCreateTag.classList.remove("hidden");
    exportSaveBtn.classList.remove("hidden");
  } else {
    subMenuCreateTag.classList.add("hidden");
    exportSaveBtn.classList.add("hidden");
  }
}

// Fonction pour créer un tag vidéo
function createVideoTag() {
  const title = document.getElementById("videoTagTitle").value;
  const fileInput = document.getElementById("videoFileInput");
  const file = fileInput.files[0];
  const sceneId = document.getElementById("sceneDropdown").value;

  if (!title || !file || !sceneId) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  const videoUrl = URL.createObjectURL(file);
  const position = { x: 0, y: 1.5, z: -3 }; // Position par défaut, à ajuster si nécessaire

  const videoTag = new VideoTag(sceneId, title, position, videoUrl);
  videoTag.create();

  // Réinitialiser le formulaire après la création du tag
  resetVideoTagForm();
}

// Fonction pour réinitialiser le formulaire de tag vidéo
function resetVideoTagForm() {
  document.getElementById("videoTagTitle").value = "";
  document.getElementById("videoFileInput").value = "";
}