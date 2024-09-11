uniform float u_time;
uniform vec3 u_color;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_pixelRatio;
varying vec2 v_uv;

#include '../../lygia/draw/fill.glsl
#include '../../lygia/draw/stroke.glsl
#include '../../lygia/draw/tri.glsl
#include '../../lygia/generative/curl.glsl

float sdRoundRect(vec2 p, vec2 b, float r) {
  vec2 d = abs(p - 0.5) * 4.2 - b + vec2(r);
  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
}
float sdCircle(in vec2 st, in vec2 center) {
  return length(st - center) * 2.0;
}

/* Coordinate and unit utils */
#ifndef FNC_COORD
#define FNC_COORD
vec2 coord(in vec2 p) {
    p = p / u_resolution.xy;
    // correct aspect ratio
    if (u_resolution.x > u_resolution.y) {
        p.x *= u_resolution.x / u_resolution.y;
        p.x += (u_resolution.y - u_resolution.x) / u_resolution.y / 2.0;
    } else {
        p.y *= u_resolution.y / u_resolution.x;
        p.y += (u_resolution.x - u_resolution.y) / u_resolution.x / 2.0;
    }
    // centering
    p -= 0.5;
    p *= vec2(-1.0, 1.0);
    return p;
}
#endif

#define st0 coord(gl_FragCoord.xy)
#define mx coord(u_mouse * u_pixelRatio)

    
void main() {
    vec2 st = v_uv;
    vec2 pixel = 1.0 / u_resolution.xy * u_pixelRatio;
    vec2 posMouse = u_mouse ;

    float circleSize = 0.3;
    float circleEdge = 0.3;

      /* sdf Round Rect params */
    float size = 1.0;
    float roundness = 0.1;
    float borderSize = 0.05;

    float sdfCircle = fill(
        sdCircle(st, posMouse),
        circleSize,
        circleEdge
    );
    
    float sdf;

    sdf = sdRoundRect(st, vec2(size), roundness);
    sdf = stroke(sdf, 0.0, borderSize, sdfCircle) * 2.0;

    vec3 color = vec3(sdf);
    gl_FragColor = vec4(color.rgb, 1.0);
}