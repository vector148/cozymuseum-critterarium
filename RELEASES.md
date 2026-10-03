# Critterarium Release Ledger

## Windows 3.0.0

The only supported 3.x download is the `v3.0.0` GitHub Release asset
`CozyMuseum-Critterarium-Setup.exe`. It contains the native Windows shell,
desktop and Start Menu shortcuts, the four showroom backgrounds, and an empty
English-only local catalog. The install directory is selectable; user data is
stored separately under `%LOCALAPPDATA%\CozyMuseum\Critterarium\data` by default.

The 3.0.1-3.0.4 release labels were intermediate corrections to the same 3.0
product. They are retired in favor of this consolidated 3.0.0 release. Later
corrections within this product generation replace the asset at the same
release URL. Use its published SHA-256 digest to distinguish installer builds;
the displayed product version remains 3.0.0 until a genuine 4.0 release.

| Asset | Bytes | SHA-256 |
| --- | ---: | --- |
| `v3.0.0` Windows installer | 33,475,289 | `89EBBA39E50DC3D4D91C0960391BCA9A4FD3E09EC961CB6BD6A5D91B5B6818C8` |

Buyer-side QA on 2026-10-15 verified the installer, native window, shortcut,
catalog save, and restart with an isolated empty data directory. On 2026-10-16,
the default directory was found to share `%LOCALAPPDATA%\CozyMuseum\data` with
a previously copied catalog. The default now has its own Critterarium namespace.
An upgrade install on the same machine launched through the Desktop shortcut
without a data override. The current shell creates only the Animalia and
Plantae & Fungi workbooks. Existing SAR and Microverse workbooks are not loaded,
deleted, or overwritten. Existing personal records in the
legacy directory require an explicit user-controlled copy; no automatic import
occurs. Windows SmartScreen behavior was not observed on this machine.

The 2026-10-16 replacement aligns add/edit dropdowns and specimen actions
with the Duo's dark glass controls. The shell still starts with an empty catalog.
