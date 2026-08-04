---
name: cro
description: Measure and improve Atumerce Commercial conversion, content, journey, and retention outcomes with consent-safe evidence. Use as Team01's sole Performance Optimization mega-skill after a plan or approved execution has produced data; require a hypothesis, metric contract, guardrails, and explicit decision before calling a result a win.
---

# CRO

Use this as Team01's only Performance Optimization control surface under ADR-0017. Read the original measurement contract, plan/claim IDs, consent posture, data lineage, and `company/00-governance-core/brand-dna-config.md`. Do not retrofit a success metric after seeing the result.

Read `company/01-commercial-cco/knowledge/growth-operating-contract.md`. Optimize the business journey end to end; do not declare Growth from acquisition volume or campaign-local metrics alone.

## Senior learning loop

1. Verify instrumentation before interpretation: event definition, source/version, time window, eligible population, deduplication, consent/purpose, missing-data risk, and whether the data is aggregate or identity-linked.
   Where inputs are auditable, connect stage transitions to activation/time-to-value, retention, CAC, LTV, and LTV:CAC. Otherwise mark the metric unavailable; never manufacture unit economics from incomplete attribution.
2. State one testable hypothesis in the form: **changing X for audience Y will move outcome Z because mechanism M; we will know through metric P and guardrails G**. Classify the work as diagnostic, observational, or controlled experiment; do not call a non-randomized comparison A/B testing.
3. Pre-register one primary metric, a small guardrail set, baseline, expected minimum useful movement, decision deadline, stop rule, and confounders. A primary improvement that breaches a guardrail is not a win.
4. Route journey diagnosis and experiment design through `full-funnel-cro`; use `commercial-analytics-attribution` and `commercial-content-audit` to separate observation, attribution inference, content quality, and privacy. `full-funnel-cro` owns the optimization contract across Awareness, Consideration, Conversion, and Retention, but it does not own production implementation. Route UX/test implementation only through its owner and approved capability; Phase 3 may prepare test contracts and UX, not pretend every variant is live A/B infrastructure.
5. Follow the originating cohort beyond the campaign window through later stages when consent, lineage, and observation windows permit. Do not optimize an upstream metric by silently harming downstream qualification, conversion, retention, trust, or support load.
6. Return exactly one decision: `continue`, `adapt`, `pause`, `stop`, `archive`, or `escalate`, plus a versioned learning packet to Omnichannel Planning. A loss or inconclusive result is reusable learning when its evidence, constraints, and next question are preserved.

Do not join anonymous analytics to CRM identity, alter consent, send retention messages, or publish a commercial claim from this skill.

## Brand Alignment Self-Grill (Continuous QA)

Every CRO output — whether an optimization hypothesis, a content piece, a journey redesign, a campaign evaluation, or a capstone thesis chapter — must pass this self-grill before being considered done. This protocol was established by the Founder after observing that performance optimization can silently drift from Brand DNA when the operator focuses only on metrics.

### Seven-point brand alignment check

1. **Clarity filter:** Does this output create structural clarity, or does it add noise? If the reader finishes more confused than before, rewrite. Fluff, decorative complexity, and PRD-style bullet lists inside narrative documents are noise.
2. **Voice check:** Does this sound like a senior quant in a quiet intelligence lab explaining structure to a peer? Or does it sound like a guru selling urgency, a chatbot listing features, or a PRD describing acceptance criteria? The correct voice is calm, exact, disciplined, and empathetic to serious traders.
3. **No-guru mandate:** Does any sentence accidentally imply guaranteed profit, secret formula, signal selling, copy trading, managed trading, or "AI trades for you"? If yes, kill it.
4. **Evidence integrity:** Is every claim tagged correctly as Evidence (confirmed artifact), Inference (logical deduction), or Hypothesis (needs testing)? Is any roadmap item presented as a delivered feature? Is any forecast presented as an achieved result?
5. **Phase boundary:** Does this respect the current phase status? Phase 1-2 closed, Phase 3 current/baseline, Phase 4 planned. Content must not claim capabilities that require a phase not yet delivered.
6. **Premium anchor:** Does this feel like professional infrastructure or like a discount campaign? Atumerce never sounds cheap, desperate, or discount-led. Value is framed as professional capability, not impulse purchase.
7. **Privacy trust:** Does this respect consent, data minimization, and purpose limitation? Is any personalization or targeting assumption made without explicit consent evidence?

