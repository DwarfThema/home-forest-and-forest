import { Html, useProgress } from "@react-three/drei";
import { useEffect } from "react";

export default function LoadingScreen() {
  const loading = useProgress();

  useEffect(() => {
    console.log(loading.loaded);
  }, [loading]);

  return (
    <Html center>
      <div className="absolute z-[30] text-white w-screen h-screen">
        {loading.progress} % loaded
      </div>
    </Html>
  );
}
