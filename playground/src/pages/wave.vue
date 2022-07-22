<script setup lang="ts">
// import { sThree } from "simon-js-tool";
import * as CANNON from 'cannon-es'
import { sThree } from '../../../src/sThree'
import vertexShader from './vertex2.glsl'
import fragmentShader from './fragment2.glsl'
// import * as sThree from "../../src/sThree.ts";
let oldElapsedTime = 0
let world
let mixer
let waterMaterial
const debugObject = {}
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
} = sThree('#wave', {
  createMesh() {
    // Update all materials
    const waterGeometry = c('pg', 10, 10, 512, 512)
    debugObject.depthColor = '#914321'
    debugObject.surfaceColor = '#fcfffd'
    waterMaterial = c('sm', {
      vertexShader,
      fragmentShader,
      uniforms: {
        uBigWavesElevation: { value: 0.2 },
        uBigWavesFrequency: { value: c('v2', 2.5, 1.5) },
        uTime: { value: 0 },
        uBigWavesSpeed: { value: 2.0 },
        uDepthColor: { value: c('c', debugObject.depthColor) },
        uSurfaceColor: { value: c('c', debugObject.surfaceColor) },
        uColorOffset: { value: 0.08 },
        uColorMultiple: { value: 5 },
        uSmallWavesElevation: { value: 0.04 },
        uSmallWavesFrequency: { value: 5 },
        uSmallWavesSpeed: { value: 0.2 },
        uSmallWavesIterations: { value: 4.0 },
      },
    })
    track(waterMaterial.uniforms.uBigWavesElevation, 'value')
      .min(0)
      .max(10)
      .step(0.001)
      .name('uBigWavesElevation')
    track(waterMaterial.uniforms.uBigWavesFrequency.value, 'x')
      .min(0)
      .max(10)
      .step(0.001)
      .name('uBigWavesFrequencyX')
    track(waterMaterial.uniforms.uBigWavesFrequency.value, 'y')
      .min(0)
      .max(10)
      .step(0.001)
      .name('uBigWavesFrequencyY')
    track(waterMaterial.uniforms.uBigWavesSpeed, 'value')
      .min(0)
      .max(10)
      .step(0.001)
      .name('uBigWavesSpeed')
    track('color', debugObject, 'depthColor')
      .name('depthColor')
      .onChange(() => {
        waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor)
      })
    track('color', debugObject, 'surfaceColor')
      .name('surfaceColor')
      .onChange(() => {
        waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)
      })
    track(waterMaterial.uniforms.uColorOffset, 'value')
      .min(0)
      .max(1)
      .step(0.001)
      .name('uColorOffset')
    track(waterMaterial.uniforms.uColorMultiple, 'value')
      .min(0)
      .max(10)
      .step(0.001)
      .name('uColorMultiple')
    track(waterMaterial.uniforms.uSmallWavesIterations, 'value')
      .min(0)
      .max(10)
      .step(0.001)
      .name('uSmallWavesIterations')
    track(waterMaterial.uniforms.uSmallWavesSpeed, 'value')
      .min(0)
      .max(1)
      .step(0.001)
      .name('uSmallWavesSpeed')
    track(waterMaterial.uniforms.uSmallWavesFrequency, 'value')
      .min(0)
      .max(10)
      .step(0.001)
      .name('uSmallWavesFrequency')
    track(waterMaterial.uniforms.uSmallWavesElevation, 'value')
      .min(0)
      .max(1)
      .step(0.001)
      .name('uSmallWavesElevation')
    const water = c('m', waterGeometry, waterMaterial)
    water.rotation.x = -Math.PI / 2
    scene.add(water)
  },
  createCamera() {
    const camera = c('PC')
    camera.position.set(-3, 3, 0)
    return camera
  },
  middleware({ camera, OrbitControls }) {
    const controls = new OrbitControls(camera, dom)
    return controls
  },
  animate({ camera, elapsedTime, params, timestamp }) {
    const delta = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime
    waterMaterial.uniforms.uTime.value = elapsedTime
  },
  shadowType: 'PCFSoftShadowMap',
  debug: true,
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
  <div id="wave" h-full />
</template>
