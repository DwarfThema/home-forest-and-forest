import { Detailed, useGLTF } from "@react-three/drei";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { createRef, useEffect, useRef, useState } from "react";
import { Mesh, MeshStandardMaterial, TextureLoader } from "three";

const imgUrls = [
  "/textures/stars/1.png",
  "/textures/stars/2.png",
  "/textures/stars/3.png",
  "/textures/stars/4.png",
  "/textures/stars/5.png",
  "/textures/stars/6.png",
  "/textures/stars/7.png",
  "/textures/stars/8.png",
  "/textures/stars/9.png",
  "/textures/stars/10.png",
  "/textures/stars/11.png",
  "/textures/stars/12.png",
  "/textures/stars/13.png",
  "/textures/stars/14.png",
  "/textures/stars/15.png",
  "/textures/stars/16.png",
  "/textures/stars/17.png",
  "/textures/stars/18.png",
  "/textures/stars/19.png",
  "/textures/stars/20.png",
  "/textures/stars/21.png",
  "/textures/stars/22.png",
  "/textures/stars/23.png",
  "/textures/stars/24.png",
  "/textures/stars/25.png",
  "/textures/stars/26.png",
  "/textures/stars/27.png",
  "/textures/stars/28.png",
  "/textures/stars/29.png",
  "/textures/stars/30.png",
  "/textures/stars/31.png",
  "/textures/stars/32.png",
  "/textures/stars/33.png",
  "/textures/stars/34.png",
  "/textures/stars/35.png",
  "/textures/stars/36.png",
  "/textures/stars/37.png",
  "/textures/stars/38.png",
  "/textures/stars/39.png",
  "/textures/stars/40.png",
];

const minIntensity = 1.5;
const maxIntensity = 2;

export default function StarsBg(props: any) {
  const textures = useLoader(TextureLoader, imgUrls);
  const { camera } = useThree();
  const meshRefs = useRef<(React.RefObject<Mesh> | null)[]>([]);
  const [offsets, setOffsets] = useState<number[]>([]);

  useEffect(() => {
    setOffsets(imgUrls.map(() => Math.random() * Math.PI * 1));
    meshRefs.current = imgUrls.map(() => createRef<Mesh>());
  }, []);

  useFrame(({ clock }) => {
    meshRefs?.current?.forEach((ref, i) => {
      if (ref?.current) {
        ref.current.lookAt(camera.position);
        (ref.current.material as MeshStandardMaterial).emissiveIntensity =
          ((Math.sin(clock.getElapsedTime() + offsets[i]) + 1) / 2) *
          (maxIntensity - minIntensity);
      }
    });
  });

  const planes = imgUrls.map((_, i) => (
    <mesh receiveShadow castShadow key={i} ref={meshRefs.current[i]}>
      <planeGeometry args={[4, 4]} attach="geometry" />
      <meshStandardMaterial
        map={textures[i]}
        emissive={"#ffffe4"}
        attach="material"
        transparent={true}
      />
    </mesh>
  ));

  return (
    <Detailed distances={[0, 15, 25, 35, 100]} {...props}>
      {planes}
      <group />
    </Detailed>
  );
}
