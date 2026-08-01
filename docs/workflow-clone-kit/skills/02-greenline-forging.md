# Skill 02 - Greenline Forging

## English Version

## Definition

Greenline Forging is the implementation skill for growing a feature through one verified slice at a time.

It uses the red-green-refactor habit, but the goal is not to write many tests. The goal is to keep the product line green while real behavior grows.

## Core Question

> What is the smallest real behavior that can go red, then green, without lying about the feature?

If no red-capable signal exists, implementation is not ready.

## Operating Protocol

1. Read the approved PRD/ADR and current code.
2. Name the owner, module, and public interface.
3. Choose one public interface: route, command, service contract, event, UI behavior, API endpoint.
4. Write one red-capable test or smoke check.
5. Implement the smallest code that makes it green.
6. Refactor only while green.
7. Repeat with the next slice.

```text
Red -> Green -> Refactor -> Verify -> Report
```

## Good Red Signals

- PHPUnit feature/unit test.
- Route smoke test.
- CLI command with expected output.
- Browser screenshot check.
- API request/response contract.
- Migration status check.
- Build/lint command.
- Replay fixture for event-driven systems.

## Guardrails

- Test behavior through public interfaces.
- Avoid testing private implementation details.
- Keep controllers thin.
- Put business logic in services/modules/domain boundaries.
- Do not add speculative features for future tests.
- Do not refactor while red.
- Do not fake green by weakening assertions.
- If three attempts fail, stop and use Faultline Containment.

## Standard Report

A Greenline report should state:

- selected slice;
- red signal;
- green command;
- changed files;
- behavior now covered;
- deferred work;
- residual risk.

-------------------------

# Skill 02 - Greenline Forging

## Phiên Bản Tiếng Việt

## Định Nghĩa

Greenline Forging là skill triển khai feature bằng từng lát nhỏ đã được kiểm chứng.

Nó dùng thói quen red-green-refactor, nhưng mục tiêu không phải viết thật nhiều test. Mục tiêu là giữ product line xanh trong khi behavior thật lớn dần.

## Câu Hỏi Lõi

> Hành vi thật nhỏ nhất nào có thể đỏ rồi xanh mà không nói dối về feature?

Nếu không có tín hiệu có thể đỏ, implementation chưa sẵn sàng.

## Giao Thức Vận Hành

1. Đọc PRD/ADR đã duyệt và code hiện tại.
2. Nói rõ owner, module, và public interface.
3. Chọn một public interface: route, command, service contract, event, UI behavior, API endpoint.
4. Viết một test hoặc smoke check có thể đỏ.
5. Implement lượng code nhỏ nhất để xanh.
6. Chỉ refactor khi đang xanh.
7. Lặp lại với lát tiếp theo.

```text
Red -> Green -> Refactor -> Verify -> Report
```

## Tín Hiệu Đỏ Tốt

- PHPUnit feature/unit test.
- Route smoke test.
- CLI command có output kỳ vọng.
- Browser screenshot check.
- API request/response contract.
- Migration status check.
- Build/lint command.
- Replay fixture cho hệ event-driven.

## Guardrails

- Test behavior qua public interface.
- Tránh test implementation detail private.
- Giữ controller mỏng.
- Đưa business logic vào service/module/domain boundary.
- Không thêm feature suy đoán cho test tương lai.
- Không refactor khi đang đỏ.
- Không làm xanh giả bằng cách làm yếu assertion.
- Nếu ba lần thử vẫn fail, dừng và dùng Faultline Containment.

## Report Chuẩn

Một Greenline report nên ghi:

- lát được chọn;
- tín hiệu đỏ;
- lệnh xanh;
- file đã đổi;
- behavior đã được cover;
- việc defer;
- rủi ro còn lại.
