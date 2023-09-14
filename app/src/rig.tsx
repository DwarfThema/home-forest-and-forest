import { CameraControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { Scene, Vector3 } from "three";

export default function Rig({
  position = new Vector3(0, 0, 0),
  focus = new Vector3(0, 0, 0),
  camSpeed,
}: {
  position?: Vector3;
  focus?: Vector3;
  camSpeed?: number;
}) {
  const { controls } = useThree() as { controls: any };
  useEffect(() => {
    controls?.setLookAt(...position.toArray(), ...focus.toArray(), true);
  });

  return (
    <CameraControls
      makeDefault
      maxSpeed={camSpeed}
      minPolarAngle={0}
      maxPolarAngle={Math.PI / 2}
    />
  );
}
