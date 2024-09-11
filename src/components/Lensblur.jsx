import * as THREE from "three";
import React, { useEffect } from "react";
import fragShader from "../glsl/lensblurFrag.glsl";
import vertShader from "../glsl/lensblurVert.glsl";
import { useFrame, useThree } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";

const Lensblur = () => {
  const { pointer, size, mouse } = useThree();
  console.log("🚀 ~ Lensblur ~ size:", size);

  const uniforms = {
    u_time: { value: 0 },
    u_color: { value: new THREE.Color(0x00ff00) },
    u_mouse: { value: new THREE.Vector2() },
    u_pixelRatio: { value: window.devicePixelRatio },
    u_resolution: { value: new THREE.Vector2() },
  };

  useEffect(() => {
    // Update resolution when size changes
    // uniforms.u_resolution.value.set(size.width, size.height);
  }, [size]);

  useFrame(state => {
    uniforms.u_time.value = state.clock.getElapsedTime();
    uniforms.u_resolution.value.set(size.width, size.height);

    // Update mouse position with aspect ratio correction and centering
    const aspect = size.width / size.height;
    uniforms.u_pixelRatio.value = window.devicePixelRatio;
    console.log("🚀 ~ Lensblur ~ uniforms.u_pixelRatio.value:", uniforms.u_pixelRatio.value);
    let x = (mouse.x + 1) / 2;
    let y = (mouse.y + 1) / 2;

    if (aspect > 1) {
      x = x * aspect + (1 - aspect) / 2;
    } else {
      y = y / aspect + (1 - 1 / aspect) / 2;
    }
    uniforms.u_mouse.value.set(x, y);
  }, []);

  return (
    <mesh>
      <OrthographicCamera makeDefault position={[0, 0, 1]} zoom={500} />
      <planeGeometry args={[2, 2]} />
      <shaderMaterial uniforms={uniforms} vertexShader={vertShader} fragmentShader={fragShader} />
    </mesh>
  );
};

export default Lensblur;
g;
