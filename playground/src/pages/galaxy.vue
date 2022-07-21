<script setup lang="ts">
import fontJson from 'three/examples/fonts/helvetiker_regular.typeface.json'
import { sThree } from '../../../src/sThree'
// import * as sThree from "../../src/sThree.ts";
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
} = sThree('#galaxy', {
  createMesh() {
    // Galaxy
    const params = {
      count: 30000,
      size: 0.02,
      radius: 4.5,
      branch: 8,
      spin: 1,
      randomness: 0.35,
      randomnessPower: 3,
      insideColor: '#b77863',
      outsideColor: '#2755e2',
    }
    let geometry
    let material
    let points
    let unmount
    const generateGalaxy = () => {
      if (points) {
        unmount()
        animationArray.shift()
      }
      geometry = c('bufferg')
      const positions = new Float32Array(params.count * 3)
      const colors = new Float32Array(params.count * 3)
      const colorInside = new THREE.Color(params.insideColor)
      const colorOutside = new THREE.Color(params.outsideColor)
      for (let i = 0; i < params.count; i++) {
        const i3 = i * 3
        // Position
        const radius = Math.random() * params.radius
        const spinAngle = radius * params.spin
        const randomX
          = Math.random() ** params.randomnessPower
          * (Math.random() < 0.5 ? -1 : 1)
          * params.randomness
        const randomY
          = Math.random() ** params.randomnessPower
          * (Math.random() < 0.5 ? -1 : 1)
          * params.randomness
        const randomZ
          = Math.random() ** params.randomnessPower
          * (Math.random() < 0.5 ? -1 : 1)
          * params.randomness
        const branchAngle = ((i % params.branch) / params.branch) * Math.PI * 2 + randomX
        positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius
        positions[i3 + 1] = 0 + randomY
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ
        // Color
        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, radius / params.radius)
        colors[i3 + 0] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
      }
      geometry.setAttribute('position', c('ba', positions, 3))
      geometry.setAttribute('color', c('ba', colors, 3))
      // Material
      material = c('pm', {
        size: params.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
      })
      points = c('p', geometry, material)
      unmount = scene._add(points)
      animationArray.push(points)
    }
    track(params, 'count').min(100).max(100000).step(100).onFinishChange(generateGalaxy)
    track(params, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)

    track(params, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
    track(params, 'branch').min(2).max(20).step(1).onFinishChange(generateGalaxy)
    track(params, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy)
    track(params, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
    track(params, 'randomnessPower')
      .min(1)
      .max(10)
      .step(0.001)
      .onFinishChange(generateGalaxy)
    track('color', params, 'insideColor').onFinishChange(generateGalaxy)
    track('color', params, 'outsideColor').onFinishChange(generateGalaxy)
    generateGalaxy()
  },
  createCamera(scene) {
    const camera = c('PC')
    camera.position.z = 1
    camera.position.y = 4
    return camera
  },
  middleware({ camera, OrbitControls }) {
    const controls = new OrbitControls(camera, dom)
  },
  animate({ camera, elapsedTime, params }) {
    animationArray[0].rotation.y = elapsedTime * 0.1
  },
  debug: true,
})
</script>

<template>
  <div id="galaxy" h-full />
</template>
