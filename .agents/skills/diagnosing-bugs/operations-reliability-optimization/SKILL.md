---
name: operations-reliability-optimization
description: Turn Operations health, recovery, security, and delivery evidence into one bounded reliability decision and a versioned learning formula for the next engineering plan.
---

# Operations Reliability Optimization

## English Version

## Role

This is the sole Performance Optimization skill inside the Operations **1 -> n -> 1** topology. It does not deploy, replay, edit production state, grant access, or reopen a planning lane. It evaluates the result of an approved Operations plan and sends one evidence-backed learning packet to Blackfire Grilling.

## Required Inputs

- approved plan ID, source state A, intended state B, owner, metric, baseline, window, and stop condition;
- delivery, runtime, incident, replay, provider-health, security, and `diagnosing-bugs` feedback-loop evidence relevant to that plan;
- known confounders, cost, privacy/security posture, and unresolved risk.

## Workflow

1. Verify that the observed evidence belongs to the approved plan and time window.
2. Compare the metric and service state with baseline and intended B; separate observation from causal inference.
3. Decide exactly one of `continue`, `adapt`, `pause`, `stop`, `archive`, or `escalate`.
4. Package a versioned reliability formula: prerequisites, inputs, mechanism, steps, expected range, exclusions, failure modes, owner, evidence, and revalidation date.
5. Return the formula to Blackfire Grilling. A new intervention requires a new or amended plan; this skill cannot silently authorise it.

## Bản Tiếng Việt

## Vai Trò

Đây là skill Tối ưu hiệu suất duy nhất trong topology Operations **1 -> n -> 1**. Nó không deploy, replay, sửa production state, cấp access hay mở thêm một luồng Planning. Nó đánh giá kết quả của plan Operations đã được duyệt và trả đúng một gói học có evidence về Blackfire Grilling.

## Đầu Vào Bắt Buộc

- plan ID đã duyệt, trạng thái nguồn A, trạng thái mục tiêu B, owner, metric, baseline, cửa sổ đo và stop condition;
- evidence delivery, runtime, incident, replay, provider-health, security và feedback loop của `diagnosing-bugs` liên quan đến plan đó;
- confounder đã biết, chi phí, security/privacy posture và rủi ro chưa xử lý.

## Quy Trình

1. Xác minh evidence quan sát được thuộc đúng plan và cửa sổ đo đã duyệt.
2. So sánh metric và trạng thái dịch vụ với baseline và B; tách quan sát khỏi suy luận nhân quả.
3. Chọn đúng một quyết định: `continue`, `adapt`, `pause`, `stop`, `archive` hoặc `escalate`.
4. Đóng gói công thức reliability có version: điều kiện tiên quyết, đầu vào, cơ chế, bước làm, khoảng kết quả dự kiến, phần loại trừ, failure mode, owner, evidence và ngày revalidation.
5. Trả công thức về Blackfire Grilling. Can thiệp mới phải có plan mới hoặc plan được sửa; skill này không được âm thầm cấp quyền.
