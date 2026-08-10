import React from 'react';

interface BrandMarkProps {
  size?: number;
  variant?: 'brass' | 'monochrome' | 'outline' | 'brass-bg';
  className?: string;
}

export const BrandMark: React.FC<BrandMarkProps> = ({
  size = 40,
  variant = 'brass',
  className = ''
}) => {
  const gradientId = `brass-grad-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`inline-flex items-center justify-center relative select-none ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
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

        {/* Outer Shield Outline */}
        <path
          d="M50 8L88 22V48C88 71.5 71.8 90.8 50 96C28.2 90.8 12 71.5 12 48V22L50 8Z"
          fill={
            variant === 'brass-bg'
              ? `url(#${gradientId})`
              : variant === 'brass'
              ? 'rgba(201, 154, 82, 0.08)'
              : 'currentColor'
          }
          stroke={
            variant === 'brass' || variant === 'brass-bg'
              ? `url(#${gradientId})`
              : 'currentColor'
          }
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Inner Shield Inset Line */}
        <path
          d="M50 16L80 27.5V48C80 66.8 67 82.5 50 87.2C33 82.5 20 66.8 20 48V27.5L50 16Z"
          fill="none"
          stroke={
            variant === 'brass-bg'
              ? '#0D0C0A'
              : variant === 'brass'
              ? `url(#${gradientId})`
              : 'currentColor'
          }
          strokeWidth="1.5"
          strokeDasharray="3 3"
          opacity="0.75"
        />

        {/* Keyhole Head */}
        <circle
          cx="50"
          cy="42"
          r="9"
          fill={
            variant === 'brass-bg'
              ? '#0D0C0A'
              : variant === 'brass'
              ? `url(#${gradientId})`
              : 'currentColor'
          }
        />

        {/* Keyhole Body */}
        <path
          d="M44 48L42 66C42 67.1 42.9 68 44 68H56C57.1 68 58 67.1 58 66L56 48H44Z"
          fill={
            variant === 'brass-bg'
              ? '#0D0C0A'
              : variant === 'brass'
              ? `url(#${gradientId})`
              : 'currentColor'
          }
        />

        {/* Central Key Accent Star Dot */}
        <circle
          cx="50"
          cy="42"
          r="2.5"
          fill={variant === 'brass-bg' ? `url(#${gradientId})` : 'var(--bg-main)'}
        />
      </svg>
    </div>
  );
};
