import { useState } from 'react';

/**
 * WebP-first image with a JPEG fallback, explicit dimensions (no layout shift)
 * and a neutral placeholder if the asset is ever missing.
 */
export default function Picture({
  src,
  webp,
  alt = '',
  className = '',
  width,
  height,
  priority = false,
  sizes,
  fallbackClassName = '',
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <div className={'media-fallback ' + fallbackClassName} aria-hidden="true" />;
  }

  return (
    <picture>
      {webp ? <source srcSet={webp} type="image/webp" sizes={sizes} /> : null}
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        onError={() => setFailed(true)}
      />
    </picture>
  );
}
