//Setup
var height = window.innerHeight;
var width = height;

document.body.style.background = "#000000";

var canvas = document.getElementById("c");
canvas.width = height;
canvas.height = height;
canvas.tabindex = 0;
canvas.setAttribute('style', "  position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);");
document.body.appendChild(canvas);
		
var renderer;
var camera;
var scene;
var loader;
var model;

var loadingManager;
var RESOURCES_LOADED;
var fullscreen;
var turn_left;
var turn_right;

init();
render();

function init(){
	scene = new THREE.Scene();
	
	//Viewport cameras
	frontCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);           			
	scene.add(frontCamera);	
	frontCamera.position.set(0, 0, 5);
	
	backCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);           			
	scene.add(backCamera);
	backCamera.position.set(0, 0, -5);
	backCamera.rotation.y = 1 * Math.PI;
	backCamera.rotation.z = 1 * Math.PI;
	backCamera.aspect = window.innerHeight / window.innerHeight;
    backCamera.updateProjectionMatrix();
	
	leftCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);           			
	scene.add(leftCamera);
	leftCamera.position.set(-5, 0, 0);
	leftCamera.rotation.y = -0.5 * Math.PI;
	leftCamera.rotation.z = -0.5 * Math.PI;
	leftCamera.aspect = window.innerHeight / window.innerHeight;
    leftCamera.updateProjectionMatrix();
	
	rightCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);           			
	scene.add(rightCamera);
	rightCamera.position.set(5, 0, 0);
	rightCamera.rotation.y = 0.5 * Math.PI;
	rightCamera.rotation.z = 0.5 * Math.PI;
	rightCamera.aspect = window.innerHeight / window.innerHeight;
    rightCamera.updateProjectionMatrix();
	
	//Renderer
	renderer = new THREE.WebGLRenderer({
		canvas: document.getElementById("c"),
		antialias: true
	});
	renderer.setClearColor( 0x000000, 1 );
	renderer.setSize( width, height);
	renderer.autoClear = false;
	
	document.body.appendChild( renderer.domElement );
	
	//Visuals
	var light = new THREE.SpotLight();
	light.position.set(5,10,-5);
	scene.add(light);
	
	loadingManager = new THREE.LoadingManager();
	loadingManager.onLoad = function() {
	RESOURCES_LOADED = true;
    };
	
	loader = new THREE.JSONLoader(loadingManager);
	loader.load(
		'../assets/goldorak.json',
		function (geometry, material){
			var material = new THREE.MeshNormalMaterial();
			model = new THREE.Mesh(geometry, material);
			model.scale.set(1.75, 1.75, 1.75);
			model.position.set(0, -3, 0);
			scene.add(model);
		});
}	

var onKeyDown = function ( event ) {
	switch ( event.keyCode ) {
		case 37:
        turn_left = true; break;
		case 39:
		turn_right = true; break;
		case 70:
		fullScreen(); break;
	}
};

var onKeyUp = function ( event ) {
	switch ( event.keyCode ) {
		case 37:
        turn_left = false; break;
		case 39:
		turn_right = false; break;
		case 70:
		resizeRenderer(); break;
	}
};

function resizeRenderer(){
		height = window.innerHeight;
		canvas.height = height;
		canvas.width  = height;
		renderer.setSize(height, height);
}

function fullScreen(){
	if (screenfull.isEnabled) {
		screenfull.request();
	}	
}

window.addEventListener( 'resize', onWindowResize, false );
document.addEventListener('keydown', onKeyDown, false);
document.addEventListener('keyup', onKeyUp, false);

function onWindowResize(){
	renderer.setSize(height, height);

	frontCamera.aspect = window.innerHeight / window.innerHeight;
    frontCamera.updateProjectionMatrix();

	height = window.innerHeight;
	width  = window.innerHeight;
	canvas.width = height;
	canvas.height = height;
}

function render() {
	requestAnimationFrame( render );
	renderer.setViewport( 0, 0, width, width );
	renderer.clear();
	
	if (RESOURCES_LOADED){
		if(turn_left){
			model.rotation.y += .02;
		}
		if(turn_right){
			model.rotation.y -= .02;
		}
		 	model.rotation.y += 0.0125;
	}
	
	var point33 = 1/3;
	var deuxTiers = 2/3;
	
	//front view
	renderer.setViewport( point33 * height + 1, deuxTiers * height + 1, point33 * height - 2, point33 * height - 2 );
	renderer.render( scene, frontCamera );
	
	//back view
	renderer.setViewport( point33 * height + 1, 1, point33 * height - 2, point33 * height - 2 );
	renderer.render( scene, backCamera );
	
	//left view
	renderer.setViewport( 1, point33 * height + 1,   point33 * height -2 , point33 * height -2);
	renderer.render( scene, leftCamera );
		
	//right view
	renderer.setViewport( deuxTiers * height + 1, point33 * height + 1, point33 * height - 2, point33 * height - 2 );
	renderer.render( scene, rightCamera );
}