import React, { useEffect, useState } from 'react';
import Hero from './components/Hero';
import AddMovieForm from './components/AddMovieForm';
import VideoPlayer from './components/VideoPlayer';
import RecentMovies from './components/RecentMovies';

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

function App() {
  const [recent, setRecent] = useState(() => loadStored('recent_movies', []));
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    saveStored('recent_movies', recent);
  }, [recent]);

  const addMovie = (movie) => {
    setCurrent(movie);
    setRecent((prev) => {
      const filtered = prev.filter((m) => m.url !== movie.url);
      const next = [movie, ...filtered].slice(0, 24);
      return next;
    });
  };

  const clearRecent = () => {
    setRecent([]);
  };

  const selectMovie = (m) => setCurrent(m);

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <Hero />
      <AddMovieForm onAdd={addMovie} />
      {current && <VideoPlayer movie={current} />}
      <RecentMovies items={recent} onSelect={selectMovie} onClear={clearRecent} />
      <footer className="mt-16 py-8 text-center text-white/50 text-sm">
        Built for effortless cloud streaming. Paste a link and play.
      </footer>
    </div>
  );
}

export default App;
