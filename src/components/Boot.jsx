export default function Boot({ loaded, total, error }) {
  if (error) {
    return (
      <div className="boot">
        <div className="ball" style={{ animation: "none" }} />
        <p>Connection failed</p>
        <p className="err">{error} — check your internet connection and reload the page.</p>
      </div>
    );
  }

  return (
    <div className="boot">
      <div className="ball" />
      <p>
        Contacting PokéAPI… {loaded}/{total}
      </p>
      <div className="track">
        <div className="fill" style={{ width: `${(loaded / total) * 100}%` }} />
      </div>
    </div>
  );
}
