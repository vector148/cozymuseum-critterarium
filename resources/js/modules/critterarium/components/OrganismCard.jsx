import { OptimizedImage } from "../../../components/OptimizedImage.jsx";
import { catalogMediaFor } from "../media/catalog-media.js";

function initials(value) {
  return String(value || "?").split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

export default function OrganismCard({ item, mode, onOpen }) {
  const image = item.coverUrl;
  const media = catalogMediaFor(item.organismId, image);
  const sideValue = mode === "retired" ? "EX" : item.iucnStatus || "–";

  return (
    <button className="card type-organism organism-card" type="button" onClick={(event) => onOpen(item, event.currentTarget)}>
      <div className="cover-wrap">
        {image ? (
          <OptimizedImage
            src={media.src}
            fallbackSrc={media.fallbackSrc}
            width={640}
            quality={75}
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
      </div>
      <div className="meta">
        <div className="title" title={item.displayName}>{item.displayName}{item.isDangerous ? " ☠️" : ""}</div>
        <div className="artist" title={item.scientificName}><i>{item.scientificName}</i></div>
        <div className="row">
          <span className="pill">{item.displayClass}</span>
          <span className="score">{sideValue}</span>
        </div>
      </div>
    </button>
  );
}
