import { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface SafeImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
  aspectClassName?: string;
}

export function SafeImage({
  src,
  alt,
  className = '',
  fallbackLabel,
  aspectClassName = 'aspect-[4/3]',
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-[#EDF2EE] via-[#E4ECE6] to-[#DCE5DE] flex flex-col items-center justify-center p-4 text-center ${aspectClassName} ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="w-10 h-10 rounded-xl bg-white/80 border border-[#D4DFD7] flex items-center justify-center text-[#1B5E3F] mb-2">
          <ImageIcon className="w-5 h-5" aria-hidden="true" />
        </div>
        <span className="text-xs font-medium text-[#415047] line-clamp-2 max-w-[200px]">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#EAECE8] ${aspectClassName} ${className}`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