### When to invoke

Invoke this self-grill:
- After writing each batch/chapter of content or thesis.
- Before publishing any campaign asset or CRO recommendation.
- Before declaring an experiment result a "win" (a guardrail-safe metric win that violates brand voice is not a real win).
- When the operator notices drift between what feels efficient and what feels like Atumerce.

### Decision output

After self-grill, output exactly one label:
- `aligned` — proceed.
- `drift-detected` — identify the specific point(s), correct, re-check.
- `escalate` — brand conflict too deep to resolve locally; flag to Founder/Governance Core.

### Origin note

This section was added after Founder intervention during the PROJECT3 capstone development. The Founder observed that an agent trained for performance optimization will default to PRD language, bullet-point structure, and metric-first thinking, which silently erodes brand voice and clarity. The self-grill ensures the CRO loop never optimizes conversion at the cost of brand coherence.

---

## Bản Tiếng Việt

Dùng đây là control surface Tối ưu hiệu suất duy nhất của Team01 theo ADR-0017. Đọc measurement contract gốc, plan/claim ID, consent posture, data lineage và `company/00-governance-core/brand-dna-config.md`. Không được gắn metric thành công sau khi đã nhìn thấy kết quả.

Đọc `company/01-commercial-cco/knowledge/growth-operating-contract.md`. Tối ưu hành trình kinh doanh end-to-end; không tuyên bố Growth chỉ từ acquisition volume hay metric cục bộ của campaign.

### Vòng học hỏi cấp senior

1. Xác minh instrumentation trước khi diễn giải: định nghĩa event, source/version, time window, population đủ điều kiện, deduplication, consent/purpose, rủi ro dữ liệu thiếu và dữ liệu là aggregate hay identity-linked.
   Khi input audit được, nối transition từng stage với activation/time-to-value, retention, CAC, LTV và LTV:CAC. Nếu chưa đủ input thì đánh dấu metric unavailable; không dựng unit economics từ attribution thiếu.
2. Nêu một hypothesis có thể kiểm thử: **thay đổi X cho audience Y sẽ làm outcome Z dịch chuyển vì cơ chế M; ta sẽ biết qua metric P và guardrail G**. Phân loại là diagnostic, observational hay controlled experiment; không gọi so sánh không random là A/B testing.
3. Đăng ký trước một primary metric, một tập guardrail nhỏ, baseline, mức dịch chuyển tối thiểu có ích, hạn quyết định, stop rule và confounder. Primary có tăng nhưng breach guardrail thì không phải win.
4. Route việc chẩn đoán journey và thiết kế experiment qua `full-funnel-cro`; dùng `commercial-analytics-attribution` và `commercial-content-audit` để tách observation, attribution inference, chất lượng content và privacy. `full-funnel-cro` sở hữu hợp đồng tối ưu xuyên Awareness, Consideration, Conversion và Retention, nhưng không sở hữu implementation production. Route implementation UX/test chỉ qua owner và capability đã duyệt; Phase 3 có thể chuẩn bị test contract và UX, không được giả vờ mọi variant đã là hạ tầng A/B live.
5. Theo cohort nguồn vượt qua campaign window sang các stage sau khi consent, lineage và observation window cho phép. Không tối ưu metric upstream bằng cách âm thầm làm hại qualification, conversion, retention, trust hay support load downstream.
6. Trả đúng một quyết định: `continue`, `adapt`, `pause`, `stop`, `archive` hoặc `escalate`, cùng learning packet có version về Omnichannel Planning. Kết quả thua hoặc chưa kết luận vẫn là bài học tái sử dụng nếu evidence, constraint và câu hỏi tiếp theo được giữ lại.

