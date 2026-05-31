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
  ".env.example",
  "vercel.json",
  "styles.css",
  "site.js",
  "research-ecosystem/index.html",
  "research-ecosystem/graph.html",
  "research-ecosystem/github-lab.html",
  "research-ecosystem/ai-handoff.html",
  "research-ecosystem/deployment.html",
  "research-ecosystem/issue-queue.html",
  "research-ecosystem/projects.html",
  "research-ecosystem/literature/index.html",
  "research-ecosystem/literature/reading-desk.html",
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
  "data/research/publication.json",
  "data/research/projects.json"
)

foreach ($file in $jsonFiles) {
  Require-JsonArray $file
}

Require-Text "research-ecosystem/literature/index.html" "data-pubmed-form"
Require-Text "research-ecosystem/literature/index.html" "data-pubmed-status"
Require-Text "research-ecosystem/literature/index.html" "retmax"
Require-Text "research-ecosystem/literature/index.html" "retstart"
Require-Text "research-ecosystem/index.html" "graph.html"
Require-Text "research-ecosystem/index.html" "github-lab.html"
Require-Text "research-ecosystem/index.html" "issue-queue.html"
Require-Text "research-ecosystem/index.html" "projects.html"
Require-Text "research-ecosystem/index.html" "deployment.html"
Require-Text "research-ecosystem/index.html" "ai-handoff.html"
Require-Text "research-ecosystem/graph.html" "data-research-graph"
Require-Text "data/research/graph.json" "pmid-42193877"
Require-Text "data/research/graph.json" "github-lab"
Require-Text "research-ecosystem/github-lab.html" "GitHub Pages"
Require-Text "research-ecosystem/github-lab.html" "tools/validate-site.ps1"
Require-Text "research-ecosystem/github-lab.html" "Research Issue Queue"
Require-Text "research-ecosystem/github-lab.html" "deployment.html"
Require-Text "research-ecosystem/github-lab.html" "ai-handoff.html"
Require-Text "research-ecosystem/ai-handoff.html" "AI Handoff Lab"
Require-Text "research-ecosystem/ai-handoff.html" "Copyable Continuation Prompt"
Require-Text "research-ecosystem/deployment.html" "GitHub Pages"
Require-Text "research-ecosystem/deployment.html" "Vercel"
Require-Text "research-ecosystem/deployment.html" "Supabase"
Require-Text "research-ecosystem/deployment.html" "Short Answer For This Website"
Require-Text "research-ecosystem/deployment.html" "Decision Checklist"
Require-Text "research-ecosystem/deployment.html" "Feature Routing Tool"
Require-Text "research-ecosystem/deployment.html" "data-deployment-advisor"
Require-Text "research-ecosystem/deployment.html" "Research Site Upgrade Path"
Require-File "research-ecosystem/translation-api.html"
Require-Text "research-ecosystem/translation-api.html" "Real Translation API Plan"
Require-Text "research-ecosystem/translation-api.html" "OPENAI_API_KEY"
Require-Text "research-ecosystem/translation-api.html" "api/deep-read.js"
Require-Text "research-ecosystem/translation-api.html" "Deployment Checklist"
Require-Text "research-ecosystem/translation-api.html" "DeepL"
Require-Text "research-ecosystem/translation-api.html" "NCBI API key"
Require-File "api/deep-read.js"
Require-Text "api/deep-read.js" "https://api.openai.com/v1/responses"
Require-Text "api/deep-read.js" "OPENAI_API_KEY"
Require-Text "api/deep-read.js" "json_schema"
Require-Text "api/deep-read.js" "openaiConfigured"
Require-Text "api/deep-read.js" "GET, POST, OPTIONS"
Require-Text "api/deep-read.js" "ALLOWED_ORIGIN"
Require-Text ".env.example" "OPENAI_MODEL"
Require-Text ".env.example" "ALLOWED_ORIGIN"
Require-Text "vercel.json" "api/deep-read.js"
Require-Text "README.md" "AI Deep Reading API"
Require-File "tools/test-ai-endpoint.ps1"
Require-Text "tools/test-ai-endpoint.ps1" "PostSample"
Require-Text "tools/test-ai-endpoint.ps1" "Invoke-RestMethod"
Require-Text "research-ecosystem/issue-queue.html" "data-issue-queue"
Require-Text "research-ecosystem/issue-queue.html" "data-issue-draft-form"
Require-Text "research-ecosystem/projects.html" "data-project-dashboard"
Require-Text "research-ecosystem/projects.html" "data-project-list"
Require-Text "research-ecosystem/literature/index.html" "data-reading-form"
Require-Text "research-ecosystem/literature/index.html" "data-reading-queue"
Require-Text "research-ecosystem/literature/index.html" "Experimental design"
Require-Text "research-ecosystem/literature/index.html" "Introduction / Background"
Require-Text "research-ecosystem/literature/index.html" "Output artifact"
Require-Text "research-ecosystem/literature/index.html" "Output language"
Require-Text "research-ecosystem/literature/index.html" "data-ai-deep-read"
Require-Text "research-ecosystem/literature/index.html" "data-ai-endpoint-form"
Require-Text "research-ecosystem/literature/index.html" "data-ai-endpoint-test"
Require-Text "research-ecosystem/literature/index.html" "Reading matrix Markdown"
Require-Text "research-ecosystem/literature/index.html" "data-download-reading"
Require-Text "research-ecosystem/literature/index.html" "data-export-html"
Require-Text "research-ecosystem/literature/index.html" "data-high-relevance"
Require-Text "research-ecosystem/literature/index.html" "reading-desk.html"
Require-Text "research-ecosystem/literature/reading-desk.html" "data-reading-desk"
Require-Text "research-ecosystem/literature/reading-desk.html" "Repository JSON"
Require-Text "research-ecosystem/literature/reading-desk.html" "GitHub Issue Draft"
Require-Text "research-ecosystem/literature/index.html" "pmid-42193877.html"
Require-Text "research-ecosystem/literature/index.html" "search-strategy-glioblastoma-immune-microenvironment.html"
Require-Text "research-ecosystem/knowledge-map/index.html" "glioblastoma-immune-microenvironment.html"
Require-Text "data/research/literature.json" "pmid-42193877"
Require-Text "data/research/knowledge.json" "glioblastoma-immune-microenvironment"
Require-Text "site.js" "eutils.ncbi.nlm.nih.gov"
Require-Text "site.js" "buildPubMedQuery"
Require-Text "site.js" "scorePaper"
Require-Text "site.js" "fetchPubMedAbstract"
Require-Text "site.js" "renderPubMedStatus"
Require-Text "site.js" "buildReadingBrief"
Require-Text "site.js" "buildReadingArtifact"
Require-Text "site.js" "buildReadingMatrixMarkdown"
Require-Text "site.js" "buildExperimentalDesignChecklist"
Require-Text "site.js" "downloadTextFile"
Require-Text "site.js" "buildRecordsHtmlExport"
Require-Text "site.js" "setupLanguageSwitcher"
Require-Text "site.js" "getReadingLanguage"
Require-Text "site.js" "requestAiDeepRead"
Require-Text "site.js" "formatAiDeepReadResult"
Require-Text "site.js" "setupAiEndpointControls"
Require-Text "site.js" "ljsdoctor:deepReadEndpoint"
Require-Text "site.js" "Endpoint online"
Require-Text "site.js" "Output language"
Require-Text "site.js" "Source Metadata"
Require-Text "site.js" "High-Signal Summary"
Require-Text "site.js" "Main Results And Evidence"
Require-Text "site.js" "buildPubMedLinkHtml"
Require-Text "site.js" "addToReadingQueue"
Require-Text "site.js" "deepReadingQueue"
Require-Text "site.js" "setupReadingDesk"
Require-Text "site.js" "buildReadingPackage"
Require-Text "site.js" "setupIssueQueue"
Require-Text "site.js" "setupProjectDashboard"
Require-Text "site.js" "setupDeploymentAdvisor"
Require-Text "site.js" "Recommended stack"
Require-Text "site.js" "data/research/projects.json"
Require-Text "site.js" "api.github.com/repos/L-js-doctor/personal-website/issues"
Require-Text "data/research/graph.json" "literature-reading-desk"
Require-Text "data/research/graph.json" "research-issue-queue"
Require-Text "data/research/graph.json" "research-project-dashboard"
Require-Text "data/research/graph.json" "ai-handoff-lab"
Require-Text "data/research/projects.json" "gbm-immune-microenvironment-project"

if ($errors.Count -gt 0) {
  Write-Error ($errors -join [Environment]::NewLine)
}

Write-Output "Site validation passed."
