import { useCallback, useEffect, useState } from "react";

import { api } from "../api/index.js";

export function useCritterarium(filters) {
  const [metadata, setMetadata] = useState({ categories: [], encounterYears: [] });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);

  const refresh = useCallback(() => setRevision((value) => value + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    Promise.all([
      api.getMetadata({
        locale: filters.locale,
        wingId: filters.wingId,
        atlasMode: filters.atlasMode,
      }),
      api.getOrganisms(filters),
    ]).then(([nextMetadata, list]) => {
      if (cancelled) return;
      setMetadata(nextMetadata);
      setItems(list.items || []);
    }).catch((requestError) => {
      if (!cancelled) setError(requestError.message);
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [
    filters.wingId,
    filters.atlasMode,
    filters.locale,
    filters.query,
    filters.classId,
    filters.encounterYear,
    revision,
  ]);

  return { metadata, items, loading, error, refresh };
}
