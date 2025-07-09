import * as React from "react";

export function useScrollZoom(threshold: number = 0.3) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [isActive, setIsActive] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
      },
      {
        threshold,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return { containerRef, isActive } as const;
} 