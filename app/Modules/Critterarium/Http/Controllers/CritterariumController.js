function queryFrom(request) {
  return {
    wingId: request.query.wingId,
    phylumId: request.query.phylumId,
    classId: request.query.classId,
    lifeState: request.query.lifeState,
    atlasMode: request.query.atlasMode,
    encounterYear: request.query.encounterYear,
    query: request.query.query,
    locale: request.query.locale,
  };
}

export function createCritterariumController({ catalog }) {
  if (!catalog) throw new TypeError("Critterarium controller requires catalog");
  return Object.freeze({
    metadata(request, response) {
      response.json(catalog.metadata({
        locale: request.query.locale,
        wingId: request.query.wingId,
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
    create(request, response) {
      try {
        return response.status(201).json(catalog.create(request.body));
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return response.status(400).json({ error: "invalid_organism", message });
      }
    },
    update(request, response) {
      try {
        return response.json(catalog.update(request.params.organismId, request.body));
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const status = message === "Organism not found" ? 404 : 400;
        return response.status(status).json({ error: status === 404 ? "organism_not_found" : "invalid_organism", message });
      }
    },
    remove(request, response) {
      try {
        catalog.remove(request.params.organismId);
        return response.status(204).end();
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return response.status(404).json({ error: "organism_not_found", message });
      }
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
