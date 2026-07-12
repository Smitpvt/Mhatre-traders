import React, { useRef } from "react";
import CountUp from "react-countup";
import { useInView } from "framer-motion";

// Resolve potential CommonJS/ESM packaging wrapper issues in Vite
const CountUpComponent = typeof CountUp === "function" 
  ? CountUp 
  : (CountUp && typeof CountUp === "object" && CountUp.default ? CountUp.default : CountUp);

export default function AnimatedCounter({ end, duration = 2.5, suffix = "", prefix = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <span ref={ref} className="font-headings font-semibold">
      {isInView && CountUpComponent ? (
        <CountUpComponent
          start={0}
          end={end}
          duration={duration}
          prefix={prefix}
          suffix={suffix}
          useEasing={true}
        />
      ) : (
        <span>{prefix}0{suffix}</span>
      )}
    </span>
  );
}

