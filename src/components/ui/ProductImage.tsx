import React, { useState } from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: '4:3' | '16:9' | '1:1' | '3:4';
  priority?: boolean;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  className = '',
  aspectRatio = '4:3',
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const getAspectClass = () => {
    switch (aspectRatio) {
      case '16:9':
        return 'aspect-video';
      case '1:1':
        return 'aspect-square';
      case '3:4':
        return 'aspect-[3/4]';
      case '4:3':
      default:
        return 'aspect-[4/3]';
    }
  };

  if (hasError || !src) {
    return (
      <div
        className={`relative w-full ${getAspectClass()} overflow-hidden bg-neutral-900 border border-neutral-800 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}
      >
        <div className="absolute inset-0 bg-radial from-neutral-800/40 via-neutral-950 to-neutral-950 opacity-90" />
        
        {/* Architectural graphic motif */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded border border-amber-500/30 flex items-center justify-center mb-3 bg-neutral-900/60 shadow-lg">
            <svg
              className="w-8 h-8 text-amber-400/80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
            >
              <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
            </svg>
          </div>
          <span className="font-bebas text-lg tracking-widest text-neutral-300 uppercase">
            AYAAN NX
          </span>
          <span className="text-[11px] text-neutral-400 mt-1 max-w-[180px] line-clamp-1 font-body">
            {alt}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-amber-400/90 font-medium mt-1">
            Studio Archive
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${getAspectClass()} overflow-hidden bg-neutral-900/50 ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-neutral-900 animate-pulse flex items-center justify-center">
          <span className="font-bebas text-sm tracking-widest text-neutral-600">AYAAN NX</span>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-all duration-700 ease-out ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        }`}
      />
    </div>
  );
};
