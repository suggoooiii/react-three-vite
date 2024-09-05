import * as THREE from "three";
import { Canvas, extend, createPortal, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useFBO } from "@react-three/drei";
import { RoundedBoxGeometry } from "three-stdlib";
import { SimulationMaterial, FBOparticles } from "./components";
import { easing } from "maath";

extend({ RoundedBoxGeometry, SimulationMaterial });

const App = () => {
  return (
    <Canvas camera={{ position: [1.5, 1.5, 1.5] }}>
      <ambientLight intensity={0.5} />
      <FBOparticles />
      <OrbitControls autoRotate={false} />
    </Canvas>
  );
};

export default App;
