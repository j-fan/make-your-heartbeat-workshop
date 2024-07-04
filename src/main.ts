import './style.css';
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders/glTF';

// ------------------------------------------ //
//            Create game engine              //
// ------------------------------------------ //

// Get the canvas DOM element
const canvas = document.getElementById('renderCanvas');

// Create the BABYLON 3D engine and attach to HTML document
const engine = new BABYLON.Engine(canvas as HTMLCanvasElement, true);

// ------------------------------------------ //
//             Define the scene               //
// ------------------------------------------ //

const createScene = function () {
  // Creates a basic Babylon Scene object
  const scene = new BABYLON.Scene(engine);

  // ------------------------------------------ //
  //               Setup Camera                 //
  // ------------------------------------------ //

  // Creates and positions a free camera
  const camera = new BABYLON.FreeCamera(
    'camera1',
    new BABYLON.Vector3(0, 0, 4),
    scene
  );

  // Targets the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero());

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // ------------------------------------------ //
  //               Setup Lighting               //
  // ------------------------------------------ //

  // Use HDR texture from file
  const hdrLighting = BABYLON.CubeTexture.CreateFromPrefilteredData(
    'https://dreamgirl.janefan.xyz/assets3d/peppermint_blue.env',
    scene
  );
  const hdrBackground = BABYLON.CubeTexture.CreateFromPrefilteredData(
    'https://dreamgirl.janefan.xyz/assets3d/peppermint_blue.env',
    scene
  );

  // Set HDRI textures for lighting and background
  scene.createDefaultSkybox(hdrBackground, true, 10000, 0.1);
  scene.environmentTexture = hdrLighting;

  // ------------------------------------------ //
  //             Import 3D Models               //
  // ------------------------------------------ //

  BABYLON.SceneLoader.Append(
    'https://dreamgirl.janefan.xyz/assets3d/demo-heart.glb',
    undefined,
    scene,
    // onSuccess function
    () => {
      // ------------------------------------------ //
      //           Define custom material           //
      // ------------------------------------------ //

      // Create new PBR (physically based rendering) material
      const pbrMaterial = new BABYLON.PBRMetallicRoughnessMaterial(
        'pbr',
        scene
      );
      pbrMaterial.roughness = 0.2;

      // Attach the material to the imported model
      const heartMesh = scene.getMeshByName('Heart');
      if (heartMesh) {
        heartMesh.material = pbrMaterial;
      }
    }
  );

  // ------------------------------------------ //
  //         Add post processing effects        //
  // ------------------------------------------ //

  const pipeline = new BABYLON.DefaultRenderingPipeline(
    'defaultPipeline',
    false,
    scene,
    [camera]
  );

  pipeline.bloomEnabled = true;
  pipeline.bloomThreshold = 0.75;
  pipeline.bloomWeight = 1.5;
  pipeline.bloomKernel = 64;
  pipeline.bloomScale = 0.5;

  pipeline.chromaticAberrationEnabled = true;
  pipeline.chromaticAberration.aberrationAmount = 100;
  pipeline.chromaticAberration.radialIntensity = 0.8;

  return scene;
};

// ------------------------------------------ //
//             Start game engine              //
// ------------------------------------------ //

// Call the createScene function
const scene = createScene();

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
  scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener('resize', function () {
  engine.resize();
});
