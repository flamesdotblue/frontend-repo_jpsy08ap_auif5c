import React from 'react';
import Spline from '@splinetool/react-spline';

function Hero() {
  return (
    <section className="relative w-full min-h-[60vh] md:min-h-[70vh] overflow-hidden bg-gradient-to-b from-black via-[#0b0b12] to-black">
      <div className="absolute inset-0">
        <Spline 
          scene="https://prod.spline.design/EF7JOSsHLk16Tlw9/scene.splinecode" 
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="backdrop-blur-sm bg-black/30 rounded-2xl p-6 sm:p-10 border border-white/10">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white">
            Stream from the cloud, instantly.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-white/70 max-w-2xl">
            Paste any shareable video link from Google Drive, Dropbox, or OneDrive and start watching immediately — no downloads, no sign‑in.
          </p>
          <div className="mt-6 flex items-center gap-3 text-xs sm:text-sm text-white/60">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/10 border border-white/10">MP4 • MKV • AVI</span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/10 border border-white/10">Subtitles</span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/10 border border-white/10">Speed control</span>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
    </section>
  );
}

export default Hero;
