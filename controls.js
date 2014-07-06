window.FPSControls = function(camera, el) {
  // Player height
  var height = 1.7;

  // Speed of movement
  var speedCoefficient    = 200;
  var jumpSpeed           = 50;
  var slowdownCoefficient = 5;

  // Physics
  var G    = 9.8;
  var mass = 20;

  // Used for movement calculations;
  var velocity = new THREE.Vector3();

  var moveForward  = null;
  var moveBackward = null;
  var moveLeft     = null;
  var moveRight    = null;

  // Shooting
  var raycaster = new THREE.Raycaster();
  var projector = new THREE.Projector();

  $el = $(el);

  camera.rotation.set(0, 0, 0);

  var pitch = new THREE.Object3D();
  pitch.add(camera);

  var yaw = new THREE.Object3D();
  yaw.position.y = height;
  yaw.add(pitch);

  // needed for updating movement
  var time     = null;
  var prevTime = performance.now();

  // Listen to events
  $(el).pointerLock({
    on: 'click',
    until: null,
    fullscreenElement: el,
    movement: function(movementX, movementY) {
      updateCamera(movementX, movementY);
    }
  });

  $(document).on('keydown', function(e) {
    switch (e.keyCode) {
      case 87: moveForward  = true; break; // w
      case 65: moveLeft     = true; break; // a
      case 83: moveBackward = true; break; // s
      case 68: moveRight    = true; break; // d

      case 32: // space
        if (isOnFloor()) { velocity.y += jumpSpeed; }
        break;
    }
  });

  $(document).on('keyup', function(e) {
    switch (e.keyCode) {
      case 87: moveForward  = false; break; // w
      case 65: moveLeft     = false; break; // a
      case 83: moveBackward = false; break; // s
      case 68: moveRight    = false; break; // d
    }
  });

  $(document).on('click', function(e) {
    var front = new THREE.Vector3(0, 0, 0.5);
    projector.unprojectVector(front, camera);
    raycaster.set(camera.position, front.sub(camera.position).normalize());

    var intersections = raycaster.intersectObjects(window.cubes);
    if (intersections.length) {
      console.log(intersections[0].object)

      intersections[0].object.material = new THREE.MeshPhongMaterial({
        color:    0xff0000,
        specular: 0xff0000,
        ambient:  0x111111,
      });
    }
  });

  // Update camera position based on mouse movement
  var updateCamera = function(movementX, movementY) {
    yaw.rotation.y   -= movementX * 0.002;
    pitch.rotation.x -= movementY * 0.002;

    pitch.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, pitch.rotation.x));
  };

  var isOnFloor = function() {
    return (yaw.position.y <= 1.7);
  };

  this.getObject = function() {
    return yaw;
  };

  this.update = function() {
    time = performance.now();
    var delta = (time - prevTime) / 1000;
    prevTime = time;

    velocity.x -= velocity.x * slowdownCoefficient * delta;
    velocity.z -= velocity.z * slowdownCoefficient * delta;

    velocity.y -= mass * G * delta;

    if (moveForward)  { velocity.z -= speedCoefficient * delta; }
    if (moveBackward) { velocity.z += speedCoefficient * delta; }

    if (moveLeft)  { velocity.x -= speedCoefficient * delta; }
    if (moveRight) { velocity.x += speedCoefficient * delta; }

    yaw.translateX(velocity.x * delta);
    yaw.translateY(velocity.y * delta);
    yaw.translateZ(velocity.z * delta);

    if (isOnFloor()) {
      velocity.y = 0;
      yaw.position.y = height;
    }
  }
};
