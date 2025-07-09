"use client";

import React, { useEffect, useRef } from "react";

interface AnimatedTreeOfLifeProps {
  color?: string;
  accentColor?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function AnimatedTreeOfLife({
  color = "#F5F0E5",
  accentColor = "#D4AF37",
  className = "",
  size = "md",
}: AnimatedTreeOfLifeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number>(0);
  const pulseStateRef = useRef<number[]>(Array(10).fill(0));
  const pulseDirectionRef = useRef<boolean[]>(Array(10).fill(true));

  const sizeClasses = {
    sm: "w-32 h-48",
    md: "w-48 h-72",
    lg: "w-64 h-96",
  };

  // Sephirot positions
  const sephirotPositions = [
    { cx: 50, cy: 10, name: "Keter" }, // Crown
    { cx: 30, cy: 30, name: "Chokmah" }, // Wisdom
    { cx: 70, cy: 30, name: "Binah" }, // Understanding
    { cx: 50, cy: 50, name: "Tiferet" }, // Beauty
    { cx: 20, cy: 70, name: "Gevurah" }, // Severity
    { cx: 80, cy: 70, name: "Chesed" }, // Mercy
    { cx: 30, cy: 90, name: "Hod" }, // Splendor
    { cx: 70, cy: 90, name: "Netzach" }, // Victory
    { cx: 50, cy: 110, name: "Yesod" }, // Foundation
    { cx: 50, cy: 150, name: "Malkuth" }, // Kingdom
  ];

  useEffect(() => {
    if (!svgRef.current) return;

    const animate = () => {
      // Update pulse state for each sephirot
      for (let i = 0; i < 10; i++) {
        // Determine if we're increasing or decreasing the pulse
        if (pulseDirectionRef.current[i]) {
          pulseStateRef.current[i] += 0.01;
          if (pulseStateRef.current[i] >= 1) {
            pulseDirectionRef.current[i] = false;
          }
        } else {
          pulseStateRef.current[i] -= 0.01;
          if (pulseStateRef.current[i] <= 0) {
            pulseDirectionRef.current[i] = true;
          }
        }

        // Apply the pulse effect to the circle
        const circle = svgRef.current?.querySelectorAll("circle")[i];
        if (circle) {
          const pulseValue = pulseStateRef.current[i];
          circle.setAttribute(
            "fill-opacity",
            (0.1 + pulseValue * 0.2).toString()
          );

          // Occasionally highlight a random sephirot
          if (Math.random() < 0.001) {
            circle.setAttribute("stroke", accentColor);
            setTimeout(() => {
              circle.setAttribute("stroke", color);
            }, 1000);
          }
        }
      }

      // Request next animation frame
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    // Cleanup function
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [color, accentColor]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 100 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeClasses[size]} ${className}`}
    >
      {/* Connecting lines */}
      <line
        x1="50"
        y1="18"
        x2="50"
        y2="42"
        stroke={color}
        strokeWidth="1.5"
        strokeOpacity="0.6"
      />

      <line
        x1="50"
        y1="58"
        x2="50"
        y2="102"
        stroke={color}
        strokeWidth="1.5"
        strokeOpacity="0.6"
      />

      <line
        x1="50"
        y1="118"
        x2="50"
        y2="142"
        stroke={color}
        strokeWidth="1.5"
        strokeOpacity="0.6"
      />

      <line
        x1="36"
        y1="34"
        x2="44"
        y2="46"
        stroke={color}
        strokeWidth="1.5"
        strokeOpacity="0.6"
      />

      <line
        x1="64"
        y1="34"
        x2="56"
        y2="46"
        stroke={color}
        strokeWidth="1.5"
        strokeOpacity="0.6"
      />

      <line
        x1="26"
        y1="76"
        x2="44"
        y2="90"
        stroke={color}
        strokeWidth="1.5"
        strokeOpacity="0.6"
      />

      <line
        x1="74"
        y1="76"
        x2="56"
        y2="90"
        stroke={color}
        strokeWidth="1.5"
        strokeOpacity="0.6"
      />

      <line
        x1="36"
        y1="94"
        x2="44"
        y2="106"
        stroke={color}
        strokeWidth="1.5"
        strokeOpacity="0.6"
      />

      <line
        x1="64"
        y1="94"
        x2="56"
        y2="106"
        stroke={color}
        strokeWidth="1.5"
        strokeOpacity="0.6"
      />

      <line
        x1="38"
        y1="30"
        x2="62"
        y2="30"
        stroke={color}
        strokeWidth="1.5"
        strokeOpacity="0.6"
      />

      <line
        x1="28"
        y1="70"
        x2="72"
        y2="70"
        stroke={color}
        strokeWidth="1.5"
        strokeOpacity="0.6"
      />

      <line
        x1="38"
        y1="90"
        x2="62"
        y2="90"
        stroke={color}
        strokeWidth="1.5"
        strokeOpacity="0.6"
      />

      {/* Circles representing the Sephirot */}
      {sephirotPositions.map((sephirot, index) => (
        <circle
          key={index}
          cx={sephirot.cx}
          cy={sephirot.cy}
          r="8"
          stroke={color}
          strokeWidth="1.5"
          fill={color}
          fillOpacity="0.1"
        >
          <title>{sephirot.name}</title>
        </circle>
      ))}
    </svg>
  );
}
