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
- PubMed search/import for literature records via NCBI E-utilities, including result paging and on-demand abstract retrieval
- literature deep-reading matrix outputs for introduction, research question, experimental design, methods, results, mechanism, limitations, and follow-up actions
- a Literature Reading Desk that generates Codex tasks, repository JSON, GitHub Issue drafts, and HTML note skeletons from selected papers
- repository-backed literature cards, starting with PMID 42193877
- linked knowledge nodes and reusable PubMed search strategies
- an interactive research graph backed by `data/research/graph.json`
- a Research Project Dashboard backed by `data/research/projects.json`
- a GitHub Lab page explaining Pages, repository data, Issues, validation, and Actions permission boundaries
- a Research Issue Queue that reads open GitHub Issues and generates structured task drafts
- a Deployment Architecture page explaining when GitHub Pages is enough and when Vercel/Supabase is needed
- a Vercel-ready AI deep-reading API at `api/deep-read.js` that keeps `OPENAI_API_KEY` on the server
- GitHub Issues/Projects for planning and review
- GitHub Actions or a static site generator when the site becomes large enough

## AI Deep Reading API

The public GitHub Pages site can generate local deep-reading artifacts without secrets. Real AI translation and paper deep reading needs a backend.

Deployment route:

1. Import this repository into Vercel.
2. Add `OPENAI_API_KEY` in Vercel Project Settings -> Environment Variables.
3. Optional: set `OPENAI_MODEL` to change the model without editing code. The example default is `gpt-5.4`.
4. Deploy the project.
5. If the visible site stays on GitHub Pages, paste the Vercel endpoint into Literature Lab:
   `https://your-vercel-project.vercel.app/api/deep-read`
6. If the whole site runs on Vercel, the default same-site endpoint `/api/deep-read` works.

Never commit real API keys. `.env.example` is only a template.

## Validation

Run the repository validation locally:

```powershell
  powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\validate-site.ps1
```

The GitHub Actions workflow is prepared under `.github/workflows/`. Publishing workflow files through the GitHub API requires a token with the `workflow` scope, so this can be enabled later when you explicitly want that permission.

The root `.nojekyll` file tells GitHub Pages to publish this as a plain static site without Jekyll processing.
