<script setup lang="ts">
import { addEventListener } from 'simon-js-tool'
import { SThree } from '../../src'
onMounted(() => {
  const cursor = {
    x: 0,
    y: 0,
  }
  SThree('#main', {
    createMesh(c, animationArray, track) {
      const geometry = c('bg', 1, 1, 1)
      const parameters = {
        color: 0xFFFFFF,
        spin() {
          console.log('spin')
        },
      }
      const material = c('mbm', parameters)
      const mesh = c('m', geometry, material)
      track(mesh.position, 'y').min(-3).max(3).step(0.01).name('myY')
      track(mesh, 'visible')
      track(material, 'wireframe')
      track('color', material, parameters)
      track(parameters, 'spin')
      console.log()
      return [mesh]
    },
    createCamera(c, meshes) {
      const camera = c('PC')
      camera.position.z = 5
      return camera
    },
    middleware({ c, meshes, camera, scene, OrbitControls, dom }) {
      const controls = new OrbitControls(camera, dom)
      controls.enableDamping = true
      return controls
    },
    animate({ c, meshes, camera, elapsedTime, params }) {
      // console.log(params);
      // meshes.forEach((mesh) => {
      //   mesh.rotation.y = time * Math.PI;
      // });
      // meshes[0].rotation.x += 0.01;
      // meshes[0].rotation.y += 0.01;
      params.update()
    },
    debug: true,
  })
})
</script>

<template>
  <main id="main" font-sans p="x-4 y-10" text="center gray-700 dark:gray-200" h-200>
    <Footer />
  </main>
</template>
