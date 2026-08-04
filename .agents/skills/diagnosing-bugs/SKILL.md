---
name: diagnosing-bugs
description: Operations' sole Performance Optimization mega-skill for diagnosing bugs and regressions, routing reliability optimization, provider health, security observability, regression learning, and a versioned formula back to Blackfire Grilling.
---

# Diagnosing Bugs

Operations' sole Performance Optimization mega-skill under ADR-0017. Skip diagnostic phases only when explicitly justified.

When exploring the codebase, read `CONTEXT.md` (if it exists) to get a clear mental model of the relevant modules, and check ADRs in the area you're touching.

## Mega-Skill Boundary

Diagnosing Bugs routes `operations-reliability-optimization`, `provider-health-observability`, and `security-observability` as child skills. It evaluates Greenline and Faultline evidence against target state B, records uncertainty and failure mode, locks regression learning, and returns exactly one versioned reusable formula to Blackfire Grilling.

Use Faultline Containment when an active hard failure needs bounded mutation or recovery. Diagnosing Bugs owns the evidence and learning loop; it does not create a second Planning authority or silently authorize production intervention.

Each completed run chooses exactly one verdict: `continue`, `adapt`, `pause`, `stop`, `archive`, or `escalate`. The output is one evidence-backed learning packet containing the observed result, attribution limits, failure mode, SLO/health/security evidence, decision, and versioned reliability formula. Any new intervention returns to Blackfire Grilling.

## Phase 1 — Build a feedback loop

**This is the skill.** Everything else is mechanical. If you have a **tight** pass/fail signal for the bug — one that goes red on _this_ bug — you will find the cause; bisection, hypothesis-testing, and instrumentation all just consume it. If you don't have one, no amount of staring at code will save you.

Spend disproportionate effort here. **Be aggressive. Be creative. Refuse to give up.**

### Ways to construct one — try them in roughly this order

1. **Failing test** at whatever seam reaches the bug — unit, integration, e2e.
2. **Curl / HTTP script** against a running dev server.
3. **CLI invocation** with a fixture input, diffing stdout against a known-good snapshot.
4. **Headless browser script** (Playwright / Puppeteer) — drives the UI, asserts on DOM/console/network.
5. **Replay a captured trace.** Save a real network request / payload / event log to disk; replay it through the code path in isolation.
6. **Throwaway harness.** Spin up a minimal subset of the system (one service, mocked deps) that exercises the bug code path with a single function call.
7. **Property / fuzz loop.** If the bug is "sometimes wrong output", run 1000 random inputs and look for the failure mode.
8. **Bisection harness.** If the bug appeared between two known states (commit, dataset, version), automate "boot at state X, check, repeat" so you can `git bisect run` it.
9. **Differential loop.** Run the same input through old-version vs new-version (or two configs) and diff outputs.
10. **HITL bash script.** Last resort. If a human must click, drive _them_ with `scripts/hitl-loop.template.sh` so the loop is still structured. Captured output feeds back to you.

Build the right feedback loop, and the bug is 90% fixed.

### Tighten the loop

Treat the loop as a product. Once you have _a_ loop, **tighten** it:

- Can I make it faster? (Cache setup, skip unrelated init, narrow the test scope.)
- Can I make the signal sharper? (Assert on the specific symptom, not "didn't crash".)
- Can I make it more deterministic? (Pin time, seed RNG, isolate filesystem, freeze network.)

A 30-second flaky loop is barely better than no loop; a 2-second deterministic one is tight — a debugging superpower.

### Non-deterministic bugs

The goal is not a clean repro but a **higher reproduction rate**. Loop the trigger 100×, parallelise, add stress, narrow timing windows, inject sleeps. A 50%-flake bug is debuggable; 1% is not — keep raising the rate until it's debuggable.

### When you genuinely cannot build a loop

Stop and say so explicitly. List what you tried. Ask the user for: (a) access to whatever environment reproduces it, (b) a captured artifact (HAR file, log dump, core dump, screen recording with timestamps), or (c) permission to add temporary production instrumentation. Do **not** proceed to hypothesise without a loop.

