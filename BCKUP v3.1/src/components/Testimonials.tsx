'use client';

import { useState, useRef, useEffect } from 'react';
import { Section } from '@/components/layout/Section';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';

interface Testimonial {
  videoSrc: string;
  quote: string;
  creatorName: string;
}

import { SiteSettings } from '@/lib/creators-db';

export default function Testimonials({ settings }: { settings: SiteSettings['testimonials'] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const [direction, setDirection] = useState(0);

    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    const testimonials = settings?.items || [];

    useEffect(() => {
        // Play current video, pause others
        videoRefs.current.forEach((video, index) => {
            if (!video) return;
            if (index === currentIndex) {
                video.currentTime = 0;
                video.play().catch(e => console.error("Video play prevented:", e));
            } else {
                video.pause();
            }
        });
    }, [currentIndex]);

    const handleNext = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const handlePrev = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
        videoRefs.current.forEach((video) => {
            if (video) video.muted = !isMuted;
        });
    };

    if (testimonials.length === 0) return null;

    return (
        <Section id="testimonials" className="bg-background overflow-hidden relative border-t border-border py-24">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] pointer-events-none rounded-full" />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                <div className="mb-16 text-center">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-xs font-semibold text-primary tracking-[0.2em] uppercase mb-4"
                    >
                        {settings.tag}
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-6 [text-shadow:0_0_1.5px_rgba(0,0,0,0.8)]"
                    >
                        {settings.title} <span className="text-gradient-primary">{settings.titleGradient}</span>
                    </motion.h2>
                </div>

                <div className="relative group max-w-4xl mx-auto">

                    {/* Navigation Arrows */}
                    <button
                        onClick={handlePrev}
                        className="absolute left-[-2rem] md:left-[-4rem] top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-foreground/5 border border-foreground/10 text-foreground/70 hover:text-foreground hover:bg-primary/20 hover:border-primary/50 transition-all backdrop-blur-md hidden sm:flex items-center justify-center hover:scale-110 active:scale-95"
                        aria-label="Previous Testimonial"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button
                        onClick={handleNext}
                        className="absolute right-[-2rem] md:right-[-4rem] top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-foreground/5 border border-foreground/10 text-foreground/70 hover:text-foreground hover:bg-primary/20 hover:border-primary/50 transition-all backdrop-blur-md hidden sm:flex items-center justify-center hover:scale-110 active:scale-95"
                        aria-label="Next Testimonial"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Video Container */}
                    <div className="relative aspect-[9/16] sm:aspect-[4/5] md:aspect-video rounded-3xl overflow-hidden glass-card shadow-[0_0_50px_rgba(0,0,0,0.5)] border-foreground/10 ring-1 ring-foreground/5">

                        <AnimatePresence initial={false} mode="wait" custom={direction}>
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                initial={{ opacity: 0, scale: 0.98, x: direction * 50 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.98, x: direction * -50 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                className="absolute inset-0 w-full h-full"
                            >
                                <video
                                    ref={(el) => {
                                        videoRefs.current[currentIndex] = el;
                                    }}
                                    src={testimonials[currentIndex].videoSrc}
                                    className="w-full h-full object-cover"
                                    loop
                                    muted={isMuted}
                                    playsInline
                                    disablePictureInPicture
                                    controlsList="nodownload nofullscreen"
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                                {/* Content Overlay */}
                                <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 pointer-events-none">
                                    <div className="max-w-2xl">
                                        <p className="text-xl md:text-3xl font-bold text-white mb-4 leading-snug drop-shadow-md [text-shadow:0_0_1.5px_rgba(0,0,0,0.8)]">
                                            &quot;{testimonials[currentIndex].quote}&quot;
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <span className="h-px w-6 bg-primary" />
                                            <span className="text-sm md:text-base font-black text-primary uppercase tracking-widest">
                                                {testimonials[currentIndex].creatorName}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Mute/Unmute UI */}
                        <button
                            onClick={toggleMute}
                            className="absolute top-6 right-6 z-20 p-3 rounded-full bg-black/40 backdrop-blur-md border border-foreground/10 text-white hover:bg-foreground/10 hover:border-foreground/20 transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 group"
                        >
                            {isMuted ? <VolumeX className="w-5 h-5 text-white/70 group-hover:text-primary transition-colors" /> : <Volume2 className="w-5 h-5 group-hover:text-primary transition-colors" />}
                        </button>

                        {/* Mobile Nav Overlays */}
                        <div className="absolute inset-y-0 left-0 w-1/4 z-10 sm:hidden cursor-pointer" onClick={handlePrev} />
                        <div className="absolute inset-y-0 right-0 w-1/4 z-10 sm:hidden cursor-pointer" onClick={handleNext} />

                    </div>

                    {/* Pagination Indicators */}
                    <div className="flex justify-center items-center gap-3 mt-8">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setDirection(i > currentIndex ? 1 : -1);
                                    setCurrentIndex(i);
                                }}
                                className={`transition-all duration-300 rounded-full ${i === currentIndex
                                        ? "w-8 h-2 bg-primary shadow-neon-primary"
                                        : "w-2 h-2 bg-foreground/20 hover:bg-foreground/40"
                                    }`}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>

                </div>
            </div>
        </Section>
    );
}
