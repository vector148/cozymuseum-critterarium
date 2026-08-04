---
name: brand-alignment-self-grill
description: Continuous self-QA child skill ensuring every CRO output, content batch, campaign asset, and capstone chapter stays aligned with Atumerce Brand DNA. Invoked after each production cycle to detect drift between metric optimization and brand coherence. Returns aligned, drift-detected, or escalate.
---

# Brand Alignment Self-Grill

## English Version

Use this child of `cro` as a mandatory quality gate after every output cycle. Read `company/00-governance-core/brand-dna-config.md`, `company/00-governance-core/brand-governance/trading-os-positioning-directive.md`, and the current phase status before evaluating.

This skill exists because performance optimization, left unchecked, defaults to metric-first thinking and PRD-style language that silently erodes Atumerce's calm, precise, premium brand voice. The Founder established this protocol after observing that an operator trained for efficiency will drift toward bullet-point structure, hype-adjacent claims, and feature-listing tone — all of which violate "Clarity over noise."

## Origin

During PROJECT3 capstone development, the Founder intervened repeatedly to correct:

- Bullet-point lists used inside narrative analysis (tiểu luận is prose, not PRD).
- Dry ADR/PRD citation style instead of brand-voice storytelling that uses ADR as invisible evidence.
- Metric-first language that sounds like a SaaS growth report instead of a quiet intelligence lab.
- Accidental implication of capabilities belonging to future phases.
- Lack of emotional depth about customer psychology and brand meaning.

These corrections are now codified as a self-grill protocol so no human needs to repeat them.

## The Seven-Point Check

Every output must pass all seven. A single failure means `drift-detected`.

### 1. Clarity Filter

Does this output create structural clarity for the reader, or does it add noise? Signs of noise include: bullet-point lists inside analytical prose, decorative headings that say nothing, paragraphs that restate the heading without adding analysis, tables used to avoid writing real sentences, and filler that exists only to increase word count.

The correct standard: each paragraph has a thesis sentence, supporting evidence or reasoning, and a transition to the next idea. The reader finishes understanding more than before.

### 2. Voice Check

Does this sound like a senior quant in a quiet intelligence lab explaining structure to a respected peer? Or does it sound like:

- a retail trading guru creating urgency;
- a SaaS chatbot listing features;
- a PRD describing acceptance criteria;
- a textbook copying Kotler without applying theory to the real decision;
- an intern bullet-pointing what they don't fully understand.

The correct voice is calm, exact, disciplined, quietly authoritative, and empathetic to the Mature Trader's experience.

### 3. No-Guru Mandate

Scan for any sentence that accidentally implies: guaranteed profit, secret formula, signal selling, copy trading, managed trading, "AI trades for you," or retail guru theatre. Also check for scarcity tactics ("limited spots"), urgency fabrication ("act now"), or emotional manipulation designed to bypass rational evaluation. If found, rewrite or delete.

### 4. Evidence Integrity

Every factual claim must carry a classification:

- **Evidence:** Confirmed by repository artifact, ADR, PRD, or documented phase outcome.
- **Inference:** Logical deduction from multiple evidence points combined with theory.
- **Hypothesis:** Unconfirmed assumption that requires primary research or experiment.

Common violations: presenting a roadmap item as a delivered feature; using old forecast numbers (ARR, LTV/CAC, customer count) as actual results; claiming Phase 3 is complete when it is current/baseline; presenting Phase 4 commerce capabilities as live.

### 5. Phase Boundary

Current phase reality:

- Phase 1 (Laravel platform + CRM foundation): **closed**.
- Phase 2 (Governed Intelligence Core, The Edge, consent, analytics, AI Gateway, Policy Router, pilots): **closed**, evidence 525/525 green.
- Phase 3 (VPS, GitOps, event mesh, typed handoff, observability, department competency): **current/baseline**.
- Phase 4 (Direct commerce, licensing, payment, billing, tax/VAT, refund): **planned/roadmap**.

Content must not claim capabilities that require a phase not yet delivered. "We will" or "planned" is acceptable. "We have" or "already live" for Phase 4 is a brand violation.

