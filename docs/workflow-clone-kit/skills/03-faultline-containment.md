# Skill 03 - Faultline Containment

## English Version

## Definition

Faultline Containment is the hard-debugging skill for isolating stubborn failures. It starts when normal implementation begins to guess.

The goal is to stop widening the blast radius and build one tight repeatable loop that proves the exact failure.

## Trigger

Use Faultline Containment when:

- three Greenline attempts fail;
- the same error keeps returning;
- CLI, browser, local server, or CI disagree;
- migration, queue, stream, auth, cache, build, or provider behavior is inconsistent;
- the agent wants to keep patching without a reproducer.

## Core Question

> What is the smallest repeatable loop that proves the exact failure?

No loop, no theory.

## Operating Protocol

1. Freeze broad edits.
2. Name the symptom precisely.
3. List recently touched files.
4. Identify the owning module/surface.
5. Build one feedback loop: test, CLI command, curl, browser screenshot, fixture replay, bisection script.
6. Minimize the scenario until every remaining part is load-bearing.
7. Rank three to five falsifiable hypotheses.
8. Add the smallest probe that distinguishes hypotheses.
9. Fix through Greenline.
10. Rerun the original loop, broader verification, and remove temporary probes.

## Escalation Back To Planning

Return to Blackfire Grilling if the failure reveals:

- wrong product decision;
- ambiguous privacy/security rule;
- module ownership conflict;
- phase/scope boundary violation;
- missing PRD/ADR decision.

## Standard Report

Report:

- symptom;
- minimal repro;
- red-capable loop;
- hypotheses considered;
- confirmed cause;
- fix;
- verification commands;
- cleanup performed;
- docs/ADR/PRD updates needed.

-------------------------

# Skill 03 - Faultline Containment

## Phiên Bản Tiếng Việt

## Định Nghĩa

Faultline Containment là skill hard-debug để khoanh vùng lỗi cứng đầu. Nó bắt đầu khi implementation bình thường chuyển sang đoán mò.

Mục tiêu là dừng mở rộng vùng phá hoại và tạo một vòng lặp nhỏ, lặp lại được, chứng minh đúng lỗi.

## Khi Kích Hoạt

Dùng Faultline Containment khi:

- ba lần Greenline vẫn fail;
- cùng một lỗi quay lại liên tục;
- CLI, browser, local server, hoặc CI cho kết quả khác nhau;
- migration, queue, stream, auth, cache, build, hoặc provider không ổn định;
- agent muốn vá tiếp dù chưa có reproducer.

## Câu Hỏi Lõi

> Vòng lặp nhỏ nhất nào lặp lại được và chứng minh đúng lỗi này?

Không có loop, không có giả thuyết.

## Giao Thức Vận Hành

1. Dừng edit diện rộng.
2. Gọi tên symptom thật chính xác.
3. Liệt kê file vừa chạm.
4. Xác định module/surface sở hữu.
5. Tạo một feedback loop: test, CLI command, curl, browser screenshot, fixture replay, bisection script.
6. Thu nhỏ scenario đến khi mọi phần còn lại đều bắt buộc.
7. Xếp hạng ba đến năm giả thuyết có thể chứng minh sai.
8. Thêm probe nhỏ nhất để phân biệt giả thuyết.
9. Fix qua Greenline.
10. Chạy lại loop gốc, verification rộng hơn, và xóa probe tạm.

## Escalation Ngược Về Planning

Quay về Blackfire Grilling nếu lỗi lộ ra:

- quyết định product sai;
- luật privacy/security mơ hồ;
- xung đột module ownership;
- vi phạm phase/scope boundary;
- thiếu quyết định PRD/ADR.

## Report Chuẩn

Report gồm:

- symptom;
- minimal repro;
- red-capable loop;
- các giả thuyết đã xét;
- nguyên nhân đã xác nhận;
- fix;
- lệnh verification;
- cleanup đã làm;
- docs/ADR/PRD cần cập nhật.
