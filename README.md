# CozyMuseum

CozyMuseum is an empty, local-first natural-history museum shell. A fresh download includes the application and schema only: no organisms, catalog workbooks, personal encounters, articles, or bundled species media.

**Current shell version:** `1.3.0`

Version `1.3.0` is the cleanroom baseline: first-run local storage, an empty Atlas, local organism workflows, Hall of Fame encounters, and failure-closed release verification. Version `2.0.0` will modernize the Critterarium interface without adding the web Foyer, Reading Room, Curatale, Supabase, analytics, or deployment services.

## Start on Windows

1. Install Node.js 20 or newer.
2. Download and extract this repository.
3. Double-click `CozyMuseum.bat`.

The launcher installs missing npm dependencies, starts the local API and interface, then opens the museum in your browser. Nothing in the core flow requires an account or cloud connection.

Developers can run the same application with:

```bash
npm install
npm run dev
```

## Your data

On first run, CozyMuseum creates four empty Realm workbooks outside the source folder. The default Windows location is:

```text
%LOCALAPPDATA%\CozyMuseum\data
```

Set `COZYMUSEUM_DATA_DIR` before launch to choose another location. Updating or replacing the application folder does not overwrite this user-data directory.

Use the Atlas empty state to add your first organism. IDs are allocated locally with a Realm prefix and five digits, such as `A00001`. Records can be viewed, edited, removed, and marked as personal encounters through the local application.

## Content responsibility

You own and control the records you add. Only attach text, images, video links, or other media that you have the right to use. CozyMuseum does not bundle a catalog or grant rights to user-supplied content.

## Verify the shell

```bash
npm run verify
```

The verification suite tests the local data boundary, API behavior, production build, empty catalog health, and the failure-closed cleanroom release gate.

## License

The application source is available under the [MIT License](LICENSE).