### 6. Premium Anchor

Does this feel like professional infrastructure or like a discount campaign? Check for:

- Pricing communicated as "cheap" or "affordable" instead of "precision-grade capability."
- Urgency or scarcity used to drive conversion.
- Comparison framing that positions Atumerce as "budget alternative."
- Visual or verbal cues that signal desperation rather than quiet confidence.

Atumerce charges for quality. It does not apologize for its price or beg for attention.

### 7. Privacy Trust

Does this respect:

- Consent before personalization.
- Data minimization (collect only what is necessary).
- Purpose limitation (use data only for stated purpose).
- No hidden telemetry or dark patterns.
- No assumption of sensitive financial behavior for targeting without explicit consent.
- No joining anonymous analytics to CRM identity.

If any personalization or targeting assumption is made without consent evidence, flag it.

## When to Invoke

- After writing each batch or chapter of content, thesis, or campaign asset.
- Before publishing any CRO recommendation or experiment result.
- Before declaring an experiment "win" (a guardrail-safe metric win that violates brand voice is not a real win).
- When the operator notices a gap between what feels efficient and what feels like Atumerce.
- During any cross-department handoff that carries marketing or content claims.

## Decision Output

After running all seven checks, output exactly one label:

- `aligned` — all seven pass; proceed with confidence.
- `drift-detected` — identify the specific failing point(s), state the correction, apply it, then re-run the check.
- `escalate` — brand conflict too deep to resolve at operator level; flag to Founder or Governance Core with a specific description of the conflict.

## Integration with CRO Loop

This skill is step 0 of every CRO cycle. Before optimizing a metric, confirm the baseline output already passes brand alignment. An experiment that improves CTR but introduces guru-adjacent language or violates privacy trust is not an improvement — it is brand erosion disguised as growth.

The self-grill also applies retroactively: if a previously published asset is discovered to violate brand alignment, flag it for correction regardless of its current metric performance.

## Anti-Patterns

- Running the check as a formality without actually reading the output critically.
- Declaring `aligned` because no single sentence is catastrophically wrong, while the overall tone is off.
- Treating this as a one-time gate instead of a continuous loop.
- Believing metric success overrides brand alignment ("but it converts well!").
- Applying the check to technical PRDs or ADRs (those have their own Blackfire Grilling discipline; this skill is for customer-facing and narrative output).

---

# Brand Alignment Self-Grill

## Phiên Bản Tiếng Việt

Dùng child skill này của `cro` như cổng chất lượng bắt buộc sau mỗi vòng output. Đọc `company/00-governance-core/brand-dna-config.md`, `company/00-governance-core/brand-governance/trading-os-positioning-directive.md` và trạng thái phase hiện tại trước khi đánh giá.

Skill này tồn tại vì performance optimization, nếu không kiểm soát, sẽ mặc định tư duy metric-first và ngôn ngữ PRD — âm thầm bào mòn giọng thương hiệu điềm tĩnh, chính xác, premium của Atumerce. Founder thiết lập protocol này sau khi nhận thấy operator được train cho hiệu quả sẽ trôi về cấu trúc bullet-point, claim gần hype, và giọng liệt kê feature — tất cả đều vi phạm "Clarity over noise."

## Nguồn Gốc

Trong quá trình phát triển đồ án PROJECT3, Founder đã can thiệp nhiều lần để sửa:

- Bullet-point list dùng trong phần phân tích narrative (tiểu luận là văn xuôi, không phải PRD).
- Trích dẫn ADR/PRD khô khan thay vì kể chuyện bằng giọng brand mà ADR chỉ là evidence ngầm.
- Ngôn ngữ metric-first nghe như báo cáo tăng trưởng SaaS thay vì intelligence lab yên tĩnh.
- Vô tình ám chỉ capability thuộc phase tương lai.
- Thiếu chiều sâu cảm xúc về tâm lý khách hàng và ý nghĩa thương hiệu.

Các lần sửa này giờ được mã hóa thành protocol tự kiểm để không ai phải lặp lại.

