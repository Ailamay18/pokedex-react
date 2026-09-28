import { API, GEN1_LIMIT, TYPE_COLORS } from "./constants";

export async function fetchPokedex(onProgress) {
  const listRes = await fetch(`${API}/pokemon?limit=${GEN1_LIMIT}&offset=0`);
  if (!listRes.ok) throw new Error("Could not reach the Pokémon API.");
  const list = await listRes.json();

  const results = [];
  const chunkSize = 12;

  for (let i = 0; i < list.results.length; i += chunkSize) {
    const chunk = list.results.slice(i, i + chunkSize);
    const details = await Promise.all(
      chunk.map((item) => fetch(item.url).then((r) => r.json()))
    );
    results.push(...details);
    onProgress?.(results.length);
  }

  return results.sort((a, b) => a.id - b.id);
}

export async function fetchDescription(id) {
  const res = await fetch(`${API}/pokemon-species/${id}`);
  if (!res.ok) throw new Error("Field data unavailable right now.");
  const data = await res.json();
  const entry = (data.flavor_text_entries || []).find(
    (e) => e.language.name === "en"
  );
  return entry ? entry.flavor_text.replace(/[\n\f\r]/g, " ") : "No field data available.";
}
export async function fetchTypeEffectiveness(typeNames) {
  const typeDatas = await Promise.all(
    typeNames.map((t) => fetch(`${API}/type/${t}`).then((r) => r.json()))
  );

  const multipliers = {};
  Object.keys(TYPE_COLORS).forEach((t) => (multipliers[t] = 1));

  typeDatas.forEach(({ damage_relations }) => {
    damage_relations.double_damage_from.forEach((t) => {
      multipliers[t.name] = (multipliers[t.name] ?? 1) * 2;
    });
    damage_relations.half_damage_from.forEach((t) => {
      multipliers[t.name] = (multipliers[t.name] ?? 1) * 0.5;
    });
    damage_relations.no_damage_from.forEach((t) => {
      multipliers[t.name] = (multipliers[t.name] ?? 1) * 0;
    });
  });
export async function fetchEvolutionChain(id) {
  const speciesRes = await fetch(`${API}/pokemon-species/${id}`);
  if (!speciesRes.ok) throw new Error("Evolution data unavailable right now.");
  const species = await speciesRes.json();

  const chainRes = await fetch(species.evolution_chain.url);
  if (!chainRes.ok) throw new Error("Evolution data unavailable right now.");
  const chainData = await chainRes.json();

  const levels = [];
  let current = [chainData.chain];
  while (current.length) {
    levels.push(
      current.map((node) => ({
        name: node.species.name,
        id: Number(node.species.url.match(/\/(\d+)\/$/)[1]),
      }))
    );
    current = current.flatMap((node) => node.evolves_to);
  }
  return levels;
}


export function spriteFor(p) {
  return (
    p.sprites?.other?.["official-artwork"]?.front_default ||
    p.sprites?.front_default ||
    ""
  );
}

