---
name: greenline-forging
description: Operations specialized-execution mega-skill for implementing an approved Atumerce PRD one observable red-green-refactor slice at a time, routing TDD with explicit ownership, tests, verification, and bounded change.
---

# Greenline Forging Skill

## English Version

## Definition

**Greenline Forging** is the Operations-owned specialized-execution mega-skill for building features one verified slice at a time. It upgrades the generic TDD/red-green-refactor habit into an Atumerce operating discipline: every serious feature should advance through small observable behavior, a failing signal, a minimal implementation, and a green verification loop.

The goal is not to write many tests. The goal is to keep the product line green while the feature grows.

Greenline Forging routes `tdd` as its child craft. It accepts only a technical slice approved by Blackfire Grilling. It does not create a second Planning surface, silently broaden scope, or imply deploy/production authority.

Every slice must preserve the declared module seam, acceptance evidence, rollback or recovery condition, and stop condition. Greenline may edit and verify repository code inside the approved boundary; it may not bypass review, grant secrets, or claim production health.

## Core Question

> What is the smallest real behavior that can go red, then green, without lying about the feature?

If there is no red-capable signal, the implementation is not ready.

## Operating Protocol

1. Read the relevant PRD, ADR, `CONTEXT.md`, owning module README, and current route/controller/service files.
2. State the owner department and Laravel module before implementation.
3. Choose one public interface: HTTP route, controller action, CLI command, service contract, event collector, or view/component behavior.
4. Write one red-capable test or smoke check for one behavior.
5. Implement the smallest change that makes it green.
6. Refactor only while green.
7. Repeat one slice at a time.

```text
Red -> Green -> Refactor -> Verify
```

## Three-Attempt Escalation Rule

If three Greenline cycles fail to produce a stable green path, stop normal implementation and activate **Faultline Containment**.

## Atumerce Guardrails

- Preserve **Clarity over noise**.
- Keep market semantics safe: no broker, signal, copy-trading, or managed-trading framing.
- Keep privacy explicit: no hidden tracking or identity join without consent.
- Keep controllers thin.
- Keep runtime code inside `app/Modules/*`.
- Keep The Edge for customers separate from Internal Agent Lab.

## Standard Output

A Greenline Forging pass should leave changed code, tests or smoke checks, a short report naming the red signal and green verification, residual risks, and deferred downstream work.

-------------------------

# Greenline Forging Skill

## Phiên Bản Tiếng Việt

## Định Nghĩa

**Greenline Forging** là mega-skill Thực thi chuyên môn do Operations sở hữu để xây feature từng lát đã được kiểm chứng. Nó nâng cấp thói quen TDD/red-green-refactor thành kỷ luật vận hành của Atumerce: mọi feature nghiêm túc nên đi qua hành vi quan sát được, tín hiệu fail, implementation tối thiểu và vòng kiểm chứng xanh.

Mục tiêu không phải viết thật nhiều test. Mục tiêu là giữ product line xanh trong khi feature lớn dần.

Greenline Forging điều phối `tdd` như nghề con. Nó chỉ nhận lát kỹ thuật đã được Blackfire Grilling duyệt; không tạo Planning thứ hai, không âm thầm mở rộng scope và không mặc nhiên có quyền deploy/production.

Mỗi lát phải giữ module seam, evidence nghiệm thu, điều kiện rollback hoặc recovery và stop condition đã chốt. Greenline được sửa và kiểm chứng code trong ranh giới đã duyệt; không bỏ qua review, cấp secret hay tự tuyên bố production khỏe.

## Câu Hỏi Cốt Lõi

> Hành vi thật nhỏ nhất nào có thể đỏ rồi xanh mà không nói dối về feature?

Nếu không có tín hiệu có thể đỏ, implementation chưa sẵn sàng.

## Giao Thức Vận Hành

1. Đọc PRD, ADR, `CONTEXT.md`, README của module owner, và route/controller/service hiện có.
2. Nói rõ owner department và Laravel module trước khi implement.
3. Chọn một public interface: HTTP route, controller action, CLI command, service contract, event collector, hoặc view/component behavior.
4. Viết một test hoặc smoke check có thể đỏ cho một behavior.
5. Implement thay đổi nhỏ nhất để nó xanh.
6. Chỉ refactor khi đang xanh.
7. Lặp từng lát một.

```text
Red -> Green -> Refactor -> Verify
```

## Luật Escalation Sau Ba Lần Thử

Nếu ba vòng Greenline không tạo được đường xanh ổn định, dừng implementation bình thường và kích hoạt **Faultline Containment**.

## Guardrails Atumerce

- Giữ **Clarity over noise**.
- Giữ market semantics an toàn: không broker, signal, copy-trading, hoặc managed-trading framing.
- Giữ privacy rõ: không hidden tracking hoặc identity join nếu thiếu consent.
- Giữ controller mỏng.
- Giữ runtime code trong `app/Modules/*`.
- Giữ The Edge cho khách tách khỏi Internal Agent Lab.

## Đầu Ra Chuẩn

Một lượt Greenline Forging nên để lại code đã đổi, test hoặc smoke check, report ngắn nêu tín hiệu đỏ và kiểm chứng xanh, residual risks, và downstream work bị defer.
