import * as THREE from "three";
import React, { useRef, useMemo } from "react";
import { Instances, Instance } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
const Cubes = ({ gap = 0.1, stride = 4, displacement = 3, intensity = 1 }) => {
  const cursor = new THREE.Vector3();
  const oPos = new THREE.Vector3();
  const vec = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const ref = useRef();

  const positions = useMemo(() => {
    const temp = [];
    const center = stride / 2 - stride * gap + gap;
    for (let x = 0; x < stride; x++)
      for (let y = 0; y < stride; y++)
        for (let z = 0; z < stride; z++) temp.push([x + x * gap - center, y + y * gap - center, z + z * gap - center]);
    return temp;
  }, [stride, gap]);

  useFrame(({ pointer, camera }, delta) => {
    cursor.set(pointer.x, pointer.y, 0.5).unproject(camera);
    dir.copy(cursor).sub(camera.position).normalize();
    cursor.add(dir.multiplyScalar(camera.position.length()));
    let count = 0;
    for (let child of ref.current.children) {
      oPos.set(...positions[count++]);
      dir.copy(oPos).sub(cursor).normalize();
      const dist = oPos.distanceTo(cursor);
      const distInv = displacement - dist;
      const col = Math.max(0.5, distInv) / 1.5;
      easing.dampC(child.color, dist > displacement * 1.1 ? "white" : [col / 2, col * 2, col * 4], 0.1, delta);
      easing.damp3(child.position, dist > displacement ? oPos : vec.copy(oPos).add(dir.multiplyScalar(distInv * intensity)), 0.2, delta);
    }
  });

  return (
    <Instances key={stride} limit={stride * stride * stride} castShadow receiveShadow frames={Infinity} ref={ref}>
      <roundedBoxGeometry args={[1, 1, 1, 2, 0.15]} />
      <meshLambertMaterial />
      {Array.from({ length: stride * stride * stride }, (v, n) => (
        <Instance key={n} position={positions[n]} />
      ))}
    </Instances>
  );
};

export default Cubes;
