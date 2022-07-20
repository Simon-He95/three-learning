<script setup lang="ts">
// import { sThree } from "simon-js-tool";
import * as CANNON from 'cannon-es'
import { sThree } from '../../../src/sThree'
// import * as sThree from "../../src/sThree.ts";

let oldElapsedTime = 0
let world
let mixer
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
} = sThree('#helmet', {
  createMesh() {
    // Update all materials

    const environmentMap = c('ctl', [
      '/public/px.png',
      '/public/nx.png',
      '/public/py.png',
      '/public/ny.png',
      '/public/pz.png',
      '/public/nz.png',
    ])
    scene.background = environmentMap
    scene.environment = environmentMap
    // Models
    glTFLoader('/public/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
      const group = gltf.scene
      group.scale.set(10, 10, 10)
      group.position.set(0, -4, 0)
      scene.add(group)
      track(group.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.001).name('rotation')
    })
    // light
    createLight()
  },
  createCamera() {
    const camera = c('PC')
    camera.position.set(-3, 3, 12)
    return camera
  },
  middleware({ camera, OrbitControls }) {
    const controls = new OrbitControls(camera, dom)
    setRendererAttributes({
      physicallyCorrectLights: true,
      outputEncoding: THREE.sRGBEncoding,
      toneMapping: THREE.ReinhardToneMapping,
      toneMappingExposure: 3,
      antialias: true,
    })
    track(renderer, 'toneMapping', {
      No: THREE.NoToneMapping,
      ACESFilmic: THREE.ACESFilmicToneMapping,
      Reinhard: THREE.ReinhardToneMapping,
      Cineon: THREE.CineonToneMapping,
      Linear: THREE.LinearToneMapping,
    }).onFinishChange(() => (renderer.toneMapping = Number(renderer.toneMapping)))
    return controls
  },
  animate({ camera, elapsedTime, params, timestamp }) {
    const delta = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime
    // mixer update
    mixer?.update(delta)
    updateAllMaterials()
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

function createLight() {
  const directionalLight = c('dl', '#ffffff', 3)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.set(1024, 1024)
  directionalLight.position.set(0.25, 3, -2.25)
  directionalLight.shadow.camera.far = 15
  scene.add(directionalLight)
  track(directionalLight, 'intensity').min(0).max(10).step(0.001).name('intensity')
  track(directionalLight.position, 'x').min(-5).max(5).step(0.001).name('lightX')
  track(directionalLight.position, 'y').min(-5).max(5).step(0.001).name('lightY')
  track(directionalLight.position, 'z').min(-5).max(5).step(0.001).name('lightZ')
}
</script>

<template>
  <div id="helmet" h-full />
</template>
