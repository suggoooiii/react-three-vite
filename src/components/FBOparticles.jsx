import * as THREE from "three";
import { createPortal, useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { useFBO } from "@react-three/drei";
import { useMemo, useRef } from "react";

import fragShader from "../glsl/fragshder.glsl";
import vertShader from "../glsl/vertshder.glsl";

const FBOparticles = () => {
  // refs
  const pointsRef = useRef();
  const simulationRef = useRef();

  // fbo setup
  const size = 256;
  const fboSettings = {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    stencilBuffer: false,
    type: THREE.FloatType,
  };

  const { uFrequency } = useControls({
    uFrequency: { value: 0.2, min: 0.1, max: 10.0, step: 0.1 },
  });

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1);
  const positions = new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0]);
  const uvs = new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]);

  const renderTarget = useFBO(size, size, fboSettings);

  // particles setup
  const particlesPosition = useMemo(() => {
    const length = size * size;
    const particles = new Float32Array(length * 3);
    for (let i = 0; i < length; i++) {
      let i3 = i * 3;
      particles[i3 + 0] = (i % size) / size;
      particles[i3 + 1] = i / size / size;
    }
    return particles;
  }, [size]);

  const uniforms = useMemo(
    () => ({
      uPositions: {
        value: null,
      },
      uTime: {
        value: 0.0,
      },
    }),
    []
  );

  // render loop
  useFrame(state => {
    const { gl, clock } = state;

    gl.setRenderTarget(renderTarget);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    pointsRef.current.material.uniforms.uPositions.value = renderTarget.texture;
    pointsRef.current.material.uniforms.uTime.value = clock.elapsedTime;

    simulationRef.current.uniforms.uTime.value = clock.elapsedTime;
    simulationRef.current.uniforms.uFrequency.value = uFrequency;
  }, []);

  return (
    <>
      {createPortal(
        <mesh>
          <simulationMaterial ref={simulationRef} args={[size]} />
          <bufferGeometry>
            <bufferAttribute attach='attributes-position' count={positions.length / 3} array={positions} itemSize={3} />
            <bufferAttribute attach='attributes-uv' count={uvs.length / 2} array={uvs} itemSize={2} />
          </bufferGeometry>
        </mesh>,
        scene
      )}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach='attributes-position' count={particlesPosition.length / 3} array={particlesPosition} itemSize={3} />
        </bufferGeometry>
        <shaderMaterial
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fragmentShader={fragShader}
          vertexShader={vertShader}
          uniforms={uniforms}
        />
      </points>
    </>
  );
};

export default FBOparticles;
