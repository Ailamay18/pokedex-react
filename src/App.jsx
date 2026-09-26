import { useEffect, useMemo, useState } from "react";
import { GEN1_LIMIT } from "./constants";
import { fetchPokedex } from "./api";
import TopBar from "./components/TopBar.jsx";
import Card from "./components/Card.jsx";
import Detail from "./components/Detail.jsx";
import Boot from "./components/Boot.jsx";

const FAVORITES_KEY = "pokedex-favorites";

export default function App() {
  const [dex, setDex] = useState([]);
  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState(null);
  const [selected, setSelected] = useState(null);
  const [sortBy, setSortBy] = useState("num-asc");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    let alive = true;
    fetchPokedex((count) => alive && setLoaded(count))
      .then((results) => {
        if (!alive) return;
        setDex(results);
        setReady(true);
      })
      .catch((err) => alive && setError(err.message));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
  }, [favorites]);

  function toggleFavorite(id) {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  // Flatten `types` from PokeAPI's nested shape to a simple string array.
  const normalized = useMemo(
    () => dex.map((p) => ({ ...p, types: p.types.map((t) => t.type.name) })),
    [dex]
  );

  const allTypes = useMemo(
    () => [...new Set(normalized.flatMap((p) => p.types))].sort(),
    [normalized]
  );

  const totalStats = (p) => p.stats.reduce((sum, s) => sum + s.base_stat, 0);

  const filtered = useMemo(() => {
    const list = normalized.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) &&
        (!activeType || p.types.includes(activeType)) &&
        (!favoritesOnly || favorites.has(p.id))
    );

    const sorted = [...list];
    switch (sortBy) {
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "stat-desc":
        sorted.sort((a, b) => totalStats(b) - totalStats(a));
        break;
      case "stat-asc":
        sorted.sort((a, b) => totalStats(a) - totalStats(b));
        break;
      case "num-desc":
        sorted.sort((a, b) => b.id - a.id);
        break;
      default: // "num-asc"
        sorted.sort((a, b) => a.id - b.id);
    }
    return sorted;
  }, [normalized, query, activeType, sortBy, favoritesOnly, favorites]);

  function handleSurprise() {
    if (normalized.length === 0) return;
    const random = normalized[Math.floor(Math.random() * normalized.length)];
    setSelected(random);
  }

  const selectedIndex = selected ? filtered.findIndex((p) => p.id === selected.id) : -1;
  const hasPrev = selectedIndex > 0;
  const hasNext = selectedIndex >= 0 && selectedIndex < filtered.length - 1;

  if (error || (!ready && dex.length === 0)) {
    return <Boot loaded={loaded} total={GEN1_LIMIT} error={error} />;
  }

  return (
    <>
      <TopBar
        query={query}
        onQueryChange={setQuery}
        types={allTypes}
        activeType={activeType}
        onTypeChange={setActiveType}
        loaded={loaded}
        total={GEN1_LIMIT}
        ready={ready}
        shown={filtered.length}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onSurprise={handleSurprise}
        favoritesOnly={favoritesOnly}
        onToggleFavoritesOnly={() => setFavoritesOnly((v) => !v)}
        favoritesCount={favorites.size}
      />

      <div className="wrap">
        {filtered.length === 0 ? (
          <div className="empty">
            {favoritesOnly
              ? "No favorites yet — tap the heart on any card to save it here."
              : "No Pokémon match that search. Try a different name or type."}
          </div>
        ) : (
          <div className="grid">
            {filtered.map((p, i) => (
              <Card
                key={p.id}
                pokemon={p}
                index={i}
                onOpen={setSelected}
                isFavorite={favorites.has(p.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </div>

      {selected && (
        <Detail
          key={selected.id}
          pokemon={selected}
          onClose={() => setSelected(null)}
          onPrev={hasPrev ? () => setSelected(filtered[selectedIndex - 1]) : null}
          onNext={hasNext ? () => setSelected(filtered[selectedIndex + 1]) : null}
          isFavorite={favorites.has(selected.id)}
          onToggleFavorite={toggleFavorite}
          allPokemon={normalized}
          onSelectPokemon={setSelected}
        />
      )}
    </>
  );
}
