import { Html, useProgress } from "@react-three/drei";
import { useEffect } from "react";

export default function LoadingScreen() {
  const loading = useProgress();

  useEffect(() => {}, [loading]);

  return (
    <Html center>
      <div className="absolute z-[30] text-white w-screen h-screen">
        {Math.floor((loading.loaded / 68) * 100)} % loaded
      </div>
    </Html>
  );
}
