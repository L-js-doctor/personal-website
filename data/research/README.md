# Research Data

This folder is the repository-backed data layer for the research ecosystem.

The website can read these JSON files as seed data. Browser-entered records are saved locally first, then can be exported and imported back into this folder with Codex's help.

## Files

- `literature.json` - paper notes and reading queue records
- `knowledge.json` - medical concepts and mechanism nodes
- `notebook.json` - dated research and study logs
- `data-tools.json` - datasets, scripts, tables, and tool documentation
- `publication.json` - outputs, abstracts, posters, reviews, and portfolio records
- `graph.json` - cross-links among papers, knowledge nodes, search strategies, workflows, and outputs

## Workflow

1. Add records in the website tool.
2. Search PubMed from the literature page when a record starts from a paper.
3. Export JSON from the tool page.
4. Ask Codex to import the exported JSON into this folder.
5. Codex commits and publishes the updated repository.

## PubMed Integration

The literature page uses NCBI E-utilities:

- ESearch finds PubMed IDs from a targeted query.
- ESummary retrieves title, journal, publication date, authors, and PMID metadata.
- Selected records can be saved into the browser-local literature library, exported, and imported into this folder.

The website does not store GitHub or OpenAI tokens in front-end code. Repository writes should happen through Codex-assisted commits or GitHub workflows.
