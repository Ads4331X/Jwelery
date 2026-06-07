import { Box, Skeleton } from "@mui/material";
import { useEffect, useRef, useState } from "react";

interface LazyImageProps {
  src: string;
  alt: string;
  height?: number | string;
}

export default function LazyImage({ src, alt, height = 260 }: LazyImageProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "120px",
        threshold: 0.1,
      },
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <Box
      ref={ref}
      sx={{ position: "relative", minHeight: height, overflow: "hidden" }}
    >
      {!loaded && (
        <Skeleton variant="rectangular" width="100%" height={height} />
      )}
      {isVisible && (
        <Box
          component="img"
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          sx={{
            width: "100%",
            height,
            objectFit: "cover",
            display: loaded ? "block" : "none",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        />
      )}
    </Box>
  );
}
