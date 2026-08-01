# Skill 01 - Blackfire Grilling

## English Version

## Definition

Blackfire Grilling is the planning and review skill for burning weak assumptions out of a proposal before it becomes code, UX, architecture, automation, content, or repo history.

It upgrades a simple “ask questions” habit into an operating discipline: every serious plan must survive hard questions before implementation starts.

## Core Question

> Does this create structural clarity, or does it create more noise?

If the answer is unclear, the plan is not ready.

## Required Lenses

| Lens | Question |
| --- | --- |
| Purpose | Why does this need to exist now? |
| Scope | What is in, what is out, and what would be scope creep? |
| User/Operator | Who touches this and who suffers if it breaks? |
| Data | What data is created, read, stored, transformed, or deleted? |
| Privacy/Security | What consent, identity, access, secret, or audit risk exists? |
| Architecture | Which module owns it and what interface should remain stable? |
| UX | What states must exist: empty, loading, error, success, mobile, desktop? |
| Testability | How will another agent prove it works? |
| Failure Mode | What breaks, where is it observed, and how is recovery done? |
| Dependency | What must be true before this can start? |

## Standard Output

Blackfire Grilling should produce at least one of:

- sharpened PRD;
- ADR;
- issue breakdown with dependencies;
- glossary clarification;
- rejection/defer note;
- handoff checklist.

## PRD Structure

Use this for serious work:

1. Title and status.
2. Executive summary.
3. Context and problem.
4. Strategic fit.
5. Scope and boundary.
6. Users and operators.
7. Functional requirements.
8. Non-functional requirements.
9. Data model and event/API contract.
10. UX/UI requirements.
11. Dependencies and ownership.
12. Issue breakdown.
13. Acceptance criteria.
14. Test and verification plan.
15. Risks and decisions.
16. Handoff notes.

## Anti-Patterns

- Writing a long PRD without dependencies.
- Saying “AI” without a real workflow and verification path.
- Hiding privacy/security risk behind technical words.
- Mixing internal tools with customer-facing surfaces.
- Moving runtime code into documentation folders.
- Accepting “we will test later”.
- Treating screenshots as proof when behavior is not verified.

-------------------------

# Skill 01 - Blackfire Grilling

## Phiên Bản Tiếng Việt

## Định Nghĩa

Blackfire Grilling là skill lập kế hoạch và review dùng để nướng cháy giả định yếu trước khi một đề xuất biến thành code, UX, kiến trúc, automation, content, hoặc lịch sử repo.

Nó nâng cấp thói quen “hỏi thêm vài câu” thành một kỷ luật vận hành: mọi kế hoạch nghiêm túc phải sống sót qua câu hỏi khó trước khi implementation bắt đầu.

## Câu Hỏi Lõi

> Việc này tạo ra structural clarity, hay tạo thêm noise?

Nếu câu trả lời chưa rõ, kế hoạch chưa sẵn sàng.

## Lăng Kính Bắt Buộc

| Lăng Kính | Câu Hỏi |
| --- | --- |
| Mục đích | Vì sao việc này cần tồn tại ngay bây giờ? |
| Scope | Cái gì nằm trong, cái gì nằm ngoài, cái gì là scope creep? |
| User/Operator | Ai chạm vào nó và ai chịu đau nếu nó hỏng? |
| Data | Dữ liệu nào được tạo, đọc, lưu, biến đổi, hoặc xóa? |
| Privacy/Security | Có rủi ro consent, identity, access, secret, hoặc audit nào không? |
| Architecture | Module nào sở hữu và interface nào phải ổn định? |
| UX | Cần trạng thái nào: empty, loading, error, success, mobile, desktop? |
| Testability | Agent khác sẽ chứng minh nó chạy đúng bằng cách nào? |
| Failure Mode | Cái gì hỏng, quan sát ở đâu, và khôi phục thế nào? |
| Dependency | Điều gì phải đúng trước khi bắt đầu? |

## Đầu Ra Chuẩn

Blackfire Grilling nên tạo ít nhất một artifact:

- PRD đã mài sắc;
- ADR;
- bảng issue có dependency;
- giải thích thuật ngữ;
- ghi chú reject/defer;
- checklist bàn giao.

## Cấu Trúc PRD

Dùng cấu trúc này cho việc nghiêm túc:

1. Tiêu đề và trạng thái.
2. Tóm tắt điều hành.
3. Bối cảnh và vấn đề.
4. Độ khớp chiến lược.
5. Scope và ranh giới.
6. Người dùng và operator.
7. Yêu cầu chức năng.
8. Yêu cầu phi chức năng.
9. Data model và contract event/API.
10. Yêu cầu UX/UI.
11. Phụ thuộc và ownership.
12. Bảng issue.
13. Acceptance criteria.
14. Kế hoạch test và verification.
15. Rủi ro và quyết định.
16. Ghi chú bàn giao.

## Anti-Patterns

- Viết PRD dài nhưng không có dependency.
- Nói “AI” mà không có workflow thật và đường verify.
- Giấu rủi ro privacy/security sau thuật ngữ kỹ thuật.
- Trộn tool nội bộ với bề mặt khách hàng.
- Move runtime code vào thư mục tài liệu.
- Chấp nhận “để test sau”.
- Xem screenshot là bằng chứng khi behavior chưa được verify.
