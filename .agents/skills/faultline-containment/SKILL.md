---
name: faultline-containment
description: Operations specialized-execution mega-skill for isolating stubborn Atumerce bugs and runtime incidents after repeated Greenline failure, routing Event Backbone Operations through bounded containment and verified recovery.
---

# Faultline Containment Skill

## English Version

## Definition

**Faultline Containment** is the Operations-owned specialized-execution mega-skill for isolating stubborn failures. It upgrades the generic diagnosis loop into an Atumerce discipline: when a feature or bug resists the first three Greenline attempts, stop expanding the code and contain the fault until the system has one tight red-capable feedback loop.

The goal is to stop guessing.

Faultline Containment routes `event-backbone-operations` as its child runtime craft. It owns bounded incident containment and recovery execution; it does not replace the reusable diagnostic and performance-learning authority of Diagnosing Bugs.

For Event Backbone work, preserve idempotency, rejection and DLQ evidence, replay auditability, privacy, rollback, and operator visibility. Return an explicit verified runtime-health verdict and recovery evidence to Diagnosing Bugs; never silently discard events or expose credentials.

## Trigger

Faultline Containment activates when:

- the user asks to diagnose, debug, or investigate a hard failure;
- a test or route keeps failing after three Greenline attempts;
- behavior is inconsistent across browser, CLI, local server, or CI;
- a migration, queue, Redis stream, auth flow, or provider integration cannot be made deterministic;
- the agent is tempted to keep patching without a red-capable reproducer.

## Core Question

> What is the smallest repeatable loop that proves the exact failure?

No loop, no theory.

## Operating Protocol

1. Freeze the blast radius: stop broad edits, name the symptom, list recently touched files, and identify the owning module.
2. Build a tight feedback loop: PHPUnit, route smoke, CLI, curl, browser screenshot, replayed fixture, service harness, or bisection script.
3. Minimise the scenario until every remaining element is load-bearing.
4. Rank three to five falsifiable hypotheses before patching.
5. Instrument surgically with the smallest probe that distinguishes hypotheses.
6. Fix through Greenline, rerun the original loop, rerun broader verification, and remove temporary instrumentation.

## Escalation Back To Blackfire

If the failure reveals a wrong product decision, privacy ambiguity, module ownership conflict, or phase boundary violation, stop and return to **Blackfire Grilling** before more code is written.

## Standard Output

A Faultline Containment pass should report the symptom, red-capable loop, minimal repro, hypotheses considered, confirmed cause, fix, verification commands, cleanup performed, and any ADR/PRD update needed.

-------------------------

# Faultline Containment Skill

## Phiên Bản Tiếng Việt

## Định Nghĩa

**Faultline Containment** là mega-skill Thực thi chuyên môn do Operations sở hữu để khoanh vùng lỗi cứng đầu. Nó nâng cấp diagnosis loop chung thành kỷ luật Atumerce: khi feature hoặc bug chống lại ba lần Greenline đầu, dừng mở rộng code và khoanh vùng lỗi cho đến khi hệ thống có một vòng feedback thật chặt, có thể đỏ.

Mục tiêu là ngừng đoán mò.

Faultline Containment điều phối `event-backbone-operations` như nghề runtime con. Nó sở hữu containment và recovery có ranh giới; không thay thế quyền chẩn đoán tái sử dụng và học hiệu suất của Diagnosing Bugs.

Với Event Backbone, phải giữ idempotency, evidence rejection và DLQ, khả năng audit replay, privacy, rollback và khả năng quan sát của operator. Trả verdict runtime-health đã xác minh cùng evidence recovery cho Diagnosing Bugs; không âm thầm bỏ event hay để lộ credential.

## Kích Hoạt

Faultline Containment kích hoạt khi:

- user yêu cầu diagnose, debug, hoặc điều tra lỗi khó;
- test hoặc route vẫn fail sau ba lần thử Greenline;
- behavior không nhất quán giữa browser, CLI, local server, hoặc CI;
- migration, queue, Redis stream, auth flow, hoặc provider integration không thể deterministic;
- agent muốn tiếp tục vá mà chưa có reproducer có thể đỏ.

## Câu Hỏi Cốt Lõi

> Vòng lặp nhỏ nhất nào lặp lại được và chứng minh đúng lỗi này?

Không có loop, không có giả thuyết.

## Giao Thức Vận Hành

1. Đóng băng blast radius: dừng edit diện rộng, gọi tên symptom, liệt kê file vừa chạm, và xác định module owner.
2. Tạo feedback loop chặt: PHPUnit, route smoke, CLI, curl, browser screenshot, replay fixture, service harness, hoặc bisection script.
3. Thu nhỏ scenario đến khi mọi phần còn lại đều load-bearing.
4. Xếp hạng ba đến năm giả thuyết falsifiable trước khi vá.
5. Instrument có phẫu thuật bằng probe nhỏ nhất để phân biệt giả thuyết.
6. Fix qua Greenline, chạy lại loop gốc, chạy verification rộng hơn, và xóa instrumentation tạm.

## Escalation Ngược Về Blackfire

Nếu lỗi lộ ra quyết định product sai, privacy mơ hồ, xung đột module ownership, hoặc vi phạm phase boundary, dừng lại và quay về **Blackfire Grilling** trước khi viết thêm code.

## Đầu Ra Chuẩn

Một lượt Faultline Containment nên report symptom, red-capable loop, minimal repro, giả thuyết đã xét, nguyên nhân đã xác nhận, fix, lệnh verification, cleanup đã làm, và ADR/PRD nào cần cập nhật.
