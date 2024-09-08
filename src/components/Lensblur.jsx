import * as THREE from "three";
import { ScreenQuad } from "@react-three/drei";
import React from "react";

import fragShader from "../glsl/lensblurFrag.glsl";
import vertShader from "../glsl/lensblurVert.glsl";
import { useFrame } from "@react-three/fiber";

const Lensblur = () => {
  const uniforms = {
    u_time: { value: 0 },
    u_color: { value: new THREE.Color(0x00ff00) },
  };

  useFrame(state => {
    uniforms.u_time.value = state.clock.getElapsedTime();
  }, []);

  return (
    <ScreenQuad>
      <shaderMaterial uniforms={uniforms} vertexShader={vertShader} fragmentShader={fragShader} />
    </ScreenQuad>
  );
};

export default Lensblur;
