import React, { useState, useEffect, useRef } from "react";
import { ToImageUrl } from "../services/file.service";

/**
 * Performant LazyImage component:
 * - When eager=false (default), only resolves S3 presigned URLs and loads image when entering/approaching viewport.
 * - Displays a subtle skeleton/shimmer placeholder while loading.
 * - Smooth fade-in transition once loaded.
 * - Prevents unnecessary network requests for below-the-fold content.
 */
export default function LazyImage({
  src,
  alt = "",
  className = "",
  imgClassName = "",
  fallbackSrc = "",
  fallback = null,
  eager = false,
  rootMargin = "300px",
  onLoad,
  onError,
  onClick,
  style = {},
  ...props
}) {
  const containerRef = useRef(null);
  const [inView, setInView] = useState(eager);
  const [resolvedSrc, setResolvedSrc] = useState(
    typeof src === "string" && (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:"))
      ? src
      : ""
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // IntersectionObserver for lazy loading
  useEffect(() => {
    if (eager || inView) return;

    const el = containerRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [eager, inView, rootMargin]);

  // Resolve S3 image URL only when inView
  useEffect(() => {
    if (!inView || !src) {
      if (!src) setResolvedSrc("");
      return;
    }

    let active = true;

    // Already a complete web URL
    if (
      typeof src === "string" &&
      (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:") || src.startsWith("blob:"))
    ) {
      setResolvedSrc(src);
      return;
    }

    // Resolve S3 fileKey on demand
    (async () => {
      try {
        const url = await ToImageUrl(src);
        if (active) {
          setResolvedSrc(url || fallbackSrc || "");
        }
      } catch (err) {
        if (active) {
          setResolvedSrc(fallbackSrc || "");
          setHasError(true);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [inView, src, fallbackSrc]);

  const handleImgLoad = (e) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  const handleImgError = (e) => {
    setHasError(true);
    if (fallbackSrc && resolvedSrc !== fallbackSrc) {
      setResolvedSrc(fallbackSrc);
    }
    onError?.(e);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={style}
      onClick={onClick}
      {...props}
    >
      {/* Background skeleton/placeholder while loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-surface-container-high/60 animate-pulse" />
      )}

      {/* Render <img> only when in view and src is resolved */}
      {inView && resolvedSrc && !hasError && (
        <img
          src={resolvedSrc}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onLoad={handleImgLoad}
          onError={handleImgError}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          } ${imgClassName}`}
        />
      )}

      {/* Fallback rendering on error or missing image */}
      {(hasError || (!resolvedSrc && inView)) && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-container-high/50 text-on-surface-variant/40 text-xs">
          {fallback || <span className="font-label-caps uppercase text-[10px] font-bold">Token Times</span>}
        </div>
      )}
    </div>
  );
}
