<script setup lang="ts">
// import { sThree } from "simon-js-tool";
import fontJson from 'three/examples/fonts/helvetiker_regular.typeface.json'
import { sThree } from '../../src/sThree'
// import * as sThree from "../../src/sThree.ts";
onMounted(() => {
  const cursor = {
    x: 0,
    y: 0,
  }
  console.log(fontJson)
  sThree('#main', {
    createMesh({ c, cf, animationArray, THREE, track, scene }) {
      const texture = c('tl', '../public/door.png')
      const light = c('dl', 0xFFFFFF, 0.5)
      light.position.x = 4
      light.position.y = 4
      light.position.z = 1
      const material = c('mmm', {
        matcap: texture,
      })
      cf('../font/myfont.json', 'Hello World', {
        size: 0.5,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
      }).then((geometry) => {
        geometry.center()
        const text = c('m', geometry, material)
        scene.add(text)
      })
      const donutGeometry = c('torusg', 0.3, 0.2, 20, 45)
      for (let i = 0; i < 100; i++) {
        const donut = c('m', donutGeometry, material)
        donut.position.x = (Math.random() - 0.5) * 10
        donut.position.y = (Math.random() - 0.5) * 10
        donut.position.z = (Math.random() - 0.5) * 10
        donut.rotation.x = Math.random() * Math.PI
        donut.rotation.y = Math.random() * Math.PI
        const scale = Math.random() * 0.9 + 0.1
        donut.scale.set(scale, scale, scale)
        scene.add(donut)
      }
      scene.add(light)
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
