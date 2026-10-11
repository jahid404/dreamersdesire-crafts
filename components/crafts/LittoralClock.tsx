import { forwardRef } from "react";
import styles from "./littoral.module.css";

interface LittoralClockProps {
  dateRef?: React.RefObject<HTMLDivElement | null>;
}

export const LittoralClock = forwardRef<HTMLDivElement, LittoralClockProps>(
  function LittoralClock({ dateRef }, timeRef) {
    return (
      <div className={styles.clock}>
        <div ref={timeRef} className={styles.time}>
          4:11 P.M.
        </div>
        <div ref={dateRef} className={styles.date}></div>
      </div>
    );
  }
);
