import { closeAllMenus, 
  updateSceneDropdown } 
  from "./domUtils.js";
import { Tag, 
  DoorTag, 
  InfoTag, 
  PhotoTag,
  tagsByScene } 
  from "./tags.js";
import {
  scenes,
  createSceneElement,
  displayScene,
  displayDefaultScene,
  saveAllScenes,
  loadScenesFromJson,
} from "./sceneManager.js";

document.addEventListener("DOMContentLoaded", function () {
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
  const leftHand = document.getElementById("leftHand");
  const rightHand = document.getElementById("rightHand");
  let tagsByScene = [];

  let selectedImage = null;

  document.addEventListener("DOMContentLoaded", function () {
    const leftHand = document.getElementById("leftHand");
    const rightHand = document.getElementById("rightHand");

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
  });

  let selectedDoor = null;
  let associatedBox = null;

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
  });

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
  });

  document.getElementById("uploadJsonBtn").addEventListener("click", () => {
    document.getElementById("uploadJsonInput").click();
  });

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

  [
    { button: OpenTagMenuText, containerId: "textTagFormContainer" },
    { button: OpenTagMenuDoor, containerId: "doorTagFormContainer" },
    { button: OpenTagMenuPhoto, containerId: "photoTagFormContainer" },
    { button: OpenTagMenuVideo, containerId: "videoTagFormContainer" },
  ].forEach((menu) => {
    menu.button.addEventListener("click", function () {
      closeAllMenus();
      const formContainer = document.getElementById(menu.containerId);
      formContainer.classList.toggle("hidden");
    });
  });

  createSceneBtn.addEventListener("click", function () {
    fileInput.click();
  });

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

  deleteSceneBtn.addEventListener("click", function () {
    deleteModal.classList.add("show");
  });

  cancelDeleteBtn.addEventListener("click", function () {
    deleteModal.classList.remove("show");
  });

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

  customFileInputBtn.addEventListener("click", function () {
    editFileInput.click();
  });

  editFileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      fileName.textContent = file.name;
    } else {
      fileName.textContent = "";
    }
  });

  document
    .getElementById("ExportSceneBtn")
    .addEventListener("click", function () {
      const scenes = document.querySelectorAll("a-scene:not(#defaultScene)");

      // Créer un nouveau document HTML
      let exportContent =
        '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Exported Scenes</title>';
      exportContent +=
        '<script src="https://aframe.io/releases/1.6.0/aframe.min.js"></script>';
      exportContent +=
        "<style>a-scene { width: 100vw; height: 100vh; position: absolute; top: 0; left: 0; transform: scaleX(-1); }</style></head><body>";

      scenes.forEach((scene) => {
        // Ajouter les contrôles de caméra
        const cameraEntity = scene.querySelector("[camera]");
        if (cameraEntity) {
          cameraEntity.setAttribute("wasd-controls", "enabled: false");
          cameraEntity.setAttribute("look-controls", "enabled: true");
        }
        exportContent += scene.outerHTML;
      });

      exportContent += "</body></html>";

      // Créer un blob et ouvrir l'URL dans une nouvelle fenêtre
      const blob = new Blob([exportContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      URL.revokeObjectURL(url);
    });

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

  document
    .getElementById("sceneNameInput")
    .addEventListener("input", function (event) {
      const sceneId = document.getElementById("sceneDropdown").value;
      const newName = event.target.value;
      if (sceneId) {
        updateSceneName(sceneId, newName);
      }
    });

  // TAGS DOOR & INFO

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
    const distance = -15;
    const tagPosition = new THREE.Vector3().copy(camera.object3D.position).addScaledVector(cameraDirection, distance);
    const doorSceneSelect = document.getElementById("doorSceneSelect");
    const targetSceneId = doorSceneSelect.value;
  
    const doorTag = new DoorTag(selectedSceneId, doorTagTitle, tagPosition, targetSceneId);
    doorTag.create();
  
    document.getElementById("doorTagTitle").value = "";
    doorSceneSelect.value = "";
    messageError.innerText = "";
  });
  
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
    const distance = -6;
    const tagPosition = new THREE.Vector3().copy(camera.object3D.position).addScaledVector(cameraDirection, distance);
  
    const infoTag = new InfoTag(selectedSceneId, infoTagTitle, tagPosition, infoTagDescription);
    infoTag.create();
  });
  
  document.getElementById("createPhotoTagBtn").addEventListener("click", function () {
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
      const photoTag = new PhotoTag(selectedSceneId, title, "0 1.6 -2", imageUrl);
      photoTag.create();
      resetPhotoTagForm();
    };
    reader.readAsDataURL(file);
  });
  
  
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
  // createSceneElement("Scene test 1", "./asset/GS__3523.jpg");
  // createSceneElement("Scene test 2", "./asset/GS__3524.jpg");
  updateSceneDropdown();
});


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
export function resetPhotoTagForm() {
  document.getElementById("photoTagTitle").value = "";
  document.getElementById("photoFileInput").value = "";
}


export function updateTagSelectorDoor(sceneId) {
  const tagSelectorDoor = document.getElementById("tagSelectorDoor");
  tagSelectorDoor.innerHTML = '<option value="" disabled selected>Sélectionnez un tag</option>';
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

//affichage de l'info scroll profondeur
const infoToggle = document.getElementById('info-toggle');
const infoToggleDoor = document.getElementById('info-toggle-door');
const infoTogglePhoto = document.getElementById('info-toggle-photo');
const popup = document.getElementById('popup');
const closePopup = document.getElementById('close-popup');


infoToggle.addEventListener('click', function(event) {
  event.preventDefault(); 
  popup.classList.toggle('hidden');
});

infoToggleDoor.addEventListener('click', function(event) {
  event.preventDefault(); 
  popup.classList.toggle('hidden');
});

infoTogglePhoto.addEventListener('click', function(event) {
  event.preventDefault(); 
  popup.classList.toggle('hidden');
});




closePopup.addEventListener('click', function(event) {
  event.preventDefault(); // Empêche le rechargement de la page
  popup.classList.add('hidden');
});
