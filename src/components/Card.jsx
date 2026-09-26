import { TYPE_COLORS } from "../constants";
import { spriteFor } from "../api";
import TypeTag from "./TypeTag.jsx";

export default function Card({ pokemon, index, onOpen, isFavorite, onToggleFavorite }) {
  const color = TYPE_COLORS[pokemon.types[0]] || "#888";

  return (
    <div
      className="card"
      style={{ animationDelay: `${(index % 24) * 22}ms` }}
      tabIndex={0}
      role="button"
      aria-label={`View ${pokemon.name}`}
      onClick={() => onOpen(pokemon)}
      onKeyDown={(e) => e.key === "Enter" && onOpen(pokemon)}
    >
      <div className="glow" style={{ background: color }} />
      <button
        className={"fav-heart" + (isFavorite ? " active" : "")}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(pokemon.id);
        }}
        aria-label={isFavorite ? `Remove ${pokemon.name} from favorites` : `Add ${pokemon.name} to favorites`}
        aria-pressed={isFavorite}
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>
      <div className="id">#{String(pokemon.id).padStart(3, "0")}</div>
      <div className="img-frame" style={{ background: `${color}26` }}>
        <div className="imgwrap">
          <img src={spriteFor(pokemon)} alt={pokemon.name} loading="lazy" />
        </div>
      </div>
      <div className="name">{pokemon.name}</div>
      <div className="types">
        {pokemon.types.map((t) => (
          <TypeTag key={t} type={t} />
        ))}
      </div>
    </div>
  );
}
