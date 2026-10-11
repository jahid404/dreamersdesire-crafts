"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { initLittoralScene, LittoralSceneController } from "./littoral-scene";
import { LittoralClock } from "./LittoralClock";
import { LittoralControls } from "./LittoralControls";
import styles from "./littoral.module.css";

export default function LittoralExperience() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sliderRef = useRef<HTMLInputElement | null>(null);
  const timeRef = useRef<HTMLDivElement | null>(null);
  const dateRef = useRef<HTMLDivElement | null>(null);
  const fallbackRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<LittoralSceneController | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLive, setIsLive] = useState<boolean>(true);
  const [hintGone, setHintGone] = useState<boolean>(false);

  const handleInteraction = useCallback(() => {
    setHintGone(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const controller = initLittoralScene(canvas, {
      onTimeChange: (minutes, timeLabel, dateLabel) => {
        if (timeRef.current) timeRef.current.textContent = timeLabel;
        if (dateRef.current) dateRef.current.textContent = dateLabel;
        if (sliderRef.current && document.activeElement !== sliderRef.current) {
          sliderRef.current.value = String(minutes);
        }
      },
      onInteraction: handleInteraction,
      onError: () => {
        if (fallbackRef.current) {
          fallbackRef.current.style.display = "flex";
        }
      },
    });

    if (!controller) {
      if (fallbackRef.current) {
        fallbackRef.current.style.display = "flex";
      }
      return;
    }

    controllerRef.current = controller;

    if (sliderRef.current) {
      sliderRef.current.style.setProperty("--sky", controller.getTrackGradient());
    }

    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, [handleInteraction]);

  const togglePlay = () => {
    setIsPlaying((prev) => {
      const next = !prev;
      if (next) setIsLive(false);
      controllerRef.current?.setPlaying(next);
      return next;
    });
    handleInteraction();
  };

  const handleLiveToggle = () => {
    setIsLive(true);
    setIsPlaying(false);
    controllerRef.current?.setLive(true);
    handleInteraction();
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setIsLive(false);
    setIsPlaying(false);
    controllerRef.current?.setHour(val);
    handleInteraction();
  };

  return (
    <div className={styles.container}>
      <Link href="/#projects" className={styles.backButton} aria-label="Back to Crafts">
        <ArrowLeft size={16} />
        <span>Crafts</span>
      </Link>

      <canvas
        ref={canvasRef}
        className={styles.scene}
        aria-label="A boy standing on beach sand with waves washing over his feet, the shore behind him and the sea in front. Drag to look around."
      />

      <LittoralClock ref={timeRef} dateRef={dateRef} />

      <LittoralControls
        ref={sliderRef}
        isPlaying={isPlaying}
        isLive={isLive}
        hintGone={hintGone}
        onTogglePlay={togglePlay}
        onToggleLive={handleLiveToggle}
        onSliderChange={handleSliderChange}
      />

      <div ref={fallbackRef} className={styles.fallback} style={{ display: "none" }}>
        This scene needs WebGL, which your browser has turned off.
      </div>
    </div>
  );
}
