---
name: blackfire-grilling
description: Operations' sole Planning mega-skill. Relentlessly review Atumerce PRDs, ADRs, architecture, agent workflows, privacy designs, UX decisions, and repository changes, then route approved planning work to the appropriate Matt, PRD, issue, or architecture child skill.
---

# Blackfire Grilling Skill

## English Version

## Definition

**Blackfire Grilling** is the Operations-owned Planning mega-skill for burning weak assumptions out of a technical plan before it becomes code, system UX, automation, data flow, or repository history. Governance Core and other departments supply policy constraints through reviewed handoffs; Operations owns this mega-skill artifact and its engineering use.

It is the Operations engineering evolution of the older `grill-with-docs` habit and is **Combo 1** in the Operations Engineering Three-Combo Workflow. The old command was an interview flow. Blackfire Grilling is an Operations discipline for technical PRDs, technical ADRs, architecture changes, engineering agent workflows, technical privacy/data-flow design, repository changes, and high-risk system UX.

## Why It Exists

Atumerce sells clarity. A plan that sounds intelligent but hides weak assumptions creates more noise. Blackfire Grilling protects the Brand DNA by forcing every proposal through hard questions before implementation.

This skill is not a company-wide loadout. A department retains its own Planning mega-skill and sends Operations a reviewed handoff when it needs an engineering slice. Blackfire can make that slice testable and safe, but does not grant ownership of another department's data, policy, budget, product truth, or runtime.

## Core Question

> Does this create structural clarity, or just more noise?

If the answer is not clear, the plan is not ready.

## Mega-Skill Routing

Blackfire Grilling is the only Operations Planning control surface under ADR-0017. Load the relevant approved Team00 Governance Core context—including canonical Brand DNA, founder direction, Brand Guardian policy, and active ADR constraints—then record state A, target state B, causal hypothesis, constraints, owner, verification, rollback/recovery condition, stop condition, evidence, and uncertainty before routing work.

Use `ask-matt` to select the planning route. Route deeper work to `grill-with-docs`, `to-prd`, `to-issues`, `setup-matt-pocock-skills`, `codebase-design`, or `improve-codebase-architecture`. These are child methods of Blackfire Grilling, not separate Planning mega-skills.

An approved technical slice moves to Greenline Forging or Faultline Containment. Evidence and learning return through Diagnosing Bugs. Blackfire Grilling does not implement, deploy, mutate production, or grant another department's business authority.

### Required Brand Orientation

Before selecting a child method or accepting a technical handoff:

1. Name technical state A, intended state B, requester and technical owner, scope, deadline, evidence, and uncertainty.
2. Apply the four values: **Market Truth** requires reproducible evidence; **Essential Simplicity** chooses the smallest safe change; **Structured Flow** fixes the seam, dependency, owner, verification, rollback/recovery path, and stop condition; **Adaptive Intelligence** records telemetry, feedback, revalidation, and revision triggers.
3. Preserve Atumerce's clear, calm, privacy-respecting, reliable premium-infrastructure trust contract. Never imply brokerage, exchange, signals, copy trading, managed trading, or guaranteed outcomes.
4. Conclude `proceed`, `reframe`, `escalate`, or `reject`. Never smuggle a rejected claim, consent change, budget choice, or cross-department decision into engineering.

## Mandatory Lenses

| Lens | Question |
| --- | --- |
| Brand DNA | Does this preserve Market Truth, Essential Simplicity, Structured Flow, and Adaptive Intelligence? |
| Anti-Noise | Is anything vague, ornamental, hype-driven, or present only because it sounds premium? |
| No-Guru | Could an outsider mistake this for signals, copy trading, managed trading, or get-rich-quick marketing? |
| Premium Anchor | Does it feel like serious infrastructure rather than cheap tactics? |
| DACH/Nordic Trust | Would a technical user in Germany, Switzerland, Austria, or the Nordics trust it under inspection? |
| Privacy | Are consent, minimization, purpose, withdrawal, export, and deletion explicit? |
| Encoding Integrity | Is the file clean UTF-8, free of mojibake, and readable in both English and Vietnamese? |
| Phase Boundary | Is this in the right phase, or is it smuggling Phase 4 risk into Phase 2/3? |
| Module Ownership | Which department owns it, and which Laravel module should contain runtime code? |
| Testability | How will an IDE/dev prove it works instead of merely describing it? |
| Failure Mode | What breaks, where is it observed, and how does an operator recover? |

