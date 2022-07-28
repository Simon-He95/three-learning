<script setup lang="ts">
import { sThree } from '@simon_he/s-three'
import * as CANNON from 'cannon-es'
// import { sThree } from '../../../src/sThree'
import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'
// import * as sThree from "../../src/sThree.ts";
let oldElapsedTime = 0
let world
let mixer
let material
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
} = sThree('#flag', {
  createMesh() {
    // Update all materials
    const flagTexture = c('tl', '/china.png')
    const geometry = c('pg', 1, 1, 32, 32)
    material = c('rsm', {
      vertexShader,
      fragmentShader,
      uniforms: {
        uFrequency: {
          value: c('v2', 10, 5),
        },
        uTime: {
          value: 0,
        },
        uColor: {
          value: c('c', 'orange'),
        },
        uTexture: {
          value: flagTexture,
        },
      },
    })
    const flag = c('m', geometry, material)
    flag.scale.y = 2 / 3
    flag.scale.set(1.5, 1.5, 1.5)
    const count = geometry.attributes.position.count
    const randoms = new Float32Array(count)
    for (let i = 0; i < count; i++) randoms[i] = Math.random()

    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))
    scene.add(flag)
    // light
  },
  createCamera() {
    const camera = c('PC')
    camera.position.set(-3, 3, 3)
    return camera
  },
  middleware({ camera, OrbitControls }) {
    const controls = new OrbitControls(camera, dom)
    return controls
  },
  animate({ camera, elapsedTime, params, timestamp }) {
    const delta = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime
    material.uniforms.uTime.value = elapsedTime
  },
  shadowType: 'PCFSoftShadowMap',
})
function updateAllMaterials() {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh
      && child.material instanceof THREE.MeshStandardMaterial
    ) {
      child.material.envMapIntensity = 5
      child.material.needsUpdate = true
      child.castShadow = true
      child.receiveShadow = true
    }
  })
}
</script>

<template>
  <div id="flag" h-full />
</template>
