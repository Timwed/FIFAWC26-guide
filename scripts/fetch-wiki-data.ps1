<#
.SYNOPSIS
  Fetch Wikipedia team/player data, save as local JSON
  Requires internet access to Wikipedia (e.g. VPN)
#>

$ErrorActionPreference = 'SilentlyContinue'
$dataDir = Join-Path $PSScriptRoot '..\src\data'
$teamNames = Get-Content (Join-Path $PSScriptRoot 'team-names.json') -Raw -Encoding UTF8 | ConvertFrom-Json -AsHashtable

function Fetch-WikiExtract {
  param([string]$Title, [string]$Base = 'https://en.m.wikipedia.org')
  $encoded = [Uri]::EscapeDataString($Title)
  $url = "$Base/w/api.php?action=query&titles=$encoded&prop=extracts&exintro=true&exsentences=5&explaintext=true&format=json"
  try {
    $resp = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 8
    $data = $resp.Content | ConvertFrom-Json
    $pages = $data.query.pages
    $page = $pages.PSObject.Properties.Value | Select-Object -First 1
    if ($page.missing -ne $null) { return $null }
    if (-not $page.extract) { return $null }
    if ($page.extract -match '\u91cd\u5b9a\u5411|redirect') { return $null }
    $lang = if ($Base -match 'zh') { 'zh' } else { 'en' }
    return @{ title = $page.title; extract = $page.extract; lang = $lang }
  } catch { return $null }
}

# === Teams ===
Write-Host '=== Updating team bios ===' -ForegroundColor Cyan
$teamsFile = Join-Path $dataDir 'wiki-teams.json'
$teams = @{}
if (Test-Path $teamsFile) { $teams = Get-Content $teamsFile -Raw -Encoding UTF8 | ConvertFrom-Json -AsHashtable }
$teamUpdated = 0

foreach ($enName in $teamNames.Keys) {
  if ($teams[$enName] -and $teams[$enName].extract -and $teams[$enName].extract.Length -gt 50) {
    Write-Host "  [skip] $enName" -ForegroundColor DarkGray; continue
  }
  Write-Host -NoNewline "  [fetch] $enName ... "
  $result = Fetch-WikiExtract -Title "$enName national football team"
  if (-not $result) {
    $zhName = $teamNames[$enName]
    $result = Fetch-WikiExtract -Title $zhName -Base 'https://zh.m.wikipedia.org'
  }
  if ($result) {
    $teams[$enName] = $result; $teamUpdated++
    Write-Host "OK ($($result.lang), $($result.extract.Length)chars)" -ForegroundColor Green
  } else { Write-Host 'FAILED' -ForegroundColor Red }
  Start-Sleep -Milliseconds 500
}
$teams | ConvertTo-Json -Depth 3 | Set-Content $teamsFile -Encoding UTF8
Write-Host "`nTeams saved. Updated: $teamUpdated" -ForegroundColor Yellow

# === Players ===
Write-Host "`n=== Updating player bios ===" -ForegroundColor Cyan
$playersFile = Join-Path $dataDir 'wiki-players.json'
$players = @{}
if (Test-Path $playersFile) { $players = Get-Content $playersFile -Raw -Encoding UTF8 | ConvertFrom-Json -AsHashtable }

$tsdbBase = 'https://www.thesportsdb.com/api/v1/json/123'
$teamsRes = Invoke-WebRequest "$tsdbBase/search_all_teams.php?l=FIFA_World_Cup" -UseBasicParsing -TimeoutSec 15
$teamsList = ($teamsRes.Content | ConvertFrom-Json).teams
$playerUpdated = 0
$teamCount = 0

foreach ($team in $teamsList) {
  $teamCount++
  Write-Host "`n[$teamCount/$($teamsList.Count)] $($team.strTeam)" -ForegroundColor Cyan
  try {
    $pRes = Invoke-WebRequest "$tsdbBase/lookup_all_players.php?id=$($team.idTeam)" -UseBasicParsing -TimeoutSec 10
    $pData = $pRes.Content | ConvertFrom-Json
    $playerList = $pData.player; if (-not $playerList) { $playerList = $pData.players }
    if (-not $playerList) { Write-Host '  No player data' -ForegroundColor DarkGray; continue }
  } catch { Write-Host '  Failed to get player list' -ForegroundColor Red; continue }
  Start-Sleep -Milliseconds 300

  $fetched = 0
  foreach ($p in $playerList) {
    if ($fetched -ge 15) { break }
    $name = $p.strPlayer
    if ($players[$name] -and $players[$name].extract -and $players[$name].extract.Length -gt 50) {
      Write-Host "  [skip] $name" -ForegroundColor DarkGray; continue
    }
    Write-Host -NoNewline "  [fetch] $name ... "
    $result = Fetch-WikiExtract -Title $name
    if ($result) {
      $players[$name] = $result; $playerUpdated++; $fetched++
      Write-Host "OK ($($result.lang))" -ForegroundColor Green
    } else { Write-Host 'FAIL' -ForegroundColor Red }
    Start-Sleep -Milliseconds 600
  }
}
$players | ConvertTo-Json -Depth 3 | Set-Content $playersFile -Encoding UTF8
Write-Host "`nPlayers saved. Updated: $playerUpdated" -ForegroundColor Yellow
Write-Host "`nDone!" -ForegroundColor Green
