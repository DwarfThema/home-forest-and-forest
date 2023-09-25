import { Float, useGLTF } from "@react-three/drei";
import { useFrame, useGraph } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Group, Mesh } from "three";
import { lerp } from "three/src/math/MathUtils.js";

export default function InnerScene({ ...props }) {
  const { scene: staticScene } = useGLTF("/models/inner.gltf");
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
    <group {...props}>
      {staticsMeshs.map((mesh, index) => {
        if (mesh.name.includes("cloud")) {
          return (
            <Float
              key={index}
              speed={1}
              rotationIntensity={0.4}
              floatIntensity={0.4}
              floatingRange={[0, 0]}
            >
              <mesh
                name="cloud"
                geometry={mesh.geometry}
                material={mesh.material}
                position={mesh.position}
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
        } else if (mesh.name.includes("moving")) {
          if (mesh.name.includes("Right")) {
            return (
              <MovingMesh
                key={index}
                geometry={mesh.geometry}
                material={mesh.material}
                position={mesh.position}
                right={true}
              />
            );
          } else {
            return (
              <MovingMesh
                key={index}
                geometry={mesh.geometry}
                material={mesh.material}
                position={mesh.position}
                right={false}
              />
            );
          }
        } else if (mesh.name.includes("shaking")) {
          return (
            <ShakingMesh
              key={index}
              geometry={mesh.geometry}
              material={mesh.material}
              position={mesh.position}
              movementIntensity={0.4}
            />
          );
        } else if (mesh.name.includes("tilt")) {
          return (
            <TiltMesh
              key={index}
              geometry={mesh.geometry}
              material={mesh.material}
              position={mesh.position}
              movementIntensity={0.1}
            />
          );
        } else {
          return (
            <mesh
              name="static"
              key={index}
              geometry={mesh.geometry}
              material={mesh.material}
              position={mesh.position}
            />
          );
        }
      })}
    </group>
  );
}

const MovingMesh = ({ geometry, material, position, right }: any) => {
  const meshRef = useRef<Mesh | null>(null);

  const xPointMax = 6.3;
  const xPointMin = -4.2;
  const speed = 5;
  const rotationSpeed = 0.8; // 회전 속도

  const [direction, setDirection] = useState(1); // 1: 오른쪽, -1: 왼쪽
  const [targetRotation, setTargetRotation] = useState(0); // 타겟 회전 값
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.x = position.x;
      if (right && position.x < xPointMax) {
        setDirection(1);
      } else if (!right && position.x > xPointMin) {
        setDirection(-1);
      }
    }
  }, []);

  useFrame((state, delta) => {
    const mesh = meshRef.current;

    if (mesh) {
      // 회전 중이 아니면 x 위치 업데이트
      if (!isRotating) {
        const targetX = mesh.position.x + direction * speed * delta;
        mesh.position.x = lerp(mesh.position.x, targetX, 0.05);
      }

      // 회전 및 방향 체크
      if (direction === 1 && mesh.position.x >= xPointMax && !isRotating) {
        setDirection(-1);
        setTargetRotation(mesh.rotation.y + Math.PI);
        setIsRotating(true);
      } else if (
        direction === -1 &&
        mesh.position.x <= xPointMin &&
        !isRotating
      ) {
        setDirection(1);
        setTargetRotation(mesh.rotation.y + Math.PI);
        setIsRotating(true);
      }

      // 180도 회전
      if (isRotating) {
        mesh.rotation.y = lerp(
          mesh.rotation.y,
          targetRotation,
          rotationSpeed * delta
        );
        if (Math.abs(mesh.rotation.y - targetRotation) < 0.01) {
          mesh.rotation.y = targetRotation;
          setIsRotating(false);
        }
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={position}
    />
  );
};

const ShakingMesh = ({
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
      mesh.rotation.y = lerp(mesh.rotation.y, targetRotation, 0.01);
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={position}
    />
  );
};

const TiltMesh = ({ geometry, material, position, movementIntensity }: any) => {
  const meshRef = useRef<Mesh | null>(null);
  const [ransomVal, setRansomVal] = useState(Math.random() * 2 * Math.PI);

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
    />
  );
};
