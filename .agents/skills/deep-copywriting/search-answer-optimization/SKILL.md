---
name: search-answer-optimization
description: Optimize approved Atumerce canonical copy for people-first SEO and evidence-grounded AI-answer discovery across Google Search and AI features, Bing/Copilot, and ChatGPT Search. Use for search intent, page purpose, answer passages, entities, titles/snippets, internal links, citation readiness, content-side structured-data requirements, and post-publish discovery measurement; route technical implementation to Operations.
---

# Search & Answer Optimization (SEO/AEO)

Operate as a child of **Deep Copywriting**, not as a parallel Planning skill. Read `../SKILL.md` and `references/modern-search-doctrine.md`. Receive an approved on-page contract from Omnichannel Planning, then make the reviewed canonical text useful to a person, understandable to search systems, and safe to quote in an answer.

SEO and AI-answer optimization share one web foundation: discoverable pages, clear purpose, useful original content, explicit evidence, consistent entities, and honest measurement. Do not create separate “Google copy” and “AI copy,” assume every AI system depends only on Google, or promise indexing, ranking, citation, or traffic.

## Required inputs

Require the approved `insight_id`, `canonical_id`, source version, page purpose, primary audience and journey stage, query family and intent, evidence pack, claim ledger, canonical draft, proposed URL, internal-link context, review owner, measurement contract, and expiry/revalidation condition. For financial or trading content, also require named author/reviewer responsibility, product-truth evidence, source dates, limitations, and forbidden claims.

Stop and return a blocker when the page duplicates an existing purpose, evidence cannot support the intended answer, the source is expired, the requested query is outside Atumerce's product truth, or a technical decision lacks an Operations handoff.

## Senior execution loop

1. **Lock the retrieval job.** State the audience problem, journey stage, primary query family, intent, decision moment, page purpose, expected useful outcome, and the existing page that would compete for the same purpose. Treat keyword volume, difficulty, CPC, and tool scores as noisy estimates—not truth.
2. **Build the answer and evidence spine.** Map every material statement to a claim ID and dated source. Lead with the smallest accurate direct answer, then explain mechanism, evidence, boundary, uncertainty, and the next useful action. For YMYL content, make `who`, `how`, and `why` visible; never convert experience, founder opinion, or inference into proof.
3. **Shape natural semantic coverage.** Use the language people use, including necessary synonyms, entities, relationships, and subquestions. Organize headings by reader logic and accessibility—not fixed keyword density, word count, heading length, or one-H1 folklore. Remove keyword stuffing, empty FAQ blocks, generic AI padding, and passages that merely restate other sources.
4. **Create citation-ready answer units.** Make important passages understandable outside their surrounding paragraph: name the subject, answer one question, attach evidence or a limitation, and avoid dangling pronouns or unsupported absolutes. Use lists, tables, definitions, examples, images, or video only when they improve understanding. Preserve entity and claim consistency across formats.
5. **Package search presentation.** Provide descriptive title and main-heading hypotheses, a truthful meta-description hypothesis, useful URL/slug guidance, image alt/caption requirements, and contextual internal-link anchors. There are no fixed pass/fail character counts; preview truncation and query-dependent rewriting are presentation constraints, not writing formulas.
6. **Control duplication and lineage.** Prefer one canonical page per purpose. Recommend merge, redirect, canonical, update, or archive when pages collide; do not describe ordinary duplication as an automatic penalty. Every derivative must point back to the canonical claim/source lineage.
7. **Issue the technical handoff.** Record requirements for crawlability, indexability, rendering, status codes, canonical/hreflang, sitemap `lastmod`, robots/meta preview controls, structured data that matches visible content, Core Web Vitals, and crawler policy. Team01 specifies the observable requirement; Operations owns implementation and verification. `robots.txt` is crawl control, not a guaranteed deindexing tool.
8. **Define discovery learning.** Record Google Search performance with AI-feature traffic included unless the platform exposes a valid split; do not fabricate separate attribution. Track Bing/Copilot citations, ChatGPT Search referrals, engaged reading, journey progression, and consent-safe conversion only where observable. Record baseline, window, query/page cohort, citation/referral evidence, confounders, and stop condition. Send outcome evidence to CRO; do not claim causality from rank, impressions, clicks, or citations alone.

## Output contract

Return one versioned **Search & Answer Package** containing:

