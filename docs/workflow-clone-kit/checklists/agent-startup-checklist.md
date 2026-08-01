# Agent Startup Checklist

## English Version

Before acting, a new IDE/agent should state:

- What request is being answered.
- Which combo applies: Blackfire, Greenline, Faultline, or a small direct answer.
- Which files must be read first.
- Which module/surface owns the work.
- Whether code changes are expected.
- Which verification command will prove the work.
- Whether existing dirty changes are unrelated and must be preserved.

## Minimal Startup Script

```text
1. Check git status.
2. Read AGENTS.md or the local workflow pointer.
3. Read the relevant PRD/ADR/README.
4. State the boundary.
5. Pick the smallest next action.
6. Verify.
7. Report.
```

## Stop And Ask / Stop And Report When

- The request conflicts with existing docs.
- The implementation would require secrets or external credentials.
- The agent would need to rewrite Git history.
- The agent sees unrelated dirty changes in files it must edit.
- The plan touches privacy/security/legal risk without a PRD or ADR.
- The agent cannot define a verification command.

-------------------------

# Checklist Khởi Động Agent

## Phiên Bản Tiếng Việt

Trước khi hành động, IDE/agent mới nên nói rõ:

- Đang trả lời yêu cầu nào.
- Combo nào áp dụng: Blackfire, Greenline, Faultline, hoặc trả lời trực tiếp nhỏ.
- File nào phải đọc trước.
- Module/surface nào sở hữu việc này.
- Có cần đổi code không.
- Lệnh verification nào chứng minh kết quả.
- Dirty changes hiện có có liên quan không và có cần giữ nguyên không.

## Script Khởi Động Tối Thiểu

```text
1. Check git status.
2. Đọc AGENTS.md hoặc workflow pointer local.
3. Đọc PRD/ADR/README liên quan.
4. Nói rõ boundary.
5. Chọn hành động nhỏ nhất tiếp theo.
6. Verify.
7. Report.
```

## Dừng Và Hỏi / Dừng Và Báo Cáo Khi

- Request mâu thuẫn với docs hiện có.
- Implementation cần secret hoặc credential ngoài.
- Agent cần rewrite Git history.
- Agent thấy dirty changes không liên quan trong file cần sửa.
- Plan chạm privacy/security/legal risk nhưng chưa có PRD hoặc ADR.
- Agent không định nghĩa được lệnh verification.
