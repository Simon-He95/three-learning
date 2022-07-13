import * as THREE from 'three'
import { OrbitControls as Orbit } from 'three/examples/jsm/controls/OrbitControls'
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import type { Mesh, Object3D, PerspectiveCamera } from 'three'
import { addEventListener, animationFrameWrapper, dragEvent, isStr } from 'simon-js-tool'
import * as dat from 'dat.gui'
type T = typeof THREE

interface AnimateOptions {
  c: (fnName: keyof T, ...args: any[]) => any
  animationArray: Mesh[]
  camera: PerspectiveCamera
  elapsedTime: number
  meshes: Mesh[]
  scene: Object3D
  dom: HTMLCanvasElement
  timestamp: number
}
interface MiddlewareOptions {
  c: (fnName: keyof T, ...args: any[]) => any
  meshes: Mesh[]
  animationArray: Mesh[]
  scene: Object3D
  OrbitControls: OrbitControls
  dom: HTMLCanvasElement
  camera: PerspectiveCamera
}
interface FnNameMap {
  cc: 'CubeCamera'
  v3: 'Vector3'
  oc: 'OrthographicCamera'
  pc: 'PerspectiveCamera'
  sc: 'StereoCamera'
  bg: 'BoxGeometry'
  buffera: 'BufferAttribute'
  bufferg: 'BufferGeometry'
  capsuleg: 'CapsuleGeometry'
  coneg: 'ConeGeometry'
  cylinderg: 'CylinderGeometry'
  dg: 'DodecahedronGeometry'
  edgeg: 'EdgesGeometry'
  extrudeg: 'ExtrudeGeometry'
  ig: 'IcosahedronGeometry'
  lg: 'LatheGeometry'
  og: 'OctahedronGeometry'
  planeg: 'PlaneGeometry'
  polyg: 'PolyhedronGeometry'
  rg: 'RingGeometry'
  sg: 'SphereGeometry'
  tetrag: 'TetrahedronGeometry'
  toursg: 'TorusGeometry'
  tkg: 'TorusKnotGeometry'
  tubeg: 'TubeGeometry'
  wfg: 'WireframeGeometry'
  ac: 'ArcCurve'
  crc3: 'CatmullRomCurve3'
  cbc: 'CubicBezierCurve'
  cbc3: 'CubicBezierCurve3'
  ec: 'EllipseCurve'
  lc: 'LineCurve'
  lc3: 'LineCurve3'
  qbc: 'QuadraticBezierCurve'
  qbc3: 'QuadraticBezierCurve3'
  splinec: 'SplineCurve'
  arrowh: 'ArrowHelper'
  axesh: 'AxesHelper'
  bh: 'BoxHelper'
  b3h: 'Box3Helper'
  ch: 'CameraHelper'
  dlh: 'DirectionalLightHelper'
  gh: 'GridHelper'
  pgh: 'PolarGridHelper'
  hlh: 'HemisphereLightHelper'
  ph: 'PlaneHelper'
  plh: 'PointLightHelper'
  sh: 'SkeletonHelper'
  slh: 'SpotLightHelper'
  animationl: 'AnimationLoader'
  audiol: 'AudioLoader'
  bgl: 'BufferGeometryLoader'
  c: 'Cache'
  compressedtl: 'CompressedTextureLoader'
  cubetl: 'CubeTextureLoader'
  dtl: 'DataTextureLoader'
  fl: 'FileLoader'
  il: 'ImageLoader'
  ibl: 'ImageBitmapLoader'
  l: 'Loader'
  lu: 'LoaderUtils'
  ml: 'MaterialLoader'
  ol: 'ObjectLoader'
  tl: 'TextureLoader'
  g: 'Group'
  lbm: 'LineBasicMaterial'
  ldm: 'LineDashedMaterial'
  m: 'Mesh'
  mbm: 'MeshBasicMaterial'
  mdepthm: 'MeshDepthMaterial'
  mdistancem: 'MeshDistanceMaterial'
  mlm: 'MeshLambertMaterial'
  mmm: 'MeshMatcapMaterial'
  mnm: 'MeshNormalMaterial'
  mpongm: 'MeshPhongMaterial'
  mphysicalm: 'MeshPhysicalMaterial'
  msm: 'MeshStandardMaterial'
  mtm: 'MeshToonMaterial'
  pm: 'PointsMaterial'
  rm: 'RawShaderMaterial'
  shaderm: 'ShaderMaterial'
  shadowm: 'ShadowMaterial'
  spritem: 'SpriteMaterial'
  line: 'Line'
  lp: 'LineLoop'
  ls: 'LineSegments'
}
interface SThreeOptions extends Record<string, any> {
  createMesh: (
    c: (fnName: keyof FnNameMap | keyof T, ...args: any[]) => any,
    animationArray: Mesh[],
    track: (...args: [target: Object, propName: string, min?: number, max?: number, step?: number]) => dat.GUIController
  ) => any[]
  createCamera: (c: (fnName: keyof FnNameMap | keyof T, ...args: any[]) => any, meshes: Mesh[], scene: Object3D) => PerspectiveCamera
  animate?: (animationOptions: AnimateOptions) => void | THREE.PerspectiveCamera
  middleware?: (middlewareOptions: MiddlewareOptions) => any
  mousemove?: (e: Event) => void
  mousedown?: (e: Event) => void
  mouseup?: (e: Event) => void
  debug?: boolean
}
export function SThree(container: HTMLElement | string, options: SThreeOptions) {
  if (isStr(container))
    container = document.querySelector(container as string) as HTMLElement || container
  if (isStr(container))
    throw new Error(`${container} container is not found`)
  const renderer = new THREE.WebGLRenderer()
  const scene = new THREE.Scene() as Object3D
  const animationArray: Mesh[] = []
  const { createCamera, createMesh, animate, mousemove, mousedown, mouseup, debug } = options
  let gui: dat.GUI
  if (debug)
    gui = new dat.GUI()
  const fnNameMap: FnNameMap = {
    v3: 'Vector3',
    cc: 'CubeCamera',
    oc: 'OrthographicCamera',
    pc: 'PerspectiveCamera',
    sc: 'StereoCamera',
    bg: 'BoxGeometry',
    buffera: 'BufferAttribute',
    bufferg: 'BufferGeometry',
    capsuleg: 'CapsuleGeometry',
    coneg: 'ConeGeometry',
    cylinderg: 'CylinderGeometry',
    dg: 'DodecahedronGeometry',
    edgeg: 'EdgesGeometry',
    extrudeg: 'ExtrudeGeometry',
    ig: 'IcosahedronGeometry',
    lg: 'LatheGeometry',
    og: 'OctahedronGeometry',
    planeg: 'PlaneGeometry',
    polyg: 'PolyhedronGeometry',
    rg: 'RingGeometry',
    sg: 'SphereGeometry',
    tetrag: 'TetrahedronGeometry',
    toursg: 'TorusGeometry',
    tkg: 'TorusKnotGeometry',
    tubeg: 'TubeGeometry',
    wfg: 'WireframeGeometry',
    ac: 'ArcCurve',
    crc3: 'CatmullRomCurve3',
    cbc: 'CubicBezierCurve',
    cbc3: 'CubicBezierCurve3',
    ec: 'EllipseCurve',
    lc: 'LineCurve',
    lc3: 'LineCurve3',
    qbc: 'QuadraticBezierCurve',
    qbc3: 'QuadraticBezierCurve3',
    splinec: 'SplineCurve',
    arrowh: 'ArrowHelper',
    axesh: 'AxesHelper',
    bh: 'BoxHelper',
    b3h: 'Box3Helper',
    ch: 'CameraHelper',
    dlh: 'DirectionalLightHelper',
    gh: 'GridHelper',
    pgh: 'PolarGridHelper',
    hlh: 'HemisphereLightHelper',
    ph: 'PlaneHelper',
    plh: 'PointLightHelper',
    sh: 'SkeletonHelper',
    slh: 'SpotLightHelper',
    animationl: 'AnimationLoader',
    audiol: 'AudioLoader',
    bgl: 'BufferGeometryLoader',
    c: 'Cache',
    compressedtl: 'CompressedTextureLoader',
    cubetl: 'CubeTextureLoader',
    dtl: 'DataTextureLoader',
    fl: 'FileLoader',
    il: 'ImageLoader',
    ibl: 'ImageBitmapLoader',
    l: 'Loader',
    lu: 'LoaderUtils',
    ml: 'MaterialLoader',
    ol: 'ObjectLoader',
    tl: 'TextureLoader',
    g: 'Group',
    lbm: 'LineBasicMaterial',
    ldm: 'LineDashedMaterial',
    m: 'Mesh',
    mbm: 'MeshBasicMaterial',
    mdepthm: 'MeshDepthMaterial',
    mdistancem: 'MeshDistanceMaterial',
    mlm: 'MeshLambertMaterial',
    mmm: 'MeshMatcapMaterial',
    mnm: 'MeshNormalMaterial',
    mpongm: 'MeshPhongMaterial',
    mphysicalm: 'MeshPhysicalMaterial',
    msm: 'MeshStandardMaterial',
    mtm: 'MeshToonMaterial',
    pm: 'PointsMaterial',
    rm: 'RawShaderMaterial',
    shaderm: 'ShaderMaterial',
    shadowm: 'ShadowMaterial',
    spritem: 'SpriteMaterial',
    line: 'Line',
    lp: 'LineLoop',
    ls: 'LineSegments',
  }
  const meshes: Mesh[] = createMesh?.(c, animationArray, track).map((mesh) => {
    scene.add(mesh)
    return mesh
  })
  const camera = createCamera?.(c, meshes, scene)
  if (!camera)
    throw new Error('camera is not created')
  const dom = renderer.domElement
  const animationOptions = {
    params: options.middleware?.({ c, meshes, scene, OrbitControls: Orbit as unknown as OrbitControls, camera, dom, animationArray }),
    c,
    dom,
    scene,
    meshes,
    camera,
    animationArray,
    elapsedTime: new THREE.Clock().getElapsedTime(),
  }
  if (animate)
    animationFrameWrapper((time: number) => renderer.render(scene, animate(Object.assign(animationOptions, { timestamp: time })) || camera), 0)
  else
    renderer.render(scene, camera);
  (container as HTMLElement).appendChild(dom)

  dragEvent(dom, {
    dragStart: mousedown,
    dragMove: mousemove,
    dragEnd: mouseup,
  })

  resize()
  addEventListener(window, 'resize', resize)

  function resize() {
    const width = (container as HTMLElement).offsetWidth
    const height = (container as HTMLElement).offsetHeight
    camera.aspect = Math.min(width / height, 2)
    camera.updateProjectionMatrix()
    renderer.setSize(width, height, false)
  }

  function c(fnName: keyof FnNameMap | keyof T, ...args: any[]): any {
    const lowName = fnName.toLowerCase() as keyof FnNameMap
    const fnNameMapKey = fnNameMap[lowName]
    const _class = THREE[fnNameMapKey || fnName]
    if (lowName)
      console.log(`${lowName}: ${fnNameMapKey}`)
    if (!_class)
      throw new Error(`${fnName} is not found`)
    // @ts-expect-error three not export specific name
    return new _class()?.(...args)
  }
  function track(...args: [target: Object, propName: string, min?: number, max?: number, step?: number]): dat.GUIController {
    if (!gui)
      throw new Error('gui is not created, please use debug option')
    if (args[0] === 'color') {
      return gui.addColor(args[2] as unknown as { color: string }, 'color').onChange(() => {
        (args[1] as unknown as { color: any }).color.set((args[2] as unknown as { color: string }).color)
      })
    }
    return gui.add(...args)
  }
}

