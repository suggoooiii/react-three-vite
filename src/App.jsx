import * as THREE from "three";
import { Canvas, extend, createPortal, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, OrthographicCamera, useFBO, Plane } from "@react-three/drei";
import { RoundedBoxGeometry } from "three-stdlib";
import { SimulationMaterial, FBOparticles, Lensblur } from "./components";
import { easing } from "maath";

import { LumaSplatsThree, LumaSplatsSemantics } from "@lumaai/luma-web";

extend({ RoundedBoxGeometry, SimulationMaterial, LumaSplats: LumaSplatsThree });

const Panel = ({ position = [0, 0, 0], size = [5, 3] }) => {
  return (
    <Plane args={size} position={position}>
      <meshBasicMaterial color='white' />
    </Plane>
  );
};

const worldSources = [
  // Chateau de Menthon - Annecy @Yannick_Cerrutti
  { source: "https://lumalabs.ai/capture/da82625c-9c8d-4d05-a9f7-3367ecab438c", scale: 1 },
  // Arosa Hörnli - Switzerland @splnlss
  { source: "https://lumalabs.ai/capture/4da7cf32-865a-4515-8cb9-9dfc574c90c2", scale: 1 },
  // Fish reefs – Okinawa @BBCG
  { source: "https://lumalabs.ai/capture/6331c1bb-3352-4c8e-b691-32b9b70ec768", scale: 1 },
  // Glacial Erratic - Aspen, Colorado @VibrantNebula_Luma
  // { source: 'https://lumalabs.ai/capture/f513900b-69fe-43c8-a72e-80b8d5a16fa4', scale: 1 },
  // Meta Girl (Oleg Lobykin) | Burning Man 2022 @VibrantNebula_Luma
  // { source: 'https://lumalabs.ai/capture/2d57866c-83dc-47a6-a725-69c27f75ddb0', scale: 1 },
  // Pinkerton Hot Springs @VibrantNebula_Luma
  // { source: 'https://lumalabs.ai/capture/a5e98f35-3759-4cf5-a226-079b15c805da', scale: 1 },
  // HOLLYWOOD @DroneFotoBooth
  // { source: 'https://lumalabs.ai/capture/b5faf515-7932-4000-ab23-959fc43f0d94', scale: 1 },
  // Metropolis @fotozhora_sk
  { source: "https://lumalabs.ai/capture/d2d2badd-8bdd-4874-84f7-9df2aae27f29", scale: 1 },
];

const innerGlobeRadius = 1;
const outerGlobeRadius = 8;
const radiusGap = outerGlobeRadius - innerGlobeRadius;

const App = () => {
  return (
    <Canvas gl={{ antialias: false }} camera={{ position: [1.5, 1.5, 1.5] }}>
      {/* <OrbitControls enableDamping /> */}
      {/* <Plane /> */}
      {/* <FBOparticles /> */}
      <Lensblur />
    </Canvas>
  );
};

export default App;