## Standard PRD Structure

Every serious Atumerce PRD after Blackfire Grilling should use this structure unless it is a very small tactical PRD.

1. **Title And Status** - PRD name, phase, date, department owner, status, related issue.
2. **Executive Summary** - What is being built and why it matters now.
3. **Context And Problem** - Current state, pain, risk, and why the current system is insufficient.
4. **Brand And Strategy Fit** - How this protects Brand DNA, anti-noise, premium positioning, and DACH/Nordic trust.
5. **Phase Boundary** - In-scope, deferred scope, and what would violate the phase.
6. **Users And Operators** - Customer, admin, operator, founder, agent, or integration.
7. **Functional Requirements** - Behaviour, routes, screens, workflows, APIs, events, permissions, and data handling.
8. **Non-Functional Requirements** - Performance, security, privacy, accessibility, observability, reliability, and maintainability.
9. **Data Model And Event Contract** - Tables, fields, event names, payload envelope, idempotency, retention, consent tier, and projection.
10. **UX/UI Requirements** - Screens, responsive breakpoints, component rules, empty/error/loading states, and acceptance screenshots when needed.
11. **Dependencies And Ownership** - Blocking issues, module owner, requesting department owner, Operations owner, required handoff, third-party service, and environment requirement.
12. **Issue Table** - Issue number, title, owner, dependency, unblocks, acceptance criteria, and verification command.
13. **Acceptance Criteria** - Exact conditions for done.
14. **Test And Verification Plan** - Unit, feature, smoke, browser, CLI, migration, privacy, and rollback checks.
15. **Risks And Grill Decisions** - Risks found, rejected ideas, deferred scope, and ADR candidates.
16. **Handoff Notes** - What the next IDE/agent must read, what must not change, and how completion should be reported.

## Standard Output

Each Blackfire Grilling pass must leave one of these artifacts:

- a sharpened PRD;
- an ADR when a durable architecture decision must be remembered;
- an issue table with dependencies and acceptance criteria;
- a glossary entry when a confusing term has been clarified;
- a short rejection note when an idea is unsafe for Atumerce.

## Operating Protocol

1. Read the master PRD, phase PRD, ADR, and relevant department ownership docs first.
2. Name the phase boundary and one primary department owner before proposing work.
3. Ask what can fail legally, technically, commercially, and brand-wise.
4. Remove or defer anything that violates the current phase or Brand DNA.
5. Convert surviving scope into concrete interfaces, data models, routes, tests, and dependency issues.
6. Use bilingual internal discussion when useful; generate outward-facing output in the target-market language.
7. For bilingual PRDs, verify that the saved file is truly UTF-8 clean before handoff. Do not treat bad PowerShell rendering as proof the file is broken; if mojibake is suspected, inspect the actual text/bytes.
8. The Vietnamese section must be readable operating Vietnamese, not an English table pasted under Vietnamese headings. Technical nouns may remain, but outcomes, acceptance criteria, and verification must be explained in Vietnamese.

### Encoding Release Gate

Encoding is a release gate, not a cosmetic review:

1. Write every PRD, ADR, guide, report, and bilingual companion as UTF-8. Never use an implicit Windows ANSI/code-page write.
2. Before staging documentation, run `php scripts/check-doc-encoding.php` from the repository root.
3. The check must pass strict UTF-8 decoding and the semantic mojibake scan. A terminal rendering problem is not a pass, and a visually readable file is not a pass if its bytes are invalid.
4. If a file is damaged, recover from a known-clean Git blob or repair the affected lines manually. Do not blindly re-encode an entire mixed-encoding file, because that can destroy Vietnamese characters that are already correct.
5. Do not hand off, commit, or publish a PRD while the checker reports any invalid byte, replacement character, mojibake signature, or corrupted letter-question-letter sequence.

