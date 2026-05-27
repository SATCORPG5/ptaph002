"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  MeshDistortMaterial, 
  Sphere, 
  Float, 
  PerspectiveCamera,
  Environment
} from "@react-three/drei";
import * as THREE from "three";

function Scene() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Smooth rotation
    meshRef.current.rotation.x += 0.005;
    meshRef.current.rotation.y += 0.005;
    
    // React to mouse - scaled down intensity but kept the lerp
    const targetX = state.mouse.x * 0.4;
    const targetY = state.mouse.y * 0.4;
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.05);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.05);
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <Environment preset="night" />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#FF3C5F" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#A78BFA" />

      <Float
        speed={4} // Animation speed, defaults to 1
        rotationIntensity={1} // XYZ rotation intensity, defaults to 1
        floatIntensity={1} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
      >
        <Sphere
          ref={meshRef}
          args={[1.6, 128, 128]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <MeshDistortMaterial
            color={hovered ? "#FF3C5F" : "#A78BFA"}
            distort={0.45}
            speed={2.5}
            roughness={0.05}
            metalness={0.9}
            emissive={hovered ? "#FF3C5F" : "#7C5FC4"}
            emissiveIntensity={hovered ? 0.8 : 0.4}
          />
        </Sphere>
      </Float>
    </>
  );
}

export function Hero3DObject() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <motion.div 
      ref={containerRef} 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isVisible ? { opacity: 0.75, scale: 1 } : { opacity: 0 }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
      className="absolute inset-0 z-0 pointer-events-none"
    >
      <Canvas 
        frameloop={isVisible ? "always" : "demand"}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
      </Canvas>
    </motion.div>
  );
}
