# Campaign Plan Contract

## Contents

1. Overview
2. Target Audience
3. Market Research
4. SWOT And Constraints
5. Master Plan
6. Content Guideline
7. Calendar And Capacity
8. Sources And Measurement
9. Status And Validation Rules
10. Plan Readiness Score

Use this contract for Google Sheets, Excel workbooks, documents, or Admin views. Keep one `campaign_id` across every view.

## View 1 - Overview

Required fields:

- campaign ID, title, class (`strategic_campaign` or `operational_communication`), status, owner, phase, period, expiry;
- business objective and desired customer decision change;
- scope statement, exclusions, cash ceiling, founder-time ceiling;
- founder `insight_id` and approval state, or the approved operational source and exception reason;
- product/capability version and claim boundary, or explicit brand-only/education-only scope;
- Atumerce Brand DNA link, selected product/capability, version, limitation;
- primary persona, market, language, canonical surface;
- review owners and stop condition.

Do not duplicate the full Brand DNA. Link to it and record only campaign-specific interpretation.

## View 2 - Target Audience

Columns:

`priority | persona | decision moment | job | friction | evidence need | objection | channel behaviour | supporting evidence | contradiction | confidence | next test`

Use one primary persona. The three working hypotheses are Evidence-Led Analyst, Senior Operator, and Systems Builder; evidence may confirm, revise, split, or reject them.

## View 3 - Market Research

Use two sections.

### Evidence register

`claim_id | observation | source | date | geography | limitation | confidence | expiry | allowed use`

### Competitor and alternative matrix

`dimension | Atumerce | alternative 1..n`

Compare customer job, audience, promise, proof, limitation, trust mechanism, acquisition path, retention mechanism, strength, weakness, and response doctrine. Distinguish named competitors from substitutes and doing nothing.

## View 4 - SWOT And Constraints

Columns:

`type | evidence-backed statement | implication | action | owner | gate/date`

Types: strength, weakness, opportunity, threat, capacity constraint, privacy constraint, phase constraint, product constraint, and review constraint.

## View 5 - Master Plan

Columns:

`timeline | objective | decision event | primary persona | insight_id/source_id | stage | market clock | audience clock | product/release clock | strategic approach | big idea | key message | knowledge pillar | campaign role | tactic | activity | evidence | canonical asset | channel | budget/time | metric | stop rule | review decision | owner | status`

One row may represent a bounded campaign wave, not an isolated social post.

## View 6 - Content Guideline

Columns:

`pillar | campaign role | audience moment | message boundary | required proof | allowed wording | forbidden leap | tone | visual logic | format | channel rule | CTA | accessibility | media rights | reviewer`

Keep English terms only when operationally useful; add Vietnamese in parentheses for founder-facing workbooks.

## View 7 - Calendar And Capacity

Columns:

`publish window | review deadline | working title | campaign/stage | pillar/role | key message | source package | format | visual | channel | language | owner | reviewer | founder minutes | production hours | cost | CTA | status | outcome`

Schedule the canonical asset before derivatives. Empty dates are allowed. Add recovery space and expiry/revalidation dates.

## View 8 - Sources And Measurement

Columns:

`source/metric ID | type | URL or event | claim/question supported | date | limitation/confounder | consent posture | baseline | target or learning threshold | owner | review date | decision`

This view may be hidden for presentation but must remain available for audit.

## Status And Validation Rules

- No unexplained blank in a required field.
- Use `unknown`, `not applicable`, or a named blocker instead of visual whitespace.
- Preserve hyperlinks behind short display text.
- Wrap long text and keep columns compact enough for normal-screen review.
- Freeze the title/header area and keep status/owner visible.
- Do not merge data cells. Restrict merges to title bands.
- Record the source and last-updated date for every material external fact.
- Re-read the exact target ranges after writing a workbook or Sheet.

## Plan Readiness Score

Score 0-2 for:

1. founder insight integrity or a valid operational exception;
2. audience specificity;
3. evidence quality;
4. Brand DNA fit;
5. product truth or an explicit non-product boundary;
6. privacy and consent;
7. channel fit;
8. qualified action;
9. learning value;
10. operating capacity.

Maximum 20. Below 14: do not scale. Zero in evidence, Brand DNA, product truth/boundary, or privacy: block publication.

## Phiên Bản Tiếng Việt

### Nội dung

1. Tổng quan
2. Target Audience
3. Market Research
4. SWOT Và Constraint
5. Master Plan
6. Content Guideline
7. Calendar Và Capacity
8. Source Và Measurement
9. Luật Status Và Validation
10. Điểm sẵn sàng của plan