The mojibake gate must also catch Windows-1252/1258 artifacts such as `U+0102 U+00AA`, `U+0102 U+00A0`, `U+00E2 U+20AC U+201D`, `U+00E1 U+00BB`, and `U+00C6 U+00B0`. These are encoding failures even when the file still technically decodes as UTF-8.

**Diagnose the encoding before repairing.** The recurring corruption on Windows is not "broken UTF-8 in general" — it is UTF-8 text that was re-saved through the Windows-1258 (or 1252) code page, producing valid-but-wrong byte sequences. Identify the specific source encoding first (`U+00E1 U+00BB`, `U+00E1 U+00BA`, `U+0102`, `U+00C6 U+00B0`, `U+00E2 U+20AC U+201D` are the 1258/1252 signatures), then reverse exactly that transform.

**Repair by token, not by rewrite.** Once the source encoding is known, fix the specific corrupted tokens in place. Do not delete-and-retype the file from memory, and do not translate/guess the Vietnamese word-by-word — both destroy meaning. Do not blanket re-encode the whole file either, because a mixed-encoding file contains Vietnamese characters that are already correct and a global re-decode corrupts them. A single line can hold both correct and garbled characters; a token-level fix rescues the line without touching the parts that are already right. Prefer recovering the exact string from a known-clean Git blob; only hand-repair tokens when no clean blob exists.

## Mandatory Use

Use Blackfire Grilling before Operations work such as:

- creating or editing technical phase PRDs and technical ADRs;
- designing engineering agent workflows, event/data flows, privacy/consent implementation, analytics transport, or telemetry;
- changing runtime/admin system structure, infrastructure, module ownership, repository history, or high-risk system UX;
- producing a technical issue batch after a reviewed engineering plan.

## Anti-Patterns

- Asking a few shallow questions and calling it a grill.
- Writing a long PRD without dependency decisions.
- Adding AI because the word AI sounds premium.
- Hiding legal/privacy risk inside technical wording.
- Mixing customer-facing The Edge with internal `/admin/lab`.
- Moving runtime code into `company/` instead of only mapping ownership.
- Treating DACH privacy as a banner problem instead of a data-flow problem.
- Shipping PRDs with mojibake, broken Vietnamese, missing section numbers, or Vietnamese issue tables that are still mostly English.

-------------------------

# Blackfire Grilling Skill

## Phiên Bản Tiếng Việt

## Định Nghĩa

**Blackfire Grilling** là skill Planning và review engineering do Operations sở hữu, dùng để nướng cháy giả định yếu trong một kế hoạch kỹ thuật trước khi nó biến thành code, UX hệ thống, automation, data flow hoặc lịch sử repo. Governance Core và phòng ban khác cung cấp policy constraint qua handoff đã review; Operations sở hữu artifact skill này và việc dùng nó cho engineering.

Đây là bản nâng cấp engineering của Operations từ thói quen `grill-with-docs` cũ và là **Combo 1** trong Operations Engineering Three-Combo Workflow. Lệnh cũ là một luồng phỏng vấn. Blackfire Grilling là kỷ luật của Operations cho PRD kỹ thuật, ADR kỹ thuật, thay đổi kiến trúc, workflow agent engineering, thiết kế privacy/data-flow kỹ thuật, thay đổi repository và UX hệ thống rủi ro cao.

## Vì Sao Nó Tồn Tại

Atumerce bán sự rõ ràng. Một kế hoạch nghe thông minh nhưng giấu giả định yếu sẽ tạo thêm noise. Blackfire Grilling bảo vệ Brand DNA bằng cách bắt mọi đề xuất đi qua câu hỏi khó trước khi triển khai.

Mega-skill này không phải loadout dùng chung toàn công ty. Mỗi phòng ban giữ mega-skill Planning của riêng mình và gửi Operations một handoff đã review khi cần lát engineering. Blackfire có thể làm lát đó an toàn và kiểm thử được, nhưng không cấp ownership đối với dữ liệu, policy, ngân sách, product truth hay runtime của phòng ban khác.

## Câu Hỏi Cốt Lõi

> Việc này tạo ra structural clarity, hay chỉ tạo thêm noise?

Nếu câu trả lời chưa rõ, kế hoạch chưa sẵn sàng.

