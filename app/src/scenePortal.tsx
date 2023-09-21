import Elephant from "./inner/elephant";
import Statics from "./inner/statics";

export function ScenePortal() {
  return (
    <group position={[0, 0, 0]} name="innerObject">
      <Statics movementIntensity={0.4} />
      <Elephant />
    </group>
  );
}
