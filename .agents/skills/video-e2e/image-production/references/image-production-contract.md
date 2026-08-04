# Image Production Contract

This reference defines a provider-neutral, reviewable contract for still images produced inside Video E2E. It adapts operating principles—not copied code—from the revision-locked MIT sources in `company/01-commercial-cco/knowledge/source-register.md`.

## 1. Source Roles

| Source | Principle adopted |
| --- | --- |
| Together AI Skills | Route generation, editing, reference guidance, dimensions, and reproducibility as explicit capabilities rather than one ambiguous image request |
| OpenAI Cookbook | Evaluate generation and editing against case-specific criteria; preserve artifacts and structured scores; use OCR and human review where exact text or high-stakes meaning matters |
| Fabric.js | Model compositions as stable objects/layers with deterministic transforms, filters, serialization, and interchange formats |
| Jimp | Treat decode, resize, crop, composite, inspection, conversion, and variant export as deterministic image-processing stages |
| rembg | Treat foreground masks, background removal, alpha matting, batch work, and model choice as inspectable processing stages |

These sources do not select Atumerce's image provider, model, editor, or runtime. They establish production invariants that survive implementation changes.

## 2. Work Classes

Select one primary work class and declare any secondary stages:

- `generate`: create a new illustrative asset from the approved brief;
- `edit`: change only declared regions or attributes of a supplied asset;
- `compose`: combine approved layers, copy, logos, product captures, and backgrounds;
- `isolate`: create a foreground mask, transparent asset, or replacement background;
- `restore`: repair bounded defects without inventing factual detail;
- `resize` or `crop`: create channel/aspect variants while protecting focal point and safe zones;
- `variant`: change one declared variable while preserving the canonical message;
- `inspect`: evaluate an asset without modifying it.

Do not use generative work to disguise a missing product capture, missing evidence, absent license, or unavailable owner approval.

## 3. Canonical Image Asset Manifest

Every production request and output must preserve:

- `asset_id`, `manifest_version`, `insight_id`, `canonical_id`, `brief_version`, and `claim_ids`;
- `work_class`, `visual_job`, `factuality_label`, intended audience, journey stage, channel, and CTA role;
- source asset paths/URIs, hashes, rights state, consent state, expiry, and original-preservation state;
- subject, environment, composition, focal point, camera/perspective intent, palette, lighting, and brand constraints;
- exact on-image copy, language, typography constraints, logo rules, prohibited elements, and accessibility/alt-text need;
- width, height, aspect ratio, safe zones, crop policy, transparency, color profile, and output format;
- provider/model/route only when approved, plus prompt version, edit instruction, negative constraints, seed, and relevant parameters;
- object/layer IDs for compositions and mask IDs for isolation/editing;
- parent asset, `variant_of`, transformation history, output hash, reviewer, and review state.

Keep semantic fields independent from provider syntax. Adapters consume the manifest; they do not redefine the approved message.

## 4. Production Gates

1. **Meaning gate:** the visual job and claim lineage match the canonical source.
2. **Rights and consent gate:** every source, face, logo, font, product capture, and derivative use is permitted.
3. **Capability and cost gate:** the route supports the requested operation, region, fidelity, format, privacy posture, and bounded cost.
4. **Preview gate:** a low-cost preview demonstrates composition, focal point, copy placement, and expected edit scope.
5. **Human review gate:** a reviewer approves the exact manifest and selected preview before expensive generation or packaging.
6. **Output QA gate:** inspect the final bytes and visible result, not merely a provider success response.
7. **Handoff gate:** approved artifacts re-enter Planning or Video E2E with lineage and review evidence intact.

## 5. Visual QA Rubric

Reject or return for revision when any required criterion fails:

- claim, product, chart, UI, or market fact is fabricated, distorted, or stronger than the approved source;
- exact text fails OCR, spelling, locale, typography, or safe-zone requirements;
- a reference subject, product, logo, or identity changes beyond the declared edit;
- composition, hierarchy, contrast, focal point, crop, or thumbnail-scale readability misses the brief;
- hands, faces, edges, reflections, geometry, repeated objects, gradients, shadows, or alpha masks contain visible defects;
- output dimensions, format, transparency, color, file size, or variant naming do not match the contract;
- an asset lacks source hash, prompt/edit lineage, rights/consent state, reviewer, or expiry;
- the image creates prohibited broker, signal, guaranteed-return, copy-trading, or managed-trading implications.

