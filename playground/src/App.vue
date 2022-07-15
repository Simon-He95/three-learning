<script setup lang="ts">
// import { sThree } from "simon-js-tool";
import fontJson from "three/examples/fonts/helvetiker_regular.typeface.json";
import { sThree } from "../../src/sThree";
// import * as sThree from "../../src/sThree.ts";
onMounted(() => {
  const cursor = {
    x: 0,
    y: 0,
  };
  sThree("#main", {
    createMesh({ c, cf, animationArray, THREE, track, scene }) {
      const light = c("al", 0xffffff);
      const floor = c("m", c("planeg", 20, 20), c("msm", { color: "#a9c388" }));
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = 0;
      // Group
      const house = c("g");
      // Walls
      const walls = c("m", c("bg", 4, 2.5, 4), c("msm", { color: "#ac8e82" }));
      walls.position.y = 2.5 / 2;
      house.add(walls);
      // Roof
      const roof = c("m", c("coneg", 3.5, 2, 4), c("msm", { color: "#b35f45" }));
      roof.position.y = 2.5 + 2 / 2;
      roof.rotation.y = Math.PI / 4;
      house.add(roof);
      // Door
      const door = c("m", c("planeg", 2, 2), c("msm", { color: "#aa7b7b" }));
      door.position.y = 2.5 / 2;
      // door.position.x = -3.5 / 2;
      door.position.z = 4 / 2 + 0.01;
      house.add(door);
      // Bushes
      const bushGeometry = c("sg", 1, 16, 16);
      const bushMaterial = c("msm", { color: "#89c854" });
      const bush = c("m", bushGeometry, bushMaterial);
      bush.scale.set(0.5, 0.5, 0.5);
      bush.position.set(1.4, 0.1, 2.1);
      house.add(bush);
      // Graves
      const graves = c("g");
      const graveGeometry = c("bg", 0.6, 0.8, 0.2);
      const graveMaterial = c("msm", { color: "#b2b6b1" });
      for (let i = 0; i < 50; i++) {}

      scene.add(floor, light, house, graves);
    },
    createCamera(c, meshes) {
      const camera = c("PC");
      camera.position.z = 25;
      camera.position.y = 10;
      return camera;
    },
    middleware({ c, meshes, camera, scene, OrbitControls, dom }) {
      const controls = new OrbitControls(camera, dom);
      controls.enableDamping = true;
      return controls;
    },
    animate({ c, animationArray, camera, elapsedTime, params }) {},
    debug: true,
  });
});
</script>

<template>
  <main id="main" font-sans p="x-4 y-10" text="center gray-700 dark:gray-200" h-200>
    <Footer />
  </main>
</template>
