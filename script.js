document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('chooseImageBtn').addEventListener('click', function() {
    document.getElementById('fileInput').click();
  });

  document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const sky = document.querySelector('a-sky');
        sky.setAttribute('src', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  });
});