Automated similarity, OCR, or vision-judge scores are diagnostic signals. Use deterministic checks where possible and require human review for identity, brand meaning, financial implications, or final creative judgment.

## 6. Video And Channel Handoff

When an image enters video, preserve `asset_id`, source/output hash, layer or mask references, focal point, safe zones, allowed animation/crop, intended `scene_id`/`beat_id`, rights expiry, and review state. A still-image approval does not authorize animation, video render, publication, or paid distribution.

For standalone channel variants, keep one parent asset and declare each derivative's channel, dimensions, crop, copy, CTA role, and review state. Do not let a derivative silently change the canonical promise.

## 7. Authority Boundary

This contract authorizes specifications, previews, QA records, and reviewable packages only. It does not grant provider credentials, spend, model installation, customer-data access, identity processing, publication, promotion, or automatic performance-driven rewriting.

---

# Hợp Đồng Sản Xuất Hình Ảnh

Tài liệu này định nghĩa hợp đồng trung lập với provider và có thể review cho ảnh tĩnh được sản xuất bên trong Video E2E. Nó điều chỉnh nguyên tắc vận hành—không sao chép code—từ các nguồn MIT đã khóa revision trong `company/01-commercial-cco/knowledge/source-register.md`.

## 1. Vai Trò Của Nguồn

| Nguồn | Nguyên tắc được áp dụng |
| --- | --- |
| Together AI Skills | Route generation, editing, reference guidance, kích thước và khả năng tái lập thành capability rõ ràng thay vì một yêu cầu ảnh mơ hồ |
| OpenAI Cookbook | Đánh giá generation/editing theo tiêu chí riêng của từng case; giữ artifact và score có cấu trúc; dùng OCR cùng human review khi text chính xác hoặc ý nghĩa rủi ro cao là bắt buộc |
| Fabric.js | Mô hình hóa composition thành object/layer ổn định với transform, filter, serialization và format trao đổi xác định |
| Jimp | Xem decode, resize, crop, composite, inspect, convert và export variant là các stage xử lý ảnh xác định |
| rembg | Xem foreground mask, xóa nền, alpha matting, xử lý batch và chọn model là các stage có thể kiểm tra |

Các nguồn này không chọn image provider, model, editor hay runtime cho Atumerce. Chúng xác lập invariant sản xuất vẫn đúng khi implementation thay đổi.

## 2. Nhóm Công Việc

Chọn một nhóm công việc chính và khai báo mọi stage phụ:

- `generate`: tạo asset minh họa mới từ brief đã duyệt;
- `edit`: chỉ thay đổi vùng hoặc thuộc tính đã khai báo của asset được cung cấp;
- `compose`: kết hợp layer, copy, logo, product capture và background đã duyệt;
- `isolate`: tạo foreground mask, asset trong suốt hoặc background thay thế;
- `restore`: sửa lỗi có giới hạn mà không bịa chi tiết factual;
- `resize` hoặc `crop`: tạo variant theo kênh/tỷ lệ khung hình đồng thời bảo vệ focal point và safe zone;
- `variant`: đổi một biến đã khai báo nhưng giữ thông điệp canonical;
- `inspect`: đánh giá asset mà không sửa đổi.

Không dùng công việc generative để che product capture bị thiếu, evidence bị thiếu, license không tồn tại hoặc approval owner chưa có.

## 3. Image Asset Manifest Canonical

Mọi yêu cầu và output sản xuất phải giữ:

