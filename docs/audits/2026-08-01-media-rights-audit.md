# CozyMuseum zero-attribution media audit - 2026-08-01

## Result

**PASS under ADR-0007.** The four live Realm workbooks contain no displayed or locally stored image outside the `CC0` / `Public Domain` allowlist.

This is a point-in-time engineering audit, not legal advice.

## Scope and method

The audit read all four flat single-sheet workbooks, the committed seed snapshot, and every file under `images/species/`. It resolved each of the 101 original `upload.wikimedia.org` covers through Wikimedia Commons `imageinfo.extmetadata` at exact file level.

The cleanup failed closed:

- accepted only normalized `CC0` or `Public Domain` declarations;
- rejected CC BY, CC BY-SA, GFDL, unknown, incomplete, or article-level-only evidence;
- removed denied image fields from live rows and seed rows;
- deleted the old local media tree and rebuilt it only from accepted rows;
- retained exact source, license, license URL, rights status, and retrieval date internally;
- did not add a visible attribution surface because accepted media has no attribution requirement.

## Before and after

| Surface | Rows | Covers before | Covers after | Local copies after | Denied after | Incomplete proof after |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `animalia.xlsx` | 256 | 50 | 12 | 12 | 0 | 0 |
| `plantae-fungi.xlsx` | 127 | 31 | 3 | 3 | 0 | 0 |
| `sar.xlsx` | 9 | 8 | 4 | 4 | 0 | 0 |
| `microverse.xlsx` | 12 | 12 | 3 | 2 | 0 | 0 |
| **Live total** | **404** | **101** | **22** | **21** | **0** | **0** |
| `database/seeds/catalog.json` | 375 | 72 | 18 | 0 | 0 | 0 |

Of the original 101 covers, 79 were removed: 20 CC BY, 55 CC BY-SA, and 4 GFDL. The 22 survivors are 17 Public Domain and 5 CC0 files.

The old local tree contained 94 files. Seventy-four attribution-bearing local copies were removed. The rebuilt tree contains 21 referenced rights-free files, with zero orphan files and zero missing declared files. One accepted Public Domain cover remains remote-only because Wikimedia rate-limited its local download; its `localCover` field is intentionally blank.

## Enforced behavior

- Commons search can inspect broad results but selects only CC0/Public Domain candidates.
- Wikipedia article thumbnails are no longer used as image fallbacks.
- The media downloader refuses any row without complete rights-free proof.
- Legacy migration strips unverified image data instead of importing it.
- Organism intake requires a Full HD/4K image that also passes the rights-free gate.
- `bio doctor` makes any denied or incomplete displayed/local image a release-blocking error.
- A missing image remains a valid truthful card state.

## YouTube boundary

CozyMuseum stores public watch links and uses YouTube's official privacy-enhanced player. It contains no locally stored YouTube video or audio and no download/rehosting path. YouTube links remain external content and are not treated as CozyMuseum-owned media.

## Verification evidence

- 404 live rows scanned.
- 22 remote covers present; all 22 are CC0/Public Domain with complete internal proof.
- 21 local paths declared; all 21 physical files exist.
- 21 physical files present; zero are orphaned.
- 0 denied image licenses.
- 0 incomplete proof records.
- Regression tests cover CC0/Public Domain acceptance and CC BY/CC BY-SA/GFDL/unknown rejection.

## References

- Creative Commons CC0: https://creativecommons.org/public-domain/cc0/
- Creative Commons Public Domain Mark: https://creativecommons.org/public-domain/mark/1.0/
- Wikimedia Commons reuse guide: https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia/en
- YouTube embed help: https://support.google.com/youtube/answer/171780