- `insight_id`, `canonical_id`, source version, page purpose, audience, journey stage, query family, intent, and competing-page decision;
- approved canonical text with claim/evidence lineage and citation-ready answer units;
- title, main-heading, snippet/meta, URL, semantic coverage, internal-link, image/alt/caption, author/reviewer, freshness, and limitation requirements;
- duplicate/canonical decision and a content-side structured-data candidate that exactly matches visible content;
- an **Operations technical handoff** with owner, acceptance evidence, and unresolved crawl/index/render/performance risks;
- a measurement contract for classic search, AI-answer discovery, engagement, and downstream business outcome; and
- review verdict: `ready_for_review`, `blocked_evidence`, `blocked_product_truth`, `blocked_technical_handoff`, `merge_existing_page`, or `reject`.

## Hard gates

- **People-first gate:** the page must solve a real audience job even without search traffic.
- **Evidence gate:** important claims are traceable, current enough, and explicit about uncertainty.
- **YMYL gate:** financial stability is affected, so trust, author/reviewer accountability, limitations, and No-Guru rules are mandatory.
- **Retrieval gate:** the direct answer and supporting passages remain clear when quoted with minimal context.
- **Integrity gate:** no scaled-content abuse, doorway pages, cloaking, hidden text, keyword stuffing, link schemes, fake freshness, fabricated reviews, or fake schema.
- **Authority gate:** the skill cannot publish, alter production SEO controls, build links through spam, disavow links by default, or grant crawler access.

## Bản Tiếng Việt

Vận hành như một child skill của **Deep Copywriting**, không phải một skill Planning song song. Đọc `../SKILL.md` và `references/modern-search-doctrine.md`. Nhận hợp đồng on-page đã duyệt từ Omnichannel Planning, sau đó làm cho canonical text đã review trở nên hữu ích với con người, dễ hiểu với hệ thống tìm kiếm và an toàn khi được trích vào câu trả lời.

SEO và tối ưu câu trả lời AI dùng chung một nền web: page có thể được khám phá, mục đích rõ, nội dung hữu ích và nguyên bản, evidence minh bạch, entity nhất quán và phép đo trung thực. Không tạo riêng “copy cho Google” và “copy cho AI”, không giả định mọi hệ AI chỉ phụ thuộc Google, và không hứa được index, xếp hạng, trích dẫn hay có traffic.

### Đầu vào bắt buộc

Phải có `insight_id`, `canonical_id`, phiên bản nguồn, mục đích page, audience chính và journey stage, query family và intent, evidence pack, claim ledger, canonical draft, URL đề xuất, bối cảnh internal link, owner review, measurement contract và điều kiện hết hạn/xác minh lại đã duyệt. Với nội dung tài chính hoặc giao dịch, còn phải có trách nhiệm author/reviewer có tên, evidence về product truth, ngày nguồn, limitation và claim bị cấm.

Dừng và trả blocker khi page trùng mục đích với page hiện có, evidence không đủ đỡ câu trả lời dự kiến, nguồn đã hết hạn, query yêu cầu vượt product truth của Atumerce hoặc quyết định kỹ thuật chưa có handoff sang Operations.

### Vòng thực thi cấp senior

