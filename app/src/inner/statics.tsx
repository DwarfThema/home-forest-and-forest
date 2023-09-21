import { Float, useGLTF } from "@react-three/drei";
import { useFrame, useGraph } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Group, MathUtils, Mesh } from "three";
import { lerp } from "three/src/math/MathUtils.js";

export default function Statics({ movementIntensity = 0.08, ...props }) {
  const { scene: staticScene } = useGLTF("/models/inner_static.gltf");
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
        if (mesh.name.includes("cloud") || mesh.name.includes("birds")) {
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
        } else if (mesh.name.includes("sign")) {
          if (mesh.name.includes("base")) {
            return (
              <mesh
                name="sign_base"
                key={index}
                geometry={mesh.geometry}
                material={mesh.material}
                position={mesh.position}
                receiveShadow
                castShadow
              />
            );
          } else if (mesh.name.includes("home")) {
            return (
              <mesh
                name="sign_home"
                key={index}
                geometry={mesh.geometry}
                material={mesh.material}
                position={mesh.position}
                receiveShadow
                castShadow
                onClick={() => {
                  var newWindow = window.open("about:blank") as Window;
                  if (newWindow) {
                    newWindow.location.href = "https://sillyday.kr/";
                  }
                }}
              />
            );
          } else if (mesh.name.includes("sillyday")) {
            return (
              <mesh
                name="sign_sillyday"
                key={index}
                geometry={mesh.geometry}
                material={mesh.material}
                position={mesh.position}
                receiveShadow
                castShadow
                onClick={() => {
                  var newWindow = window.open("about:blank") as Window;
                  if (newWindow) {
                    newWindow.location.href =
                      "https://www.instagram.com/sillyday.official/";
                  }
                }}
              />
            );
          } else if (mesh.name.includes("sillysally")) {
            return (
              <mesh
                name="sign_sillysally"
                key={index}
                geometry={mesh.geometry}
                material={mesh.material}
                position={mesh.position}
                receiveShadow
                castShadow
                onClick={() => {
                  var newWindow = window.open("about:blank") as Window;
                  if (newWindow) {
                    newWindow.location.href =
                      "https://www.instagram.com/sillysally.official/";
                  }
                }}
              />
            );
          }
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

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (mesh) {
      const targetRotation =
        Math.sin(clock.getElapsedTime() + ransomVal) * movementIntensity;
      mesh.rotation.y = lerp(mesh.rotation.y, targetRotation, 0.05);
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
