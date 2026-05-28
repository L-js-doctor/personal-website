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
  "styles.css",
  "site.js",
  "research-ecosystem/index.html",
  "research-ecosystem/literature/index.html",
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
Require-Text "research-ecosystem/literature/index.html" "data-reading-form"
Require-Text "research-ecosystem/literature/index.html" "data-high-relevance"
Require-Text "site.js" "eutils.ncbi.nlm.nih.gov"
Require-Text "site.js" "buildPubMedQuery"
Require-Text "site.js" "scorePaper"
Require-Text "site.js" "buildReadingBrief"

if ($errors.Count -gt 0) {
  Write-Error ($errors -join [Environment]::NewLine)
}

Write-Output "Site validation passed."
