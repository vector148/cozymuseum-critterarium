function queryFrom(request) {
  return {
    realmId: request.query.realmId,
    phylumId: request.query.phylumId,
    classId: request.query.classId,
    lifeState: request.query.lifeState,
    atlasMode: request.query.atlasMode,
    encounterYear: request.query.encounterYear,
    query: request.query.query,
    locale: request.query.locale,
  };
}

export function createAtlasController({ catalog }) {
  if (!catalog) throw new TypeError("Atlas controller requires catalog");
  return Object.freeze({
    metadata(request, response) {
      response.json(catalog.metadata({
        locale: request.query.locale,
        realmId: request.query.realmId,
        atlasMode: request.query.atlasMode,
      }));
    },
    list(request, response) {
      response.json(catalog.list(queryFrom(request)));
    },
    detail(request, response) {
      const item = catalog.get(request.params.organismId, { locale: request.query.locale });
      if (!item) return response.status(404).json({ error: "organism_not_found" });
      return response.json(item);
    },
    completeEncounter(request, response) {
      try {
        return response.json(catalog.completeEncounter(request.params.organismId, request.body));
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const status = message === "Organism not found" ? 404 : 400;
        return response.status(status).json({ error: status === 404 ? "organism_not_found" : "invalid_encounter", message });
      }
    },
    undoEncounter(request, response) {
      try {
        return response.json(catalog.undoEncounter(request.params.organismId));
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return response.status(404).json({ error: "organism_not_found", message });
      }
    },
  });
}
