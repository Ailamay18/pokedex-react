import { TYPE_COLORS } from "../constants";

const SORT_OPTIONS = [
  { value: "num-asc", label: "# Low → High" },
  { value: "num-desc", label: "# High → Low" },
  { value: "name-asc", label: "Name A → Z" },
  { value: "name-desc", label: "Name Z → A" },
  { value: "stat-desc", label: "Stats High → Low" },
  { value: "stat-asc", label: "Stats Low → High" },
];

export default function TopBar({
  query,
  onQueryChange,
  types,
  activeType,
  onTypeChange,
  loaded,
  total,
  ready,
  shown,
  sortBy,
  onSortChange,
  onSurprise,
  favoritesOnly,
  onToggleFavoritesOnly,
  favoritesCount,
}) {
  return (
    <div className="topbar">
      <div className="brand">
        <div className="eye" />
        <h1>Pokédex</h1>
      </div>

      <div className="controls">
        <div className="search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8b96a8" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            placeholder="Search by name…"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            aria-label="Search Pokémon"
          />
        </div>

        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="Sort Pokémon"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <button className="surprise-btn" onClick={onSurprise} type="button">
          🎲 Surprise me
        </button>

        <button
          className={"fav-toggle" + (favoritesOnly ? " active" : "")}
          onClick={onToggleFavoritesOnly}
          type="button"
          aria-pressed={favoritesOnly}
        >
          {favoritesOnly ? "❤️" : "🤍"} Favorites{favoritesCount ? ` (${favoritesCount})` : ""}
        </button>

        <div className="chips">
          <span
            className={"chip" + (activeType === null ? " active" : "")}
            style={activeType === null ? { background: "#f0a83c" } : {}}
            onClick={() => onTypeChange(null)}
          >
            ALL
          </span>
          {types.map((t) => (
            <span
              key={t}
              className={"chip" + (activeType === t ? " active" : "")}
              style={activeType === t ? { background: TYPE_COLORS[t] } : {}}
              onClick={() => onTypeChange(activeType === t ? null : t)}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="count">
        {!ready ? `Loading ${loaded}/${total}… ` : ""}
        {shown} of {total} Pokémon shown
      </div>
    </div>
  );
}
