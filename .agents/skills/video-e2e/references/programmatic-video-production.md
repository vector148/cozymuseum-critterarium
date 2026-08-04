# Programmatic Video Production Reference

This reference converts an approved Video E2E brief into a deterministic production contract. It adapts operating principles—not copied code—from the revision-locked MIT sources in `company/01-commercial-cco/knowledge/source-register.md`.

## 1. Source Roles

| Source | Principle adopted |
| --- | --- |
| Motion Canvas | Component-driven scenes, deterministic timing, voice-over synchronization, preview, rendering, and end-to-end testing |
| MoviePy | Cuts, concatenation, compositing, effects, frame inspection, and output validation |
| Editly | Declarative edit specifications, clip/layer structure, aspect variants, audio mixing, subtitles, and render logs |
| Revideo | Typed dynamic inputs, reusable templates, preview, headless/parallel rendering, frame extraction, and audio synchronization |
| OpenAI Whisper | Multilingual transcription, language detection, timestamped transcript input, and explicit model limitations |
| ffsubsync | Measurable alignment between spoken audio and subtitle activity |

These sources do not select Atumerce's render engine. They define production invariants that remain valid if the implementation changes.

## 2. Canonical Scene And Timeline Manifest

Create one versioned manifest after script/storyboard approval and before expensive rendering. Each scene must include:

- `scene_id`, `beat_id`, and ordered `sequence`;
- `claim_ids`, `canonical_source_version`, and `brief_version`;
- `component_type`: `hook`, `context`, `mechanism`, `evidence`, `example`, `objection`, `transition`, or `cta`;
- `start_frame`, `end_frame`, `fps`, and computed `duration_ms`;
- `visual_job`, `narration_ref`, `on_screen_text_ref`, `caption_ref`, and `asset_refs`;
- `aspect_safe_zones`, `transition_in`, `transition_out`, and accessibility notes;
- `asset_rights_state`, `review_state`, `variant_of`, and content hash.

Keep semantic timing—claims, beats, and audience questions—separate from provider or render-engine syntax. A renderer adapter may consume the manifest; it may not redefine its meaning.

## 3. Timeline Invariants

Reject the package before rendering when:

- a scene has `end_frame <= start_frame`;
- an undeclared gap or overlap exists;
- FPS, resolution, aspect ratio, duration, language, or audio target is missing;
- a factual scene lacks an approved claim ID;
- an asset lacks origin, rights state, hash, or expiry;
- narration, on-screen text, and captions disagree on the claim;
- a derivative silently changes the hook, evidence strength, CTA, or canonical meaning.

Lock frame rate, resolution, aspect ratio, fonts, asset hashes, caption policy, audio loudness target, and export codec per output variant.

## 4. Review And Render Gates

1. **Semantic gate:** the hook matches the approved promise; every factual statement maps to evidence; illustrative material is labeled.
2. **Rights gate:** every visual, font, voice, music, and footage asset has a permitted use state.
3. **Capability/cost gate:** the chosen specialist route can deliver the required format, language, quality, region, and bounded cost.
4. **Preview gate:** low-cost preview passes scene order, timing, legibility, safe-zone, and claim review.
5. **Render gate:** a human authorizes the exact manifest version and output set.
6. **Output QA gate:** verify duration, frame continuity, black/frozen frames, audio/video synchronization, loudness, caption timing, contrast, safe zones, aspect variants, metadata, hashes, and render logs.
7. **Publish handoff:** package evidence is handed off; Video E2E does not gain publish or paid-distribution authority.

## 5. Retention Learning

Post-release evidence must map back to stable production identifiers:

- expectation match during the opening;
- dip, spike, replay, skip, completion, and CTA moments;
- `scene_id`, `beat_id`, frame range, audience segment, channel, and sample window;
- competing explanations and confidence;
- one proposed change with the expected metric and guardrail.

A spike does not prove comprehension and a dip does not prove a bad scene. Return a reviewed learning packet to CRO; only an approved Planning decision may change the next brief.

## 6. Authority Boundary

This reference authorizes specification and review artifacts only. It does not authorize provider calls, model spend, generation, render, publication, promotion, customer-data access, or automatic rewriting from retention data.

---

# Tham Chiếu Sản Xuất Video Lập Trình Hóa

Tài liệu này chuyển video brief đã duyệt thành hợp đồng sản xuất có thể tái lập. Nó điều chỉnh các nguyên tắc vận hành—không sao chép code—từ những nguồn MIT đã khóa revision trong `company/01-commercial-cco/knowledge/source-register.md`.

## 1. Vai Trò Của Nguồn

