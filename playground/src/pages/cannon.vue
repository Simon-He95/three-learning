<script setup lang="ts">
// import { sThree } from "simon-js-tool";
import { sThree } from "../../../src/sThree";
import * as CANNON from "cannon-es";
// import * as sThree from "../../src/sThree.ts";

let oldElapsedTime = 0;
let world;

const hitSound = new Audio("/public/hit.mp3");
const playHitSound = (collision) => {
  // if (collision.contact.getImpactVelocityAlongNormal() > 3) {
  //   hitSound.volume = Math.random();
  //   hitSound.currentTime = 0;
  //   hitSound.play();
  // }
};

const debugObject = {
  createSphere() {
    const radius = (Math.random() - 0.5) * 10;
    createSphere(0.5 * Math.random(), {
      x: radius,
      y: 3,
      z: radius,
    });
  },
  createBox() {
    const size = Math.random();
    const radius = (Math.random() - 0.5) * 3;
    createBox(size, size, size, {
      x: radius,
      y: 3,
      z: radius,
    });
  },
  reset() {
    animationArray.forEach((item) => {
      //remove body
      item.body.removeEventListener("collide", playHitSound);
      world.removeBody(item.body);
      // remove mesh
      scene.remove(item.mesh);
    });
  },
};

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
} = sThree("#cannon", {
  createMesh() {
    // World
    world = createWorld();
    // Material
    createMaterial();
    // floorBody
    createFloorbody();
    // sphere
    createSphere(0.5, {
      x: 0,
      y: 3,
      z: 0,
    });
    // floor
    createFloor();
    // light
    createLight();
    // debug

    track(debugObject, "createSphere");
    track(debugObject, "createBox");
    track(debugObject, "reset");
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
    animationArray.forEach((item) => {
      item.mesh.position.copy(item.body.position);
      item.mesh.quaternion.copy(item.body.quaternion);
    });
    world.step(1 / 60, delta, 3);
    debugObject.createSphere();
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
function createFloor() {
  const floor = c(
    "m",
    c("pg", 10, 10),
    c("msm", {
      color: "#777777",
      metalness: 0.3,
      roughness: 0.4,
    })
  );
  floor.receiveShadow = true;
  floor.rotation.x = -Math.PI * 0.5;
  scene.add(floor);
  return floor;
}

function createFloorbody() {
  const floorShape = new CANNON.Plane();
  const floorBody = new CANNON.Body();
  floorBody.mass = 0;
  floorBody.addShape(floorShape);
  floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI / 2);
  world.addBody(floorBody);
  return floorBody;
}

function createMaterial() {
  const defaultMaterial = new CANNON.Material("default");
  const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
      friction: 0.1,
      restitution: 0.7,
    }
  );
  world.addContactMaterial(defaultContactMaterial);
  world.defaultContactMaterial = defaultContactMaterial;
}
function createWorld() {
  const world = new CANNON.World();
  // performance
  world.broadphase = new CANNON.SAPBroadphase(world);
  world.allowSleep = true;
  world.gravity.set(0, -9.82, 0);
  return world;
}
const boxGeometry = c("bg", 1, 1, 1);
const boxMaterial = c("msm", {
  metalness: 0.3,
  roughness: 0.4,
});

const texture = c("tl", "/public/1.png");

const sphereGeometry = c("sg", 1, 20, 20);
const sphereMaterial = c("msm", {
  metalness: 0.1,
  roughness: 0.1,
  map: texture,
});
function createSphere(radius, position) {
  const mesh = c("m", sphereGeometry, sphereMaterial);
  mesh.scale.set(radius, radius, radius);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  const shape = new CANNON.Sphere(radius);
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape,
  });
  body.addEventListener("collide", playHitSound);

  body.position.copy(position);
  world.addBody(body);
  animationArray.push({
    mesh,
    body,
  });
}

function createBox(width, height, depth, position) {
  const mesh = c("m", boxGeometry, boxMaterial);
  mesh.scale.set(width, height, depth);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  // body
  const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5));
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape,
  });
  body.position.copy(position);
  body.addEventListener("collide", playHitSound);
  world.addBody(body);
  animationArray.push({
    mesh,
    body,
  });
}
</script>

<template>
  <div id="cannon" h-full></div>
</template>

<style scoped></style>
