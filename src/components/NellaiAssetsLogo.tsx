import React, { useState } from 'react';

interface NellaiAssetsLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'white'; // 'dark' = for light bg, 'white' = for dark green bg
  showTagline?: boolean;
}

export const NellaiAssetsLogo: React.FC<NellaiAssetsLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'dark',
  showTagline = true,
}) => {
  const [imgError, setImgError] = useState(false);

  // Logo icon dimensions matching responsive scale
  const imgSizes = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const taglineSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm',
  };

  const isWhite = variant === 'white';
  const taglineColor = isWhite ? 'text-[#E0B25B]' : 'text-[#8C651E]';

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Official Circular Medallion Emblem */}
      <div className={`${imgSizes[size]} shrink-0 rounded-full relative flex items-center justify-center overflow-hidden shadow-xs border border-[#D4AF37]/50 bg-[#FAFBF8]`}>
        {!imgError ? (
          <img
            src="/assets/branding/nellai-assets-logo.png"
            alt="Nellai Assets Logo"
            className="w-full h-full object-contain rounded-full"
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
          />
        ) : (
          <img
            src="/assets/branding/nellai-assets-logo.svg"
            alt="Nellai Assets Logo"
            className="w-full h-full object-contain rounded-full"
            referrerPolicy="no-referrer"
          />
        )}
      </div>

      {/* Typography Unit */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-serif font-black tracking-wider ${titleSizes[size]} ${
              isWhite ? 'text-white' : 'text-[#123F2B]'
            }`}
            style={{ letterSpacing: '0.04em' }}
          >
            NELLAI ASSETS
          </span>
        </div>

        {showTagline && (
          <span
            className={`font-sans font-bold tracking-widest uppercase mt-0.5 ${taglineSizes[size]} ${taglineColor}`}
            style={{ letterSpacing: '0.12em' }}
          >
            Your Assets Adviser
          </span>
        )}
      </div>
    </div>
  );
};
