# CozyMuseum

CozyMuseum is an empty, local-first natural-history museum shell. A fresh download includes the application and schema only: no organisms, catalog workbooks, personal encounters, articles, or bundled species media.

**Current shell version:** `3.0.0`

Version `3.0.0` starts from the 2.0.0 Critterarium shell. It preserves the local catalog and encounter model, uses the same card-to-detail and add-card-to-editor interaction pattern as Curatale, closes mobile navigation after a Realm switch, and removes inherited public-platform modules and private catalog media from this source tree.

## Version lineage

- `1.0.0` - initial CozyMuseum empty shell baseline.
- `2.0.0` - Critterarium visual, interaction, and modular architecture upgrade.
- `3.0.0` - clean source baseline for incremental Critterarium card and navigation refinements.

## Start on Windows

1. Download `CozyMuseum-Critterarium-Setup.exe` from the official GitHub Release.
2. Run the installer. It installs for the current Windows user and creates desktop and Start Menu shortcuts.
3. Open **CozyMuseum Critterarium**. The local showroom opens in your browser; no Node.js or npm installation is required.

The installer contains the Node runtime and production dependencies. The application binds to Windows loopback only. Nothing in the core flow requires an account or cloud connection. Internet access is needed only for optional source lookup and enrichment.

The source checkout remains available to developers. Double-click `CozyMuseum Critterarium.bat` after installing Node.js 20 or newer, or run:

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

Windows release builders can run `npm run desktop:build` with Node 26.3.0 and Inno Setup 6. The exact GitHub asset name is `CozyMuseum-Critterarium-Setup.exe`. Build output is in `.build/release/` and does not enter Git.

The verification suite tests the local data boundary, API behavior, production build, empty catalog health, and the failure-closed cleanroom release gate.

## License

CozyMuseum Critterarium is distributed under the [Personal-Use Only License](LICENSE). It is licensed solely for private, non-commercial use. Commercial use, resale, sublicensing, and unauthorized public redistribution are strictly prohibited.
