# Three-Combo Unified Workflow (Project Standard)

A project-level workflow that composes Matt Pocock's skills into a single, repeatable 3-phase loop for CozyMuseum. This is a convenience wrapper over independent skills — you can still run any skill standalone.

---

## Combo 1 — Plan & Architecture (Backlog → Agent-Ready)

- Goal
  - Turn rough intent into a reviewed PRD and agent-ready issues.
- Inputs
  - Any rough note, plan, screenshot, or conversation summary.
- Commands (in order)
  - `/to-prd` — synthesize a Product Requirements Document (PRD) from the current context.
  - `/grill-with-docs` — relentless interview to stress-test the PRD (architecture, data seams, risks).
  - `/to-issues` — break the approved PRD into independently grabbable, labeled issues.
- Defaults & conventions
  - Issue tracker: local markdown under `.scratch/`.
  - Triage labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`.
  - Domain docs: single-context — `CONTEXT.md` + `docs/adr/`.
  - Do NOT auto-commit PRD during `/to-prd`. Commit once after `/grill-with-docs` and immediately before `/to-issues` if you want the PRD in history.
- Exit criteria
  - PRD approved in repo (or staged locally pending commit).
  - Issues created with `ready-for-agent` when truly AFK-ready; otherwise `ready-for-human`.

---

## Combo 2 — TDD Implementation (Issue → Code)

- Goal
  - Deliver working code via a test-first loop with clean module seams.
- Inputs
  - A single, independent issue from Combo 1.
- Commands (per issue)
  - `/tdd <issue-title>` — Red → Green → Refactor loop.
  - Implicit guardrail: `/codebase-design` vocabulary — push complexity into server modules; keep client components thin.
- Conventions
  - Tests exercise observable behavior; avoid testing private implementation details.
  - Respect Conventional Commits (72-char headers). Keep commitlint green.
  - Separate client (`resources/js/`) and server (`server/`) concerns cleanly.
- Exit criteria
  - All tests green locally; commitlint green.

---

## Combo 3 — Maintenance & Bugfix (Runtime → Stable)

- Goal
  - Diagnose hard bugs to root cause and keep the codebase agent-friendly over time.
- Triggers
  - Failing checks, crashes, regressions, or architectural smells.
- Commands
  - `/diagnosing-bugs` — reproduce → minimize → hypothesize → fix; add tests to prevent regressions.
  - `/improve-codebase-architecture` — scan for deepening opportunities; select one and refactor.
- Exit criteria
  - Bug reproduced and fixed with tests; or an architectural improvement merged with clear ADR notes if needed.

---

## Cross-cutting rules

- Router: `/ask-matt` when in doubt about which skill to run next.
- Docs discipline: Keep `CONTEXT.md` current; add ADRs in `docs/adr/` when decisions affect boundaries or infra.
- CI discipline: Commitlint must pass on every commit.
- Local workflow skills under `.agents/` and `skills-lock.json` are versioned so the clone retains the three-combo system. Never commit `.env`.
- Product UI and biological records are bilingual EN/VI; architecture documents may use the clearest single language.

---

## Quickstart (cheat sheet)

- Plan: `/to-prd` → `/grill-with-docs` → commit PRD (optional) → `/to-issues`
- Build: pick one issue → `/tdd <issue>` → commit
- Sustain: `/diagnosing-bugs` (when broken) → `/improve-codebase-architecture` (when idle)

---

## Notes on alignment with the skills design

- This workflow composes Matt Pocock's modular skills. It stays faithful by:
  - Keeping each skill independent and callable directly.
  - Using the router (`/ask-matt`) to avoid lock-in when an exception is needed.
  - Avoiding auto-commit during `/to-prd`, matching the skills' guidance to iterate locally before publication.

---

# Quy trình hợp nhất 3 Combo (Tiêu chuẩn dự án)

Một workflow cấp dự án CozyMuseum ghép các kỹ năng của Matt Pocock thành một vòng lặp 3 pha có thể lặp lại. Các kỹ năng vẫn độc lập; bạn có thể chạy riêng lẻ bất cứ lúc nào.

---

## Combo 1 — Lên kế hoạch & kiến trúc (Backlog → Sẵn sàng cho Agent)

- Mục tiêu
  - Biến ý định thô thành PRD đã được rà soát và các issue sẵn sàng cho agent.
- Đầu vào
  - Ghi chú, kế hoạch, ảnh chụp, tóm tắt hội thoại.
- Lệnh (theo thứ tự)
  - `/to-prd` — tạo PRD từ ngữ cảnh hiện tại.
  - `/grill-with-docs` — phản biện gắt gao để soi kiến trúc, điểm nối dữ liệu, rủi ro.
  - `/to-issues` — bẻ PRD đã duyệt thành các issue nhỏ, độc lập, có nhãn.
- Mặc định & quy ước
  - Issue tracker: local markdown dưới `.scratch/`.
  - Nhãn triage: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`.
  - Domain docs: single-context — `CONTEXT.md` + `docs/adr/`.
  - Không auto-commit PRD ở bước `/to-prd`.
- Tiêu chí kết thúc
  - PRD được duyệt. Issue tạo ra có nhãn `ready-for-agent` hoặc `ready-for-human`.

---

## Combo 2 — Triển khai TDD (Issue → Code)

- Mục tiêu
  - Giao hàng code chạy được qua vòng lặp viết test trước.
- Đầu vào
  - Một issue độc lập từ Combo 1.
- Lệnh (mỗi issue)
  - `/tdd <issue-title>` — vòng Red → Green → Refactor.
  - Lan can ngầm: `/codebase-design` — dồn phức tạp vào server modules; giữ client components mỏng.
- Quy ước
  - Test hành vi quan sát được; tránh test chi tiết triển khai nội bộ.
  - Tuân thủ Conventional Commits (72 ký tự); commitlint phải xanh.
- Tiêu chí kết thúc
  - Tất cả test xanh; commitlint xanh.

---

## Combo 3 — Bảo trì & Sửa lỗi (Runtime → Ổn định)

- Mục tiêu
  - Chẩn đoán bug khó tới gốc và giữ codebase thân thiện với agent.
- Tín hiệu kích hoạt
  - Check fail, crash, hồi quy, hoặc mùi kiến trúc.
- Lệnh
  - `/diagnosing-bugs` — tái hiện → thu hẹp → giả thuyết → sửa.
  - `/improve-codebase-architecture` — quét cơ hội làm sâu; chọn một và refactor.
- Tiêu chí kết thúc
  - Bug được sửa kèm test; hoặc cải tiến kiến trúc được commit với ghi chú ADR.

---

## Quy tắc cắt ngang

- Router: `/ask-matt` khi phân vân bước kế tiếp.
- Kỷ luật tài liệu: cập nhật `CONTEXT.md`; thêm ADR vào `docs/adr/`.
- Kỷ luật commit: commitlint phải pass trên mọi commit.
- Bộ skill workflow trong `.agents/` và `skills-lock.json` được version để clone mới vẫn giữ trọn ba combo; không commit `.env`.
- UI và dữ liệu sinh học phải hỗ trợ EN/VI; tài liệu kiến trúc có thể dùng một ngôn ngữ rõ nhất.

---

## Lối tắt (cheat sheet)

- Kế hoạch: `/to-prd` → `/grill-with-docs` → commit PRD (tùy chọn) → `/to-issues`
- Xây dựng: chọn một issue → `/tdd <issue>` → commit
- Duy trì: `/diagnosing-bugs` (khi lỗi) → `/improve-codebase-architecture` (khi rảnh)
