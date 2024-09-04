precision highp float;

varying vec2 vUv;
varying float vSize;
varying float vDistance;
varying vec3 vPosition;

uniform float uTime;
uniform float uRadius;

#define MAX_STEPS 100

#include "../../lygia/generative/snoise.glsl"

float sdSphere(vec3 p,float radius){
    return length(p)-radius;
}

float scene(vec3 p){
    float distance=sdSphere(p,1.);
    return-distance;
}

const float MARCH_SIZE=.08;

vec4 raymarch(vec3 rayOrigin,vec3 rayDirection){
    float depth=0.;
    vec3 p=rayOrigin+depth*rayDirection;
    
    vec4 res=vec4(0.);
    
    for(int i=0;i<MAX_STEPS;i++){
        float density=scene(p);
        
        // We only draw the density if it's greater than 0
        if(density>0.){
            vec4 color=vec4(mix(vec3(1.,1.,1.),vec3(0.,0.,0.),density),density);
            color.rgb*=color.a;
            res+=color*(1.-res.a);
        }
        
        depth+=MARCH_SIZE;
        p=rayOrigin+depth*rayDirection;
    }
    
    return res;
}

vec3 rainbow(float t){
    vec3 a=vec3(.5,.5,.5);
    vec3 b=vec3(.5,.5,.5);
    vec3 c=vec3(1.,1.,1.);
    vec3 d=vec3(0.,.33,.67);
    
    return a+b*cos(6.28318*(c*t+d));
}
void main(){
    // vec2 uv=gl_FragCoord.xy/uResolution.xy;
    // uv-=.5;
    // uv.x*=uResolution.x/uResolution.y;
    
    // // Ray Origin - camera
    // vec3 ro=vec3(0.,0.,5.);
    // // Ray Direction
    // vec3 rd=normalize(vec3(uv,-1.));
    
    // vec3 color=vec3(0.);
    // vec4 res=raymarch(ro,rd);
    // color=res.rgb;
    
    // Calculate distacne from center of point
    // vec2 cxy=2.*gl_PointCoord-1.;
    // float r=dot(cxy,cxy);
    
    // Discard pixels outside the point
    // if(r>1.){
        // discard;
    // }
    // Calculate alpha based on distance from center
    // float alpha=1.-smoothstep(.8,1.,r);
    
    // Color based on distance from center and time
    // float dist=length(vPosition);
    // vec3 color=.5+.5*cos(dist*5.+uTime+vec3(0.,2.,4.));
    
    // ELectric field effect
    // color=vec3(.1,.4,1.)/(1.+length(vPosition)*.5);
    // color*=.5*vec3(snoise(vec4(vPosition*2.,uTime)));
    
    // color+=mix(
        // vec3(0.,.5,1.),
        // vec3(1.,.5,0.),
        // smoothstep(2.,8.,vSize*10.)+sin(vPosition.y*2.+uTime)*.2
    // );
    
    // Use vSize to affec the color
    // color=mix(vec3(.3882,.9098,.9804),vec3(1.,.5,0.),vSize/20.);
    // color=mix(color,vec3(.0745,.1059,.6549),vSize/20.);
    // color=mix(color,vec3(.97,.70,.45),vDistance*.5);
    // color=mix(vec3(0.),color,strength);
    //
    // gl_FragColor=vec4(color,alpha);
    vec3 color=vec3(.34,.53,.96);
    float strength=distance(gl_PointCoord,vec2(.5));
    strength=1.-strength;
    strength=pow(strength,3.);
    
    color=mix(color,vec3(.97,.70,.45),vDistance*.5);
    color=mix(vec3(0.),color,strength);
    gl_FragColor=vec4(color,strength);
    
}
