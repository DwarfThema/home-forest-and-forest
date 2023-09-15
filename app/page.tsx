"use client";

import StarsBg from "./src/starBg";
import Book from "./src/book";
import { Environment, Sparkles } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { Suspense, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Image from "next/image";

export default function Home() {
  const positions = [...Array(300)]
    .map(() => ({
      position: [
        40 - Math.random() * 100,
        40 - Math.random() * 100,
        40 - Math.random() * 100,
      ],
    }))
    .filter(
      (pos) =>
        (pos.position[0] < 0 || pos.position[0] > 5) &&
        (pos.position[1] < 0 || pos.position[1] > 5) &&
        (pos.position[2] < 0 || pos.position[2] > 5)
    );

  const bookRef = useRef() as any;
  const [isBookStyle, setBookStyle] = useState(true);
  const [sequenceInt, setSequenceInt] = useState(0);

  return (
    <main className="w-screen h-screen bg-black">
      <div className="absolute z-20 m-10 w-20">
        {sequenceInt === 0 ? (
          <label className="bottom-56 left-1/2 z-20 flex cursor-pointer">
            <input
              type="checkbox"
              value=""
              className="sr-only peer"
              onClick={() => {
                bookRef.current.switchInput(isBookStyle);
                setBookStyle((prev) => !prev);
              }}
            />
            <div className="w-14 h-7 bg-green-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 dark:peer-focus:ring-pink-800 rounded-full peer dark:bg-green-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-green-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-green-600 peer-checked:bg-pink-600"></div>
          </label>
        ) : (
          <button
            onClick={() => {
              bookRef.current.reverseBtn();
            }}
          >
            <Image
              src="/textures/backArrow.png"
              width={100}
              height={100}
              alt="back"
            />
          </button>
        )}
      </div>

      <Canvas shadows camera={{ fov: 40, position: [0, 0, 30], focus: 0 }}>
        <Environment preset="park" />
        <color attach="background" args={["#202130"]} />
        <fog attach="fog" args={["#202030", 10, 70]} />
        <Suspense fallback={null}>
          <Book
            ref={bookRef}
            sqeunceFn={(result: number) => {
              setSequenceInt(result);
            }}
          />
          <Sparkles
            count={200}
            scale={[20, 20, 10]}
            size={1}
            speed={0.5}
            color={"#ff9152"}
          />
          <Sparkles
            count={200}
            scale={[20, 20, 10]}
            size={1}
            speed={0.5}
            color={"#fffd8f"}
          />
          {positions.map((props, i) => (
            <StarsBg key={i} {...props} />
          ))}
        </Suspense>
        <EffectComposer>
          <Bloom
            luminanceThreshold={0}
            luminanceSmoothing={1.5}
            intensity={1}
          />
          <Vignette eskil={false} offset={0.01} darkness={0.75} />
        </EffectComposer>
      </Canvas>
    </main>
  );
}