## Điều Phối Mega-Skill

Blackfire Grilling là control surface Planning duy nhất của Operations theo ADR-0017. Phải nạp context Team00 Governance Core đã duyệt có liên quan—gồm Brand DNA canonical, định hướng founder, policy Brand Guardian và ràng buộc ADR đang hiệu lực—rồi ghi trạng thái A, trạng thái B mục tiêu, giả thuyết nhân quả, ràng buộc, owner, cách xác minh, điều kiện rollback/recovery, stop condition, evidence và uncertainty trước khi điều phối công việc.

Dùng `ask-matt` để chọn route Planning. Điều phối phần chuyên sâu sang `grill-with-docs`, `to-prd`, `to-issues`, `setup-matt-pocock-skills`, `codebase-design` hoặc `improve-codebase-architecture`. Đây là các phương pháp con của Blackfire Grilling, không phải mega-skill Planning độc lập.

Lát kỹ thuật đã duyệt chuyển sang Greenline Forging hoặc Faultline Containment. Evidence và bài học quay lại qua Diagnosing Bugs. Blackfire Grilling không implementation, deploy, mutation production hay tự cấp thẩm quyền nghiệp vụ của phòng ban khác.

### Brand Orientation Bắt Buộc

Trước khi chọn phương pháp con hoặc nhận technical handoff:

1. Nêu trạng thái kỹ thuật A, trạng thái B mong muốn, requester và technical owner, scope, deadline, evidence và uncertainty.
2. Áp dụng bốn giá trị: **Market Truth** yêu cầu evidence tái lập được; **Essential Simplicity** chọn thay đổi an toàn nhỏ nhất; **Structured Flow** khóa seam, dependency, owner, verification, đường rollback/recovery và stop condition; **Adaptive Intelligence** ghi telemetry, feedback, mốc xác minh lại và trigger sửa đổi.
3. Giữ hợp đồng niềm tin hạ tầng cao cấp rõ ràng, điềm tĩnh, tôn trọng privacy và đáng tin cậy của Atumerce. Không ngụ ý brokerage, exchange, signals, copy trading, managed trading hay kết quả được bảo đảm.
4. Kết luận `proceed`, `reframe`, `escalate` hoặc `reject`. Không giấu claim bị từ chối, thay đổi consent, lựa chọn ngân sách hay quyết định liên phòng ban vào engineering.

## Các Lăng Kính Bắt Buộc

| Lăng Kính | Câu Hỏi |
| --- | --- |
| Brand DNA | Việc này có giữ Market Truth, Essential Simplicity, Structured Flow, và Adaptive Intelligence không? |
| Anti-Noise | Có phần nào mơ hồ, trang trí, hype, hoặc chỉ có mặt vì nghe có vẻ cao cấp không? |
| No-Guru | Người ngoài có thể hiểu nhầm đây là bán tín hiệu, copy trading, managed trading, hoặc marketing làm giàu nhanh không? |
| Premium Anchor | Nó có cảm giác như hạ tầng nghiêm túc, thay vì chiến thuật rẻ tiền không? |
| DACH/Nordic Trust | Một người dùng kỹ thuật ở Đức, Thụy Sĩ, Áo hoặc Bắc Âu soi vào có tin không? |
| Privacy | Consent, tối thiểu hóa dữ liệu, mục đích thu thập, rút quyền, export, và deletion có rõ không? |
| Encoding Integrity | File có sạch UTF-8, không mojibake, và đọc được ở cả bản tiếng Anh lẫn tiếng Việt không? |
| Ranh Giới Phase | Nó đúng phase chưa, hay đang lén nhét rủi ro Phase 4 vào Phase 2/3? |
| Module Ownership | Phòng ban nào sở hữu, và runtime code nên nằm trong Laravel module nào? |
| Khả Năng Test | IDE/dev sẽ chứng minh nó chạy đúng bằng cách nào, thay vì nói miệng? |
| Failure Mode | Cái gì có thể hỏng, quan sát ở đâu, và operator khôi phục thế nào? |

## Cấu Trúc PRD Chuẩn

