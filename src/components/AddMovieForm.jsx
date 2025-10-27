import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Link as LinkIcon, Image as ImageIcon, KeyRound } from 'lucide-react';

function cleanTitleFromUrl(url) {
  try {
    const decoded = decodeURIComponent(url);
    const path = decoded.split('/').pop() || decoded;
    let base = path.split('?')[0];
    // Remove common file extensions
    base = base.replace(/\.(mp4|mkv|avi|mov|wmv|flv)$/i, '');
    // Remove common quality and encoding tags
    base = base.replace(/(1080p|720p|2160p|4k|x264|x265|h\.?264|h\.?265|bluray|webrip|hdr|dvdrip|hevc|10bit|8bit)/gi, '');
    // Replace separators with spaces and tidy
    base = base.replace(/[._-]+/g, ' ').replace(/\s+/g, ' ').trim();
    // Remove brackets and their content
    base = base.replace(/\[[^\]]*\]|\([^\)]*\)/g, '').replace(/\s+/g, ' ').trim();
    return base || 'Untitled';
  } catch {
    return 'Untitled';
  }
}

const TMDB_IMG = (path) => (path ? `https://image.tmdb.org/t/p/w500${path}` : null);

const loadStored = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const saveStored = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

function AddMovieForm({ onAdd }) {
  const [url, setUrl] = useState('');
  const [tmdbKey, setTmdbKey] = useState(loadStored('tmdb_api_key', ''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    saveStored('tmdb_api_key', tmdbKey);
  }, [tmdbKey]);

  const guessedTitle = useMemo(() => cleanTitleFromUrl(url), [url]);

  async function fetchTMDBMeta(title) {
    if (!tmdbKey || !title) return null;
    try {
      const q = encodeURIComponent(title);
      const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&query=${q}`);
      if (!res.ok) return null;
      const data = await res.json();
      const first = data?.results?.[0];
      if (!first) return null;
      return {
        title: first.title || title,
        poster: TMDB_IMG(first.poster_path),
        tmdbId: first.id,
        releaseDate: first.release_date,
        overview: first.overview,
      };
    } catch {
      return null;
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    if (!url.trim()) {
      setError('Please paste a valid video URL');
      return;
    }
    setLoading(true);
    const fallback = { title: guessedTitle, poster: null };
    const meta = await fetchTMDBMeta(guessedTitle);
    const movie = {
      url: url.trim(),
      title: meta?.title || fallback.title,
      poster: meta?.poster || null,
      overview: meta?.overview || '',
      addedAt: Date.now(),
    };
    setLoading(false);
    onAdd(movie);
    setUrl('');
  };

  return (
    <section className="w-full max-w-6xl mx-auto -mt-12 sm:-mt-16 px-4 sm:px-6 lg:px-8 relative z-20">
      <form onSubmit={handleAdd} className="bg-zinc-900/80 border border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <div className="flex-1">
            <label className="block text-sm font-medium text-white/80 mb-1">Cloud video link</label>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center p-2 rounded-lg bg-black/40 border border-white/10 text-white/80">
                <LinkIcon size={18} />
              </span>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste Google Drive, Dropbox, OneDrive, or direct .mp4/.mkv/.avi URL"
                className="w-full rounded-lg bg-black/50 border border-white/10 px-3 py-2.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
              />
            </div>
            {url && (
              <p className="mt-2 text-xs text-white/50">Detected title: <span className="text-white/80">{guessedTitle}</span></p>
            )}
          </div>
          <div className="md:w-64">
            <label className="block text-sm font-medium text-white/80 mb-1 flex items-center gap-2"><KeyRound size={16}/> TMDB API key (optional)</label>
            <input
              type="text"
              value={tmdbKey}
              onChange={(e) => setTmdbKey(e.target.value)}
              placeholder="Enter TMDB key for posters"
              className="w-full rounded-lg bg-black/50 border border-white/10 px-3 py-2.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
            />
          </div>
          <div className="md:self-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition-colors text-white px-4 py-2.5 font-medium shadow-lg shadow-purple-600/20"
            >
              <Plus size={18} />
              {loading ? 'Adding…' : 'Add Movie'}
            </button>
          </div>
        </div>
        {error && (
          <div className="mt-3 text-sm text-red-400">{error}</div>
        )}
        <div className="mt-4 text-xs text-white/50 flex items-start gap-2">
          <ImageIcon size={14} className="mt-0.5"/>
          <p>
            Tip: Some cloud providers block cross‑origin streaming. Direct links with proper CORS and Range support work best in modern browsers.
          </p>
        </div>
      </form>
    </section>
  );
}

export default AddMovieForm;