- `asset_id`, `manifest_version`, `insight_id`, `canonical_id`, `brief_version` và `claim_ids`;
- `work_class`, `visual_job`, `factuality_label`, audience dự kiến, journey stage, kênh và vai trò CTA;
- path/URI của source asset, hash, trạng thái quyền, trạng thái consent, hạn dùng và trạng thái bảo toàn bản gốc;
- chủ thể, môi trường, bố cục, focal point, ý định camera/perspective, palette, lighting và ràng buộc thương hiệu;
- copy chính xác trên ảnh, ngôn ngữ, ràng buộc typography, luật logo, phần bị cấm và nhu cầu accessibility/alt text;
- width, height, aspect ratio, safe zone, crop policy, transparency, color profile và output format;
- provider/model/route chỉ khi đã duyệt, cùng version prompt, edit instruction, negative constraint, seed và tham số liên quan;
- object/layer ID cho composition và mask ID cho isolation/editing;
- asset cha, `variant_of`, lịch sử transform, hash output, reviewer và trạng thái review.

Giữ semantic field độc lập với cú pháp provider. Adapter đọc manifest nhưng không được định nghĩa lại thông điệp đã duyệt.

## 4. Gate Sản Xuất

1. **Gate ý nghĩa:** nhiệm vụ hình ảnh và claim lineage khớp nguồn canonical.
2. **Gate quyền và consent:** mọi source, khuôn mặt, logo, font, product capture và derivative use đều được phép.
3. **Gate capability và chi phí:** route hỗ trợ operation, khu vực, fidelity, format, privacy posture và chi phí có giới hạn được yêu cầu.
4. **Gate preview:** preview chi phí thấp chứng minh bố cục, focal point, vị trí copy và phạm vi edit dự kiến.
5. **Gate human review:** reviewer duyệt đúng manifest và preview được chọn trước generation hoặc packaging tốn kém.
6. **Gate QA output:** kiểm tra byte output và kết quả nhìn thấy, không chỉ dựa vào response thành công của provider.
7. **Gate handoff:** artifact đã duyệt quay lại Planning hoặc Video E2E với lineage và evidence review còn nguyên.

## 5. Rubric Visual QA

Từ chối hoặc trả lại sửa khi bất kỳ tiêu chí bắt buộc nào fail:

- claim, product, chart, UI hay sự thật thị trường bị bịa, bóp méo hoặc mạnh hơn nguồn đã duyệt;
- text chính xác fail OCR, chính tả, locale, typography hoặc yêu cầu safe zone;
- chủ thể reference, product, logo hay identity thay đổi vượt khỏi edit đã khai báo;
- bố cục, hierarchy, contrast, focal point, crop hoặc khả năng đọc ở kích thước thumbnail không đạt brief;
- bàn tay, khuôn mặt, edge, reflection, geometry, object lặp, gradient, shadow hoặc alpha mask có lỗi nhìn thấy;
- kích thước, format, transparency, màu, dung lượng file hoặc cách đặt tên variant không khớp contract;
- asset thiếu source hash, lineage prompt/edit, trạng thái quyền/consent, reviewer hoặc hạn dùng;
- ảnh tạo hàm ý broker, signal, lợi nhuận bảo đảm, copy trading hoặc managed trading bị cấm.

Điểm similarity tự động, OCR hay vision judge chỉ là tín hiệu chẩn đoán. Dùng kiểm tra xác định khi có thể và bắt buộc human review cho danh tính, ý nghĩa thương hiệu, hàm ý tài chính hoặc phán đoán creative cuối cùng.

## 6. Handoff Sang Video Và Kênh

Khi ảnh đi vào video, giữ `asset_id`, hash nguồn/output, reference layer hoặc mask, focal point, safe zone, animation/crop được phép, `scene_id`/`beat_id` dự kiến, hạn quyền và trạng thái review. Approval ảnh tĩnh không cấp quyền animate, render video, publish hay paid distribution.

Với variant độc lập theo kênh, giữ một asset cha và khai báo kênh, kích thước, crop, copy, vai trò CTA cùng trạng thái review của từng derivative. Không để derivative âm thầm đổi lời hứa canonical.

## 7. Ranh Giới Quyền Hạn

Contract này chỉ cho phép specification, preview, hồ sơ QA và package có thể review. Nó không cấp credential provider, ngân sách, quyền cài model, truy cập customer data, xử lý danh tính, publish, promotion hay tự động viết lại theo performance.
