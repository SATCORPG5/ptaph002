"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CreatorMediaBoxProps {
  images: string[];
  name: string;
  className?: string;
  imageClassName?: string;
  interval?: number;
  transitionDuration?: number;
}

export const CreatorMediaBox = ({
  images,
  name,
  className = "relative w-full h-full",
  imageClassName = "absolute inset-0 w-full h-full object-cover",
  interval = 4000,
  transitionDuration = 1.5,
}: CreatorMediaBoxProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failedIndices, setFailedIndices] = useState<Set<number>>(new Set());

  const placeholder = "/branding/KYRAX425.png";
  const displayImages = images.length > 0 && images.every(img => img && img.trim() !== "") 
    ? images 
    : [placeholder];

  // Reset state when images change
  useEffect(() => {
    setFailedIndices(new Set());
    setCurrentIndex(0);
  }, [images]);

  useEffect(() => {
    if (displayImages.length <= 1) {
      if (currentIndex !== 0) setCurrentIndex(0);
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayImages.length);
    }, interval);

    return () => clearInterval(timer);
  }, [displayImages.length, interval]);

  if (displayImages.length === 0) return null;

  const currentSrc = failedIndices.has(currentIndex) ? placeholder : displayImages[currentIndex];

  return (
    <div className={className}>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.img
          key={`${currentIndex}-${currentSrc}`}
          src={currentSrc}
          alt={`${name} - ${currentIndex + 1}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: transitionDuration, ease: "easeInOut" }}
          className={imageClassName}
          onError={() => {
            if (!failedIndices.has(currentIndex)) {
              setFailedIndices((prev) => new Set(prev).add(currentIndex));
            }
          }}
        />
      </AnimatePresence>
    </div>
  );
};
