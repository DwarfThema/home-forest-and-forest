import { Float, useGLTF } from "@react-three/drei";
import { useFrame, useGraph } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Group, MathUtils, Mesh } from "three";
import { lerp } from "three/src/math/MathUtils.js";

export default function Statics({ movementIntensity = 0.08, ...props }) {
  const { scene: staticScene } = useGLTF("/models/inner_ground.gltf");
  const { nodes: staticNodes } = useGraph(staticScene);

  const plantMesh = staticNodes.mesh as Group;
  const staticsMeshs: Mesh[] = [];
  plantMesh.traverse((obj) => {
    if (obj instanceof Mesh) {
      staticsMeshs.push(obj);
    }
  });

  const [offsets] = useState<number[]>(
    Array(15)
      .fill(0)
      .map(() => Math.random() * 2 * Math.PI)
  );

  return (
    <group>
      {staticsMeshs.map((mesh, index) => {
        if (mesh.name.includes("cloud")) {
          return (
            <Float
              key={index}
              speed={1}
              rotationIntensity={1}
              floatIntensity={2}
              floatingRange={[0, 0]}
            >
              <mesh
                name="cloud"
                geometry={mesh.geometry}
                material={mesh.material}
                position={mesh.position}
                receiveShadow
                castShadow
              />
            </Float>
          );
        } else if (mesh.name.includes("Ground") || mesh.name.includes("bush")) {
          return (
            <mesh
              name="ground"
              key={index}
              geometry={mesh.geometry}
              material={mesh.material}
              position={mesh.position}
              receiveShadow
              castShadow
            />
          );
        } else {
          return (
            <MovingMesh
              key={index}
              geometry={mesh.geometry}
              material={mesh.material}
              position={mesh.position}
              movementIntensity={movementIntensity}
            />
          );
        }
      })}
    </group>
  );
}

const MovingMesh = ({
  geometry,
  material,
  position,
  movementIntensity,
}: any) => {
  const meshRef = useRef<Mesh | null>(null);
  const [ransomVal, setRansomVal] = useState(Math.random() * 2 * Math.PI);

  console.log(ransomVal);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (mesh) {
      const targetRotation =
        Math.sin(clock.getElapsedTime() + ransomVal) * movementIntensity;
      mesh.rotation.z = lerp(mesh.rotation.z, targetRotation, 0.05);
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={position}
      receiveShadow
      castShadow
    />
  );
};
