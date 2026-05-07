/* eslint-disable no-unused-vars */
'use strict';
/* global THREE, $ */

const TEST_MODE = false;

const LOADER = document.getElementById('canvas-loader');

export let floor;
let floorMaterial;

export let scene;
export let sceneWatarmark;
export let renderer;
export let canvas;
export let camera;
export let controls;
export let envMap;

export const IMPORTED_MODELS = [];
const IMPORTED_MODELS_GLTF = [];
export let isModelsLoaded = false;

import { TONE_MAPPING_EXPOSURE, LIGHT_SCHEME, HUMAN_HEIGHT } from './settings.js';
import { 
  updateAnnotations,
  current3Dmodel,
  isLocalClippingOn,
  notClippingMaterials,
 } from './3d-configurator.js';

let externalProperties;

const scenePropertiesDefault = {
  BACKGROUND_COLOR: 0xffffff,
  MODEL_PATHS: ['./src/models/empty_scene.glb'],
  ENVIRONMENT_MAP: '',
  ENVIRONMENT_MAP_INTENSITY: 0.8,
  SHADOW_TRANSPARENCY: 0.0,
  MODEL_CENTER_POSITION: 0,
};

let startPosition = new THREE.Vector3(3.757, 1.801, 9.629);

let dirLight;
let dirLightIntencity;

let clippingPlaneCam;
let clippingPlaneTop;

export function Get3DScene() {
  return scene;
}

