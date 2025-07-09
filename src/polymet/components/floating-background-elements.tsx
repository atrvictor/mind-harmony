"use client";

import React, { useEffect, useRef } from "react";
import KabbalisticSymbol from "@/polymet/components/kabbalistic-symbols";

interface FloatingElement {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  symbol: "tree-of-life" | "ain-soph" | "hebrew-letter" | "sephirot";
  rotation: number;
  rotationSpeed: number;
}

interface FloatingBackgroundElementsProps {
  count?: number;
  color?: string;
  className?: string;
  fullWidth?: boolean;
  extendDown?: boolean;
}

export default function FloatingBackgroundElements({
  count = 6,
  color = "#F5F0E5",
  className = "",
  fullWidth = false,
  extendDown = false,
}: FloatingBackgroundElementsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<FloatingElement[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    // Initialize floating elements with wider distribution
    elementsRef.current = Array.from({ length: count }, () => {
      // For fullWidth, use the entire container width
      // For extendDown, position elements more toward the bottom
      let xPosition = fullWidth
        ? Math.random() * containerWidth
        : Math.random() * (containerWidth * 0.8) + containerWidth * 0.1;
      
      // Ensure the xPosition never exceeds the container width
      // Allow for a 70px margin (maximum element size)
      const maxSafeX = containerWidth - 70;
      xPosition = Math.min(xPosition, maxSafeX);
      
      const yPosition = extendDown
        ? Math.random() * containerHeight * 1.5 // Position some elements below the visible area
        : Math.random() * containerHeight;

      return {
        x: xPosition,
        y: yPosition,
        size: Math.random() * 40 + 30, // Size between 30-70px (increased)
        opacity: Math.random() * 0.4 + 0.1, // Opacity between 0.1-0.5 (increased)
        speed: Math.random() * 0.5 + 0.2, // Speed between 0.2-0.7
        symbol: ["tree-of-life", "ain-soph", "hebrew-letter", "sephirot"][
          Math.floor(Math.random() * 4)
        ] as any,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 0.5, // Rotation speed between -0.25 and 0.25 degrees per frame
      };
    });

    // Animation function
    const animate = () => {
      elementsRef.current = elementsRef.current.map((element) => {
        // Move element
        let newY = element.y - element.speed;

        // Reset position if element moves out of view
        // For extendDown, reset to a position below the container
        if (newY < -100) {
          newY = extendDown
            ? containerHeight + Math.random() * (containerHeight * 0.5)
            : containerHeight + 50;
        }

        // Update rotation
        const newRotation = element.rotation + element.rotationSpeed;

        return {
          ...element,
          y: newY,
          rotation: newRotation,
        };
      });

      // Request next animation frame
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    // Cleanup function
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [count, fullWidth, extendDown]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {elementsRef.current.map((element, index) => (
        <div
          key={index}
          className="absolute transition-opacity duration-1000"
          style={{
            left: `${element.x}px`,
            top: `${element.y}px`,
            opacity: element.opacity,
            transform: `rotate(${element.rotation}deg)`,
          }}
        >
          <KabbalisticSymbol symbol={element.symbol} color={color} size="lg" />
        </div>
      ))}
    </div>
  );
}
