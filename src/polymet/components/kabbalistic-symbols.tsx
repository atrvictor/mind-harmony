import React from "react";

interface KabbalisticSymbolProps {
  symbol: "tree-of-life" | "ain-soph" | "hebrew-letter" | "sephirot";
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

export default function KabbalisticSymbol({
  symbol,
  size = "md",
  color = "currentColor",
  className = "",
}: KabbalisticSymbolProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const renderSymbol = () => {
    switch (symbol) {
      case "tree-of-life":
        return (
          <svg
            viewBox="0 0 100 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${sizeClasses[size]} ${className}`}
          >
            {/* Circles representing the Sephirot */}
            <circle cx="50" cy="10" r="8" stroke={color} strokeWidth="1.5" />

            <circle cx="30" cy="30" r="8" stroke={color} strokeWidth="1.5" />

            <circle cx="70" cy="30" r="8" stroke={color} strokeWidth="1.5" />

            <circle cx="50" cy="50" r="8" stroke={color} strokeWidth="1.5" />

            <circle cx="20" cy="70" r="8" stroke={color} strokeWidth="1.5" />

            <circle cx="80" cy="70" r="8" stroke={color} strokeWidth="1.5" />

            <circle cx="30" cy="90" r="8" stroke={color} strokeWidth="1.5" />

            <circle cx="70" cy="90" r="8" stroke={color} strokeWidth="1.5" />

            <circle cx="50" cy="110" r="8" stroke={color} strokeWidth="1.5" />

            <circle cx="50" cy="150" r="8" stroke={color} strokeWidth="1.5" />

            {/* Connecting lines */}
            <line
              x1="50"
              y1="18"
              x2="50"
              y2="42"
              stroke={color}
              strokeWidth="1.5"
            />

            <line
              x1="50"
              y1="58"
              x2="50"
              y2="102"
              stroke={color}
              strokeWidth="1.5"
            />

            <line
              x1="50"
              y1="118"
              x2="50"
              y2="142"
              stroke={color}
              strokeWidth="1.5"
            />

            <line
              x1="36"
              y1="34"
              x2="44"
              y2="46"
              stroke={color}
              strokeWidth="1.5"
            />

            <line
              x1="64"
              y1="34"
              x2="56"
              y2="46"
              stroke={color}
              strokeWidth="1.5"
            />

            <line
              x1="26"
              y1="76"
              x2="44"
              y2="90"
              stroke={color}
              strokeWidth="1.5"
            />

            <line
              x1="74"
              y1="76"
              x2="56"
              y2="90"
              stroke={color}
              strokeWidth="1.5"
            />

            <line
              x1="36"
              y1="94"
              x2="44"
              y2="106"
              stroke={color}
              strokeWidth="1.5"
            />

            <line
              x1="64"
              y1="94"
              x2="56"
              y2="106"
              stroke={color}
              strokeWidth="1.5"
            />

            <line
              x1="38"
              y1="30"
              x2="62"
              y2="30"
              stroke={color}
              strokeWidth="1.5"
            />

            <line
              x1="28"
              y1="70"
              x2="72"
              y2="70"
              stroke={color}
              strokeWidth="1.5"
            />

            <line
              x1="38"
              y1="90"
              x2="62"
              y2="90"
              stroke={color}
              strokeWidth="1.5"
            />
          </svg>
        );

      case "ain-soph":
        return (
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${sizeClasses[size]} ${className}`}
          >
            <circle cx="50" cy="50" r="45" stroke={color} strokeWidth="1.5" />

            <circle cx="50" cy="50" r="35" stroke={color} strokeWidth="1.5" />

            <circle cx="50" cy="50" r="25" stroke={color} strokeWidth="1.5" />

            <circle cx="50" cy="50" r="15" stroke={color} strokeWidth="1.5" />

            <circle cx="50" cy="50" r="5" stroke={color} strokeWidth="1.5" />
          </svg>
        );

      case "hebrew-letter":
        // Aleph symbol
        return (
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${sizeClasses[size]} ${className}`}
          >
            <path
              d="M30 20L50 80M50 80L70 20M35 50H65"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        );

      case "sephirot":
        return (
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${sizeClasses[size]} ${className}`}
          >
            <circle cx="50" cy="50" r="40" stroke={color} strokeWidth="1.5" />

            <circle cx="50" cy="50" r="30" stroke={color} strokeWidth="1.5" />

            <path
              d="M50 10L90 50L50 90L10 50L50 10Z"
              stroke={color}
              strokeWidth="1.5"
            />

            <path
              d="M50 20L80 50L50 80L20 50L50 20Z"
              stroke={color}
              strokeWidth="1.5"
            />

            <path
              d="M30 30L70 30L70 70L30 70L30 30Z"
              stroke={color}
              strokeWidth="1.5"
            />
          </svg>
        );

      default:
        return null;
    }
  };

  return <div className="inline-block">{renderSymbol()}</div>;
}