## Bảy Điểm Kiểm Tra

Mọi output phải pass cả bảy. Một điểm fail = `drift-detected`.

### 1. Bộ Lọc Clarity

Output tạo structural clarity cho người đọc, hay thêm noise? Dấu hiệu noise: bullet-list trong prose phân tích, heading trang trí không nói gì, đoạn văn lặp lại heading mà không thêm phân tích, bảng dùng để trốn viết câu thật, filler chỉ để tăng số từ.

### 2. Kiểm Tra Giọng

Nghe như senior quant trong intelligence lab giải thích cấu trúc cho đồng nghiệp? Hay nghe như guru tạo urgency, chatbot liệt kê feature, PRD mô tả acceptance criteria, sách giáo khoa copy Kotler không áp dụng, hoặc intern bullet-point vì chưa hiểu sâu?

### 3. No-Guru Mandate

Scan tìm câu vô tình ám chỉ: lợi nhuận đảm bảo, công thức bí mật, bán tín hiệu, copy trading, managed trading, "AI trade thay", scarcity giả, urgency bịa, hoặc thao túng cảm xúc. Nếu có: viết lại hoặc xóa.

### 4. Tính Toàn Vẹn Evidence

Mỗi claim phải mang nhãn: Evidence (artifact xác nhận), Inference (suy luận logic), hoặc Hypothesis (cần kiểm tra). Vi phạm thường gặp: roadmap bị trình bày như feature đã giao; forecast cũ bị trình bày như kết quả thực; Phase 3 bị gọi là complete; Phase 4 bị gọi là live.

### 5. Ranh Giới Phase

- Phase 1-2: **đã đóng**.
- Phase 3: **hiện tại/baseline**.
- Phase 4: **kế hoạch/roadmap**.

Không được claim capability cần phase chưa delivery.

### 6. Premium Anchor

Cảm giác như infrastructure chuyên nghiệp hay campaign giảm giá? Không: rẻ, tuyệt vọng, phụ thuộc discount, urgency/scarcity, so sánh kiểu "budget alternative".

### 7. Privacy Trust

Tôn trọng consent trước personalization, data minimization, purpose limitation, không telemetry ẩn, không dark pattern, không nối anonymous analytics với CRM identity.

## Khi Nào Gọi

- Sau mỗi batch/chương content, đồ án, campaign asset.
- Trước publish recommendation CRO hoặc kết quả experiment.
- Trước tuyên bố "win" (metric tăng mà vi phạm brand voice = không phải win).
- Khi thấy khoảng cách giữa cái hiệu quả và cái đúng Atumerce.
- Trong cross-department handoff mang claim marketing/content.

## Output Quyết Định

- `aligned` — cả bảy pass; tiến hành.
- `drift-detected` — xác định điểm fail, nêu cách sửa, áp dụng, chạy lại.
- `escalate` — xung đột brand quá sâu; flag lên Founder/Governance Core kèm mô tả cụ thể.

## Tích Hợp Với Vòng CRO

Skill này là bước 0 của mọi vòng CRO. Trước khi tối ưu metric, xác nhận output baseline đã pass brand alignment. Experiment tăng CTR nhưng tạo ngôn ngữ guru-adjacent hoặc vi phạm privacy trust không phải cải thiện — đó là brand erosion đội lốt growth.

Self-grill cũng áp dụng hồi tố: nếu phát hiện asset đã publish vi phạm brand alignment, flag để sửa bất kể metric hiện tại đang tốt.

## Anti-Patterns

- Chạy check như thủ tục mà không đọc output kỹ.
- Gọi `aligned` vì không câu nào sai nặng, nhưng tổng thể giọng lệch.
- Coi đây là gate một lần thay vì vòng lặp liên tục.
- Tin metric success ghi đè brand alignment ("nhưng nó convert tốt mà!").
- Áp dụng check này cho PRD/ADR kỹ thuật (những thứ đó có Blackfire Grilling riêng; skill này dành cho output đối khách hàng và narrative).