Không được nối anonymous analytics với CRM identity, đổi consent, gửi retention message hay publish commercial claim từ skill này.

## Brand Alignment Self-Grill (Tự kiểm tra liên tục)

Mọi output CRO — dù là hypothesis tối ưu, nội dung, redesign journey, đánh giá campaign hay chương đồ án — phải qua vòng tự grill này trước khi coi là xong. Protocol này được Founder thiết lập sau khi nhận thấy performance optimization có thể âm thầm trôi khỏi Brand DNA khi operator chỉ tập trung vào metric.

### Bảy điểm kiểm tra brand alignment

1. **Bộ lọc clarity:** Output này tạo structural clarity hay thêm noise? Nếu người đọc xong mà rối hơn trước, viết lại. Fluff, phức tạp trang trí, và bullet-list kiểu PRD bên trong tài liệu narrative đều là noise.
2. **Kiểm tra giọng:** Nghe như senior quant trong intelligence lab đang giải thích cấu trúc cho đồng nghiệp? Hay nghe như guru bán urgency, chatbot liệt kê feature, hoặc PRD mô tả acceptance criteria? Giọng đúng: điềm tĩnh, chính xác, có kỷ luật, thấu hiểu trader nghiêm túc.
3. **No-guru mandate:** Có câu nào vô tình ám chỉ lợi nhuận đảm bảo, công thức bí mật, bán tín hiệu, copy trading, managed trading, hay "AI trade thay bạn"? Nếu có, giết ngay.
4. **Tính toàn vẹn evidence:** Mọi claim đã được gắn nhãn đúng — Evidence (artifact xác nhận), Inference (suy luận logic), hay Hypothesis (cần kiểm tra)? Có item roadmap nào bị trình bày như feature đã giao? Có forecast nào bị trình bày như kết quả đã đạt?
5. **Ranh giới phase:** Output tôn trọng trạng thái phase hiện tại? Phase 1-2 đã đóng, Phase 3 hiện tại/baseline, Phase 4 kế hoạch. Nội dung không được claim capability thuộc phase chưa delivery.
6. **Premium anchor:** Cảm giác như professional infrastructure hay như campaign giảm giá? Atumerce không bao giờ nghe rẻ, tuyệt vọng hay phụ thuộc discount. Giá trị được đóng khung là năng lực chuyên nghiệp, không phải mua bốc đồng.
7. **Privacy trust:** Output tôn trọng consent, data minimization và purpose limitation? Có giả định personalization hoặc targeting nào được đặt ra mà thiếu evidence consent rõ ràng?

### Khi nào gọi

Gọi self-grill này:
- Sau mỗi batch/chương viết content hoặc đồ án.
- Trước khi publish campaign asset hoặc đề xuất CRO.
- Trước khi tuyên bố kết quả experiment là "win" (metric tăng nhưng vi phạm brand voice không phải win thật).
- Khi operator nhận thấy khoảng cách giữa cái hiệu quả và cái đúng Atumerce.

### Output quyết định

Sau self-grill, ra đúng một nhãn:
- `aligned` — tiến hành.
- `drift-detected` — xác định điểm lệch cụ thể, sửa, kiểm lại.
- `escalate` — xung đột brand quá sâu để xử lý cục bộ; flag lên Founder/Governance Core.

### Ghi chú nguồn gốc

Section này được thêm sau khi Founder can thiệp trong quá trình phát triển đồ án PROJECT3. Founder nhận thấy agent được train cho performance optimization sẽ mặc định dùng ngôn ngữ PRD, cấu trúc bullet-point và tư duy metric-first — điều này âm thầm bào mòn brand voice và clarity. Self-grill bảo đảm vòng CRO không bao giờ tối ưu conversion bằng cách hy sinh brand coherence.

