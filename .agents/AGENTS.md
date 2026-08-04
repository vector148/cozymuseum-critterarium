
### Commit policy

Maximum one commit per calendar day. It is strictly forbidden to squash multiple days' work into a single commit or to create multiple commits in a single day. Before committing, always check if there is an existing commit for today. If so, amend the existing commit. If it is a new day, create a new commit.

### Commit Context & Dates

When instructed to combine content or modify an existing commit in the past, ONLY modify the content/context of the commit. DO NOT modify the original AuthorDate and ensure the CommitDate is preserved (e.g. by setting GIT_COMMITTER_DATE) unless explicitly instructed otherwise. Commits must retain their original historical timestamps.
