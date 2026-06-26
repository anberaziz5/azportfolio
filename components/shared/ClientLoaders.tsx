"use client";

import dynamic from 'next/dynamic';

export const LazySpeedInsights = dynamic(() => import('@vercel/speed-insights/next').then(mod => mod.SpeedInsights), { ssr: false });
export const LazySVGScrollPath = dynamic(() => import('@/components/shared/SVGScrollPath').then(mod => mod.SVGScrollPath), { ssr: false });
export const LazySparklesCore = dynamic(() => import('@/components/ui/SparklesCore').then(mod => mod.SparklesCore), { ssr: false });
