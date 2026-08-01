# Installing The Workflow Clone Kit

## English Version

## What This Kit Is

This is a compressed workflow kit. It is not meant to replace the target repository's structure on day one. It should be copied as a folder, then exposed through the target repo's front door so every IDE/agent knows how to use it.

The front door is normally:

- root `AGENTS.md`;
- root `CONTEXT.md`;
- `docs/README.md`;
- issue tracker labels or issue templates if the project uses them.

## Recommended Installation

## Repo Or Separate Folder?

Use this rule:

- If the target repo must enforce this workflow for all future IDEs/agents, commit the kit into that repo.
- If the kit is meant to be reused across many unrelated projects, keep a canonical copy outside the app repo or in a dedicated workflow repo.
- If unsure, keep it outside first, then copy it into a project only when the project is ready to adopt it.

### Step 1 - Copy The Folder

Copy this folder into the target repo:

```text
docs/workflow-clone-kit/
```

Do not split the files yet.

### Step 2 - Add Root AGENTS.md Pointer

Open or create:

```text
AGENTS.md
```

Paste the contents of:

```text
docs/workflow-clone-kit/AGENTS-snippet.md
```

This is the most important step. If `AGENTS.md` does not point to the kit, future agents may never read it.

### Step 3 - Add Docs README Pointer

If the repo has `docs/README.md`, add:

```md
## Workflow Kit

This repo uses the portable Workflow Clone Kit at `docs/workflow-clone-kit/`.

- Planning and PRDs: `skills/01-blackfire-grilling.md`
- Implementation: `skills/02-greenline-forging.md`
- Hard debugging: `skills/03-faultline-containment.md`
- Templates: `templates/`
```

### Step 4 - Adapt Project Vocabulary

Edit only project-specific terms:

- module paths;
- framework conventions;
- test command;
- build command;
- issue tracker;
- privacy/legal requirements;
- brand/product guardrails.

Do not rename the three combos unless the new names are equally clear and consistently documented.

### Step 5 - Optional Expansion

Only after the target repo has used the kit successfully, you may expand it:

| If The Repo Needs | Promote To |
| --- | --- |
| First-class agent skills | `.agents/skills/` or equivalent |
| Long-lived architecture decisions | `docs/adr/` |
| Feature planning | `docs/prd/` |
| Team/company operating docs | `company/` or `docs/operations/` |
| Issue templates | `.github/ISSUE_TEMPLATE/` |

Keep the original kit as a compressed source if useful.

## Agent Instruction

When an agent enters a repo with this kit:

1. Read `AGENTS.md`.
2. Read `docs/workflow-clone-kit/README.md`.
3. Select the correct combo.
4. Read the relevant skill file.
5. Use the templates when producing PRD/ADR/handoff artifacts.

## Common Mistakes

- Copying the folder but forgetting `AGENTS.md`.
- Moving files around before the workflow is understood.
- Treating Blackfire as a casual brainstorming step.
- Implementing before a PRD has dependencies and acceptance criteria.
- Writing tests after code and pretending it was Greenline.
- Continuing to patch after three failed attempts instead of activating Faultline.

-------------------------

# Cài Đặt Workflow Clone Kit

## Phiên Bản Tiếng Việt

## Bộ Kit Này Là Gì

Đây là một workflow kit dạng nén. Nó không nhằm thay thế cấu trúc repo đích ngay ngày đầu. Hãy copy nguyên thư mục, rồi đưa chỉ dẫn ra mặt tiền repo để mọi IDE/agent biết cách dùng.

Mặt tiền repo thường là:

- `AGENTS.md` ở root;
- `CONTEXT.md` ở root;
- `docs/README.md`;
- issue tracker labels hoặc issue templates nếu dự án có dùng.

## Cách Cài Khuyến Nghị

## Để Trong Repo Hay Tách Riêng?

Dùng nguyên tắc này:

- Nếu repo đích cần ép mọi IDE/agent tương lai làm theo workflow này, hãy commit kit vào repo đó.
- Nếu kit là bộ nghề dùng lại cho nhiều dự án khác nhau, hãy giữ bản gốc ở ngoài repo app hoặc trong một repo workflow riêng.
- Nếu chưa chắc, cứ giữ riêng bên ngoài trước, rồi chỉ copy vào dự án khi dự án đó thật sự sẵn sàng áp dụng.

### Bước 1 - Copy Folder

Copy thư mục này vào repo đích:

```text
docs/workflow-clone-kit/
```

Đừng tách file vội.

### Bước 2 - Gắn Pointer Vào AGENTS.md Ở Root

Mở hoặc tạo:

```text
AGENTS.md
```

Dán nội dung của:

```text
docs/workflow-clone-kit/AGENTS-snippet.md
```

Đây là bước quan trọng nhất. Nếu `AGENTS.md` không trỏ tới kit, agent sau có thể không bao giờ đọc nó.

### Bước 3 - Gắn Pointer Vào Docs README

Nếu repo có `docs/README.md`, thêm:

```md
## Workflow Kit

This repo uses the portable Workflow Clone Kit at `docs/workflow-clone-kit/`.

- Planning and PRDs: `skills/01-blackfire-grilling.md`
- Implementation: `skills/02-greenline-forging.md`
- Hard debugging: `skills/03-faultline-containment.md`
- Templates: `templates/`
```

### Bước 4 - Chỉnh Vocabulary Riêng Của Dự Án

Chỉ chỉnh các thuật ngữ riêng:

- đường dẫn module;
- convention framework;
- lệnh test;
- lệnh build;
- issue tracker;
- yêu cầu privacy/legal;
- guardrail brand/product.

Không đổi tên ba combo trừ khi tên mới rõ tương đương và được document nhất quán.

### Bước 5 - Bung Ra Nếu Cần

Chỉ sau khi repo đích đã dùng kit ổn, có thể bung ra:

| Nếu Repo Cần | Promote Sang |
| --- | --- |
| Agent skills chính thức | `.agents/skills/` hoặc tương đương |
| Quyết định kiến trúc lâu dài | `docs/adr/` |
| Lập kế hoạch feature | `docs/prd/` |
| Tài liệu vận hành team/company | `company/` hoặc `docs/operations/` |
| Issue templates | `.github/ISSUE_TEMPLATE/` |

Có thể giữ lại kit gốc như nguồn nén.

## Chỉ Dẫn Cho Agent

Khi agent bước vào repo có kit này:

1. Đọc `AGENTS.md`.
2. Đọc `docs/workflow-clone-kit/README.md`.
3. Chọn đúng combo.
4. Đọc skill file liên quan.
5. Dùng template khi tạo PRD/ADR/handoff.

## Lỗi Hay Gặp

- Copy folder nhưng quên `AGENTS.md`.
- Move file lung tung trước khi hiểu workflow.
- Xem Blackfire như brainstorm nhẹ.
- Implement trước khi PRD có dependency và acceptance criteria.
- Viết test sau code rồi giả vờ đó là Greenline.
- Vá tiếp sau ba lần fail thay vì kích hoạt Faultline.
