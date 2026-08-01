const PILL_COLORS = ["blue", "green", "yellow", "red", "purple"];

function initials(value) {
  return String(value || "?").split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function pillColor(value) {
  const hash = [...String(value || "")].reduce((sum, character) => sum + character.charCodeAt(0), 0);
  return PILL_COLORS[hash % PILL_COLORS.length];
}

export default function OrganismCard({ item, mode, onOpen }) {
  const image = item.coverUrl;
  const sideValue = mode === "retired" ? "EX" : item.iucnStatus || "–";

  return (
    <button className="card type-organism organism-card" type="button" onClick={(event) => onOpen(item, event.currentTarget)}>
      <div className="cover-wrap">
        {image ? (
          <img
            src={image}
            alt={item.displayName}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display = "none";
              event.currentTarget.nextElementSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div className="cover-fallback organism-fallback" style={image ? { display: "none" } : undefined}>
          {initials(item.scientificName || item.displayName)}
        </div>
        {item.encountered ? <span className="organism-encountered-badge" aria-label="Encountered">★</span> : null}
      </div>
      <div className="meta">
        <div className="title" title={item.displayName}>{item.displayName}</div>
        <div className="artist" title={item.scientificName}><i>{item.scientificName}</i></div>
        <div className="row">
          <span className={`pill ${pillColor(item.className)}`}>{item.displayClass}</span>
          <span className="score">{sideValue}</span>
        </div>
      </div>
    </button>
  );
}
