<script setup lang="ts">
import { SThree } from "../../src";
import { addEventListener } from "simon-js-tool";
onMounted(() => {
  const cursor = {
    x: 0,
    y: 0,
  };
  SThree("#main", {
    createMesh(THREE, animationArray) {
      const group = new THREE.Group();
      const cube1 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      );
      group.add(cube1);
      animationArray.push(cube1);
      return [group];
    },
    createCamera(THREE, meshes) {
      const camera = new THREE.PerspectiveCamera();
      camera.position.z = 5;
      return camera;
    },
    middleware(THREE, meshes, scene) {
      // Axes helper
      // const axesHelper = new THREE.AxesHelper();
      // scene.add(axesHelper);
    },
    animate(THREE, meshes, camera, elapsedTime) {
      // meshes.forEach((mesh) => {
      //   mesh.rotation.y = time * Math.PI;
      // });
      console.log(cursor);
      camera.position.x = Math.sin(cursor.x * 10) * 5;
      camera.position.z = Math.cos(cursor.x * 10) * 5;
      console.log(meshes);
      camera.lookAt(meshes[0].position);
      // meshes[0].rotation.x += 0.01;
      // meshes[0].rotation.y += 0.01;
    },
    mousemove(e) {
      cursor.x = e.offsetX / e.target.clientWidth - 0.5;
      cursor.y = -(e.offsetY / e.target.clientHeight - 0.5);
    },
  });
});
</script>

<template>
  <main id="main" font-sans p="x-4 y-10" text="center gray-700 dark:gray-200" w-200 h-200>
    <Footer />
  </main>
</template>
