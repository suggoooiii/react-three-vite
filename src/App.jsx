import * as THREE from "three";
import { Canvas, extend, createPortal, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useFBO } from "@react-three/drei";
import { Bloom, EffectComposer, N8AO } from "@react-three/postprocessing";
import { easing } from "maath";
import { RoundedBoxGeometry } from "three-stdlib";
import { usePerf } from "r3f-perf";
import { Caustics, CustomGeometryParticles, SimulationMaterial, FBOparticles } from "./components";
import { useMemo, useRef } from "react";
import fragShader from "./glsl/fragshder.glsl";
import vertShader from "./glsl/vertshder.glsl";
import { useControls } from "leva";

extend({ RoundedBoxGeometry, SimulationMaterial });

const PerfHook = () => {
  // getPerf() is also available for non-reactive way
  const [gl, log, getReport] = usePerf(s => s[(s.gl, s.log, s.getReport)]);
  console.log(gl, log, getReport());
  return <PerfHeadless />;
};

const App = () => {
  return (
    <Canvas camera={{ position: [1.5, 1.5, 1.5] }}>
      <ambientLight intensity={0.5} />
      {/* <CustomGeometryParticles count={1000} shape='box' /> */}
      <CustomGeometryParticles count={4000} shape='sphere' />
      <FBOparticles />
      <OrbitControls autoRotate={false} />
    </Canvas>
  );
};

export default App;
