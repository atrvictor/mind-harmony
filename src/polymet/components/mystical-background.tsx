"use client";

import React, { useEffect, useRef } from "react";

interface MysticalBackgroundProps {
  className?: string;
  primaryColor?: string;
  secondaryColor?: string;
  density?: number;
  height?: string;
}

export default function MysticalBackground({
  className = "",
  primaryColor = "#F5F0E5",
  secondaryColor = "#D4AF37",
  density = 15, // Reduced default density
  height = "120vh", // Default height
}: MysticalBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions to match container
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.offsetWidth;
        // Ensure height is a valid number by parsing or using a safe default
        const parsedHeight = typeof height === 'string' ? parseInt(height) : height;
        canvas.height = parsedHeight || container.offsetHeight;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Create particles - significantly reduced quantity
    const particleCount = Math.floor(
      (canvas.width * canvas.height) / (40000 / density) // Increased divisor to reduce particle count
    );
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5, // Smaller particles
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        color: Math.random() > 0.8 ? secondaryColor : primaryColor, // More primary color particles
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    // Create sacred geometry patterns - increased quantity and variety
    const patterns: Pattern[] = [];
    const patternCount =
      Math.floor(canvas.width / 300) + Math.floor(canvas.height / 300) + 3; // More patterns based on canvas size

    for (let i = 0; i < patternCount; i++) {
      patterns.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 120 + 60, // Larger patterns
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.003,
        type: Math.floor(Math.random() * 5), // Increased pattern variety (0-4)
        opacity: Math.random() * 0.15 + 0.05,
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw and update patterns
      patterns.forEach((pattern) => {
        ctx.save();
        ctx.globalAlpha = pattern.opacity;
        ctx.translate(pattern.x, pattern.y);
        ctx.rotate(pattern.rotation);

        ctx.strokeStyle =
          pattern.type % 2 === 0 ? primaryColor : secondaryColor;
        ctx.lineWidth = 0.5;
        ctx.beginPath();

        switch (pattern.type) {
          case 0: // Flower of Life pattern
            for (let i = 0; i < 6; i++) {
              const angle = (Math.PI / 3) * i;
              const x = (Math.cos(angle) * pattern.size) / 2;
              const y = (Math.sin(angle) * pattern.size) / 2;
              ctx.beginPath();
              ctx.arc(x, y, pattern.size / 2, 0, Math.PI * 2);
              ctx.stroke();
            }
            ctx.beginPath();
            ctx.arc(0, 0, pattern.size / 2, 0, Math.PI * 2);
            ctx.stroke();
            break;
          case 1: // Metatron's Cube
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
              const angle = (Math.PI / 3) * i;
              const x = (Math.cos(angle) * pattern.size) / 2;
              const y = (Math.sin(angle) * pattern.size) / 2;
              ctx.moveTo(0, 0);
              ctx.lineTo(x, y);
            }
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(0, 0, pattern.size / 2, 0, Math.PI * 2);
            ctx.stroke();
            break;
          case 2: // Sri Yantra inspired
            for (let i = 3; i < 9; i++) {
              ctx.beginPath();
              ctx.moveTo(
                -pattern.size / 2,
                -pattern.size / 2 + (i * pattern.size) / 9
              );
              ctx.lineTo(
                pattern.size / 2,
                -pattern.size / 2 + (i * pattern.size) / 9
              );
              ctx.stroke();

              ctx.beginPath();
              ctx.moveTo(
                -pattern.size / 2 + (i * pattern.size) / 9,
                -pattern.size / 2
              );
              ctx.lineTo(
                -pattern.size / 2 + (i * pattern.size) / 9,
                pattern.size / 2
              );
              ctx.stroke();
            }
            break;
          case 3: // Tree of Life simplified
            // Vertical line
            ctx.beginPath();
            ctx.moveTo(0, -pattern.size / 2);
            ctx.lineTo(0, pattern.size / 2);
            ctx.stroke();

            // Horizontal lines
            ctx.beginPath();
            ctx.moveTo(-pattern.size / 3, -pattern.size / 4);
            ctx.lineTo(pattern.size / 3, -pattern.size / 4);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(-pattern.size / 3, 0);
            ctx.lineTo(pattern.size / 3, 0);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(-pattern.size / 3, pattern.size / 4);
            ctx.lineTo(pattern.size / 3, pattern.size / 4);
            ctx.stroke();

            // Circles at intersections
            for (
              let y = -pattern.size / 2;
              y <= pattern.size / 2;
              y += pattern.size / 4
            ) {
              if (y === -pattern.size / 2 || y === pattern.size / 2) {
                // Top and bottom circles
                ctx.beginPath();
                ctx.arc(0, y, pattern.size / 10, 0, Math.PI * 2);
                ctx.stroke();
              } else {
                // Middle row circles
                ctx.beginPath();
                ctx.arc(
                  -pattern.size / 3,
                  y,
                  pattern.size / 10,
                  0,
                  Math.PI * 2
                );
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(0, y, pattern.size / 10, 0, Math.PI * 2);
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(pattern.size / 3, y, pattern.size / 10, 0, Math.PI * 2);
                ctx.stroke();
              }
            }
            break;
          case 4: // Kabbalistic Star of David
            // First triangle
            ctx.beginPath();
            ctx.moveTo(0, -pattern.size / 2);
            ctx.lineTo((pattern.size / 2) * 0.866, pattern.size / 4);
            ctx.lineTo((-pattern.size / 2) * 0.866, pattern.size / 4);
            ctx.closePath();
            ctx.stroke();

            // Second triangle (inverted)
            ctx.beginPath();
            ctx.moveTo(0, pattern.size / 2);
            ctx.lineTo((pattern.size / 2) * 0.866, -pattern.size / 4);
            ctx.lineTo((-pattern.size / 2) * 0.866, -pattern.size / 4);
            ctx.closePath();
            ctx.stroke();

            // Center circle
            ctx.beginPath();
            ctx.arc(0, 0, pattern.size / 8, 0, Math.PI * 2);
            ctx.stroke();
            break;
        }

        ctx.restore();

        // Update pattern rotation
        pattern.rotation += pattern.rotationSpeed;

        // Slowly move patterns
        pattern.x += Math.sin(Date.now() * 0.0003) * 0.2;
        pattern.y += Math.cos(Date.now() * 0.0003) * 0.2;

        // Wrap patterns around screen
        if (pattern.x < -pattern.size) pattern.x = canvas.width + pattern.size;
        if (pattern.x > canvas.width + pattern.size) pattern.x = -pattern.size;
        if (pattern.y < -pattern.size) pattern.y = canvas.height + pattern.size;
        if (pattern.y > canvas.height + pattern.size) pattern.y = -pattern.size;
      });

      // Draw and update particles
      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();

        // Update particle position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap particles around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [primaryColor, secondaryColor, density, height]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ height }}
    />
  );
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
}

interface Pattern {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  type: number;
  opacity: number;
}