// Probes whether a WebGL context can be created. Returns false on any
// error path — missing constructor, getContext throwing, hardware
// acceleration disabled, GPU process sandboxed without access. Used by
// Start() to bail with a friendly message before THREE.WebGLRenderer
// throws an uncaught exception that would leave the page on the loader.
export function isWebGLAvailable() {
  try {
    const probe = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (probe.getContext('webgl') || probe.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

// Reads the user agent to pick the right "fix it" instructions. Order
// matters — Edge and Opera UAs both contain "Chrome/", so they must be
// checked first. Falls back to "unknown" for anything we don't recognize.
function detectBrowser() {
  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/i.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  if (/Edg(e|A|iOS)?\//i.test(ua)) return { id: 'edge', name: 'Microsoft Edge' };
  if (/OPR\//i.test(ua) || /Opera\//i.test(ua)) return { id: 'opera', name: 'Opera' };
  if (/SamsungBrowser\//i.test(ua)) return { id: 'samsung', name: 'Samsung Internet' };
  if (/Firefox\//i.test(ua) || /FxiOS\//i.test(ua)) return { id: 'firefox', name: 'Firefox' };
  if (/CriOS\//i.test(ua) || /Chrome\//i.test(ua)) return { id: 'chrome', name: 'Google Chrome' };
  if (/Safari\//i.test(ua)) return { id: 'safari', name: 'Safari', isIOS };
  return { id: 'unknown', name: 'your browser' };
}

const FIX_INSTRUCTIONS = {
  edge: `
    <ol style="margin:0;padding-left:1.25rem;line-height:1.7;">
      <li>Open a new tab and go to <code style="background:#f4f4f4;padding:0.1em 0.4em;border-radius:3px;">edge://settings/system</code></li>
      <li>Turn on &ldquo;Use graphics acceleration when available&rdquo;</li>
      <li>Quit Edge completely (close all windows) and reopen it</li>
    </ol>
    <p style="margin:1rem 0 0;color:#888;font-size:0.85rem;">If that setting was already on, the GPU process may just need a restart &mdash; quitting and reopening Edge usually fixes it.</p>
  `,
  chrome: `
    <ol style="margin:0;padding-left:1.25rem;line-height:1.7;">
      <li>Open a new tab and go to <code style="background:#f4f4f4;padding:0.1em 0.4em;border-radius:3px;">chrome://settings/system</code></li>
      <li>Turn on &ldquo;Use hardware acceleration when available&rdquo;</li>
      <li>Quit Chrome completely and reopen it</li>
    </ol>
  `,
  opera: `
    <ol style="margin:0;padding-left:1.25rem;line-height:1.7;">
      <li>Open a new tab and go to <code style="background:#f4f4f4;padding:0.1em 0.4em;border-radius:3px;">opera://settings/system</code></li>
      <li>Turn on &ldquo;Use hardware acceleration when available&rdquo;</li>
      <li>Quit Opera completely and reopen it</li>
    </ol>
  `,
  firefox: `
    <ol style="margin:0;padding-left:1.25rem;line-height:1.7;">
      <li>Open Firefox Settings (or go to <code style="background:#f4f4f4;padding:0.1em 0.4em;border-radius:3px;">about:preferences</code>)</li>
      <li>Scroll to <strong>Performance</strong></li>
      <li>Uncheck &ldquo;Use recommended performance settings&rdquo;</li>
      <li>Check &ldquo;Use hardware acceleration when available&rdquo;</li>
      <li>Quit Firefox and reopen it</li>
    </ol>
  `,
  safari: `
    <ol style="margin:0;padding-left:1.25rem;line-height:1.7;">
      <li>In the Safari menu bar, click <strong>Develop</strong> &rarr; <strong>Enable WebGL</strong></li>
      <li>If you don&rsquo;t see the Develop menu, open Safari Settings &rarr; <strong>Advanced</strong> and check &ldquo;Show Develop menu in menu bar&rdquo;</li>
      <li>Reload this page</li>
    </ol>
  `,
  safariIOS: `
    <p style="margin:0;line-height:1.6;">
      WebGL is normally always on in Safari for iOS &mdash; this is unusual. Try:
    </p>
    <ol style="margin:0.75rem 0 0;padding-left:1.25rem;line-height:1.7;">
      <li>Force-quit Safari (swipe up from the Home bar, swipe Safari away) and reopen it</li>
      <li>Restart your device if that doesn&rsquo;t help</li>
      <li>If it still fails, open this page in Chrome from the App Store</li>
    </ol>
  `,
  samsung: `
    <ol style="margin:0;padding-left:1.25rem;line-height:1.7;">
      <li>Open Samsung Internet menu &rarr; Settings &rarr; <strong>Useful features</strong></li>
      <li>Make sure &ldquo;Hardware acceleration&rdquo; is on</li>
      <li>Force-quit Samsung Internet from your recent apps and reopen it</li>
    </ol>
  `,
  unknown: `
    <p style="margin:0;line-height:1.6;">
      Look in your browser&rsquo;s settings for &ldquo;hardware acceleration,&rdquo; &ldquo;GPU acceleration,&rdquo; or &ldquo;graphics acceleration&rdquo; and turn it on, then quit and reopen the browser.
    </p>
    <p style="margin:0.75rem 0 0;color:#888;font-size:0.9rem;">
      Or open this page in a recent version of Chrome, Edge, Safari, or Firefox.
    </p>
  `,
};

// Replaces the boot loader with an actionable, browser-specific
// "WebGL required" message. Inline-styled so it works even if site CSS
// hasn't loaded.
export function showWebGLFallback() {
  const loader = document.getElementById('js-loader');
  if (loader) loader.classList.add('invisible');

  if (document.getElementById('webgl-fallback')) return;
  const browser = detectBrowser();
  const fixKey = browser.id === 'safari' && browser.isIOS ? 'safariIOS' : browser.id;
  const fix = FIX_INSTRUCTIONS[fixKey] || FIX_INSTRUCTIONS.unknown;

  const overlay = document.createElement('div');
  overlay.id = 'webgl-fallback';
  overlay.style.cssText = [
    'position:fixed', 'inset:0',
    'display:flex', 'align-items:center', 'justify-content:center',
    'background:#fff', 'z-index:99999', 'padding:2rem',
    'color:#222',
    'font-family:Inter,-apple-system,BlinkMacSystemFont,system-ui,sans-serif',
  ].join(';');
  overlay.innerHTML = `
    <div style="max-width:560px;">
      <h1 style="font-size:1.5rem;margin:0 0 1rem;font-weight:600;">3D rendering isn&rsquo;t available</h1>
      <p style="margin:0 0 1.25rem;line-height:1.55;">
        The Zomes Designer needs WebGL graphics support, which is currently disabled in <strong>${browser.name}</strong>.
      </p>
      <div style="background:#fafafa;border:1px solid #eee;border-radius:8px;padding:1.25rem;font-size:0.95rem;">
        ${fix}
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

export function create3DScene(properties = scenePropertiesDefault, startFunction) {
  if (!properties) {
    properties = scenePropertiesDefault;
  }

  const {
    MODEL_PATHS,
    ENVIRONMENT_MAP,
    SHADOW_TRANSPARENCY,
    ENVIRONMENT_MAP_INTENSITY,
    MODEL_CENTER_POSITION,
  } = properties;

  externalProperties = properties;

  // ********************************************
  //      Init SCENE, canvas, RENDERER
  // ********************************************
  scene = new THREE.Scene();
  scene.background = null;
  canvas = document.getElementById('ar_model_view');

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true, alpha: true });
  renderer.shadowMap.enabled = true;
  renderer.shadowMapSoft = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;
  renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = TONE_MAPPING_EXPOSURE;

  
  // ********************************************
  //      Clipping Planes
  // ********************************************
  
  renderer.localClippingEnabled = true;
  clippingPlaneCam = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  // renderer.clippingPlanes = [clippingPlaneCam];

  // clippingPlaneTop = new THREE.Plane(new THREE.Vector3(0, -1, -1), 1.8);
  // renderer.clippingPlanes = [clippingPlaneTop];
  
  function updateClippingPlane() {
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    clippingPlaneCam.normal.copy(cameraDirection);
    
    const clippingDistance = 4.75;
    clippingPlaneCam.constant = -camera.position.dot(cameraDirection) - clippingDistance;
  }

  // ********************************************
  //      Init CAMERA
  // ********************************************

  camera = new THREE.PerspectiveCamera(50, window.innerWidth /
    window.innerHeight, 0.1, 1000);

  if (ENVIRONMENT_MAP != '') {
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const rgbeLoader = new THREE.RGBELoader();
    rgbeLoader.load(ENVIRONMENT_MAP, function (texture) {
      envMap = pmremGenerator.fromEquirectangular(texture).texture;
      scene.environment = envMap;
      texture.dispose();
      pmremGenerator.dispose();
    });
  }

  // ********************************************
  //              IMPORT MODELS
  // ********************************************
  async function importAllModels(array, callback) {
    const loader = new THREE.GLTFLoader();

    for (const element of array) {
      const model = await loader.loadAsync(element);
      IMPORTED_MODELS_GLTF.push(model);
      onLoadModel(model);
    }

    if (callback != null) {
      callback();
    }
  }

  function onLoadModel(gltf) {
    const model = gltf.scene;
    model.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        if (o.material.map) {
          o.material.map.anisotropy = 16;
          o.material.map.needsUpdate = true;
          o.material.needsUpdate = true;
        }

        if (ENVIRONMENT_MAP != '') {
          if (!o.material.envMap) {
            o.material.envMap = scene.environment;
            o.material.envMapIntensity = ENVIRONMENT_MAP_INTENSITY;
          }
        }
      }
    });

    const scale = 1;
    model.scale.set(scale, scale, scale);
    model.position.y = MODEL_CENTER_POSITION;
    IMPORTED_MODELS.push(model);
  }

  // eslint-disable-next-line no-unused-vars
  function onImportModelSuccessful() {
    for (let i = 0; i < IMPORTED_MODELS.length; i++) {
      IMPORTED_MODELS[i].visible = false;
      scene.add(IMPORTED_MODELS[i]);
    }
    // LOADER.classList.add('invisible');
    // $('.summary.entry-summary').removeClass('hidden');
    isModelsLoaded = true;

    startFunction();
  }

  // importAllModels(MODEL_PATHS, onImportModelSuccessful); //! loading all models at once
  startFunction(); //! the models will be loaded on demand (in 3d-conficurator.js by loadModel function in the StartSettings())

  // ********************************************
  //                   LIGHTS
  // ********************************************
  if (ENVIRONMENT_MAP == '') {
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000, 1.6);
    hemiLight.position.set(0, 0, 0);
    scene.add(hemiLight);
  }
  const cameraSize = (LIGHT_SCHEME === 0) ? 18 : 10;
  dirLightIntencity = (LIGHT_SCHEME === 0) ? 6 : 0.6;
  const dirPosY = (LIGHT_SCHEME === 0) ? 8 : 2;

  dirLight = new THREE.DirectionalLight(0xffffff, dirLightIntencity);
  dirLight.position.set(0, dirPosY, 0.000001);
  dirLight.castShadow = true;
  dirLight.shadow.bias = -0.0005;
  dirLight.shadow.radius = 10;
  dirLight.shadow.camera.left = -cameraSize;
  dirLight.shadow.camera.right = cameraSize;
  dirLight.shadow.camera.top = cameraSize;
  dirLight.shadow.camera.bottom = -cameraSize;
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = (LIGHT_SCHEME === 0) ? 50 : 100;

  if (LIGHT_SCHEME !== 0) {
    const planeGeometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    const planeMaterial = new THREE.MeshBasicMaterial({
      transparent: true, opacity: 0,
    });

    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMesh.rotation.x = -Math.PI / 2;
    planeMesh.position.set(0, 20, 0);
    scene.add(planeMesh);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.7); // 1.5
    dirLight2.position.set(0, 4, 0);
    dirLight2.castShadow = true;
    dirLight2.shadow.bias = -0.0005;
    dirLight2.shadow.radius = 10;
    dirLight2.shadow.camera.left = -cameraSize;
    dirLight2.shadow.camera.right = cameraSize;
    dirLight2.shadow.camera.top = cameraSize;
    dirLight2.shadow.camera.bottom = -cameraSize;
    dirLight2.shadow.camera.near = 0.5;
    dirLight2.shadow.camera.far = 1000;

    dirLight2.target = planeMesh;
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xffffff, 0.4, 0);
    pointLight.position.set(0, 2.2, 0);
    scene.add(pointLight);
  }

  switch (getMobileOperatingSystem()) {
    case 'Android':
      dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
      dirLight.shadow.radius = (LIGHT_SCHEME === 0) ? 5 : 15;
      dirLight.shadow.blurSamples = 10;
      break;
    case 'iOS':
      dirLight.shadow.mapSize = new THREE.Vector2(2048, 2048);
      dirLight.shadow.radius = (LIGHT_SCHEME === 0) ? 5 : 40;
      dirLight.shadow.blurSamples = 30;
      break;
    case 'Windows':
      dirLight.shadow.mapSize = new THREE.Vector2(2048, 2048);
      dirLight.shadow.radius = (LIGHT_SCHEME === 0) ? 5 : 40;
      dirLight.shadow.blurSamples = 30;
      break;
    case 'Macintosh':
      dirLight.shadow.mapSize = new THREE.Vector2(2048, 2048);
      dirLight.shadow.radius = (LIGHT_SCHEME === 0) ? 5 : 40;
      dirLight.shadow.blurSamples = 50;
      break;
    default:
      dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
      dirLight.shadow.radius = (LIGHT_SCHEME === 0) ? 15 : 15;
      dirLight.shadow.blurSamples = 10;
      break;

      
  }

  scene.add(dirLight);

  // **** HELPERS *******

  if (TEST_MODE) {
    const helperDir = new THREE.DirectionalLightHelper(dirLight, 2, 0xff0000);
    scene.add(helperDir);
  }

  if (TEST_MODE) {
    const axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper);
  }

  // ********************************************
  //                  FLOOR
  // ********************************************
  const floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
  floorMaterial = new THREE.ShadowMaterial();
  floorMaterial.opacity = SHADOW_TRANSPARENCY;

  floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -0.5 * Math.PI;
  floor.receiveShadow = true;
  floor.position.y = MODEL_CENTER_POSITION;
  
  scene.add(floor);

  // ********************************************
  //                 CONTROLS
  // ********************************************
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = Math.PI / 1.85; // 2.29
  controls.minAzimuthAngle = -Infinity;
  controls.maxAzimuthAngle = Infinity;
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.dampingFactor = 0.1;
  controls.autoRotateSpeed = -0.5;
  controls.maxDistance = 15;
  controls.minDistance = 4;
  controls.autoRotate = false;
  controls.enableZoom = true;

  (startPosition) && camera.position.copy(startPosition);
  controls.target.set(0, HUMAN_HEIGHT, 0);

  if (TEST_MODE) {
    controls.enablePan = true;
    controls.minDistance = 0.01;
  }

  controls.addEventListener('end', () => {
    controls.autoRotate = false;

    if (TEST_MODE) {
      consoleLogPosition('camera', camera.position, 3);
      consoleLogPosition('target', controls.target, 3);
    }
  });

  // ********************************************
  //      ANIMATE
  // ********************************************
  function animate() {
    requestAnimationFrame(animate);

    isLocalClippingOn && updateClippingPlane();
    isLocalClippingOn && applyClippingPlanesToModel(current3Dmodel, notClippingMaterials);
    // !isLocalClippingOn && removeClippingPlanesFromModel(current3Dmodel, notClippingMaterials);

    if (controls.enabled) { controls.update(); }
    
    updateAnnotations(camera, scene, controls);

    updateMeshRotationToCameraY(camera, scene, 'man');
    
    renderer.render(scene, camera);

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
  }

  window.addEventListener('resize', () => {
    updateAnnotations(camera, scene, controls);
  });

  function resizeRendererToDisplaySize(renderer) {
    const canvasContainer = document.getElementById('ar_model_viewer');
    const rect = canvasContainer.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const needResize = renderer.domElement.width !== width ||
      renderer.domElement.height !== height;

    if (needResize) {
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      controls.update();
    }
    return needResize;
  }

  animate();
}

export async function disposeModel(model) {
  if (model) {
    model.visible = false;

    model.traverse((object) => {
      if (object.isMesh) {
        if (object.geometry) {
          object.geometry.dispose();
        }

        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => {
              if (material.map) {
                material.map.dispose();
              }
              if (material.aoMap) {
                material.aoMap.dispose();
              }
              if (material.normalMap) {
                material.normalMap.dispose();
              }
              if (material.specularMap) {
                material.specularMap.dispose();
              }
              if (material.envMap) {
                material.envMap.dispose();
              }
              material.dispose();
            });
          } else {
            if (object.material.map) {
              object.material.map.dispose();
            }
            if (object.material.aoMap) {
              object.material.aoMap.dispose();
            }
            if (object.material.normalMap) {
              object.material.normalMap.dispose();
            }
            if (object.material.specularMap) {
              object.material.specularMap.dispose();
            }
            if (object.material.envMap) {
              object.material.envMap.dispose();
            }
            object.material.dispose();
          }
        }
      }
    });

    scene.remove(model);
  }
}

export async function loadModel(
  modelPath, 
  isSecondaryModel = true, 
  callback = () => {},
  isLoaderNeeded = false,
  retryCount = 999, retryDelay = 1000) {
  // console.log("🚀 ~ modelPath:", modelPath);
  if (!modelPath) { return; }

  const {
    ENVIRONMENT_MAP,
    ENVIRONMENT_MAP_INTENSITY,
    MODEL_CENTER_POSITION,
  } = externalProperties;

  (isLoaderNeeded) && LOADER.classList.remove('invisible');
  const loader = new THREE.GLTFLoader();

  let model;

  try {
    const gltf = await loader.loadAsync(modelPath);
    model = gltf.scene;
  } catch (error) {
    console.error("🚀 ~ loadModel error:", error);
    if (retryCount > 0) {
      console.log(`Retrying loadModel... Attempts left: ${retryCount}`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      return loadModel(modelPath, isSecondaryModel, callback, isLoaderNeeded, retryCount - 1, retryDelay);
    } else {
      console.error("Failed to load model after multiple attempts:", modelPath);
      LOADER?.classList.add('invisible');
      return;
    }
  }

  model.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
      if (o.material.map) {
        o.material.map.anisotropy = 16;
        o.material.map.needsUpdate = true;
        o.material.needsUpdate = true;
      }

      if (ENVIRONMENT_MAP != '') {
        if (!o.material.envMap) {
          o.material.envMap = scene.environment;
          o.material.envMapIntensity = ENVIRONMENT_MAP_INTENSITY;
        }
      }
    }
  });

  model.scale.set(1, 1, 1);
  model.position.y = MODEL_CENTER_POSITION;

  if (isSecondaryModel) {
    IMPORTED_MODELS.push(model);
  } else {
    IMPORTED_MODELS.splice(0, 1, model);
  }

  callback();
  LOADER?.classList.add('invisible');
}

// ********************************************
//      Additional functions
// ********************************************
export function getMobileOperatingSystem() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  if (/Macintosh/i.test(userAgent)) {
    return 'Macintosh';
  }

  if (/Windows/i.test(userAgent) || /Win/i.test(userAgent)) {
    return 'Windows';
  }

  if (/windows phone/i.test(userAgent)) {
    return 'Windows Phone';
  }

  if (/android/i.test(userAgent)) {
    return 'Android';
  }

  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return 'iOS';
  }

  return 'unknown';
}

function consoleLogPosition(text = '', pos, num = 2) {
  let k = 1;

  for (let i = 0; i < num; i++) {
    k = k * 10;
  }

  const x = Math.round(pos.x * k) / k;
  const y = Math.round(pos.y * k) / k;
  const z = Math.round(pos.z * k) / k;

  console.log('🚀 ' + text + ': [' + x + ', ' + y + ', ' + z + '],');
}

export function isEqualVector(vector1, vector2) {
  const precision = 3;
  console.log('🚀', vector1.x.toFixed(3), vector2.x.toFixed(3));
  console.log('🚀', vector1.y.toFixed(3), vector2.y.toFixed(3));
  console.log('🚀', vector1.z.toFixed(3), vector2.z.toFixed(3));
  return (
    vector1.x.toFixed(precision) === vector2.x.toFixed(precision) &&
    vector1.y.toFixed(precision) === vector2.y.toFixed(precision) &&
    vector1.z.toFixed(precision) === vector2.z.toFixed(precision)
  );
}

// ********************************************
//      Animation functions
// ********************************************

// ANIMATION OF MODEL - "SCALE" - appearing or disappearing
export function animateScale(
  model,
  duration = 500,
  userCallback = () => {},
  startScale = 0,
  endScale = 1,
  timingKeyword = 'ease-in',
  // callback = () => springScale(model)
  callback = () => {}
) {
  if (!model) { return; }
  
  function timingFunction(progress) {
    switch (timingKeyword) {
      case 'ease-in':
        return progress * progress;
      case 'ease-out':
        return 1 - Math.pow(1 - progress, 2);
      case 'ease-in-out':
        return progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      default:
        return progress;
    }
  }

  let startTime = null;

  function animate(currentTime) {
    if (!startTime) {
      startTime = currentTime;
    }

    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    const easedProgress = timingFunction(progress);
    const interpolatedScale = startScale + (endScale - startScale) * easedProgress;
    model?.scale.set(interpolatedScale, interpolatedScale, interpolatedScale);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      model.scale.set(endScale, endScale, endScale);
      userCallback();
      callback();
    }
  }

  requestAnimationFrame(animate);
}

// ANIMATION OF MODEL - "SPRING-SCALE"
export function springScale(model, duration = 500, oscillations = 1, callback = () => { }) {
  if (!model) { return; }

  const startTime = performance.now();
  const startScale = model.scale.x;
  const dampingFactor = 0.1; // attenuation coefficient
  const maxAmplitude = 0.2 * startScale; // maximum oscillation amplitude (20%)

  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const angularFrequency = oscillations * Math.PI * 2 / duration;
    const amplitude = maxAmplitude * Math.pow(dampingFactor, elapsed / duration);
    const phase = angularFrequency * elapsed;
    const currentScale = startScale + amplitude * Math.sin(phase);

    model.scale.set(currentScale, currentScale, currentScale);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      model.scale.set(startScale, startScale, startScale);
      callback();
    }
  }

  requestAnimationFrame(animate);
}

export function smoothCameraTransition(
    targetCameraPosition,
    duration,
    targetControlX = 0,
    targetControlY = 0,
    targetControlZ = 0,
    targetControlMinDist,
    targetCameraFOV,
    maxPolarAngle = Math.PI / 1.88,
    callback = () => {},
    callback_env = () => {},
) {
  const correctedTargetPosition = new THREE.Vector3(0, 0, 0);
  const delta = 0;
  const deltaControlsX = targetControlX - controls.target.x;
  const deltaControlsY = targetControlY - controls.target.y;
  const deltaControlsZ = targetControlZ - controls.target.z;
  const deltaControlMinDist = targetControlMinDist - controls.minDistance;
  const deltaCameraFOV = targetCameraFOV - camera.fov;

  correctedTargetPosition.x = targetCameraPosition.x + delta;
  correctedTargetPosition.y = targetCameraPosition.y;
  correctedTargetPosition.z = targetCameraPosition.z - delta;

  const startPosition = camera.position.clone();
  const startControlX = controls.target.x;
  const startControlY = controls.target.y;
  const startControlZ = controls.target.z;
  const startControlMinDist = controls.minDistance;
  const startCameraFOV = camera.fov;
  const startTime = performance.now();

  function animate() {
    const currentTime = performance.now() - startTime;
    const progress = Math.min(currentTime / duration, 1);
    const t = 0.5 - 0.5 * Math.cos(Math.PI * progress);
    const currentPosition = new THREE.Vector3().lerpVectors(
        startPosition, correctedTargetPosition, t,
    );

    const currentControlX = startControlX + deltaControlsX * t;
    const currentControlY = startControlY + deltaControlsY * t;
    const currentControlZ = startControlZ + deltaControlsZ * t;
    const currentControlZoom = startControlMinDist + deltaControlMinDist * t;
    const currentCameraFOV = startCameraFOV + deltaCameraFOV * t;

    camera.position.copy(currentPosition);
    controls.target.x = currentControlX;
    controls.target.y = currentControlY;
    controls.target.z = currentControlZ;
    controls.minDistance = currentControlZoom;
    camera.fov = currentCameraFOV;
    camera.updateProjectionMatrix();

    controls.maxPolarAngle = maxPolarAngle;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      callback();
      if (callback_env) callback_env();
    }
  }

  animate();
}

function updateMeshRotationToCameraY(camera, scene, meshName) {
  const man = scene.getObjectByName(meshName);
  if (man) {
    const cameraPosition = new THREE.Vector3();
    camera.getWorldPosition(cameraPosition);
    const manPosition = new THREE.Vector3();
    man.getWorldPosition(manPosition);
    const direction = cameraPosition.sub(manPosition);
    direction.y = 0;
    direction.normalize();
    const angle = Math.atan2(direction.x, direction.z);
    man.rotation.set(0, angle, 0);
  }
}

function applyClippingPlanesToModel(model, materialExcept = [], clipIntersection = true) {
  if (!model) { return; }
  
  if (!materialExcept) {
    materialExcept = [];
  }

  model.traverse(object => {
    if (object.isMesh) {
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach(material => {
        if (materialExcept.includes(material.name)) return;

        material.clippingPlanes = [clippingPlaneCam];
        material.clipIntersection = clipIntersection;
        material.needsUpdate = true;
      });
    }
  });
}

export function removeClippingPlanesFromModel(model, materialExcept = []) {
  if (!model) { return; }

  if (!materialExcept) {
    materialExcept = [];
  }

  model.traverse(object => {
    if (object.isMesh) {
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach(material => {
        if (materialExcept.includes(material.name)) return;

        material.clippingPlanes = null;
        material.clipIntersection = false;
        material.needsUpdate = true;
      });
    }
  });
}

