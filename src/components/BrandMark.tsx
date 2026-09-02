import React from 'react';

interface BrandMarkProps {
  size?: number;
  variant?: 'brass' | 'monochrome' | 'outline' | 'brass-bg';
  className?: string;
  src?: string;
  alt?: string;
}

export const BrandMark: React.FC<BrandMarkProps> = ({
  size = 32,
  variant = 'brass',
  className = ''
  , src, alt
}) => {
  const gradientId = `brass-grad-${Math.random().toString(36).substring(2, 9)}`;

  const strokeColor =
    variant === 'brass' || variant === 'brass-bg'
      ? `url(#${gradientId})`
      : 'currentColor';

  const strokeColorSolid =
    variant === 'brass'
      ? 'var(--color-brass, #C99A52)'
      : 'currentColor';

  // If an external image source is provided, render that as the mark.
  if (src) {
    return (
      <div className={`inline-flex items-center justify-center relative select-none shrink-0 ${className}`} style={{ width: size, height: size }}>
        <img
          src={src}
          alt={alt || 'Brand mark'}
          width={size}
          height={size}
          className="object-contain w-full h-full transition-transform duration-300 hover:scale-105"
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center justify-center relative select-none shrink-0 ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full transition-transform duration-300 hover:scale-105"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E2B876" />
            <stop offset="50%" stopColor="#C99A52" />
            <stop offset="100%" stopColor="#A97C3C" />
          </linearGradient>
        </defs>

        {/* Shield Outline */}
        <path
          d="M16 2 4 7v9c0 8 5 13.5 12 14 7-.5 12-6 12-14V7L16 2Z"
          fill={variant === 'brass-bg' ? strokeColorSolid : 'rgba(201, 154, 82, 0.08)'}
          stroke={strokeColor}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* Keyhole Circle */}
        <circle
          cx="16"
          cy="14"
          r="3"
          fill={variant === 'brass-bg' ? '#0D0C0A' : 'none'}
          stroke={variant === 'brass-bg' ? '#0D0C0A' : strokeColor}
          strokeWidth="1.8"
        />

        {/* Keyhole Stem */}
        <path
          d="M16 16.5V21"
          stroke={variant === 'brass-bg' ? '#0D0C0A' : strokeColor}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

