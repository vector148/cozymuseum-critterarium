# Critterarium Release Ledger

The source version in `package.json`, `package-lock.json`, and `README.md` is 3.0.1.

| Version | Date | Change |
| --- | --- | --- |
| `1.0.0` | 2026-08-01 | Initial empty Critterarium shell. |
| `2.0.0` | 2026-08-22 | Modular architecture and showroom update. |
| `3.0.0` | 2026-10-03 | Clean shell source. Release held after shortcut QA found an incorrect runtime path. |
| `3.0.1` | 2026-10-03 | Corrected shortcut and verified the installed showroom and local API. |

The Windows Release asset is named `CozyMuseum-Critterarium-Setup.exe`.

| Asset | Bytes | SHA-256 |
| --- | ---: | --- |
| `v3.0.0` held draft | 29,970,106 | `0BD262EEEA1E5802CF807EDF45B50008BD2A06CBD6F38B68477E99AE7EDEC600` |
| `v3.0.1` Windows installer | 29,969,917 | `767A395C692F242F17D52A7D14CB005371C27AAD5E7F5DBE324A81AEC4C0DDF2` |

Buyer-side QA found the v3.0.0 shortcut failure and held that Release. The corrected v3.0.1 installer passed silent installation, shortcut launch, HTTP showroom, and empty-catalog API checks.
