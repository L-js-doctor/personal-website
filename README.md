# Personal Website

This is L-js-doctor's personal website and learning portal.

It is a static site that can be opened directly in a browser or hosted with GitHub Pages.

## Files

- `index.html` - homepage content
- `styles.css` - responsive styling
- `assets/hero-study-workspace.png` - generated hero image
- `medical-learning/` - medical study HTML notes
- `coding-practice/` - coding practice and technical notes
- `project-archive/` - project pages and portfolio records
- `research-ecosystem/` - research hub for literature, knowledge maps, notebooks, tools, and publication records
- `site.js` - small progressive interactions for static pages

## Next Ideas

- Add a study notes section
- Add a project portfolio page
- Add a blog page
- Publish with GitHub Pages

## Research Ecosystem Direction

The long-term goal is to turn this site into a research learning ecosystem:

- literature notes and citation trails
- medical knowledge maps
- research notebook entries
- data and tool documentation
- publication and portfolio pages
- local browser tools for adding, searching, deleting, and exporting research records
- PubMed search/import for literature records via NCBI E-utilities
- literature deep-reading briefs that can be handed to Codex for structured HTML notes
- repository-backed literature cards, starting with PMID 42193877
- linked knowledge nodes and reusable PubMed search strategies
- an interactive research graph backed by `data/research/graph.json`
- GitHub Issues/Projects for planning and review
- GitHub Actions or a static site generator when the site becomes large enough

## Validation

Run the repository validation locally:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\validate-site.ps1
```

The GitHub Actions workflow is prepared under `.github/workflows/`. Publishing workflow files through the GitHub API requires a token with the `workflow` scope, so this can be enabled later when you explicitly want that permission.
