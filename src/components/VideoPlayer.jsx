import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Maximize, Captions, Gauge } from 'lucide-react';

function VideoPlayer({ movie }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [subtitleUrl, setSubtitleUrl] = useState('');

  useEffect(() => {
    setPlaying(false);
    setSubtitleUrl('');
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [movie?.url]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const handleRate = (rate) => {
    setPlaybackRate(rate);
    if (videoRef.current) videoRef.current.playbackRate = rate;
  };

  const goFullscreen = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.requestFullscreen) v.requestFullscreen();
  };

  const guessedType = () => {
    if (!movie?.url) return undefined;
    const m = movie.url.toLowerCase();
    if (m.includes('.mp4')) return 'video/mp4';
    if (m.includes('.webm')) return 'video/webm';
    if (m.includes('.ogg') || m.includes('.ogv')) return 'video/ogg';
    if (m.includes('.mkv')) return 'video/x-matroska';
    if (m.includes('.avi')) return 'video/x-msvideo';
    return undefined;
  };

  if (!movie) return null;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <div className="relative bg-black rounded-xl overflow-hidden border border-white/10">
            <video
              ref={videoRef}
              controls
              playsInline
              className="w-full aspect-video bg-black"
              src={movie.url}
            >
              {subtitleUrl && (
                <track
                  label="Subtitles"
                  kind="subtitles"
                  srcLang="en"
                  src={subtitleUrl}
                  default
                />
              )}
              <source src={movie.url} type={guessedType()} />
            </video>
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2 items-center justify-between bg-black/40 backdrop-blur rounded-lg p-2 border border-white/10">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm"
                >
                  {playing ? <Pause size={16}/> : <Play size={16}/>}
                  <span>{playing ? 'Pause' : 'Play'}</span>
                </button>
                <button
                  onClick={goFullscreen}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm"
                >
                  <Maximize size={16}/>
                  <span>Fullscreen</span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-white/10 text-white text-sm">
                  <Gauge size={16}/>
                  <select
                    value={playbackRate}
                    onChange={(e) => handleRate(Number(e.target.value))}
                    className="bg-transparent outline-none"
                  >
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((r) => (
                      <option key={r} value={r}>{r}x</option>
                    ))}
                  </select>
                </div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-white/10 text-white text-sm">
                  <Captions size={16}/>
                  <input
                    type="url"
                    value={subtitleUrl}
                    onChange={(e) => setSubtitleUrl(e.target.value)}
                    placeholder="Subtitle .vtt URL (optional)"
                    className="bg-transparent placeholder-white/50 outline-none w-48"
                  />
                </div>
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-white/50">
            Note: Browser playback depends on the file's codecs and the host's CORS/Range support. MKV/AVI may not play in all browsers.
          </p>
        </div>
        <aside className="lg:col-span-1">
          <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-4">
            <h3 className="text-white font-semibold text-lg">Now Playing</h3>
            <p className="text-white/60 text-sm mt-1">{movie.title}</p>
            {movie.poster ? (
              <img src={movie.poster} alt={movie.title} className="mt-3 rounded-lg w-full object-cover" />
            ) : (
              <div className="mt-3 aspect-[2/3] w-full rounded-lg bg-gradient-to-br from-purple-700/40 to-fuchsia-500/30 border border-white/10" />
            )}
            {movie.overview && (
              <p className="text-white/60 text-sm mt-3 line-clamp-6">{movie.overview}</p>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

export default VideoPlayer;
