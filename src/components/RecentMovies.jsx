import React from 'react';
import { Clock, Play } from 'lucide-react';

function RecentMovies({ items, onSelect, onClear }) {
  if (!items?.length) return null;
  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white font-semibold text-lg flex items-center gap-2"><Clock size={18}/> Recent</h2>
        <button onClick={onClear} className="text-xs text-white/60 hover:text-white">Clear</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.map((m) => (
          <button
            key={m.addedAt + m.url}
            onClick={() => onSelect(m)}
            className="group text-left relative rounded-lg overflow-hidden bg-zinc-900/60 border border-white/10 hover:border-white/20 transition-colors"
          >
            {m.poster ? (
              <img src={m.poster} alt={m.title} className="w-full aspect-[2/3] object-cover"/>
            ) : (
              <div className="w-full aspect-[2/3] bg-gradient-to-br from-purple-700/40 to-fuchsia-500/30" />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 text-white text-sm"><Play size={16}/> Play</span>
            </div>
            <div className="p-2">
              <p className="text-white/90 text-sm line-clamp-2">{m.title}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

export default RecentMovies;
