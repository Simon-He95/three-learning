<script setup lang="ts">
// import { sThree } from "simon-js-tool";
import { sThree } from "../../../src/sThree";
import * as CANNON from "cannon-es";
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
  scene,
  dom,
  renderer,
} = sThree("#gltf", {
  createMesh() {
    // floor
    const floor = c(
      "m",
      c("pg", 10, 10),
      c("msm", {
        color: "#444444",
        metalness: 0,
        roughness: 0.5,
      })
    );
    floor.receiveShadow = true;
    floor.rotation.x = -Math.PI / 2;
    // light
    createLight();
    // dracoLoader
    // const dracoLoader = draCOLoader("/public/Duck/glTF-Draco/");
    //gltfLoader
    // console.log(dracoLoader);
    glTFLoader("/public/Fox/glTF/Fox.gltf").then((gltf) => {
      mixer = c("am", gltf.scene);
      mixer.clipAction(gltf.animations[0]).play();
      mixer.clipAction(gltf.animations[2]).play();
      gltf.scene.scale.set(0.025, 0.025, 0.025);
      scene.add(gltf.scene);
    });

    scene.add(floor);
  },
  createCamera() {
    const camera = c("PC");
    camera.position.set(-3, 3, 10);
    return camera;
  },
  middleware({ camera, OrbitControls }) {
    const controls = new OrbitControls(camera, dom);
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

function createLight() {
  const ambientLight = c("al", 0xffffff, 0.7);
  const directionalLight = c("dl", 0xffffff, 0.2);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.set(1024, 1024);
  directionalLight.shadow.camera.far = 15;
  directionalLight.shadow.camera.left = -7;
  directionalLight.shadow.camera.top = 7;
  directionalLight.shadow.camera.right = 7;
  directionalLight.shadow.camera.bottom = -7;
  directionalLight.position.set(5, 5, 5);
  scene.add(ambientLight, directionalLight);
}
</script>

<template>
  <div id="gltf" h-full></div>
</template>
