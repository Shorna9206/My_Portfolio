import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import { useRef } from "react";

function Orb() {
  const ref = useRef();
  useFrame((state) => {
    ref.current.rotation.x = state.clock.elapsedTime * .12;
    ref.current.rotation.y = state.clock.elapsedTime * .18;
  });
  return <Float speed={1.3} rotationIntensity={.4} floatIntensity={1.2}>
    <mesh ref={ref} scale={2.05}>
      <icosahedronGeometry args={[1, 5]} />
      <MeshDistortMaterial color="#8ee6c1" roughness=".22" metalness=".75" distort={.34} speed={1.5} />
    </mesh>
  </Float>;
}

export default function ThreeOrb() {
  return <div className="three-orb"><Canvas camera={{ position: [0,0,5], fov: 40 }} dpr={[1, 1.5]}>
    <ambientLight intensity={.45}/><directionalLight position={[3,3,4]} intensity={2}/>
    <Orb/>
  </Canvas></div>;
}