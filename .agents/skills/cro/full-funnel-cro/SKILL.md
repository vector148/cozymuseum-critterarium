---
name: full-funnel-cro
description: Diagnose and optimize Atumerce's complete Awareness, Consideration, Conversion, and Retention journey with consent-safe analytics, behavioral evidence, stage-specific conversion rates, and pre-registered experiments. Use for funnel drop-off, page or form CRO, activation, retention, experiment backlogs, A/B test contracts, and growth-learning decisions.
---

# Full-Funnel CRO

## English Version

Use this child of `cro` to improve the whole Atumerce customer journey, not only a landing page or the top of the funnel. Read the approved Commercial plan, `company/00-governance-core/brand-dna-config.md`, the measurement contract, consent posture, data lineage, and [the full-funnel operating reference](references/full-funnel-cro-operating-reference.md) before recommending a change.

This method adapts the decision discipline of Corey Haines' MIT-licensed `cro`, `analytics`, `ab-testing`, `onboarding`, and `churn-prevention` skills to Atumerce's four-stage journey and ADR-0017. It does not copy provider access, SaaS billing assumptions, benchmarks, or autonomous execution.

## Conversion Contract

Calculate each rate against the population eligible for that stage:

`stage conversion rate = completed target transitions / eligible stage opportunities × 100`

Never mix visitors, sessions, leads, accounts, customers, or cohorts in one denominator. Report the numerator, denominator, eligibility rule, time window, source version, exclusions, and confidence with every rate.

## Four-Stage Ownership

| Stage | Optimize | Example transition | Primary evidence | Guardrail |
| --- | --- | --- | --- | --- |
| Awareness | Qualified attention and message-source match | eligible impression or visit → qualified content entry | source/UTM, landing relevance, engaged entry, load/error state | do not reward reach that lowers relevance, trust, accessibility, or consent quality |
| Consideration | Evidence discovery and informed progression | qualified entry → meaningful evidence interaction or next-step intent | content depth, comparison/FAQ use, saved article, return visit, explicit product interest | do not confuse dwell time, scroll, or repeated visits with purchase intent |
| Conversion | Completion of an explicit qualified action | eligible lead or account attempt → valid form/account/demo/product-interest completion | step funnel, validation/error recovery, form completion, qualification and consent | do not increase raw completions by degrading lead quality, privacy, clarity, or support burden |
| Retention | Post-purchase value, relationship health, and continued voluntary use | first customer event → activation, correct use, repeat value, renewal, or healthy relationship | time-to-value, activation, product/support signals, cohort retention, stated exit reason | no hidden identity join, obstructed cancellation, guilt, spam, or metric that rewards involuntary lock-in |

## Senior CRO Loop

1. **Orient:** name stage, state A, target state B, eligible population, traffic/source context, customer intent, business value, and the approved Brand DNA constraint.
2. **Verify measurement:** prove events, properties, deduplication, consent, identity boundary, missing-data risk, sample health, and failure visibility before interpreting a rate.
3. **Find the bottleneck:** combine quantitative funnel evidence with qualitative or behavioral evidence. Distinguish friction, confusion, weak value proposition, trust deficit, technical failure, audience mismatch, and missing product value.
4. **Form one causal hypothesis:** `Because [evidence], changing X for audience Y should move stage transition Z through mechanism M; metric P will decide, while guardrails G prevent harm.`
5. **Prioritize:** score impact, evidence confidence, effort, reversibility, and risk. Prefer the smallest change capable of testing the mechanism, not cosmetic motion.
6. **Pre-register:** record control, variant, one primary metric, secondary diagnostics, guardrails, baseline, minimum useful movement, sample or observation rule, deadline, stop rule, confounders, and rollback.
7. **Run through the owner:** this skill may design the test contract and analysis. It does not publish, send, spend, modify production, join identity, or claim that an unimplemented variant is live.
8. **Decide and compound:** return exactly one decision—`continue`, `adapt`, `pause`, `stop`, `archive`, or `escalate`—then version the reusable pattern and send it back to Omnichannel Planning.

## Required Output

Return:

1. stage and bottleneck;
2. evidence quality and instrumentation verdict;
3. current conversion formula with numerator and eligible denominator;
4. prioritized diagnosis;
5. testable causal hypothesis;
6. experiment or observational contract;
7. primary, secondary, and guardrail metrics;
8. authority and privacy boundaries;
9. decision rule and next review date;
10. learning packet for Planning.

Do not call a recommendation “growth” unless it improves a business-relevant transition without breaching trust, retention, privacy, product quality, or downstream unit economics. A campaign report is not a growth loop until its evidence generates the next testable decision.

## Phiên Bản Tiếng Việt

Dùng phương pháp con của `cro` này để cải thiện toàn bộ hành trình khách hàng Atumerce, không chỉ landing page hoặc phần đầu phễu. Trước khi đề xuất thay đổi, phải đọc kế hoạch Commercial đã duyệt, `company/00-governance-core/brand-dna-config.md`, measurement contract, trạng thái consent, data lineage và [tài liệu vận hành CRO toàn phễu](references/full-funnel-cro-operating-reference.md).

Phương pháp này thích nghi kỷ luật ra quyết định từ các skill MIT `cro`, `analytics`, `ab-testing`, `onboarding` và `churn-prevention` của Corey Haines vào hành trình bốn stage của Atumerce và ADR-0017. Nó không sao chép quyền truy cập provider, giả định billing SaaS, benchmark hay quyền tự thực thi.

