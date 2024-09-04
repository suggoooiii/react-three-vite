precision highp float;

varying vec2 vUv;
varying vec3 vNormal;

uniform float time;
uniform bool uDisplace;
uniform float uFrequency;
uniform float uAmplitude;

#include "../../lygia/generative/cnoise.glsl"

vec3 orthogonal(vec3 v){
    return normalize(abs(v.x)>abs(v.z)?vec3(-v.y,v.x,0.)
    :vec3(0.,-v.z,v.y));
}

float displace(vec3 point){
    if(uDisplace){
        return cnoise(point*uFrequency+vec3(time))*uAmplitude;
    }
    return 0.;
}

void main(){
    vec3 displacedPosition=position+normal*displace(position);
    vec4 modelPosition=modelMatrix*vec4(displacedPosition,1.);
    
    vec4 viewPosition=viewMatrix*modelPosition;
    vec4 projectedPosition=projectionMatrix*viewPosition;
    
    gl_Position=projectedPosition;
    
    float offset=4./256.;
    vec3 tangent=orthogonal(normal);
    vec3 bitangent=normalize(cross(normal,tangent));
    vec3 neighbour1=position+tangent*offset;
    vec3 neighbour2=position+bitangent*offset;
    vec3 displacedNeighbour1=neighbour1+normal*displace(neighbour1);
    vec3 displacedNeighbour2=neighbour2+normal*displace(neighbour2);
    
    vec3 displacedTangent=displacedNeighbour1-displacedPosition;
    vec3 displacedBitangent=displacedNeighbour2-displacedPosition;
    
    // https://upload.wikimedia.org/wikipedia/commons/d/d2/Right_hand_rule_cross_product.svg
    vec3 displacedNormal=normalize(cross(displacedTangent,displacedBitangent));
    
    vNormal=displacedNormal*normalMatrix;
}