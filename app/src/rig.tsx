import { CameraControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { Scene, Vector3 } from "three";
import { useRoute } from "wouter";

export default function Rig({
  position = new Vector3(0, 0, 0),
  focus = new Vector3(0, 0, 0),
  camSpeed,
}: {
  position?: Vector3;
  focus?: Vector3;
  camSpeed?: number;
}) {
  const { controls, scene } = useThree() as { controls: any; scene: Scene };
  const [, params] = useRoute("/:id");
  useEffect(() => {
    const enter = scene.getObjectByName(params?.id as string);
    if (enter) {
      enter?.parent?.localToWorld(position.set(1, -0.7, -2.2));
      enter?.parent?.localToWorld(focus.set(5, -0.7, -2.2));
    }
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
