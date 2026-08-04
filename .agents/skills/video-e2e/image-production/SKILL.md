---
name: image-production
description: Produce governed still-image assets from an approved Atumerce image foundation brief or Video E2E scene contract. Use for image generation, editing, compositing, background isolation, thumbnails, key art, banners, social variants, storyboard frames, and video scene assets that require traceable prompts, rights, deterministic variants, visual QA, and handoff; do not invent claims, call an unapproved provider, spend, publish, or overwrite source assets.
---

# Image Production

Use this as a Video E2E child skill for still-image execution. Read the approved image foundation brief or scene contract, canonical text, claim ledger, route card, `company/00-governance-core/brand-dna-config.md`, and `references/image-production-contract.md`. Stop when the visual job, source lineage, rights state, factual-versus-illustrative label, owner, or review gate is missing.

## Senior execution loop

1. Classify the smallest required job: `generate`, `edit`, `compose`, `isolate`, `restore`, `resize`, `crop`, `variant`, or `inspect`. Do not regenerate an asset when a deterministic edit is enough.
2. Convert the approved brief into a versioned image asset manifest. Freeze the intended message, claim IDs, visual job, subject, composition, aspect variants, focal point, safe zones, exact on-image copy, accessibility need, prohibited elements, and acceptance rubric before production.
3. Preserve sources non-destructively. Hash every supplied image, keep the original untouched, declare reference-image and identity-consent status, and record whether each element is owned, licensed, supplied, generated, factual capture, or illustrative reconstruction.
4. Select an approved production route only after capability, model/provider, region, cost, privacy, and rights checks. Record seed and relevant parameters when supported. If no approved route exists, return the manifest and production-ready prompt/edit specification; do not call a provider.
5. Produce the lowest-cost useful preview first. For generation, keep prompts and negative constraints versioned. For edits, declare the allowed edit region and invariants that must not change. For composition, preserve stable object/layer IDs and transforms. For isolation, inspect masks and alpha edges instead of accepting a transparent file blindly.
6. Run independent visual QA against the frozen rubric: message and claim fidelity, subject/reference fidelity, exact text and OCR, brand tone, composition, crop/safe zones, resolution, edge/mask quality, artifact defects, contrast, accessibility, rights, and prohibited financial or trading implications. A model or automated judge is evidence, not final truth.
7. Return an image package with source and output hashes, manifest version, prompt/edit lineage, approved variants, rejected variants and reasons, QA evidence, rights state, review state, and channel or Video E2E handoff. Keep stable `asset_id` values when the image becomes a storyboard frame, scene plate, thumbnail, or layered video element.

This skill does not grant provider credentials, generation spend, publication, paid-media activation, identity processing, or permission to alter canonical meaning. Send performance evidence to CRO; send any changed audience, thesis, claim, or visual strategy back to Omnichannel Planning.

## Bản Tiếng Việt

Dùng đây là child skill của Video E2E cho thực thi ảnh tĩnh. Đọc image foundation brief hoặc scene contract đã duyệt, canonical text, claim ledger, route card, `company/00-governance-core/brand-dna-config.md` và `references/image-production-contract.md`. Dừng lại khi thiếu nhiệm vụ hình ảnh, lineage nguồn, trạng thái quyền, nhãn factual-hay-illustrative, owner hoặc gate review.

### Vòng thực thi cấp senior

1. Phân loại công việc nhỏ nhất cần làm: `generate`, `edit`, `compose`, `isolate`, `restore`, `resize`, `crop`, `variant` hoặc `inspect`. Không tạo lại cả ảnh khi một phép chỉnh sửa xác định đã đủ.
2. Chuyển brief đã duyệt thành image asset manifest có version. Đóng băng thông điệp, claim ID, nhiệm vụ hình ảnh, chủ thể, bố cục, variant tỷ lệ khung hình, focal point, safe zone, copy chính xác trên ảnh, nhu cầu accessibility, phần bị cấm và rubric chấp nhận trước khi sản xuất.
3. Bảo toàn nguồn theo cách không phá hủy. Hash mọi ảnh được cung cấp, giữ nguyên bản gốc, khai báo trạng thái reference image và consent danh tính, đồng thời ghi mỗi thành phần là owned, licensed, supplied, generated, factual capture hay illustrative reconstruction.
4. Chỉ chọn route sản xuất đã duyệt sau khi kiểm tra capability, model/provider, khu vực, chi phí, privacy và quyền sử dụng. Ghi seed cùng tham số liên quan khi route hỗ trợ. Nếu chưa có route được duyệt, chỉ trả manifest và prompt/edit specification sẵn sàng sản xuất; không tự gọi provider.
5. Tạo preview hữu ích với chi phí thấp nhất trước. Với ảnh sinh mới, version hóa prompt và negative constraint. Với chỉnh sửa, khai báo vùng được phép sửa và invariant không được đổi. Với compositing, giữ object/layer ID cùng transform ổn định. Với tách nền, kiểm tra mask và mép alpha thay vì mù quáng chấp nhận file trong suốt.
6. Chạy visual QA độc lập theo rubric đã đóng băng: độ trung thực với thông điệp và claim, độ trung thực chủ thể/reference, text chính xác và OCR, giọng thương hiệu, bố cục, crop/safe zone, độ phân giải, chất lượng edge/mask, lỗi artifact, contrast, accessibility, quyền sử dụng và hàm ý tài chính/trading bị cấm. Model hoặc automated judge chỉ là evidence, không phải sự thật cuối cùng.
7. Trả image package gồm hash nguồn/output, version manifest, lineage prompt/edit, variant được duyệt, variant bị loại cùng lý do, evidence QA, trạng thái quyền, trạng thái review và handoff sang kênh hoặc Video E2E. Giữ `asset_id` ổn định khi ảnh trở thành storyboard frame, scene plate, thumbnail hay phần tử video theo layer.

Skill này không cấp credential provider, ngân sách generate, quyền publish, kích hoạt paid media, xử lý danh tính hay quyền đổi ý nghĩa canonical. Gửi evidence hiệu suất sang CRO; gửi mọi thay đổi audience, thesis, claim hoặc chiến lược hình ảnh về Omnichannel Planning.
