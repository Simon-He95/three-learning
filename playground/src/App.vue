<script setup lang="ts">
import { addEventListener } from 'simon-js-tool'
import { SThree } from '../../src'
onMounted(() => {
  const cursor = {
    x: 0,
    y: 0,
  }
  SThree('#main', {
    createMesh(c, animationArray) {
      const group = c('G')
      const cube1 = c('Mesh', c('BG', 1, 1, 1), c('MBM', { color: '#ff0000' }))
      group.add(cube1)
      animationArray.push(cube1)
      return [group]
    },
    createCamera(c, meshes) {
      const camera = c('PC')
      camera.position.z = 5
      return camera
    },
    middleware({ c, meshes, camera, scene, OrbitControls, dom }) {
      // Axes helper
      // const axesHelper = new THREE.AxesHelper();
      // scene.add(axesHelper);
      const controls = new OrbitControls(camera, dom)
      controls.enableDamping = true
      return controls
    },
    animate({ THREE, meshes, camera, elapsedTime, params }) {
      // console.log(params);
      // meshes.forEach((mesh) => {
      //   mesh.rotation.y = time * Math.PI;
      // });
      // meshes[0].rotation.x += 0.01;
      // meshes[0].rotation.y += 0.01;
      params.update()
    },
  })
})
</script>

<template>
  <main id="main" font-sans p="x-4 y-10" text="center gray-700 dark:gray-200" h-200>
    <Footer />
  </main>
</template>
