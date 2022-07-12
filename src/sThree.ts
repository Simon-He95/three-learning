import * as THREE from 'three'
import { Object3D, Mesh, PerspectiveCamera } from 'three'
import { addEventListener, animationFrameWrapper, isStr } from 'simon-js-tool'
type T = typeof THREE

interface SThreeOptions extends Record<string, any> {
  createMesh: (THREE: T, animationArray: Mesh[]) => any[]
  createCamera: (THREE: T, meshes: Mesh[], scene: Object3D) => PerspectiveCamera
  animate: (THREE: T, animationArray: Mesh[], camera: PerspectiveCamera, elapsedTime: number, timestamp: number) => void | THREE.PerspectiveCamera
  middleware: (THREE: T, meshes: Mesh[], scene: Object3D) => void
  mousemove: (e: Event) => void
}
export function SThree(container: HTMLElement | string, options: SThreeOptions) {
  if (isStr(container))
    container = document.querySelector(container as string) as HTMLElement || container
  if (isStr(container))
    throw new Error(`${container} container is not found`)
  const renderer = new THREE.WebGLRenderer()
  const scene = new THREE.Scene() as Object3D
  const animationArray: Mesh[] = []
  const { createCamera, createMesh, animate, mousemove } = options
  const meshes = createMesh?.(THREE, animationArray)
  const camera = createCamera?.(THREE, meshes, scene)
  if (!camera)
    throw new Error('camera is not created')
  meshes.forEach(mesh => scene.add(mesh))
  options.middleware?.(THREE, meshes, scene)
  const clock = new THREE.Clock()
  if (animate)
    animationFrameWrapper((time: number) => renderer.render(scene, animate(THREE, animationArray, camera, clock.getElapsedTime(), time) || camera), 0)
  else
    renderer.render(scene, camera);
  (container as HTMLElement).appendChild(renderer.domElement);

  if (mousemove) {
    addEventListener(renderer.domElement, 'mousemove', mousemove)
  }

  resize()
  addEventListener(window, 'resize', resize)

  function resize() {
    const width = (container as HTMLElement).offsetWidth
    const height = (container as HTMLElement).offsetHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height, false)
    renderer.render(scene, camera)
  }
}