## Hợp Đồng Chuyển Đổi

Tính mỗi tỷ lệ trên đúng population đủ điều kiện của stage đó:

`tỷ lệ chuyển đổi stage = số chuyển tiếp mục tiêu hoàn tất / tổng cơ hội đủ điều kiện tại stage × 100`

Không trộn visitor, session, lead, account, customer hoặc cohort trong cùng một mẫu số. Mỗi tỷ lệ phải đi kèm tử số, mẫu số, luật đủ điều kiện, time window, source version, trường hợp bị loại và độ tin cậy.

## Quyền Sở Hữu Bốn Stage

| Stage | Nội dung tối ưu | Ví dụ chuyển tiếp | Evidence chính | Guardrail |
| --- | --- | --- | --- | --- |
| Awareness | Sự chú ý đủ chất lượng và độ khớp giữa thông điệp với nguồn traffic | impression hoặc visit đủ điều kiện → bắt đầu tiếp nhận nội dung có chất lượng | source/UTM, độ khớp landing, engaged entry, trạng thái tải/lỗi | không thưởng cho reach làm giảm relevance, trust, accessibility hoặc chất lượng consent |
| Consideration | Khả năng tìm thấy evidence và tiến triển sau khi đã hiểu thông tin | qualified entry → tương tác evidence có ý nghĩa hoặc thể hiện ý định bước tiếp theo | độ sâu content, dùng comparison/FAQ, lưu bài, quay lại, thể hiện product interest | không đánh đồng dwell time, scroll hoặc nhiều lần ghé với ý định mua |
| Conversion | Hoàn tất một hành động đủ điều kiện và được nêu rõ | lần thử của lead hoặc account đủ điều kiện → form/account/demo/product-interest hợp lệ | step funnel, validation/error recovery, hoàn tất form, qualification và consent | không tăng số completion thô bằng cách làm giảm chất lượng lead, privacy, clarity hoặc tăng gánh support |
| Retention | Giá trị sau mua, sức khỏe quan hệ và việc tiếp tục sử dụng tự nguyện | customer event đầu tiên → activation, sử dụng đúng, nhận lại giá trị, renewal hoặc quan hệ khỏe | time-to-value, activation, tín hiệu product/support, cohort retention, lý do rời đi được khai báo | không nối identity ngầm, cản trở hủy, gây tội lỗi, spam hoặc dùng metric thưởng cho việc khóa chân không tự nguyện |

## Vòng CRO Cấp Senior

1. **Định hướng:** nêu stage, trạng thái A, trạng thái B mục tiêu, population đủ điều kiện, bối cảnh traffic/source, customer intent, business value và constraint Brand DNA đã duyệt.
2. **Xác minh đo lường:** chứng minh event, property, deduplication, consent, ranh giới identity, rủi ro thiếu dữ liệu, sức khỏe sample và failure visibility trước khi diễn giải tỷ lệ.
3. **Tìm bottleneck:** kết hợp evidence định lượng của funnel với evidence định tính hoặc hành vi. Phân biệt friction, confusion, value proposition yếu, thiếu trust, lỗi kỹ thuật, lệch audience và thiếu product value.
4. **Lập một giả thuyết nhân quả:** `Vì [evidence], thay đổi X cho audience Y sẽ làm chuyển tiếp Z dịch chuyển qua cơ chế M; metric P dùng để quyết định, còn guardrail G ngăn gây hại.`
5. **Ưu tiên:** chấm impact, confidence dựa trên evidence, effort, khả năng đảo ngược và risk. Ưu tiên thay đổi nhỏ nhất nhưng đủ sức kiểm tra cơ chế, không ưu tiên chuyển động trang trí.
6. **Đăng ký trước:** ghi control, variant, một primary metric, secondary diagnostic, guardrail, baseline, mức dịch chuyển tối thiểu có ích, luật sample hoặc observation, deadline, stop rule, confounder và rollback.
7. **Chạy qua đúng owner:** skill này được thiết kế test contract và phân tích. Nó không tự publish, send, spend, sửa production, nối identity hoặc tuyên bố variant chưa triển khai là đang chạy live.
8. **Ra quyết định và tích lũy:** trả đúng một quyết định—`continue`, `adapt`, `pause`, `stop`, `archive` hoặc `escalate`—sau đó version hóa pattern tái sử dụng được và gửi lại Omnichannel Planning.

## Đầu Ra Bắt Buộc

Phải trả:

1. stage và bottleneck;
2. chất lượng evidence và phán quyết instrumentation;
3. công thức conversion hiện tại với tử số và mẫu số đủ điều kiện;
4. diagnosis đã ưu tiên;
5. giả thuyết nhân quả có thể kiểm thử;
6. hợp đồng experiment hoặc observation;
7. primary, secondary và guardrail metrics;
8. ranh giới thẩm quyền và privacy;
9. decision rule và ngày review tiếp theo;
10. learning packet cho Planning.

Không gọi một recommendation là “growth” nếu nó không cải thiện chuyển tiếp có ý nghĩa kinh doanh hoặc nếu nó phá trust, retention, privacy, chất lượng sản phẩm hay unit economics phía sau. Báo cáo campaign chưa phải growth loop cho đến khi evidence của nó tạo ra quyết định kiểm thử tiếp theo.
