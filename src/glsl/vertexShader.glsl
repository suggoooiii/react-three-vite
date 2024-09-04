precision highp float;

varying vec2 vUv;
varying float vSize;
varying float vDistance;
varying vec3 vPosition;

uniform float uTime;
uniform float uRadius;

#include "../../lygia/math/rotate3dY.glsl"
#include "../../lygia/math/rotate3dX.glsl"
#include "../../lygia/math/rotate3dZ.glsl"
#include "../../lygia/generative/snoise.glsl"

mat3 rotation3dY(float angle){
    float s=sin(angle);
    float c=cos(angle);
    return mat3(
        c,0.,-s,
        0.,1.,0.,
        s,0.,c
    );
}

// play with this
float calculatePointSize(vec3 pos){
    // Base size
    float baseSize=3.;
    
    // Add some variation based on position
    float positionFactor=sin(length(pos)*.5)*.5+.5;
    
    // Add time-based animation
    float timeFactor=cos(uTime*1.5)*.5+.5;
    
    // Add Perlin noise
    float noise=snoise(vec4(pos*.5,uTime*.5));
    
    // Combine all factors
    float size=baseSize*(1.+positionFactor*.5)*(1.+timeFactor*1.5)*(1.+noise*.5);
    
    return size;
}

void main(){
    float distanceFactor=pow(uRadius-distance(position,vec3(0.)),2.);
    vec3 particlePosition=position*rotation3dY(uTime*.5*distanceFactor);
    vDistance=distanceFactor;
    vec4 modelPosition=modelMatrix*vec4(particlePosition,1.);
    vec4 viewPosition=viewMatrix*modelPosition;
    vec4 projectedPosition=projectionMatrix*viewPosition;
    
    gl_Position=projectedPosition;
    
    // Calculate point size
    vSize=calculatePointSize(particlePosition);
    
    gl_PointSize=vSize;
    
    // Size attenuation;
    gl_PointSize+=(1./-viewPosition.z);
    
    // Pass UV coordinates
    vUv=uv;
    vPosition=particlePosition;
    
}
