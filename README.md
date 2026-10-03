# CozyMuseum

CozyMuseum is an empty, local-first natural-history museum shell. A fresh download includes the application and schema only: no organisms, catalog workbooks, personal encounters, articles, or bundled species media.

**Current shell version:** `3.0.3`

Version `3.0.0` starts from the 2.0.0 Critterarium shell. It preserves the local catalog and encounter model, uses the same card-to-detail and add-card-to-editor interaction pattern as Curatale, closes mobile navigation after a Realm switch, and removes inherited public-platform modules and private catalog media from this source tree.

## Version lineage

- `1.0.0` - initial CozyMuseum empty shell baseline.
- `2.0.0` - Critterarium visual, interaction, and modular architecture upgrade.
- `3.0.0` - clean source baseline for incremental Critterarium card and navigation refinements.
- `3.0.1` - correct the installed shortcut path and release a verified Windows setup.
- `3.0.2` - open the museum in its own native desktop window, add a desktop shortcut and sidebar-logo icon, and restore the showroom background.
- `3.0.3` - render the sidebar mark without a dark icon tile and match the Botany and Wildlife showroom backgrounds.

## Start on Windows

1. Download `CozyMuseum-Critterarium-Setup.exe` from the official GitHub Release.
2. Run the installer. It installs for the current Windows user and creates desktop and Start Menu shortcuts.
3. Open **CozyMuseum Critterarium** from the Desktop or Start Menu shortcut. The showroom opens in its own desktop window; no browser, Node.js, or npm installation is required.

The installer contains a native Tauri window, the Node runtime, and production dependencies. Its local server binds to Windows loopback only and closes with the desktop app. Nothing in the core flow requires an account or cloud connection. Internet access is needed only for optional source lookup and enrichment.

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

Windows release builders can run `npm run desktop:build` with Node 26.3.0, Rust, WebView2, and Inno Setup 6. The exact GitHub asset name is `CozyMuseum-Critterarium-Setup.exe`. Build output is in `.build/release/` and does not enter Git.

The verification suite tests the local data boundary, API behavior, production build, empty catalog health, and the failure-closed cleanroom release gate.

## License

CozyMuseum Critterarium is distributed under the [Personal-Use Only License](LICENSE). It is licensed solely for private, non-commercial use. Commercial use, resale, sublicensing, and unauthorized public redistribution are strictly prohibited.
