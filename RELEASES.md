# Critterarium Release Ledger

The source version in `package.json`, `package-lock.json`, and `README.md` is 3.0.3.

| Version | Date | Change |
| --- | --- | --- |
| `1.0.0` | 2026-08-01 | Initial empty Critterarium shell. |
| `2.0.0` | 2026-08-22 | Modular architecture and showroom update. |
| `3.0.0` | 2026-10-03 | Clean shell source. Release held after shortcut QA found an incorrect runtime path. |
| `3.0.1` | 2026-10-03 | Corrected shortcut and verified the installed showroom and local API. |
| `3.0.2` | 2026-10-03 | Native desktop window, user desktop shortcut, sidebar-logo icon, and showroom background. |
| `3.0.3` | 2026-10-03 | Transparent sidebar icon and image parity for Botany and Wildlife; Aquarium and Fossils retained their web treatments. |

The Windows Release asset is named `CozyMuseum-Critterarium-Setup.exe`.

| Asset | Bytes | SHA-256 |
| --- | ---: | --- |
| `v3.0.0` held draft | 29,970,106 | `0BD262EEEA1E5802CF807EDF45B50008BD2A06CBD6F38B68477E99AE7EDEC600` |
| `v3.0.1` Windows installer | 29,969,917 | `767A395C692F242F17D52A7D14CB005371C27AAD5E7F5DBE324A81AEC4C0DDF2` |
| `v3.0.2` native Windows installer | 32,858,648 | `6CE4C609AF96B1AFAFBE4A15159D13BE6B26EA6E36BE3A725E7D402DF121FB2B` |
| `v3.0.3` native Windows installer | 33,471,212 | `DA9B9B7CD125DCF4062EEFC31A6B556F4A7D2A748E488B8941D894201C02DEB6` |

Buyer-side QA found the v3.0.0 shortcut failure and held that Release. The corrected v3.0.1 installer passed silent installation, shortcut launch, HTTP showroom, and empty-catalog API checks.

Buyer-side QA installed v3.0.2, found its Desktop shortcut targeting the native executable, observed a visible Critterarium WebView2 window without a new Chrome process, read the showroom and background over loopback, and verified that closing the window stopped the local server.

The v3.0.3 payload was run in a separate native WebView2 window. Aquarium, Botany, Wildlife, and Fossils were visually checked against the web showroom assets and treatments. The PNG and ICO icon corners have zero alpha; the installer includes a versioned ICO for its shortcuts. An in-place installer and shortcut refresh have not been run because an existing v3.0.2 user session was open.
