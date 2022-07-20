<script setup lang="ts">
// import { sThree } from "simon-js-tool";
import { sThree } from "../../../src/sThree";
import * as CANNON from "cannon-es";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
// import * as sThree from "../../src/sThree.ts";
let oldElapsedTime = 0;
let world;
let mixer;
const {
  c,
  track,
  cf,
  animationArray,
  glTFLoader,
  draCOLoader,
  setUV,
  THREE,
  renderer,
  scene,
  dom,
  setRendererAttributes,
} = sThree("#demo", {
  createMesh() {
    // Update all materials
    const geometry = c("pg", 1, 1, 32, 32);
    const paper = c(
      "m",
      geometry,
      c("rsm", {
        vertexShader,
        fragmentShader,
        uniforms: {
          uFrequency: {
            value: c("v2", 10, 5),
          },
        },
      })
    );
    const count = geometry.attributes.position.count;
    const randoms = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      randoms[i] = Math.random();
    }
    geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));
    scene.add(paper);
    // light
    createLight();
  },
  createCamera() {
    const camera = c("PC");
    camera.position.set(-3, 3, 3);
    return camera;
  },
  middleware({ camera, OrbitControls }) {
    const controls = new OrbitControls(camera, dom);
    setRendererAttributes({
      physicallyCorrectLights: true,
      outputEncoding: THREE.sRGBEncoding,
      toneMapping: THREE.ReinhardToneMapping,
      toneMappingExposure: 3,
      antialias: true,
    });
    track(renderer, "toneMapping", {
      No: THREE.NoToneMapping,
      ACESFilmic: THREE.ACESFilmicToneMapping,
      Reinhard: THREE.ReinhardToneMapping,
      Cineon: THREE.CineonToneMapping,
      Linear: THREE.LinearToneMapping,
    }).onFinishChange(() => (renderer.toneMapping = Number(renderer.toneMapping)));
    return controls;
  },
  animate({ camera, elapsedTime, params, timestamp }) {
    const delta = elapsedTime - oldElapsedTime;
    oldElapsedTime = elapsedTime;
    // mixer update
    mixer?.update(delta);
  },
  shadowType: "PCFSoftShadowMap",
  debug: true,
});

function updateAllMaterials() {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      child.material.envMapIntensity = 5;
      child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
}

function createLight() {
  const directionalLight = c("dl", "#ffffff", 3);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.set(1024, 1024);
  directionalLight.position.set(0.25, 3, -2.25);
  directionalLight.shadow.camera.far = 15;
  scene.add(directionalLight);
  track(directionalLight, "intensity").min(0).max(10).step(0.001).name("intensity");
  track(directionalLight.position, "x").min(-5).max(5).step(0.001).name("lightX");
  track(directionalLight.position, "y").min(-5).max(5).step(0.001).name("lightY");
  track(directionalLight.position, "z").min(-5).max(5).step(0.001).name("lightZ");
}
</script>

<template>
  <div id="demo" h-full></div>
</template>