Dùng contract này cho Google Sheets, Excel workbook, document hoặc Admin view. Giữ một `campaign_id` xuyên mọi view.

### View 1 - Tổng quan

Field bắt buộc:

- campaign ID, title, class (`strategic_campaign` hoặc `operational_communication`), status, owner, phase, period, expiry;
- business objective và thay đổi quyết định khách hàng mong muốn;
- scope statement, exclusion, cash ceiling, founder-time ceiling;
- `insight_id` founder và trạng thái duyệt, hoặc operational source đã duyệt cùng exception reason;
- product/capability version và claim boundary, hoặc scope brand-only/education-only rõ ràng;
- link Brand DNA Atumerce, product/capability được chọn, version, limitation;
- persona chính, market, language, canonical surface;
- review owner và stop condition.

Không chép lại toàn bộ Brand DNA. Chỉ link tới nó và ghi cách diễn giải riêng của campaign.

### View 2 - Target Audience

Column:

`priority | persona | decision moment | job | friction | evidence need | objection | channel behaviour | supporting evidence | contradiction | confidence | next test`

Dùng một persona chính. Ba hypothesis làm việc là Evidence-Led Analyst, Senior Operator và Systems Builder; evidence có thể xác nhận, sửa, tách hoặc bác bỏ chúng.

### View 3 - Market Research

Dùng hai phần.

#### Evidence register

`claim_id | observation | source | date | geography | limitation | confidence | expiry | allowed use`

#### Ma trận competitor và alternative

`dimension | Atumerce | alternative 1..n`

So sánh customer job, audience, promise, proof, limitation, trust mechanism, acquisition path, retention mechanism, strength, weakness và response doctrine. Tách named competitor khỏi substitute và lựa chọn không làm gì.

### View 4 - SWOT Và Constraint

Column:

`type | evidence-backed statement | implication | action | owner | gate/date`

Type gồm strength, weakness, opportunity, threat, capacity constraint, privacy constraint, phase constraint, product constraint và review constraint.

### View 5 - Master Plan

Column:

`timeline | objective | decision event | primary persona | insight_id/source_id | stage | market clock | audience clock | product/release clock | strategic approach | big idea | key message | knowledge pillar | campaign role | tactic | activity | evidence | canonical asset | channel | budget/time | metric | stop rule | review decision | owner | status`

Một row có thể đại diện một campaign wave có giới hạn, không phải một social post đơn lẻ.

### View 6 - Content Guideline

Column:

`pillar | campaign role | audience moment | message boundary | required proof | allowed wording | forbidden leap | tone | visual logic | format | channel rule | CTA | accessibility | media rights | reviewer`

Chỉ giữ thuật ngữ tiếng Anh khi hữu ích cho vận hành; thêm tiếng Việt trong ngoặc cho workbook hướng founder.

### View 7 - Calendar Và Capacity

Column:

`publish window | review deadline | working title | campaign/stage | pillar/role | key message | source package | format | visual | channel | language | owner | reviewer | founder minutes | production hours | cost | CTA | status | outcome`

Schedule canonical asset trước derivative. Được phép để date trống. Thêm recovery space và expiry/revalidation date.

### View 8 - Source Và Measurement

Column:

`source/metric ID | type | URL or event | claim/question supported | date | limitation/confounder | consent posture | baseline | target or learning threshold | owner | review date | decision`

View này có thể ẩn khi presentation nhưng phải luôn sẵn sàng cho audit.

### Luật status và validation

- Không để ô required trống mà không giải thích.
- Dùng `unknown`, `not applicable` hoặc blocker có tên thay cho khoảng trắng.
- Giữ hyperlink phía sau display text ngắn.
- Wrap text dài và giữ column đủ gọn để review trên màn hình thường.
- Freeze khu title/header và giữ status/owner dễ thấy.
- Không merge data cell; chỉ merge title band.
- Ghi source và ngày cập nhật cuối cho mọi external fact quan trọng.
- Đọc lại đúng target range sau khi ghi workbook hoặc Sheet.

### Điểm sẵn sàng của plan

Chấm 0-2 cho:

1. toàn vẹn founder insight hoặc operational exception hợp lệ;
2. độ cụ thể audience;
3. chất lượng evidence;
4. độ khớp Brand DNA;
5. product truth hoặc non-product boundary rõ;
6. privacy và consent;
7. độ khớp channel;
8. qualified action;
9. learning value;
10. operating capacity.

Tối đa 20. Dưới 14: không scale. Điểm 0 ở evidence, Brand DNA, product truth/boundary hoặc privacy: block publication.
