$(function() {
  var $canvas = $('canvas');

  var scene    = new THREE.Scene();
  var camera   = new THREE.PerspectiveCamera(55, $canvas.innerWidth() / $canvas.innerHeight(), 1, 1000);
  var renderer = new THREE.WebGLRenderer({canvas: $canvas[0], antialias: true});

  renderer.setClearColor(0xffffff);
  renderer.setSize($canvas.innerWidth(), $canvas.innerHeight());

  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var material = new THREE.MeshPhongMaterial({
    color:    0x00ff00,
    specular: 0x009900,
    ambient:  0x005500,
    shininess: 10
  });

  var light = new THREE.AmbientLight( 0xffffff, 0.1 );
  scene.add( light );

  var light = new THREE.DirectionalLight( 0xffffff, 1.5 );
  light.position.set( 100, 100, -100 );
  scene.add( light );

  var light = new THREE.DirectionalLight( 0xffffff, 0.75 );
  light.position.set( -100, -50, -100 );
  scene.add( light );

  addFloor(scene);
  addCubes(scene);

  var controls = new FPSControls(camera, $canvas[0]);
  scene.add(controls.getObject());

  window.render = function() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);

    controls.update();
  }

  render();

  function addFloor(scene) {
    var segments = 10;
    var geometry = new THREE.PlaneGeometry( 100, 100, segments, segments );
    geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

    var materialEven = new THREE.MeshBasicMaterial({ color: 0xccccfc });
    var materialOdd  = new THREE.MeshBasicMaterial({ color: 0x444464 });
    var materials    = [materialEven, materialOdd];

    for (var x = 0; x < segments; x++) {
      for (var y = 0; y < segments; y++) {
        i = x * segments + y
        j = 2 * i

        geometry.faces[j].materialIndex     = (x + y) % 2;
        geometry.faces[j + 1].materialIndex = (x + y) % 2;
      }
    }

    var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));

    mesh.position.y = 0;
    scene.add( mesh );
  }

  function addCubes(scene) {
    var side = 3;
    var cubes = [];

    for (var i = 0; i < 20; i++) {
      var geometry = new THREE.BoxGeometry(side, side, side);
      var material = new THREE.MeshPhongMaterial({
        color:    0x00ff00,
        specular: 0x009900,
        ambient:  0x111111,
      });

      var cube = new THREE.Mesh(geometry, material);

      var randomX = -50 + Math.random()*100;
      var randomZ = -50 + Math.random()*100;

      cube.position.set(randomX, side / 2, randomZ);
      cube.rotation.y = -Math.PI/2 + Math.random()*Math.PI

      cubes.push(cube);
      scene.add(cube);
    }

    return cubes;
  }
});