| Nguồn | Nguyên tắc được áp dụng |
| --- | --- |
| Motion Canvas | Scene theo component, timing xác định, đồng bộ voice-over, preview, render và kiểm thử end-to-end |
| MoviePy | Cắt, nối, compositing, effect, kiểm tra frame và xác minh output |
| Editly | Edit specification dạng khai báo, cấu trúc clip/layer, variant aspect, trộn audio, subtitle và render log |
| Revideo | Dynamic input có kiểu, template tái sử dụng, preview, render headless/song song, trích frame và đồng bộ audio |
| OpenAI Whisper | Transcription đa ngôn ngữ, nhận diện ngôn ngữ, transcript có timestamp và công khai giới hạn model |
| ffsubsync | Đo được độ khớp giữa âm thanh lời nói và hoạt động của subtitle |

Các nguồn này không chọn render engine cho Atumerce. Chúng xác lập invariant sản xuất vẫn đúng khi implementation thay đổi.

## 2. Manifest Scene Và Timeline Canonical

Tạo một manifest có version sau khi script/storyboard được duyệt và trước render tốn kém. Mỗi scene bắt buộc có:

- `scene_id`, `beat_id` và `sequence` có thứ tự;
- `claim_ids`, `canonical_source_version` và `brief_version`;
- `component_type`: `hook`, `context`, `mechanism`, `evidence`, `example`, `objection`, `transition` hoặc `cta`;
- `start_frame`, `end_frame`, `fps` và `duration_ms` được tính ra;
- `visual_job`, `narration_ref`, `on_screen_text_ref`, `caption_ref` và `asset_refs`;
- `aspect_safe_zones`, `transition_in`, `transition_out` và ghi chú accessibility;
- `asset_rights_state`, `review_state`, `variant_of` và content hash.

Tách timing ngữ nghĩa—claim, beat và câu hỏi của audience—khỏi cú pháp của provider hay render engine. Renderer adapter được phép đọc manifest nhưng không được định nghĩa lại ý nghĩa của nó.

## 3. Invariant Timeline

Từ chối package trước render khi:

- scene có `end_frame <= start_frame`;
- tồn tại gap hoặc overlap không được khai báo;
- thiếu FPS, resolution, aspect ratio, duration, language hoặc audio target;
- scene factual thiếu claim ID đã duyệt;
- asset thiếu nguồn gốc, trạng thái quyền, hash hoặc hạn dùng;
- narration, on-screen text và caption diễn đạt claim không nhất quán;
- derivative âm thầm đổi hook, độ mạnh evidence, CTA hoặc ý nghĩa canonical.

Khóa frame rate, resolution, aspect ratio, font, asset hash, caption policy, audio loudness target và export codec cho từng output variant.

## 4. Gate Review Và Render

1. **Gate ngữ nghĩa:** hook khớp lời hứa đã duyệt; mọi phát biểu factual nối tới evidence; nội dung minh họa được gắn nhãn.
2. **Gate quyền:** mọi visual, font, voice, music và footage có trạng thái sử dụng được phép.
3. **Gate năng lực/chi phí:** route chuyên dụng đáp ứng format, language, quality, region và cost có giới hạn.
4. **Gate preview:** preview chi phí thấp pass thứ tự scene, timing, độ đọc được, safe zone và claim review.
5. **Gate render:** con người duyệt đúng manifest version và output set.
6. **Gate QA output:** xác minh duration, liên tục frame, frame đen/đóng băng, đồng bộ audio/video, loudness, caption timing, contrast, safe zone, aspect variant, metadata, hash và render log.
7. **Handoff publish:** bàn giao package kèm evidence; Video E2E không tự có quyền publish hay paid distribution.

## 5. Học Từ Retention

Evidence sau release phải map ngược về identifier sản xuất ổn định:

- mức khớp kỳ vọng ở phần mở đầu;
- thời điểm dip, spike, replay, skip, completion và CTA;
- `scene_id`, `beat_id`, frame range, audience segment, channel và sample window;
- các cách giải thích cạnh tranh cùng confidence;
- một thay đổi đề xuất kèm expected metric và guardrail.

Spike không tự chứng minh comprehension và dip không tự chứng minh scene kém. Trả learning packet đã review cho CRO; chỉ quyết định Planning đã duyệt mới được đổi brief kế tiếp.

## 6. Ranh Giới Quyền Hạn

Tài liệu này chỉ cho phép tạo specification và review artifact. Nó không cấp quyền gọi provider, chi model, generate, render, publish, promotion, đọc customer data hay tự động viết lại nội dung từ retention data.
