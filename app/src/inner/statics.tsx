import { Float, useGLTF } from "@react-three/drei";
import { useGraph } from "@react-three/fiber";
import { Group, Mesh } from "three";

export default function Statics({ ...props }) {
  const { scene: staticScene } = useGLTF("/models/plant_static.gltf");
  const { nodes: staticNodes } = useGraph(staticScene);

  const plantMesh = staticNodes.mesh as Group;

  const staticsMeshs: Mesh[] = [];
  plantMesh.traverse((obj) => {
    if (obj instanceof Mesh) {
      staticsMeshs.push(obj);
    }
  });

  return (
    <group>
      {staticsMeshs.map((mesh, index) => {
        if (mesh.name.includes("bush")) {
          return (
            <mesh
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
            <Float
              key={index}
              speed={1}
              rotationIntensity={1}
              floatIntensity={2}
              floatingRange={[0, 0]}
            >
              <mesh
                geometry={mesh.geometry}
                material={mesh.material}
                position={mesh.position}
                receiveShadow
                castShadow
              />
            </Float>
          );
        }
      })}
    </group>
  );
}
