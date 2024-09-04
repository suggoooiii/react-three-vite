import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import fragmentShader from "../glsl/fragmentShader.glsl";
import vertexShader from "../glsl/vertexShader.glsl";

const CustomGeometryParticles = props => {
  const { count, shape } = props;
  const radius = 2;

  // This reference gives us direct access to our points
  const points = useRef();

  // Generate our positions attributes array
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);

    if (shape === "box") {
      for (let i = 0; i < count; i++) {
        let x = (Math.random() - 0.5) * 2;
        let y = (Math.random() - 0.5) * 2;
        let z = (Math.random() - 0.5) * 2;

        positions.set([x, y, z], i * 3);
      }
    }

    if (shape === "sphere") {
      for (let i = 0; i < count; i++) {
        const distance = Math.sqrt(Math.random()) * radius;
        const theta = THREE.MathUtils.randFloatSpread(360);
        const phi = THREE.MathUtils.randFloatSpread(360);

        let x = distance * Math.sin(theta) * Math.cos(phi);
        let y = distance * Math.sin(theta) * Math.sin(phi);
        let z = distance * Math.cos(theta);

        positions.set([x, y, z], i * 3);
      }
    }

    return positions;
  }, [count, shape]);

  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0.0,
      },
      uRadius: {
        value: radius,
      },
    }),
    []
  );

  // Animating Particles with attributes
  useFrame(state => {
    const { clock } = state;

    // for (let i = 0; i < count; i++) {
    //   const i3 = i * 3;
    //   points.current.geometry.attributes.position.array[i3] += Math.sin(clock.elapsedTime + Math.random() * 10) * 0.01;
    //   points.current.geometry.attributes.position.array[i3 + 1] += Math.cos(clock.elapsedTime + Math.random() * 10) * 0.01;
    //   points.current.geometry.attributes.position.array[i3 + 2] += Math.sin(clock.elapsedTime + Math.random() * 10) * 0.01;
    // }
    // points.current.geometry.attributes.position.needsUpdate = true;
    points.current.material.uniforms.uTime.value += clock.elapsedTime;
    // make the uRadius change in a mathematically interesting way  (e.g. oscillate between 1 and 2)
    // points.current.material.uniforms.uRadius.value = 1 + Math.sin(clock.elapsedTime) * 0.5;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach='attributes-position' count={particlesPosition.length / 3} array={particlesPosition} itemSize={3} />
      </bufferGeometry>
      <shaderMaterial
        depthWrite={false}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
        blending={THREE.AdditiveBlending}
      />
      {/* <pointsMaterial size={0.015} color='#5786F5' sizeAttenuation depthWrite={false} fog /> */}
    </points>
  );
};

export default CustomGeometryParticles;
