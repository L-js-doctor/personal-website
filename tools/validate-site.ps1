$ErrorActionPreference = "Stop"

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$errors = New-Object System.Collections.Generic.List[string]

function Require-File {
  param([string] $Path)
  $fullPath = Join-Path $root $Path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    $errors.Add("Missing file: $Path")
  }
}

function Require-Text {
  param([string] $Path, [string] $Pattern)
  $fullPath = Join-Path $root $Path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    $errors.Add("Missing file for text check: $Path")
    return
  }
  $content = Get-Content -LiteralPath $fullPath -Raw
  if ($content -notmatch [regex]::Escape($Pattern)) {
    $errors.Add("Missing text in ${Path}: $Pattern")
  }
}

function Require-JsonArray {
  param([string] $Path)
  $fullPath = Join-Path $root $Path
  if (-not (Test-Path -LiteralPath $fullPath)) {
    $errors.Add("Missing JSON file: $Path")
    return
  }
  try {
    $json = Get-Content -LiteralPath $fullPath -Raw | ConvertFrom-Json
    if ($null -eq $json -or $json.GetType().Name -ne "Object[]") {
      $errors.Add("JSON must be an array: $Path")
    }
  }
  catch {
    $errors.Add("Invalid JSON: $Path")
  }
}

$requiredFiles = @(
  "index.html",
  ".nojekyll",
  "styles.css",
  "site.js",
  "research-ecosystem/index.html",
  "research-ecosystem/graph.html",
  "research-ecosystem/github-lab.html",
  "research-ecosystem/literature/index.html",
  "research-ecosystem/literature/pmid-42193877.html",
  "research-ecosystem/literature/search-strategy-glioblastoma-immune-microenvironment.html",
  "research-ecosystem/knowledge-map/glioblastoma-immune-microenvironment.html",
  "research-ecosystem/knowledge-map/index.html",
  "research-ecosystem/notebook/index.html",
  "research-ecosystem/data-tools/index.html",
  "research-ecosystem/publication/index.html",
  ".github/ISSUE_TEMPLATE/literature-deep-reading.md",
  ".github/ISSUE_TEMPLATE/research-data-import.md"
)

foreach ($file in $requiredFiles) {
  Require-File $file
}

$jsonFiles = @(
  "data/research/literature.json",
  "data/research/knowledge.json",
  "data/research/notebook.json",
  "data/research/data-tools.json",
  "data/research/publication.json"
)

foreach ($file in $jsonFiles) {
  Require-JsonArray $file
}

Require-Text "research-ecosystem/literature/index.html" "data-pubmed-form"
Require-Text "research-ecosystem/index.html" "graph.html"
Require-Text "research-ecosystem/index.html" "github-lab.html"
Require-Text "research-ecosystem/graph.html" "data-research-graph"
Require-Text "data/research/graph.json" "pmid-42193877"
Require-Text "data/research/graph.json" "github-lab"
Require-Text "research-ecosystem/github-lab.html" "GitHub Pages"
Require-Text "research-ecosystem/github-lab.html" "tools/validate-site.ps1"
Require-Text "research-ecosystem/literature/index.html" "data-reading-form"
Require-Text "research-ecosystem/literature/index.html" "data-high-relevance"
Require-Text "research-ecosystem/literature/index.html" "pmid-42193877.html"
Require-Text "research-ecosystem/literature/index.html" "search-strategy-glioblastoma-immune-microenvironment.html"
Require-Text "research-ecosystem/knowledge-map/index.html" "glioblastoma-immune-microenvironment.html"
Require-Text "data/research/literature.json" "pmid-42193877"
Require-Text "data/research/knowledge.json" "glioblastoma-immune-microenvironment"
Require-Text "site.js" "eutils.ncbi.nlm.nih.gov"
Require-Text "site.js" "buildPubMedQuery"
Require-Text "site.js" "scorePaper"
Require-Text "site.js" "buildReadingBrief"

if ($errors.Count -gt 0) {
  Write-Error ($errors -join [Environment]::NewLine)
}

Write-Output "Site validation passed."
