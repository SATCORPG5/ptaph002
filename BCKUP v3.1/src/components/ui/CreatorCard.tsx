"use client";
import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import Image from 'next/image';

interface CreatorCardProps {
  displayName?: string;
  handle?: string;
  bio?: string;
  avatarUrl?: string;
  status?: 'active' | 'inactive' | 'live';
  categories?: string[];
  profile?: {
    display_name?: string;
    handle?: string;
    bio?: string;
    avatar_url?: string;
    status?: 'active' | 'inactive' | 'live';
    categories?: string[];
  };
}

export default function CreatorCard({
  displayName,
  handle,
  bio = '',
  avatarUrl = '/placeholder-avatar.png',
  status = 'active',
  categories = [],
  profile,
}: CreatorCardProps) {
  // Resolve values from profile if provided
  const resolvedDisplayName = profile?.display_name || displayName;
  const resolvedHandle = profile?.handle || handle;
  const resolvedBio = profile?.bio || bio;
  const resolvedAvatarUrl = profile?.avatar_url || avatarUrl;
  const resolvedStatus = profile?.status || status;
  const resolvedCategories = profile?.categories || categories;

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const scale = useMotionValue(1);

  const rotateXTransform = useTransform(rotateX, [-30, 30], [30, -30]);
  const rotateYTransform = useTransform(rotateY, [-30, 30], [-30, 30]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateMax = 15;
    rotateX.set((-y / (rect.height / 2)) * rotateMax);
    rotateY.set((x / (rect.width / 2)) * rotateMax);
    scale.set(1.02);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  return (
    <motion.div
      className="relative w-80 h-96 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-white/20"
      style={{
        rotateX: rotateXTransform,
        rotateY: rotateYTransform,
        scale,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 opacity-30" />
      <div className="p-4 flex flex-col items-center h-full relative z-10">
        <div className="relative w-24 h-24 mb-4">
          <Image
            src={resolvedAvatarUrl}
            alt={`${resolvedDisplayName} avatar`}
            width={96}
            height={96}
            className="rounded-full object-cover border-2 border-white/30"
          />
          {resolvedStatus === 'live' && (
            <span className="absolute bottom-0 right-0 block w-4 h-4 bg-green-500 rounded-full ring-2 ring-white" />
          )}
        </div>
        <h2 className="text-xl font-bold text-white mb-1">{resolvedDisplayName}</h2>
        <p className="text-sm text-white/70 mb-2">{resolvedHandle}</p>
        {resolvedCategories.length > 0 && (
          <div className="flex flex-wrap gap-1 justify-center mb-2">
            {resolvedCategories.map((cat) => (
              <span
                key={cat}
                className="px-2 py-0.5 bg-white/10 text-xs rounded-full text-white"
              >
                {cat}
              </span>
            ))}
          </div>
        )}
        {resolvedBio && <p className="text-sm text-white/80 text-center mt-auto mb-4">{resolvedBio}</p>}
      </div>
    </motion.div>
  );
}