Mọi PRD nghiêm túc của Atumerce sau khi Blackfire Grilling nên dùng cấu trúc này, trừ khi đó chỉ là PRD chiến thuật rất nhỏ.

1. **Tiêu Đề Và Trạng Thái** - Tên PRD, phase, ngày, phòng ban owner, trạng thái, issue liên quan.
2. **Tóm Tắt Điều Hành** - Đang xây gì và vì sao nó quan trọng lúc này.
3. **Bối Cảnh Và Vấn Đề** - Hiện trạng, nỗi đau, rủi ro, và vì sao hệ thống hiện tại chưa đủ.
4. **Độ Khớp Brand Và Chiến Lược** - Cách việc này bảo vệ Brand DNA, anti-noise, premium positioning, và trust DACH/Nordic.
5. **Ranh Giới Phase** - Scope trong phase, phần defer, và điều gì sẽ vi phạm phase.
6. **Người Dùng Và Operator** - Khách, admin, operator, founder, agent, hoặc integration.
7. **Yêu Cầu Chức Năng** - Hành vi, route, màn hình, workflow, API, event, quyền, và xử lý dữ liệu.
8. **Yêu Cầu Phi Chức Năng** - Hiệu năng, bảo mật, privacy, accessibility, observability, reliability, và maintainability.
9. **Data Model Và Event Contract** - Bảng, field, tên event, payload envelope, idempotency, retention, consent tier, và projection.
10. **Yêu Cầu UX/UI** - Màn hình, breakpoint responsive, luật component, trạng thái empty/error/loading, và ảnh nghiệm thu khi cần.
11. **Phụ Thuộc Và Ownership** - Issue phải xong trước, module owner, owner của phòng yêu cầu, owner Operations, handoff bắt buộc, dịch vụ bên thứ ba và yêu cầu môi trường.
12. **Bảng Issue** - Số issue, title, owner, dependency, unblocks, acceptance criteria, và lệnh verify.
13. **Acceptance Criteria** - Điều kiện chính xác để xem là done.
14. **Test Và Verification Plan** - Unit, feature, smoke, browser, CLI, migration, privacy, và rollback checks.
15. **Rủi Ro Và Grill Decisions** - Rủi ro đã phát hiện, ý tưởng bị loại, phần defer, và ứng viên ADR.
16. **Handoff Notes** - IDE/agent kế tiếp phải đọc gì trước, không được đổi gì, và báo cáo hoàn thành ra sao.

## Đầu Ra Chuẩn

Mỗi lượt Blackfire Grilling phải để lại một trong các artifact sau:

- một PRD đã được mài sắc;
- một ADR nếu có quyết định kiến trúc cần nhớ lâu;
- một bảng issue có phụ thuộc và acceptance criteria;
- một glossary entry nếu thuật ngữ dễ gây lú đã được làm rõ;
- một rejection note ngắn nếu ý tưởng không an toàn với Atumerce.

## Giao Thức Vận Hành

1. Đọc master PRD, phase PRD, ADR, và tài liệu ownership phòng ban liên quan trước.
2. Nói rõ ranh giới phase và một phòng ban owner chính trước khi đề xuất việc.
3. Hỏi điều gì có thể sai về pháp lý, kỹ thuật, thương mại, và thương hiệu.
4. Loại hoặc defer mọi thứ vi phạm phase hiện tại hoặc Brand DNA.
5. Chuyển phần sống sót thành interface, data model, route, test, và dependency issue cụ thể.
6. Khi làm việc nội bộ với founder thì dùng song ngữ khi hữu ích; output đối ngoại dùng ngôn ngữ của thị trường mục tiêu.
7. Với PRD song ngữ, kiểm tra file lưu thật sự sạch UTF-8 trước khi bàn giao. Không xem PowerShell render lỗi là bằng chứng file hỏng; nếu nghi mojibake thì kiểm tra trực tiếp text/byte của file.
8. Bản tiếng Việt phải là tiếng Việt vận hành đọc được, không phải bảng tiếng Anh dán lại rồi chỉ dịch tiêu đề cột. Thuật ngữ kỹ thuật có thể giữ, nhưng kết quả, tiêu chí nghiệm thu và cách xác minh phải được diễn giải bằng tiếng Việt.