### Completion criterion — a tight loop that goes red

Phase 1 is done when the loop is **tight** and **red-capable**: you can name **one command** — a script path, a test invocation, a curl — that you have **already run at least once** (paste the invocation and its output), and that is:

- [ ] **Red-capable** — it drives the actual bug code path and asserts the **user's exact symptom**, so it can go red on this bug and green once fixed. Not "runs without erroring" — it must be able to _catch this specific bug_.
- [ ] **Deterministic** — same verdict every run (flaky bugs: a pinned, high reproduction rate, per above).
- [ ] **Fast** — seconds, not minutes.
- [ ] **Agent-runnable** — you can run it unattended; a human in the loop only via `scripts/hitl-loop.template.sh`.

If you catch yourself reading code to build a theory before this command exists, **stop — jumping straight to a hypothesis is the exact failure this skill prevents.** No red-capable command, no Phase 2.

## Phase 2 — Reproduce + minimise

Run the loop. Watch it go red — the bug appears.

Confirm:

- [ ] The loop produces the failure mode the **user** described — not a different failure that happens to be nearby. Wrong bug = wrong fix.
- [ ] The failure is reproducible across multiple runs (or, for non-deterministic bugs, reproducible at a high enough rate to debug against).
- [ ] You have captured the exact symptom (error message, wrong output, slow timing) so later phases can verify the fix actually addresses it.

### Minimise

Once it's red, shrink the repro to the **smallest scenario that still goes red**. Cut inputs, callers, config, data, and steps **one at a time**, re-running the loop after each cut — keep only what's load-bearing for the failure.

Why bother: a minimal repro shrinks the hypothesis space in Phase 3 (fewer moving parts left to suspect) and becomes the clean regression test in Phase 5.

Done when **every remaining element is load-bearing** — removing any one of them makes the loop go green.

Do not proceed until you have reproduced **and** minimised.

## Phase 3 — Hypothesise

Generate **3–5 ranked hypotheses** before testing any of them. Single-hypothesis generation anchors on the first plausible idea.

Each hypothesis must be **falsifiable**: state the prediction it makes.

> Format: "If <X> is the cause, then <changing Y> will make the bug disappear / <changing Z> will make it worse."

If you cannot state the prediction, the hypothesis is a vibe — discard or sharpen it.

**Show the ranked list to the user before testing.** They often have domain knowledge that re-ranks instantly ("we just deployed a change to #3"), or know hypotheses they've already ruled out. Cheap checkpoint, big time saver. Don't block on it — proceed with your ranking if the user is AFK.

## Phase 4 — Instrument

Each probe must map to a specific prediction from Phase 3. **Change one variable at a time.**

Tool preference:

1. **Debugger / REPL inspection** if the env supports it. One breakpoint beats ten logs.
2. **Targeted logs** at the boundaries that distinguish hypotheses.
3. Never "log everything and grep".

**Tag every debug log** with a unique prefix, e.g. `[DEBUG-a4f2]`. Cleanup at the end becomes a single grep. Untagged logs survive; tagged logs die.

**Perf branch.** For performance regressions, logs are usually wrong. Instead: establish a baseline measurement (timing harness, `performance.now()`, profiler, query plan), then bisect. Measure first, fix second.

## Phase 5 — Fix + regression test

Write the regression test **before the fix** — but only if there is a **correct seam** for it.

