# CozyMuseum

CozyMuseum is an empty, local-first natural-history museum shell. A fresh download includes the application and schema only: no organisms, catalog workbooks, personal encounters, articles, or bundled species media.

This distributable shell is English only.

## Context for agents and maintainers

This repository is the empty Critterarium desktop shell, separate from the founder's private Curatale catalog and the Curatale product shell. Do not copy personal records, proprietary documents, private media, or unrelated branded sections into this release.

The audience uses English. Keep the visible app, create and edit forms, guidance, and release copy in English. Do not add Vietnamese input fields or an EN/VI switch. The founder's private Curatale repository can use Vietnamese for the founder; its language rule does not transfer to this shell. Existing localized columns may be retained for storage compatibility, but the buyer form must not request or overwrite them.

In the organism form, put cover, common English name, life state, and personal score before scientific classification and less used metadata. Keep add and edit in one form. Scientific name and class are required for saving. Offer only a small, editable set of common-name classification suggestions; broad names such as “fish” need multiple class choices. Never treat a suggestion as scientific proof or bundle a species catalog. QA with an isolated `COZYMUSEUM_DATA_DIR`, not the founder's records.

**Current shell version:** `3.0.0`

Version `3.0.0` starts from the 2.0.0 Critterarium shell. It preserves the local catalog and encounter model, uses the same card-to-detail and add-card-to-editor interaction pattern as Curatale, closes mobile navigation after a Realm switch, and removes inherited public-platform modules and private catalog media from this source tree.

## Version lineage

- `1.0.0` - initial CozyMuseum empty shell baseline.
- `2.0.0` - Critterarium visual, interaction, and modular architecture upgrade.
- `3.0.0` - native Windows window and shortcuts, showroom backgrounds, an opaque organism editor, and the empty English-only local catalog. The installer can be placed in a user-chosen directory; personal data remains outside that directory.

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

On first run, CozyMuseum creates two empty Realm workbooks for Animalia and Plantae & Fungi outside the source folder. The default Windows location is:

```text
%LOCALAPPDATA%\CozyMuseum\Critterarium\data
```

Set `COZYMUSEUM_DATA_DIR` before launch to choose another location. Updating or replacing the application folder does not overwrite this user-data directory.

Older builds used `%LOCALAPPDATA%\CozyMuseum\data`, which could contain a
catalog copied from another CozyMuseum project. The desktop app does not import
that shared folder automatically. If it holds your own Critterarium records,
close the app, back up both folders, then copy your supported Realm workbooks and
image files into the new Critterarium folder yourself. Older `sar.xlsx` and
`microverse.xlsx` files are left untouched, but this shell does not load them.

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
