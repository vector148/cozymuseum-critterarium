# Critterarium Release Ledger

The source version in `package.json`, `package-lock.json`, and `README.md` is 3.0.0.

| Version | Date | Change |
| --- | --- | --- |
| `1.0.0` | 2026-08-01 | Initial empty Critterarium shell. |
| `2.0.0` | 2026-08-22 | Modular architecture and showroom update. |
| `3.0.0` | 2026-10-03 | Clean shell, one-click Windows installer, and local browser runtime. |

The Windows Release asset is named `CozyMuseum-Critterarium-Setup.exe`.

| Asset | Bytes | SHA-256 |
| --- | ---: | --- |
| `CozyMuseum-Critterarium-Setup.exe` | 29,970,106 | `0BD262EEEA1E5802CF807EDF45B50008BD2A06CBD6F38B68477E99AE7EDEC600` |

Buyer-side QA installed this exact file on Windows without Node.js or npm setup. The installed program served the showroom and local catalog API on loopback with an empty catalog.
