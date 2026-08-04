# Full-Funnel CRO Operating Reference

## English Version

## Source And Adaptation Boundary

The workflow is independently adapted from the following MIT-licensed Corey Haines sources:

- `https://github.com/coreyhaines31/marketingskills/tree/main/skills/cro`
- `https://github.com/coreyhaines31/marketingskills/tree/main/skills/analytics`
- `https://github.com/coreyhaines31/marketingskills/tree/main/skills/ab-testing`
- `https://github.com/coreyhaines31/marketingskills/tree/main/skills/onboarding`
- `https://github.com/coreyhaines31/marketingskills/tree/main/skills/churn-prevention`

Copyright © 2025 Corey Haines. Used and adapted under the MIT License. Retain this notice when a substantial portion of this adapted reference is redistributed.

Atumerce keeps the useful operating principles: context first, decisions before events, page/form friction diagnosis, explicit hypotheses, one primary metric, guardrails, sample discipline, activation/time-to-value, cohort retention, and reusable experiment learning. Atumerce replaces SaaS-specific billing assumptions, generic benchmark targets, provider commands, and autonomous execution with its Brand DNA, four-stage Admin Journey, consent boundary, owner gates, and Phase 3 capability limits.

## Diagnostic Map

| Failure family | Evidence to seek | Do not assume |
| --- | --- | --- |
| Audience/source mismatch | source message, intent, landing promise, qualified-entry rate | more traffic will fix poor fit |
| Value clarity | five-second comprehension, customer-language match, differentiated benefit | clever wording equals comprehension |
| Evidence/trust gap | claim lineage, proof placement, objections, comparison and process transparency | a logo or testimonial proves the claim |
| Interaction friction | navigation, hierarchy, form fields, validation, mobile, speed, accessibility | every abandonment is persuasion failure |
| Technical measurement failure | duplicate/missing events, bad properties, identity leakage, provider outage | zero means no behavior occurred |
| Activation/value failure | time-to-value, earliest retained behavior, setup drop-off, support need | a signup is a successful conversion |
| Retention failure | cohort use, stated exit reason, unresolved problems, voluntary cancellation path | preventing cancellation equals retention |

## Experiment Integrity

Use a controlled A/B label only when allocation, exposure consistency, tracking, sample rule, and variant QA are implemented. Otherwise label the work diagnostic, observational, usability, sequential, or pre/post.

Every experiment record includes:

- evidence-backed hypothesis;
- one meaningful change;
- eligible population and exclusions;
- control and variant identity;
- one primary decision metric;
- secondary diagnostics;
- harm guardrails;
- baseline and minimum useful movement;
- sample-size or observation rule;
- duration, stop condition, confounders, and rollback;
- result, uncertainty, decision, reusable pattern, and where the pattern may be tested next.

Do not peek and declare an early winner. Stop early only for a pre-registered safety, privacy, technical, or material guardrail breach.

## Funnel Learning Ledger

Store each learning with:

`learning_id`, `plan_id`, `stage`, `state_a`, `target_state_b`, `audience`, `source_version`, `hypothesis`, `mechanism`, `primary_metric`, `guardrails`, `evidence_window`, `result`, `uncertainty`, `decision`, `formula_version`, `revalidate_at`, and `next_question`.

The ledger is a decision aid, not permission to expose identity, send a message, change spend, publish content, or mutate production.

## Phiên Bản Tiếng Việt

## Nguồn Và Ranh Giới Thích Nghi

Workflow được thích nghi độc lập từ các nguồn MIT sau của Corey Haines:

- `https://github.com/coreyhaines31/marketingskills/tree/main/skills/cro`
- `https://github.com/coreyhaines31/marketingskills/tree/main/skills/analytics`
- `https://github.com/coreyhaines31/marketingskills/tree/main/skills/ab-testing`
- `https://github.com/coreyhaines31/marketingskills/tree/main/skills/onboarding`
- `https://github.com/coreyhaines31/marketingskills/tree/main/skills/churn-prevention`

Copyright © 2025 Corey Haines. Nội dung được dùng và thích nghi theo MIT License. Phải giữ thông báo này khi phân phối lại phần đáng kể của tài liệu thích nghi.

Atumerce giữ các nguyên tắc vận hành hữu ích: nạp context trước, xác định decision trước event, chẩn đoán friction của page/form, giả thuyết rõ, một primary metric, guardrail, kỷ luật sample, activation/time-to-value, cohort retention và bài học experiment tái sử dụng được. Atumerce thay các giả định billing SaaS, benchmark chung, lệnh provider và quyền tự thực thi bằng Brand DNA, Admin Journey bốn stage, ranh giới consent, owner gate và giới hạn capability Phase 3.

## Bản Đồ Chẩn Đoán

| Nhóm lỗi | Evidence cần tìm | Không được giả định |
| --- | --- | --- |
| Lệch audience/source | thông điệp nguồn, intent, lời hứa landing, qualified-entry rate | kéo thêm traffic sẽ sửa được độ lệch |
| Value chưa rõ | khả năng hiểu trong năm giây, độ khớp ngôn ngữ khách hàng, benefit khác biệt | câu chữ thông minh đồng nghĩa dễ hiểu |
| Thiếu evidence/trust | claim lineage, vị trí proof, objection, comparison và minh bạch process | logo hoặc testimonial tự chứng minh claim |
| Friction tương tác | navigation, hierarchy, field form, validation, mobile, tốc độ, accessibility | mọi abandonment đều do thuyết phục yếu |
| Lỗi đo lường kỹ thuật | event trùng/thiếu, property sai, rò identity, provider outage | số 0 nghĩa là hành vi không xảy ra |
| Lỗi activation/value | time-to-value, hành vi sớm tương quan retention, setup drop-off, nhu cầu support | signup là conversion thành công trọn vẹn |
| Lỗi retention | hành vi theo cohort, lý do rời đi được khai báo, vấn đề chưa giải quyết, đường hủy tự nguyện | ngăn khách hủy đồng nghĩa giữ chân thành công |

## Tính Toàn Vẹn Của Experiment

Chỉ dùng nhãn controlled A/B khi allocation, consistency của exposure, tracking, luật sample và QA variant đã được triển khai. Nếu chưa đủ thì phải ghi đúng loại là diagnostic, observational, usability, sequential hoặc pre/post.

Mỗi experiment record phải có:

- giả thuyết dựa trên evidence;
- một thay đổi có ý nghĩa;
- population đủ điều kiện và trường hợp bị loại;
- danh tính control và variant;
- một primary metric để quyết định;
- secondary diagnostic;
- guardrail ngăn gây hại;
- baseline và mức dịch chuyển tối thiểu có ích;
- luật sample-size hoặc observation;
- duration, stop condition, confounder và rollback;
- result, uncertainty, decision, pattern tái sử dụng và nơi có thể kiểm thử pattern tiếp theo.

Không được nhìn sớm rồi tuyên bố winner. Chỉ dừng sớm theo safety, privacy, technical hoặc material guardrail breach đã đăng ký trước.

## Sổ Bài Học Toàn Phễu

Lưu mỗi bài học với:

`learning_id`, `plan_id`, `stage`, `state_a`, `target_state_b`, `audience`, `source_version`, `hypothesis`, `mechanism`, `primary_metric`, `guardrails`, `evidence_window`, `result`, `uncertainty`, `decision`, `formula_version`, `revalidate_at` và `next_question`.

Ledger là công cụ hỗ trợ quyết định, không phải quyền làm lộ identity, gửi message, đổi spend, publish content hoặc mutate production.
