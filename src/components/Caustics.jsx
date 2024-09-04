import * as THREE from "three";
import { MeshTransmissionMaterial, shaderMaterial, useFBO } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef, useMemo, useState } from "react";
import surfaceFrag from "../glsl/surfaceFrag.frag";
import surfaceVert from "../glsl/surfaceVert.vert";
import { useControls } from "leva";

const NormalMaterial = shaderMaterial(
  {
    time: { value: 0.0 },
    uDisplace: { value: true },
    uAmplitude: { value: 0.25 },
    uFrequency: { value: 0.75 },
  },
  surfaceVert,
  surfaceFrag
);

const config = {
  backsideThickness: 0.3,
  thickness: 25,
  samples: 6,
  transmission: 0.9,
  clearcoat: 1,
  clearcoatRoughness: 0.5,
  chromaticAberration: 1.5,
  anisotropy: 0.2,
  roughness: 0,
  distortion: 0,
  distortionScale: 0.09,
  temporalDistortion: 0,
  ior: 1.5,
  color: "#ffffff",
};

const Caustics = () => {
  const mesh = useRef();
  const causticsPlane = useRef();
  const normalRenderTarget = useFBO(2000, 2000, {});
  // dedicated camera for our render target
  const [normalCamera] = useState(() => new THREE.PerspectiveCamera(65, 1, 0.1, 1000));
  const [normalMaterial] = useState(() => new NormalMaterial());

  // controls
  const { light, intensity, chromaticAberration, displace, amplitude, frequency, geometry } = useControls({
    light: {
      value: new THREE.Vector3(-10, 13, -10),
    },
    // geometry: {
    //   value: "sphere",
    //   options: ["sphere", "torus", "bunny"],
    // },
    intensity: {
      value: 1.5,
      step: 0.01,
      min: 0,
      max: 10.0,
    },
    chromaticAberration: {
      value: 0.16,
      step: 0.001,
      min: 0,
      max: 0.4,
    },
    displace: {
      value: true,
    },
    amplitude: {
      value: 0.13,
      step: 0.01,
      min: 0,
      max: 1,
    },
    frequency: {
      value: 0.65,
      step: 0.01,
      min: 0,
      max: 4,
    },
  });

  const SphereGeometry = forwardRef((props, ref) => {
    return (
      <mesh ref={ref} scale={2} position={[0, 6.5, 0]}>
        <sphereGeometry args={[3, 512, 512]} />
        <MeshTransmissionMaterial backside {...config} />
      </mesh>
    );
  });

  const TorusGeometry = forwardRef((props, ref) => {
    return (
      <mesh ref={ref} scale={0.4} position={[0, 6.5, 0]}>
        <torusKnotGeometry args={[10, 3, 600, 160]} />
        <MeshTransmissionMaterial backside {...config} />
      </mesh>
    );
  });

  const TargetMesh = useMemo(() => {
    switch (geometry) {
      case "sphere":
        return SphereGeometry;
      case "torus":
        return TorusGeometry;
      default:
        return SphereGeometry;
    }
  }, [geometry]);

  useFrame(state => {
    const { gl } = state;
    const bounds = new THREE.Box3().setFromObject(mesh.current, true);
    normalCamera.position.set(light.x, light.y, light.z);
    normalCamera.lookAt(
      bounds.getCenter(new THREE.Vector3(0, 0, 0)).x,
      bounds.getCenter(new THREE.Vector3(0, 0, 0)).y,
      bounds.getCenter(new THREE.Vector3(0, 0, 0)).z
    );
    normalCamera.up = new THREE.Vector3(0, 1, 0);
    const originalMaterial = mesh.current.material;

    mesh.current.material = normalMaterial;
    mesh.current.material.side = THREE.BackSide;

    gl.setRenderTarget(normalRenderTarget);
    gl.render(mesh.current, normalCamera);

    mesh.current.material = originalMaterial;

    causticsPlane.current.material.map = normalRenderTarget.texture;

    gl.setRenderTarget(null);
  });
  return (
    <>
      <mesh ref={mesh} scale={0.02} position={[0, 10.5, 0]}>
        <torusKnotGeometry args={[200, 40, 600, 16]} />
        <MeshTransmissionMaterial backside {...config} />
      </mesh>
      <mesh ref={causticsPlane} rotation={[-Math.PI / 2, 0, 0]} position={[5, 0, 5]}>
        <planeGeometry args={[10, 10, 10, 10]} />
        <meshBasicMaterial />
      </mesh>
    </>
  );
};

export default Caustics;
