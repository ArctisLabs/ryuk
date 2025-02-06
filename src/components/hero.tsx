"use client";

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { useEffect, useRef, useState, Suspense } from 'react'
import * as THREE from 'three'
import { Button } from "@/components/ui/button"

function AnimatedBox({ initialPosition }: { initialPosition: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [targetPosition, setTargetPosition] = useState(new THREE.Vector3(...initialPosition))
  const currentPosition = useRef(new THREE.Vector3(...initialPosition))

  const getAdjacentIntersection = (current: THREE.Vector3) => {
    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]
    const randomDirection = directions[Math.floor(Math.random() * directions.length)]
    return new THREE.Vector3(
      current.x + randomDirection[0] * 3,
      0.5,
      current.z + randomDirection[1] * 3
    )
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const newPosition = getAdjacentIntersection(currentPosition.current)
      newPosition.x = Math.max(-15, Math.min(15, newPosition.x))
      newPosition.z = Math.max(-15, Math.min(15, newPosition.z))
      setTargetPosition(newPosition)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useFrame((state, delta) => {
    if (meshRef.current) {
      currentPosition.current.lerp(targetPosition, 0.1)
      meshRef.current.position.copy(currentPosition.current)
    }
  })

  return (
    <mesh ref={meshRef} position={initialPosition}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ffffff" opacity={0.9} transparent />
      <lineSegments>
        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(1, 1, 1)]} />
        <lineBasicMaterial attach="material" color="#000000" linewidth={2} />
      </lineSegments>
    </mesh>
  )
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
  ]

  return (
    <>
      <OrbitControls />
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
  )
}

export default function Hero(){
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <section className="pt-32 pb-20 px-4 w-full bg-[linear-gradient(to_right,#4f4f4f3e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f3e_1px,transparent_1px)] bg-[size:6rem_6rem] bg-[position:4rem_4rem] [mask-image:radial-gradient(circle_at_center,black_60%,transparent_80%)]">
        <div className="container mx-auto text-center w-[60%]">
          <div className="inline-flex items-center bg-purple-500/10 rounded-full px-4 py-2 mb-6">
            <span className="text-purple-500 text-sm">Introducing the future of Coding</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Introducing <span className="text-purple-500">Kinetic AI</span>
            <br />
            Your AI-Powered Code Writer
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Bolt AI is a powerful AI tool that can write code for you. It's like having a pair of hands that can write code for you while you focus on the big picture.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8">Get Started</Button>
            <Button
              variant="outline"
              className="border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white px-8"
            >
              Explore More
            </Button>
          </div>
        </div>

        <div className="mt-16 relative">
          <div className="w-[fit-content] h-[400px] mx-auto rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] overflow-hidden">
            <img 
              src="dashboard.webp" 
              alt="Dashboard Preview" 
              className="w-full h-full object-cover object-center rounded-lg"
            />
          </div>
        </div>
        {/* {isClient && (
            <Suspense fallback={null}>
              <Canvas shadows camera={{ position: [30, 30, 30], fov: 50 }} className="absolute !important w-full h-full top-0 left-0">
                <Scene />
              </Canvas>
            </Suspense>
        )} */}
    </section>
  )
}
