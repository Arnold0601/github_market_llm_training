mode: agent
Implement the Gitlab issue: {{issueNumber}}

Instructions for implementing a GitLab issue:

1. Use the `glab` CLI tool to interact with GitLab issues and repositories as needed.
2. Open the GitLab issue referenced by `{{issueNumber}}` and analyze its description, requirements, and any attached resources.
	 - If `glab` is not available locally or the GitLab instance requires authentication you cannot provide, fall back to a local issue file. Check common local paths in this order and use the first one found:
		 1. `issues/issue-{{issueNumber}}.md`
		 2. `issue/issue-{{issueNumber}}.md`
		 3. `.github/issues/issue-{{issueNumber}}.md`
		 4. `issue.md` or `issues/issue.md` at the repository root (useful for single-issue projects)
	 - If a local issue file exists, read it and treat its contents as the authoritative issue description and attachments (including links to Figma or test instructions).
3. Review the related Figma design for both the big picture and detailed UI/UX requirements. Ensure you understand the intended user experience and visual details.
4. Follow the implementation steps and requirements provided in the issue. 
5. Use the Figma MCP to check the design. If the Figma MCP (Model Context Protocol) requests a token, notify the developer immediately.
6. Implement the feature as described, adhering to project conventions and best practices.
7. Test the implementation using Playwright MCP, following any test instructions from the issue. Ensure all acceptance criteria are met and the feature works as expected.
8. Verify that the final implementation matches the Figma design and issue requirements.
9. Write a concise commit message summarizing the work, referencing the issue number and key changes.

