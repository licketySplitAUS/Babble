param(
  [string]$SourceCsv = (Join-Path $PSScriptRoot '..\..\GitHubSelfServe\SelfServeClues\public\BabbleWordList.csv')
)

$ErrorActionPreference = 'Stop'
$lengths = 4..12
$words = Import-Csv -LiteralPath $SourceCsv | ForEach-Object { $_.word.Trim().ToLowerInvariant() }
$head = '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>html{scrollbar-gutter:stable}body{margin:0;font:16px/1 ui-monospace,Consolas,"Liberation Mono",monospace;white-space:pre}</style><body>'

foreach ($length in $lengths) {
  $list = $words | Where-Object { $_.Length -eq $length }
  $output = $head + ($list -join "`n")
  [IO.File]::WriteAllText((Join-Path $PSScriptRoot "words-$length.html"), $output, [Text.UTF8Encoding]::new($false))
  Write-Host "words-$length.html: $($list.Count) words"
}
