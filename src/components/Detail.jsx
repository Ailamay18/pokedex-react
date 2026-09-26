import { useEffect, useState, Fragment } from "react";
import { TYPE_COLORS, STAT_LABELS } from "../constants";
import { spriteFor, fetchDescription, fetchTypeEffectiveness, fetchEvolutionChain } from "../api";
import TypeTag from "./TypeTag.jsx";

export default function Detail({
  pokemon,
  onClose,
  onPrev,
  onNext,
  isFavorite,
  onToggleFavorite,
  allPokemon,
  onSelectPokemon,
}) {
  const color = TYPE_COLORS[pokemon.types[0]] || "#888";
  const [desc, setDesc] = useState(null);
  const [matchups, setMatchups] = useState(null);
  const [evolution, setEvolution] = useState(null);

  useEffect(() => {
    let alive = true;
    setDesc(null);
    setMatchups(null);
    setEvolution(null);

    fetchDescription(pokemon.id)
      .then((text) => alive && setDesc(text))
      .catch((err) => alive && setDesc(err.message));

    fetchTypeEffectiveness(pokemon.types)
      .then((m) => alive && setMatchups(m))
      .catch(() => alive && setMatchups({}));

    fetchEvolutionChain(pokemon.id)
      .then((levels) => alive && setEvolution(levels))
      .catch(() => alive && setEvolution([]));

    return () => {
      alive = false;
    };
  }, [pokemon.id]);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext?.();
      if (e.key === "ArrowLeft") onPrev?.();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onNext, onPrev]);

  const weakTo = matchups
    ? Object.entries(matchups).filter(([, mult]) => mult > 1).sort((a, b) => b[1] - a[1])
    : [];
  const resists = matchups
    ? Object.entries(matchups).filter(([, mult]) => mult < 1).sort((a, b) => a[1] - b[1])
    : [];

  return (
    <div className="overlay" onClick={onClose}>
      {onPrev && (
        <button className="nav-arrow nav-left" onClick={(e) => { e.stopPropagation(); onPrev(); }} aria-label="Previous Pokémon">
          ‹
        </button>
      )}

      <div
        className="panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={pokemon.name}
      >
        <button className="close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <button
          className={"panel-heart" + (isFavorite ? " active" : "")}
          onClick={() => onToggleFavorite(pokemon.id)}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>

        <div className="panel-content">
          <div className="panel-head">
            <div className="glow" style={{ background: color }} />
            <div className="id">#{String(pokemon.id).padStart(3, "0")}</div>
            <div className="img-frame" style={{ background: `${color}26` }}>
              <div className="imgwrap">
                <img src={spriteFor(pokemon)} alt={pokemon.name} />
              </div>
            </div>
            <h2>{pokemon.name}</h2>
            <div className="types">
              {pokemon.types.map((t) => (
                <TypeTag key={t} type={t} />
              ))}
            </div>
          </div>

          <div className="panel-body">
          <p className="desc">
            {desc ?? (
              <>
                <span className="spinner-sm" />
                Reading field data…
              </>
            )}
          </p>

          <div className="meta">
            <div>
              <span className="v">{(pokemon.height / 10).toFixed(1)} m</span>
              <span className="l">HEIGHT</span>
            </div>
            <div>
              <span className="v">{(pokemon.weight / 10).toFixed(1)} kg</span>
              <span className="l">WEIGHT</span>
            </div>
          </div>

          {pokemon.stats.map((s) => (
            <div className="stat-row" key={s.stat.name}>
              <span className="l">{STAT_LABELS[s.stat.name] || s.stat.name}</span>
              <span className="bar">
                <i
                  style={{
                    width: `${Math.min(100, (s.base_stat / 180) * 100)}%`,
                    background: color,
                  }}
                />
              </span>
              <span className="v">{s.base_stat}</span>
            </div>
          ))}

          <div className="matchups">
            <div className="matchup-col">
              <span className="l">WEAK TO</span>
              <div className="matchup-tags">
                {matchups === null ? (
                  <span className="spinner-sm" />
                ) : weakTo.length === 0 ? (
                  <span className="none">None</span>
                ) : (
                  weakTo.map(([t, mult]) => (
                    <span key={t} className="mtag" style={{ background: TYPE_COLORS[t] }}>
                      {t} ×{mult}
                    </span>
                  ))
                )}
              </div>
            </div>
            <div className="matchup-col">
              <span className="l">RESISTS</span>
              <div className="matchup-tags">
                {matchups === null ? (
                  <span className="spinner-sm" />
                ) : resists.length === 0 ? (
                  <span className="none">None</span>
                ) : (
                  resists.map(([t, mult]) => (
                    <span key={t} className="mtag dim" style={{ background: TYPE_COLORS[t] }}>
                      {t} ×{mult}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="evolution">
            <span className="l">EVOLUTION</span>
            {evolution === null ? (
              <span className="spinner-sm" />
            ) : evolution.length <= 1 ? (
              <span className="evo-none">This Pokémon does not evolve.</span>
            ) : (
              <div className="evo-chain">
                {evolution.map((stage, i) => (
                  <Fragment key={`stage-${i}`}>
                    <div className="evo-stage">
                      {stage.map((s) => {
                        const mon = allPokemon?.find((p) => p.id === s.id);
                        return (
                          <div
                            key={s.id}
                            className={"evo-mon" + (s.id === pokemon.id ? " current" : "")}
                            onClick={() => mon && onSelectPokemon?.(mon)}
                          >
                            {mon && <img src={spriteFor(mon)} alt={s.name} />}
                            <span>{s.name}</span>
                          </div>
                        );
                      })}
                    </div>
                    {i < evolution.length - 1 && <span className="evo-arrow">→</span>}
                  </Fragment>
                ))}
              </div>
            )}
          </div>
          </div>
        </div>
      </div>

      {onNext && (
        <button className="nav-arrow nav-right" onClick={(e) => { e.stopPropagation(); onNext(); }} aria-label="Next Pokémon">
          ›
        </button>
      )}
    </div>
  );
}
