uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
varying float vElevation;
uniform float uColorOffset;
uniform float uColorMultiple;

void main() {
  vec3 mixedColor = mix(uDepthColor, uSurfaceColor, vElevation * uColorMultiple + uColorOffset);
  gl_FragColor = vec4(mixedColor, 1.0);
}