1. **Khóa retrieval job.** Nêu vấn đề của audience, journey stage, query family chính, intent, decision moment, mục đích page, kết quả hữu ích dự kiến và page hiện có sẽ tranh cùng mục đích. Xem volume, difficulty, CPC và điểm từ tool là ước lượng nhiễu, không phải sự thật.
2. **Dựng xương sống câu trả lời và evidence.** Gắn mọi phát biểu quan trọng với claim ID và nguồn có ngày. Mở đầu bằng câu trả lời trực tiếp nhỏ nhất nhưng chính xác, sau đó giải thích cơ chế, evidence, boundary, uncertainty và hành động hữu ích tiếp theo. Với nội dung YMYL, phải làm rõ `ai`, `làm bằng cách nào` và `vì sao`; tuyệt đối không biến trải nghiệm, ý kiến founder hay suy luận thành proof.
3. **Tạo semantic coverage tự nhiên.** Dùng ngôn ngữ người đọc thực sự dùng cùng synonym, entity, quan hệ và subquestion cần thiết. Tổ chức heading theo logic người đọc và accessibility, không theo keyword density, số từ, độ dài heading hay giáo điều chỉ được có một H1. Xóa keyword stuffing, FAQ rỗng, phần đệm AI chung chung và đoạn chỉ kể lại nguồn khác.
4. **Tạo answer unit sẵn sàng để trích dẫn.** Làm cho passage quan trọng vẫn hiểu được khi tách khỏi đoạn xung quanh: gọi đúng chủ thể, trả lời một câu hỏi, gắn evidence hoặc limitation, tránh đại từ lơ lửng và khẳng định tuyệt đối thiếu căn cứ. Chỉ dùng list, table, definition, example, image hay video khi chúng giúp hiểu rõ hơn. Giữ entity và claim nhất quán xuyên các format.
5. **Đóng gói phần hiển thị tìm kiếm.** Cung cấp giả thuyết title và main heading mô tả đúng nội dung, giả thuyết meta description trung thực, hướng dẫn URL/slug hữu ích, yêu cầu alt/caption của hình và anchor internal link theo ngữ cảnh. Không có số ký tự pass/fail cố định; việc cắt ngắn và viết lại theo query là ràng buộc trình bày, không phải công thức viết.
6. **Kiểm soát trùng lặp và lineage.** Ưu tiên một canonical page cho mỗi mục đích. Đề xuất merge, redirect, canonical, update hoặc archive khi page xung đột; không gọi trùng lặp thông thường là hình phạt tự động. Mọi derivative phải trỏ về lineage claim/nguồn canonical.
7. **Phát hành handoff kỹ thuật.** Ghi yêu cầu về crawlability, indexability, rendering, status code, canonical/hreflang, sitemap `lastmod`, robots/meta preview control, structured data khớp visible content, Core Web Vitals và crawler policy. Team01 nêu yêu cầu quan sát được; Operations sở hữu việc triển khai và xác minh. `robots.txt` điều khiển crawl, không bảo đảm deindex.
8. **Định nghĩa vòng học discovery.** Ghi hiệu suất Google Search với traffic AI feature nằm chung, trừ khi nền tảng cung cấp phép tách hợp lệ; cấm bịa attribution riêng. Chỉ track citation Bing/Copilot, referral ChatGPT Search, engaged reading, journey progression và conversion an toàn theo consent khi quan sát được. Ghi baseline, window, cohort query/page, evidence citation/referral, confounder và stop condition. Gửi outcome evidence cho CRO; không suy diễn nhân quả chỉ từ rank, impression, click hay citation.

### Hợp đồng đầu ra

Trả một **Search & Answer Package** có phiên bản, gồm:

- `insight_id`, `canonical_id`, phiên bản nguồn, mục đích page, audience, journey stage, query family, intent và quyết định về page cạnh tranh;
- canonical text đã duyệt với lineage claim/evidence và answer unit sẵn sàng để trích dẫn;
- yêu cầu về title, main heading, snippet/meta, URL, semantic coverage, internal link, image/alt/caption, author/reviewer, freshness và limitation;
- quyết định duplicate/canonical và structured-data candidate phía content khớp hoàn toàn với visible content;
- **Operations technical handoff** có owner, evidence chấp nhận và rủi ro crawl/index/render/performance chưa giải quyết;
- measurement contract cho search truyền thống, AI-answer discovery, engagement và business outcome downstream; cùng
- verdict review: `ready_for_review`, `blocked_evidence`, `blocked_product_truth`, `blocked_technical_handoff`, `merge_existing_page` hoặc `reject`.

### Gate cứng

- **People-first gate:** page phải giải quyết một công việc thật của audience kể cả khi không có search traffic.
- **Evidence gate:** claim quan trọng phải truy vết được, đủ mới và nói rõ uncertainty.
- **YMYL gate:** nội dung ảnh hưởng ổn định tài chính nên trust, trách nhiệm author/reviewer, limitation và luật No-Guru là bắt buộc.
- **Retrieval gate:** direct answer và passage hỗ trợ vẫn phải rõ khi được trích với rất ít ngữ cảnh.
- **Integrity gate:** cấm scaled-content abuse, doorway page, cloaking, hidden text, keyword stuffing, link scheme, fake freshness, review giả và schema giả.
- **Authority gate:** skill không được publish, đổi SEO control production, tạo backlink spam, disavow link mặc định hay tự cấp quyền crawler.
