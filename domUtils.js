export function closeAllMenus() {
    document.getElementById('textTagFormContainer').classList.add('hidden');
    document.getElementById('doorTagFormContainer').classList.add('hidden');
    document.getElementById('photoTagFormContainer').classList.add('hidden');
    document.getElementById('videoTagFormContainer').classList.add('hidden');
  }
  
  export function syncRangeAndValue(rangeId, valueId) {
    const range = document.getElementById(rangeId);
    const rangeValue = document.getElementById(valueId);
  
    range.addEventListener('input', function() {
      rangeValue.value = range.value;
    });
  
    rangeValue.addEventListener('input', function() {
      range.value = rangeValue.value;
    });
  }
  export function updateSceneDropdown() {
    const sceneDropdown = document.getElementById('sceneDropdown');
    const doorSceneSelect = document.getElementById('doorSceneSelect');
    
    // Réinitialiser les sélecteurs
    sceneDropdown.innerHTML = '<option value="defaultScene">Sélectionner une scène</option>';
    doorSceneSelect.innerHTML = '<option value="">Sélectionnez une scène</option>';
    
    const allScenes = document.querySelectorAll('a-scene');
    allScenes.forEach(scene => {
      const sceneId = scene.getAttribute('id');
      const sceneName = scene.getAttribute('data-name') || sceneId;
      if (sceneId && sceneId !== 'defaultScene') {
        const option = document.createElement('option');
        option.value = sceneId;
        option.textContent = sceneName;
        option.setAttribute('data-name', sceneName); 
        sceneDropdown.appendChild(option);
  
        const doorOption = document.createElement('option');
        doorOption.value = sceneId;
        doorOption.textContent = sceneName;
        doorOption.setAttribute('data-name', sceneName); 
        doorSceneSelect.appendChild(doorOption);
      }
    });
  }