A correct seam is one where the test exercises the **real bug pattern** as it occurs at the call site. If the only available seam is too shallow (single-caller test when the bug needs multiple callers, unit test that can't replicate the chain that triggered the bug), a regression test there gives false confidence.

**If no correct seam exists, that itself is the finding.** Note it. The codebase architecture is preventing the bug from being locked down. Flag this for the next phase.

If a correct seam exists:

1. Turn the minimised repro into a failing test at that seam.
2. Watch it fail.
3. Apply the fix.
4. Watch it pass.
5. Re-run the Phase 1 feedback loop against the original (un-minimised) scenario.

## Phase 6 — Cleanup + post-mortem

Required before declaring done:

- [ ] Original repro no longer reproduces (re-run the Phase 1 loop)
- [ ] Regression test passes (or absence of seam is documented)
- [ ] All `[DEBUG-...]` instrumentation removed (`grep` the prefix)
- [ ] Throwaway prototypes deleted (or moved to a clearly-marked debug location)
- [ ] The hypothesis that turned out correct is stated in the commit / PR message — so the next debugger learns

**Then ask: what would have prevented this bug?** If the answer involves architectural change (no good test seam, tangled callers, hidden coupling) hand off to the `/improve-codebase-architecture` skill with the specifics. Make the recommendation **after** the fix is in, not before — you have more information now than when you started.

---

# Chẩn Đoán Lỗi

Đây là mega-skill Tối ưu hiệu suất duy nhất của Operations theo ADR-0017. Chỉ được bỏ qua một
phase chẩn đoán khi đã nêu lý do rõ ràng.

Khi khảo sát codebase, đọc `CONTEXT.md` nếu file tồn tại để dựng mental model chính xác về module
liên quan, rồi kiểm tra các ADR trong vùng đang tác động.

## Ranh Giới Mega-Skill

Diagnosing Bugs điều phối ba skill con: `operations-reliability-optimization`,
`provider-health-observability` và `security-observability`. Nó đánh giá evidence từ Greenline và
Faultline so với trạng thái B mục tiêu, ghi uncertainty cùng failure mode, khóa bài học regression
và trả đúng một công thức tái sử dụng có version về Blackfire Grilling.

Dùng Faultline Containment khi một lỗi khó đang hoạt động cần mutation hoặc recovery có giới hạn.
Diagnosing Bugs sở hữu vòng evidence và learning; nó không tạo Planning authority thứ hai và không
âm thầm cho phép can thiệp production.

Mỗi run hoàn tất phải chọn đúng một verdict: `continue`, `adapt`, `pause`, `stop`, `archive` hoặc
`escalate`. Output là một learning packet dựa trên evidence, gồm kết quả quan sát được, giới hạn
attribution, failure mode, evidence SLO/health/security, quyết định và công thức reliability có
version. Mọi can thiệp mới phải quay lại Blackfire Grilling.

## Phase 1 — Dựng vòng phản hồi

**Đây chính là skill.** Mọi phần còn lại chỉ là cơ học. Nếu có một tín hiệu pass/fail **chặt** cho
đúng lỗi này—tín hiệu đỏ khi lỗi này xuất hiện—thì sẽ tìm được nguyên nhân; bisection, kiểm thử giả
thuyết và instrumentation chỉ là công cụ tiêu thụ tín hiệu đó. Nếu không có, nhìn code bao lâu cũng
không cứu được.

Phải dành phần lớn công sức cho bước này. **Quyết liệt. Sáng tạo. Không bỏ cuộc.**

### Cách dựng vòng phản hồi — thử gần theo thứ tự này

1. **Failing test** tại seam chạm được lỗi: unit, integration hoặc e2e.
2. **Curl / HTTP script** nhắm vào dev server đang chạy.
3. **CLI invocation** với fixture input rồi diff stdout với snapshot chuẩn.
4. **Headless browser script** bằng Playwright/Puppeteer để điều khiển UI và assert DOM, console,
   network.
5. **Replay trace đã capture.** Lưu request, payload hoặc event log thật rồi phát lại qua code path
   trong cô lập.
6. **Throwaway harness.** Khởi động tập con tối thiểu của hệ thống, mock dependency cần thiết và
   kích hoạt bug bằng một lời gọi hàm.
7. **Property / fuzz loop.** Nếu bug là “thỉnh thoảng output sai”, chạy 1.000 input ngẫu nhiên và
   tìm failure mode.
8. **Bisection harness.** Nếu bug xuất hiện giữa hai trạng thái đã biết như commit, dataset hoặc
   version, tự động hóa “boot state X, check, repeat” để chạy được `git bisect run`.
9. **Differential loop.** Chạy cùng input qua version cũ và mới hoặc hai config rồi diff output.
10. **HITL bash script.** Phương án cuối. Nếu con người buộc phải click, điều phối họ bằng
    `scripts/hitl-loop.template.sh` để vòng lặp vẫn có cấu trúc và output capture quay lại agent.

Dựng đúng feedback loop thì lỗi đã được giải quyết 90%.

### Siết chặt vòng lặp

Hãy xem vòng lặp như một sản phẩm. Khi đã có vòng lặp, tiếp tục siết:

- Có thể làm nó nhanh hơn không? Cache setup, bỏ init không liên quan, thu hẹp phạm vi test.
- Có thể làm tín hiệu sắc hơn không? Assert đúng triệu chứng, không chỉ kiểm tra “không crash”.
- Có thể làm nó deterministic hơn không? Pin time, seed RNG, cô lập filesystem, đóng băng network.

Vòng lặp 30 giây nhưng flaky chỉ nhỉnh hơn không có vòng lặp; vòng lặp deterministic 2 giây là siêu
năng lực debugging.

### Lỗi không deterministic

Mục tiêu không phải repro sạch mà là **tăng tỷ lệ tái hiện**. Lặp trigger 100 lần, chạy song song,
thêm stress, thu hẹp timing window, inject sleep. Bug tái hiện 50% đủ để debug; 1% thì chưa—tiếp tục
nâng tỷ lệ cho đến khi có thể debug.

### Khi thực sự không dựng được vòng lặp

Dừng lại và nói rõ. Liệt kê những gì đã thử. Yêu cầu user cung cấp: (a) quyền vào environment tái
hiện được lỗi, (b) artifact đã capture như HAR, log dump, core dump hoặc screen recording có
timestamp, hoặc (c) quyền thêm instrumentation production tạm thời. **Không được** tiếp tục đoán
nguyên nhân khi chưa có vòng lặp.

### Điều kiện hoàn tất — vòng lặp chặt và có khả năng đỏ

Phase 1 chỉ xong khi vòng lặp **chặt** và **red-capable**: có thể nêu một command duy nhất—đường dẫn
script, lệnh test hoặc curl—đã thật sự chạy ít nhất một lần, kèm invocation và output, đồng thời:

- [ ] **Red-capable** — đi qua code path thật của bug và assert đúng triệu chứng user nêu, nên có thể
  đỏ khi bug tồn tại và xanh sau khi sửa. “Chạy không lỗi” không đủ; nó phải bắt đúng bug này.
- [ ] **Deterministic** — cùng input cho cùng verdict; với bug flaky phải pin được tỷ lệ repro cao.
- [ ] **Nhanh** — tính bằng giây, không phải phút.
- [ ] **Agent-runnable** — chạy không cần giám sát; nếu bắt buộc có người thì chỉ qua
  `scripts/hitl-loop.template.sh`.

Nếu phát hiện mình đang đọc code để dựng theory trước khi command này tồn tại, **dừng lại—nhảy thẳng
vào giả thuyết chính là lỗi mà skill này ngăn chặn.** Không có command red-capable thì không sang
Phase 2.

## Phase 2 — Tái hiện và tối giản

Chạy vòng lặp và quan sát nó đỏ—bug xuất hiện.

Xác nhận:

- [ ] Vòng lặp tạo đúng failure mode user mô tả, không phải lỗi khác ở gần đó. Bắt sai bug sẽ sửa sai.
- [ ] Lỗi tái hiện qua nhiều lần chạy; với bug không deterministic, tỷ lệ phải đủ cao để debug.
- [ ] Đã capture chính xác triệu chứng như error message, output sai hoặc timing chậm để phase sau
  chứng minh fix thật sự xử lý nó.

### Tối giản

Khi đã đỏ, thu nhỏ repro thành **scenario nhỏ nhất vẫn đỏ**. Cắt input, caller, config, data và step
**từng thứ một**, chạy lại vòng lặp sau mỗi lần cắt và chỉ giữ phần thật sự chịu lực cho failure.

Lý do: repro tối thiểu thu hẹp không gian giả thuyết ở Phase 3 vì còn ít yếu tố đáng nghi hơn, đồng
thời trở thành regression test sạch ở Phase 5.

Chỉ hoàn tất khi **mọi phần còn lại đều chịu lực**—bỏ bất kỳ phần nào cũng làm vòng lặp xanh.

Không được đi tiếp trước khi đã tái hiện **và** tối giản.

## Phase 3 — Đặt giả thuyết

Tạo **3–5 giả thuyết có xếp hạng** trước khi kiểm bất kỳ giả thuyết nào. Chỉ tạo một giả thuyết sẽ
neo tư duy vào ý đầu tiên nghe có vẻ hợp lý.

Mỗi giả thuyết phải **falsifiable**: nêu dự đoán mà nó tạo ra.

> Format: “Nếu X là nguyên nhân, thay đổi Y sẽ làm bug biến mất / thay đổi Z sẽ làm bug nặng hơn.”

Không nêu được dự đoán thì đó chỉ là cảm giác; loại bỏ hoặc làm nó sắc hơn.

**Hiển thị danh sách đã xếp hạng cho user trước khi kiểm.** Họ có thể có context giúp đổi hạng ngay,
ví dụ vừa deploy thay đổi liên quan giả thuyết số 3, hoặc biết giả thuyết nào đã bị loại. Đây là
checkpoint rẻ nhưng giá trị cao. Không block nếu user vắng; tiếp tục theo thứ hạng hiện có.

## Phase 4 — Gắn instrumentation

Mỗi probe phải ánh xạ vào một dự đoán cụ thể từ Phase 3. **Mỗi lần chỉ đổi một biến.**

Thứ tự ưu tiên công cụ:

1. **Debugger / REPL inspection** nếu environment hỗ trợ. Một breakpoint tốt hơn mười log.
2. **Log có mục tiêu** tại boundary phân biệt được các giả thuyết.
3. Không bao giờ “log mọi thứ rồi grep”.

Gắn prefix duy nhất cho mọi debug log, ví dụ `[DEBUG-a4f2]`. Khi cleanup chỉ cần tìm một prefix.
Log không tag sẽ sống sót; log có tag phải được xóa.

**Nhánh performance.** Với performance regression, log thường là công cụ sai. Hãy lập baseline bằng
timing harness, `performance.now()`, profiler hoặc query plan rồi bisect. Đo trước, sửa sau.

## Phase 5 — Sửa và khóa regression test

Viết regression test **trước fix**, nhưng chỉ khi có **seam đúng**.

Seam đúng là nơi test đi qua pattern thật của bug đúng như tại call site. Nếu seam duy nhất quá nông
như test một caller khi bug cần nhiều caller, hoặc unit test không tái tạo được chuỗi kích hoạt,
regression test đó tạo tự tin giả.

**Nếu không có seam đúng, bản thân điều đó là finding.** Ghi lại. Kiến trúc codebase đang ngăn bug
được khóa. Đưa finding sang phase kế tiếp.

Nếu có seam đúng:

1. Biến repro tối thiểu thành failing test tại seam đó.
2. Quan sát test fail.
3. Áp dụng fix.
4. Quan sát test pass.
5. Chạy lại feedback loop Phase 1 trên scenario gốc chưa tối giản.

## Phase 6 — Cleanup và post-mortem

Bắt buộc hoàn tất trước khi tuyên bố xong:

- [ ] Repro gốc không còn tái hiện; đã chạy lại vòng lặp Phase 1.
- [ ] Regression test pass, hoặc đã ghi rõ vì sao không có seam đúng.
- [ ] Đã xóa toàn bộ instrumentation `[DEBUG-...]` bằng cách tìm prefix.
- [ ] Đã xóa throwaway prototype hoặc chuyển vào vị trí debug được đánh dấu rõ.
- [ ] Commit/PR message nêu giả thuyết nào đã đúng để debugger tiếp theo học được.

**Sau đó hỏi: điều gì có thể ngăn bug này từ đầu?** Nếu câu trả lời cần thay đổi kiến trúc như không
có test seam tốt, caller rối hoặc coupling ẩn, handoff chi tiết sang skill
`/improve-codebase-architecture`. Chỉ đưa khuyến nghị **sau** khi fix đã vào, không phải trước đó,
vì lúc này evidence đầy đủ hơn thời điểm bắt đầu.
