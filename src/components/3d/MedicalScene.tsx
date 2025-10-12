import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// DNA Helix Component
const DNAHelix = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  const helixPoints = useMemo(() => {
    const points = [];
    const radius = 1.5;
    const height = 6;
    const turns = 3;
    const pointsPerTurn = 20;
    
    for (let i = 0; i < turns * pointsPerTurn; i++) {
      const angle = (i / pointsPerTurn) * Math.PI * 2;
      const y = (i / (turns * pointsPerTurn)) * height - height / 2;
      
      points.push({
        x: Math.cos(angle) * radius,
        y,
        z: Math.sin(angle) * radius,
      });
      
      points.push({
        x: Math.cos(angle + Math.PI) * radius,
        y,
        z: Math.sin(angle + Math.PI) * radius,
      });
    }
    return points;
  }, []);

  return (
    <group ref={groupRef}>
      {helixPoints.map((point, i) => (
        <Float key={i} speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh position={[point.x, point.y, point.z]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#3b82f6" : "#10b981"}
              emissive={i % 2 === 0 ? "#3b82f6" : "#10b981"}
              emissiveIntensity={0.3}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

// Medical Cross Component
const MedicalCross = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[0.3, 1.5, 0.3]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={position}>
        <boxGeometry args={[1.5, 0.3, 0.3]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.2} />
      </mesh>
    </Float>
  );
};

// Pill Component
const Pill = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={groupRef} position={position}>
        <mesh position={[-0.4, 0, 0]}>
          <sphereGeometry args={[0.4, 16, 16, 0, Math.PI]} />
          <meshStandardMaterial color="#8b5cf6" />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.4, 0.4, 0.8, 16]} />
          <meshStandardMaterial color="#8b5cf6" />
        </mesh>
        <mesh position={[0.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <sphereGeometry args={[0.4, 16, 16, 0, Math.PI]} />
          <meshStandardMaterial color="#ec4899" />
        </mesh>
      </group>
    </Float>
  );
};

// Stethoscope Component (simplified)
const Stethoscope = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={groupRef} position={position}>
        {/* Chest piece */}
        <mesh>
          <cylinderGeometry args={[0.4, 0.5, 0.2, 32]} />
          <meshStandardMaterial color="#10b981" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Earpiece */}
        <mesh position={[0, 2, 0]}>
          <torusGeometry args={[0.5, 0.1, 16, 32]} />
          <meshStandardMaterial color="#10b981" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>
    </Float>
  );
};

// Glowing Sphere (Represents medical data)
const GlowingSphere = ({ position }: { position: [number, number, number] }) => {
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <Sphere args={[0.5, 32, 32]} position={position}>
        <MeshDistortMaterial
          color="#06b6d4"
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
};

// Main Scene
const Scene = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
      <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={1} color="#10b981" />
      
      {/* Medical Elements */}
      <DNAHelix />
      <MedicalCross position={[4, 2, -2]} />
      <Pill position={[-4, -1, -1]} />
      <Stethoscope position={[-3, -2, 0]} />
      <GlowingSphere position={[3, -2, 1]} />
      <GlowingSphere position={[-3, 1, 0]} />
    </>
  );
};

// Exported Component
export const MedicalScene = () => {
  return (
    <div className="w-full h-[400px] md:h-[500px] lg:h-[600px]">
      <Canvas>
        <Scene />
      </Canvas>
    </div>
  );
};
