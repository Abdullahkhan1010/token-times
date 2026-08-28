import React, { useState, useEffect, useRef } from "react";
import { ToImageUrl, getCachedImageUrl, refreshS3ImageUrl, evictS3UrlCache } from "../services/file.service";

/**
 * Performant LazyImage component:
 * - Synchronously uses persistent cache if already resolved (instant display on refresh/navigation).
 * - When eager=false (default), resolves S3 presigned URLs when entering/approaching viewport.
 * - Displays a subtle skeleton/shimmer placeholder while loading.
 * - Auto-recovers from expired presigned URLs with seamless retry.
 * - Smooth fade-in transition once loaded.
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
  const [resolvedSrc, setResolvedSrc] = useState(() => {
    if (!src || typeof src !== "string") return "";
    if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:") || src.startsWith("blob:")) {
      return src;
    }
    return getCachedImageUrl(src) || "";
  });
  const [isLoaded, setIsLoaded] = useState(() => Boolean(resolvedSrc));
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Sync if src prop changes
  useEffect(() => {
    setRetryCount(0);
    if (!src || typeof src !== "string") {
      setResolvedSrc("");
      setIsLoaded(false);
      setHasError(false);
      return;
    }
    if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:") || src.startsWith("blob:")) {
      setResolvedSrc(src);
      setHasError(false);
      return;
    }
    const cached = getCachedImageUrl(src);
    if (cached) {
      setResolvedSrc(cached);
      setHasError(false);
    }
  }, [src]);

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

  // Resolve S3 image URL on demand if not already resolved
  useEffect(() => {
    if ((!inView && !eager) || !src) {
      return;
    }

    let active = true;

    // Check synchronous cache first
    const cached = getCachedImageUrl(src);
    if (cached) {
      setResolvedSrc(cached);
      return;
    }

    (async () => {
      try {
        const url = await ToImageUrl(src);
        if (active && url) {
          setResolvedSrc(url);
          setHasError(false);
        }
      } catch (err) {
        if (active) {
          if (fallbackSrc) setResolvedSrc(fallbackSrc);
          setHasError(true);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [inView, eager, src, fallbackSrc]);

  const handleImgLoad = (e) => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.(e);
  };

  const handleImgError = async (e) => {
    // If it's an S3 file key and hasn't exceeded 2 retries, force a fresh presigned URL!
    if (
      retryCount < 2 &&
      src &&
      typeof src === "string" &&
      !src.startsWith("data:") &&
      !src.startsWith("blob:") &&
      !src.startsWith("http://") &&
      !src.startsWith("https://")
    ) {
      try {
        setRetryCount((prev) => prev + 1);
        const freshUrl = await refreshS3ImageUrl(src);
        if (freshUrl && freshUrl !== resolvedSrc) {
          setResolvedSrc(freshUrl);
          setHasError(false);
          setIsLoaded(false);
          return;
        }
      } catch (err) {
        console.warn("Auto-recovery for S3 image failed:", err);
      }
    }

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