### Cổng Phát Hành Encoding

Encoding là cổng phát hành bắt buộc, không phải bước làm đẹp:

1. Mọi PRD, ADR, guide, report và bản song ngữ phải được ghi bằng UTF-8. Tuyệt đối không ghi file bằng ANSI/code page Windows ngầm định.
2. Trước khi stage tài liệu, chạy `php scripts/check-doc-encoding.php` từ thư mục gốc repository.
3. Bộ kiểm tra phải pass cả giải mã UTF-8 nghiêm ngặt lẫn semantic scan mojibake. Terminal hiển thị lỗi không đồng nghĩa file hỏng; file nhìn được cũng không pass nếu byte bên trong sai.
4. Nếu file đã hỏng, phục hồi từ blob Git sạch đã biết hoặc sửa thủ công đúng các dòng lỗi. Không giải mã lại mù toàn bộ file mixed-encoding vì có thể phá các ký tự tiếng Việt đang đúng.
5. Không handoff, commit hoặc publish PRD khi checker còn báo byte lỗi, ký tự thay thế, dấu mojibake hoặc mẫu chữ-hỏi-chữ bị hỏng.

Gate mojibake cũng phải bắt các dấu vết Windows-1252/1258 như `U+0102 U+00AA`, `U+0102 U+00A0`, `U+00E2 U+20AC U+201D`, `U+00E1 U+00BB` và `U+00C6 U+00B0`. Đây vẫn là lỗi encoding dù file còn giải mã được như UTF-8.

**Chẩn đoán encoding trước khi sửa.** Lỗi hỏng lặp lại trên Windows không phải "UTF-8 hỏng chung chung" — đó là văn bản UTF-8 bị lưu lại qua code page Windows-1258 (hoặc 1252), tạo ra chuỗi byte hợp lệ nhưng sai. Phải xác định đúng encoding nguồn trước (`U+00E1 U+00BB`, `U+00E1 U+00BA`, `U+0102`, `U+00C6 U+00B0`, `U+00E2 U+20AC U+201D` là chữ ký của 1258/1252), rồi đảo ngược đúng phép biến đổi đó.

**Sửa theo token, không đập ra làm lại.** Khi đã biết encoding nguồn, sửa đúng các token bị hỏng tại chỗ. Không xóa file rồi gõ lại từ trí nhớ, và không dịch/đoán tiếng Việt từng chữ — cả hai đều phá nghĩa. Cũng không re-encode mù toàn bộ file, vì file mixed-encoding chứa các ký tự tiếng Việt đang đúng và giải mã lại toàn cục sẽ phá chúng. Một dòng có thể chứa cả chữ đúng lẫn chữ rác; sửa ở mức token cứu được dòng đó mà không đụng phần đã đúng. Ưu tiên phục hồi đúng chuỗi từ blob Git sạch đã biết; chỉ sửa token thủ công khi không có blob sạch.

## Khi Nào Bắt Buộc Dùng

Dùng Blackfire Grilling trước công việc Operations như:

- tạo hoặc sửa PRD phase kỹ thuật và ADR kỹ thuật;
- thiết kế workflow agent engineering, event/data flow, triển khai privacy/consent, analytics transport hoặc telemetry;
- sửa cấu trúc runtime/admin system, hạ tầng, module ownership, lịch sử repository hoặc UX kỹ thuật rủi ro cao;
- tạo batch issue kỹ thuật sau engineering plan đã được review.

## Anti-Patterns

- Hỏi vài câu nông rồi gọi là "grill".
- Viết PRD dài nhưng không quyết định dependency.
- Thêm AI chỉ vì chữ AI nghe cao cấp.
- Giấu rủi ro pháp lý/privacy trong thuật ngữ kỹ thuật.
- Trộn The Edge cho khách với `/admin/lab` nội bộ.
- Move runtime code vào `company/` thay vì chỉ map ownership.
- Xem privacy DACH là vấn đề banner thay vì vấn đề data-flow.
- Xuất PRD có mojibake, tiếng Việt gãy, mất số mục, hoặc bảng issue bản Việt vẫn bê nguyên tiếng Anh.
