precision mediump float;
uniform sampler2D uTexture;
varying vec2 vUv;
varying float vElevation;

void main() {
  vec4 textureColor = texture2D(uTexture, vUv);
  textureColor.rgb *= vElevation * 2.0 + 1.0;
  gl_FragColor = textureColor;
}
