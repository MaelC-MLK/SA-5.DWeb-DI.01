AFRAME.registerComponent('follow-camera', {
    tick: function () {
        // Récupère référence à l'entité de la caméra
        var camera = document.getElementById('camera');
        // Récupère la direction dans laquelle la caméra regarde
        var cameraDirection = new THREE.Vector3();
        camera.object3D.getWorldDirection(cameraDirection);

        // Défini la distance à laquelle l'entité suiveuse doit être placée devant la caméra
        var distance = -4; // Distance désirée

        // Calcul la position de l'entité suiveuse
        var followerPosition = new THREE.Vector3();
        followerPosition.copy(camera.object3D.position).addScaledVector(cameraDirection, distance);

        // Met à jour la position de l'entité suiveuse
        this.el.object3D.position.copy(followerPosition);

    }
});