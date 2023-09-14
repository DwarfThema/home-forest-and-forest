import { Float, useGLTF } from "@react-three/drei";
import { useFrame, useGraph } from "@react-three/fiber";
import { useRef, useState } from "react";
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

  const meshRefs = staticsMeshs.map(() => useRef<Mesh | null>(null));
  useFrame(({ clock }) => {
    meshRefs.forEach((ref, index) => {
      const mesh = ref.current;
      if (
        mesh &&
        !mesh?.name.includes("cloud") &&
        !mesh?.name.includes("Ground")
      ) {
        const targetRotation =
          Math.sin(clock.getElapsedTime() + index * 0.5) * movementIntensity;
        mesh.rotation.z = lerp(mesh.rotation.z, targetRotation, 0.05);
      }
    });
  });

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
            <mesh
              name="moving"
              ref={meshRefs[index]}
              key={index}
              geometry={mesh.geometry}
              material={mesh.material}
              position={mesh.position}
              receiveShadow
              castShadow
            />
          );
        }
      })}
    </group>
  );
}
