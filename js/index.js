if (!Detector.webgl) 
  Detector.addGetWebGLMessage();

var container;
var camera, scene, renderer;
var plane, cube;
var mouse, raycaster, is_delete = false;

var is_editor = true;

var roll_over_mesh, roll_over_material;
var cube_geo, cube_material;

var objects = [];

init();
render();

function init()
{
  container = document.createElement('div');
  document.body.appendChild(container);
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, 
                                       window.innerWidth / window.innerHeight, 
                                       1, 10000);
  camera.position.set(500, 800, 1300);
  camera.lookAt(new THREE.Vector3());
  scene.add(camera);

  // Lights
  scene.add(new THREE.AmbientLight(0xf0f0f0)); 
  var light = new THREE.SpotLight(0xffffff, 1.5);
  light.position.set(0, 1500, 200);
  light.castShadow = true;
  light.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(70, 1, 
                                                                   200, 2000));
  light.shadow.bias = -0.000222;
  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;
  scene.add(light);
  spotlight = light;

  scene.add( new THREE.CameraHelper(light.shadow.camera));

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setClearColor(0xf0f0f0);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  var size = 500, step = 50;
  var geometry = new THREE.Geometry();
  for (var i = -size; i <= size; i += step) 
  {
    geometry.vertices.push(new THREE.Vector3(-size, 0, i));
    geometry.vertices.push(new THREE.Vector3(size, 0, i));

    geometry.vertices.push(new THREE.Vector3(i, 0, -size));
    geometry.vertices.push(new THREE.Vector3(i, 0, size));
  }

  var material = new THREE.LineBasicMaterial( 
  { 
    color: 0x000000, 
    opacity: 0.2, 
    transparent: true 
  });

  var line = new THREE.LineSegments(geometry, material);
  scene.add(line);


  // Controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.damping = 0.2;
  controls.addEventListener('change', render);

  transformControl = new THREE.TransformControls(camera, renderer.domElement);
  transformControl.addEventListener('change', render);

  scene.add(transformControl);
}

function render()
{
  renderer.render(scene, camera);
}
