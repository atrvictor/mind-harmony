"use client";

import React, { useEffect, useRef, useState } from "react";

interface HebrewLetterAnimationProps {
  color?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  interval?: number;
}

export default function HebrewLetterAnimation({
  color = "#F5F0E5",
  className = "",
  size = "md",
  interval = 3000,
}: HebrewLetterAnimationProps) {
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  // Hebrew letters with their meanings
  const hebrewLetters = [
    {
      name: "Aleph",
      path: "M30 20L50 80M50 80L70 20M35 50H65",
      meaning: "Unity, Oneness",
    },
    {
      name: "Bet",
      path: "M30 20H70V80H30V50H60",
      meaning: "Creation, Duality",
    },
    {
      name: "Gimel",
      path: "M60 20V80M30 30H60",
      meaning: "Movement, Balance",
    },
    {
      name: "Dalet",
      path: "M30 20H70V50H30",
      meaning: "Doorway, Humility",
    },
    {
      name: "Heh",
      path: "M30 20H70M30 20V80M30 50H60",
      meaning: "Breath, Revelation",
    },
  ];

  useEffect(() => {
    // Function to cycle through letters
    const cycleLetter = () => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentLetterIndex((prev) => (prev + 1) % hebrewLetters.length);
        setIsVisible(true);
      }, 500); // Wait for fade out before changing letter
    };

    // Set up interval
    intervalRef.current = setInterval(cycleLetter, interval);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [interval]);

  const currentLetter = hebrewLetters[currentLetterIndex];

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        className={`transition-opacity duration-500 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={sizeClasses[size]}
        >
          <path
            d={currentLetter.path}
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div
        className={`mt-2 text-center transition-opacity duration-500 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="font-semibold text-sm">{currentLetter.name}</div>
        <div className="text-xs text-muted-foreground">
          {currentLetter.meaning}
        </div>
      </div>
    </div>
  );
}
