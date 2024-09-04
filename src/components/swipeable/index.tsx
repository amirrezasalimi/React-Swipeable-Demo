import React, { useCallback, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
} from "framer-motion";
import { cn } from "@udecode/cn";

interface SwipeableProfileCardProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  className?: string;
  children: React.ReactNode[];
}

const Swipeable: React.FC<SwipeableProfileCardProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  className,
}) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0, 1, 1, 1, 0]);
  const backScale = useTransform(
    x,
    [-300, -150, 0, 150, 300],
    [1, 0.98, 0.96, 0.98, 1]
  );

  const frontControls = useAnimation();
  const backControls = useAnimation();

  const [isSwiping, setIsSwiping] = useState(false);
  const startPointerX = useRef<number | null>(null);
  const startPointerY = useRef<number | null>(null);

  const handleSwipe = useCallback(
    async (direction: "left" | "right") => {
      const xDirection = direction === "left" ? -1 : 1;
      await Promise.all([
        frontControls.start({
          x: xDirection * 300,
          opacity: 0,
          transition: { duration: 0.2 },
        }),
        backControls.start({ scale: 1, transition: { duration: 0.2 } }),
      ]);
      if (direction === "left") {
        onSwipeLeft();
      } else {
        onSwipeRight();
      }
      frontControls.set({ x: 0, opacity: 1 });
      backControls.set({ scale: 0.96 });
      x.set(0);
    },
    [frontControls, backControls, onSwipeLeft, onSwipeRight, x]
  );

  const handlePointerStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    startPointerX.current = clientX;
    startPointerY.current = clientY;
  };

  const handlePointerMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (startPointerX.current === null || startPointerY.current === null)
      return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const deltaX = clientX - startPointerX.current;
    const deltaY = clientY - startPointerY.current;

    if (
      !isSwiping &&
      Math.abs(deltaX) > Math.abs(deltaY) &&
      Math.abs(deltaX) > 10
    ) {
      setIsSwiping(true);
    }

    if (isSwiping) {
      x.set(deltaX);
      e.preventDefault();
    }
  };

  const handlePointerEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (isSwiping) {
      const clientX =
        "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
      const deltaX = clientX - (startPointerX.current || 0);
      const threshold = 100;

      if (Math.abs(deltaX) > threshold) {
        handleSwipe(deltaX > 0 ? "right" : "left");
      } else {
        frontControls.start({ x: 0, opacity: 1 });
      }

      setIsSwiping(false);
    }

    startPointerX.current = null;
    startPointerY.current = null;
  };

  const current = children[0];
  const next = children[1];

  return (
    <div className={className}>
      {next && (
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{ scale: backScale }}
          animate={backControls}
          initial={{ scale: 0.96 }}
        >
          {next}
        </motion.div>
      )}
      <motion.div
        className="absolute inset-0 w-full h-full"
        animate={frontControls}
        style={{ x, rotate, opacity }}
        onTouchStart={handlePointerStart}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerEnd}
        onMouseDown={handlePointerStart}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerEnd}
        onMouseLeave={handlePointerEnd}
      >
        <div
          className={cn("h-full", isSwiping && "pointer-events-none")}
          style={{ touchAction: "pan-y" }}
        >
          {current}
        </div>
      </motion.div>
    </div>
  );
};

export default Swipeable;
