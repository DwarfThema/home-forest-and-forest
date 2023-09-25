import { CameraControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { Vector3 } from "three";

export default function Rig({
  position = new Vector3(0, 0, 0),
  focus = new Vector3(0, 0, 0),
  camSpeed,
  sqeuenceInt,
}: {
  position?: Vector3;
  focus?: Vector3;
  camSpeed?: number;
  sqeuenceInt?: number;
}) {
  const { controls } = useThree() as { controls: any };

  console.log(controls);

  const [rigFix, setRigFix] = useState(true);
  const [azimuteInt, setAzimuteInt] = useState(0);
  useEffect(() => {
    if (rigFix) {
      controls?.setLookAt(...position.toArray(), ...focus.toArray(), true);
    }

    if (sqeuenceInt === 6 && isMobile) {
      setTimeout(() => {
        setRigFix(false);
        setAzimuteInt(10);
      }, 4000);
    } else {
      setRigFix(true);
      setAzimuteInt(0);
    }
  });

  return (
    <>
      <CameraControls
        makeDefault
        maxSpeed={rigFix ? camSpeed : 0}
        minPolarAngle={Math.PI / 1.6}
        maxPolarAngle={0}
        minAzimuthAngle={-Math.PI / azimuteInt}
        maxAzimuthAngle={Math.PI / azimuteInt}
      />
    </>
  );
}
