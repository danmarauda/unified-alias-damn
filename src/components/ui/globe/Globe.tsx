"use client";

import * as React from "react";
import { Html, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { Doc } from "../../../../convex/_generated/dataModel";

// Earth radius
const EARTH_RADIUS = 5;
const DEFAULT_COLOR = "#3060D1"; // Default color for points

// Define the type for project activity data
type ProjectActivity = Doc<"projectActivities">;

interface ActivityPointProps {
  lat: number;
  lng: number;
  size?: number;
  color?: string;
  label?: string;
}

// Activity point component
function ActivityPoint({
  lat,
  lng,
  size = 0.15,
  color = DEFAULT_COLOR,
  label,
}: ActivityPointProps) {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const meshRef = useRef<THREE.Mesh>(null);

  // Convert lat/lng to 3D position
  const phi: number = (90 - lat) * (Math.PI / 180);
  const theta: number = (lng + 180) * (Math.PI / 180);

  const x: number = -(EARTH_RADIUS * Math.sin(phi) * Math.cos(theta));
  const y: number = EARTH_RADIUS * Math.cos(phi);
  const z: number = EARTH_RADIUS * Math.sin(phi) * Math.sin(theta);

  // Small random offset to avoid z-fighting
  const offset: number = Math.random() * 0.05;

  return (
    <group position={[x, y, z]}>
      <mesh
        ref={meshRef}
        onPointerOut={() => setShowTooltip(false)}
        onPointerOver={() => setShowTooltip(true)}
        position={[0, 0, offset]}
      >
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial color={color} opacity={0.8} transparent />
        {showTooltip && label && (
          <Html
            position={[0, size + 0.5, 0]}
            style={{
              background: "rgba(0, 0, 0, 0.8)",
              padding: "8px 12px",
              borderRadius: "4px",
              color: "white",
              fontSize: "12px",
              pointerEvents: "none",
              whiteSpace: "nowrap",
              transform: "translate(-50%, -100%)",
              maxWidth: "200px",
            }}
          >
            {label}
          </Html>
        )}
      </mesh>
    </group>
  );
}

interface EarthProps {
  points: ProjectActivity[];
  children?: React.ReactNode;
}

// Earth component with wireframe
function Earth({ points }: EarthProps) {
  const earthRef = useRef<THREE.Group>(null);
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);

  // Rotate the earth slowly
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev: [number, number, number]) => [prev[0], prev[1] - 0.002, prev[2]]);
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <group ref={earthRef} rotation={rotation}>
      {/* Earth wireframe sphere */}
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
        <meshBasicMaterial
          color="#30354d"
          opacity={0.3}
          transparent
          wireframe
        />
      </mesh>

      {/* Activity points */}
      {points.map((point) => (
        <ActivityPoint
          color={
            point.type === "development"
              ? "#3060D1"
              : point.type === "testing"
                ? "#5A7DE9"
                : point.type === "deployment"
                  ? "#50C878"
                  : "#F9A826"
          }
          key={point._id}
          label={`${point.project}: ${point.action}`}
          lat={point.location.lat}
          lng={point.location.lng}
          size={point.importance * 0.1}
        />
      ))}
    </group>
  );
}

interface GlobeProps {
  points: ProjectActivity[];
}

// Main globe component
export default function Globe({ points }: GlobeProps) {
  return (
    <Canvas
      camera={{
        position: [0, 0, 16],
        fov: 45,
        near: 0.1,
        far: 1000,
      }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.8} />
      <spotLight angle={0.15} penumbra={1} position={[10, 10, 10]} />
      <Earth points={points} />
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.5}
        enablePan={false}
        enableZoom={false}
        rotateSpeed={0.4}
      />
    </Canvas>
  );
}