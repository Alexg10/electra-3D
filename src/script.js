import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

THREE.ColorManagement.enabled = false;

/**
 * Debug
 */

const parameters = {
  materialColor: "#ffeded",
};

const objectsDistance = 2;

/**
 * !Models
 */
const gltfLoader = new GLTFLoader();
let model;
gltfLoader.load("/models/PowerBox/PowerBox.gltf", (gltf) => {
  model = gltf.scene;
  model.scale.set(6, 6, 6);
  model.rotation.set(0, Math.PI, 0);
  model.position.set(0, -3, 0);
  scene.add(model);
});

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
cameraGroup.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * !Scroll
 */

let scrollY = window.scrollY;
window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
});

/**
 * Cursor
 */
const cursor = {};
cursor.x = 0;
cursor.y = 0;

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = event.clientY / sizes.height - 0.5;
});

/**
 * Animate
 */

gsap.registerPlugin(ScrollTrigger);

const sections = document.querySelectorAll(".charging");

setTimeout(() => {
  if (model != null) {
    gsap.to(model.rotation, {
      y: Math.PI * 2,
      scrollTrigger: {
        trigger: sections[0],
        start: "top top",
        end: "bottom bottom",
        scrub: 2,
      },
    });
    gsap.to(model.scale, {
      x: 4,
      y: 4,
      z: 4,
      scrollTrigger: {
        trigger: sections[0],
        start: "top top",
        end: "bottom bottom",
        scrub: 2,
      },
    });
    gsap.to(model.position, {
      y: 0,
      scrollTrigger: {
        trigger: sections[0],
        start: "top top",
        end: "bottom bottom",
        scrub: 2,
      },
    });
    ScrollTrigger.create({
      trigger: "main",
      start: "top top",
      end: "bottom bottom",
      pin: ".webgl",
    });
  }
}, 1000);

const clock = new THREE.Clock();
let previousTime = 0;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;
  const parallaxX = cursor.x * 0.2;
  const parallaxY = -cursor.y * 0.2;

  cameraGroup.position.x +=
    (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
  cameraGroup.position.y +=
    (parallaxY - cameraGroup.position.y) * 5 * deltaTime;
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
