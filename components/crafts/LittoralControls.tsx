import { forwardRef } from "react";
import { Play, Pause } from "lucide-react";
import styles from "./littoral.module.css";

interface LittoralControlsProps {
  isPlaying: boolean;
  isLive: boolean;
  hintGone: boolean;
  onTogglePlay: () => void;
  onToggleLive: () => void;
  onSliderChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const LittoralControls = forwardRef<HTMLInputElement, LittoralControlsProps>(
  function LittoralControls(
    { isPlaying, isLive, hintGone, onTogglePlay, onToggleLive, onSliderChange },
    sliderRef
  ) {
    return (
      <div className={styles.controls}>
        <div className={`${styles.hint} ${hintGone ? styles.hintGone : ""}`}>
          Drag to look around or up at the sky. Pinch to move closer.
        </div>
        <div className={styles.bar}>
          <button
            className={styles.play}
            onClick={onTogglePlay}
            aria-pressed={isPlaying}
            aria-label={isPlaying ? "Pause the day" : "Play the day"}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            className={`${styles.live} ${isLive ? styles.liveActive : ""}`}
            onClick={onToggleLive}
            aria-pressed={isLive}
            aria-label="Follow the real time"
          >
            Live
          </button>
          <div className={styles.rail}>
            <input
              ref={sliderRef}
              className={styles.slider}
              type="range"
              min="0"
              max="1439"
              step="1"
              defaultValue={971}
              onChange={onSliderChange}
              aria-label="Time of day"
            />
            <div className={styles.ticks} aria-hidden="true">
              <span style={{ left: "0%" }}>12 am</span>
              <span style={{ left: "25%" }}>6 am</span>
              <span style={{ left: "50%" }}>Noon</span>
              <span style={{ left: "75%" }}>6 pm</span>
              <span style={{ left: "100%" }}>12 am</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
