"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import { useEffect, useRef, useState, Suspense } from "react";
import * as THREE from "three";
import { Button } from "@/components/ui/button";

function AnimatedBox({
  initialPosition,
}: {
  initialPosition: [number, number, number];
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [targetPosition, setTargetPosition] = useState(
    new THREE.Vector3(...initialPosition)
  );
  const currentPosition = useRef(new THREE.Vector3(...initialPosition));

  const getAdjacentIntersection = (current: THREE.Vector3) => {
    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    return new THREE.Vector3(
      current.x + randomDirection[0] * 3,
      0.5,
      current.z + randomDirection[1] * 3
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newPosition = getAdjacentIntersection(currentPosition.current);
      newPosition.x = Math.max(-15, Math.min(15, newPosition.x));
      newPosition.z = Math.max(-15, Math.min(15, newPosition.z));
      setTargetPosition(newPosition);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      currentPosition.current.lerp(targetPosition, 0.1);
      meshRef.current.position.copy(currentPosition.current);
    }
  });

  return (
    <mesh ref={meshRef} position={initialPosition}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ffffff" opacity={0.9} transparent />
      <lineSegments>
        <edgesGeometry
          attach="geometry"
          args={[new THREE.BoxGeometry(1, 1, 1)]}
        />
        <lineBasicMaterial attach="material" color="#000000" linewidth={2} />
      </lineSegments>
    </mesh>
  );
}

function Scene() {
  const initialPositions: [number, number, number][] = [
    [-9, 0.5, -9],
    [-3, 0.5, -3],
    [0, 0.5, 0],
    [3, 0.5, 3],
    [9, 0.5, 9],
    [-6, 0.5, 6],
    [6, 0.5, -6],
    [-12, 0.5, 0],
    [12, 0.5, 0],
    [0, 0.5, 12],
  ];

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Grid
        renderOrder={-1}
        position={[0, 0, 0]}
        infiniteGrid
        cellSize={1}
        cellThickness={0.5}
        sectionSize={3}
        sectionThickness={1}
        sectionColor={[0.5, 0.5, 0.5]}
        fadeDistance={50}
      />
      {initialPositions.map((position, index) => (
        <AnimatedBox key={index} initialPosition={position} />
      ))}
    </>
  );
}

export default function Hero() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section className="pt-32 pb-20 px-4 w-full relative before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.2)_45%,rgba(0,0,0,0.9)_100%)] before:pointer-events-none before:z-20">
      {isClient && (
        <div className="absolute inset-0 opacity-50">
          <Suspense fallback={null}>
            <Canvas 
              shadows 
              camera={{ 
                position: [20, 20, 20], 
                fov: 30,
              }}
            >
              <Scene />
            </Canvas>
          </Suspense>
        </div>
      )}
      <div className="container mx-auto text-center w-[80%] relative z-10">
        <div className="inline-flex items-center bg-purple-500/10 rounded-full px-4 py-2 mb-6">
          <span className="text-purple-500 text-sm">Code the Future with Kinetic AI</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold mb-6">
          Introducing <span className="text-purple-500">Kinetic AI</span>
          <br />
          Next-Gen AI Code Generator for Every Tech Stack.
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto mb-8">
          Generate complete, production-ready code with a detailed file structure. Choose your tech stack, and let Kinetic AI do the rest.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="outline"
            className="border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white px-8"
          >
            Start Building
          </Button>
        </div>
      </div>

      <div className="mt-16 relative z-10">
        <div className="w-[fit-content] h-[400px] mx-auto rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] overflow-hidden">
          <img
            src="dashboard.webp"
            alt="Dashboard Preview"
            className="w-full h-full object-cover object-center rounded-lg"
          />
        </div>
      </div>
    </section>
  );
}
