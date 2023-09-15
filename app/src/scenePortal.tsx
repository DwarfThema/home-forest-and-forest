import { useControls } from "leva";
import { useEffect, useState } from "react";
import Sign from "./inner/sign";
import { Gltf } from "@react-three/drei";
import Elephant from "./inner/elephant";
import Statics from "./inner/statics";
import AnimModel from "./animModel";

export function ScenePortal() {
  return (
    <group position={[0, 0, 0]} name="innerObject">
      <Sign />
      <Statics movementIntensity={0.08} />
      <Elephant />
    </group>
  );
}
