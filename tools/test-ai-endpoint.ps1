param(
  [Parameter(Mandatory = $true)]
  [string] $Endpoint,

  [switch] $PostSample
)

$ErrorActionPreference = "Stop"

Write-Host "Testing AI endpoint health..."
$health = Invoke-RestMethod -Method Get -Uri $Endpoint
$health | ConvertTo-Json -Depth 6

if (-not $health.ok) {
  throw "Endpoint did not report ok=true."
}

if (-not $health.openaiConfigured) {
  Write-Warning "Endpoint is online, but OPENAI_API_KEY is not configured."
}

if ($PostSample) {
  Write-Host "Sending sample deep-reading request..."
  $body = @{
    id = "sample"
    title = "Sample glioblastoma immune microenvironment paper"
    abstract = "This is a short sample abstract used only to verify that the API can return a structured literature deep-reading response."
    goal = "Test whether the backend can summarize experimental design, methods, limitations, and follow-up actions."
    mode = "research"
    language = "zh"
  } | ConvertTo-Json -Depth 6

  $result = Invoke-RestMethod -Method Post -Uri $Endpoint -ContentType "application/json" -Body $body
  $result | ConvertTo-Json -Depth 10
}
