param([switch]$Resume)

$ErrorActionPreference = "Continue"
$baseDir = Split-Path -Parent $PSCommandPath
$tmpDir = Join-Path $baseDir "..\temp-players"
if (-not (Test-Path $tmpDir)) { New-Item -ItemType Directory -Path $tmpDir -Force | Out-Null }

$squads = Get-Content -LiteralPath (Join-Path $baseDir "..\src\data\squads.json") -Raw -Encoding UTF8 | ConvertFrom-Json
$players = ($squads | Where-Object { $_.name -eq "Argentina" })[0].players
$headers = @{ "User-Agent" = "FIFAWC26Guide/1.0" }
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

Write-Host "=== Phase 1: Batch fetch extracts for all 26 ==="
$names = ($players | ForEach-Object { [uri]::EscapeDataString($_.name) }) -join "|"
$url = "https://en.m.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=true&explaintext=true&format=json&origin=*&titles=$names"
$r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30 -Headers $headers
$d = $r.Content | ConvertFrom-Json
$pages = $d.query.pages.PSObject.Properties.Value
$extracts = @{}
foreach ($pg in $pages) { $extracts[$pg.title] = $pg.extract }
Write-Host "Got extracts for $($extracts.Count) players"
Start-Sleep -Seconds 3

Write-Host "=== Phase 2: Batch fetch wikitext (5 at a time) ==="
$batchSize = 5
for ($i = 0; $i -lt $players.Count; $i += $batchSize) {
    $batch = $players[$i..([Math]::Min($i + $batchSize - 1, $players.Count - 1))]
    $batchNames = ($batch | ForEach-Object { [uri]::EscapeDataString($_.name) }) -join "|"
    
    Write-Host "Batch $($i/$($players.Count)): $batchNames"
    
    $url = "https://en.m.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&origin=*&titles=$batchNames"
    try {
        $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30 -Headers $headers
        $d = $r.Content | ConvertFrom-Json
        $bpages = $d.query.pages.PSObject.Properties.Value
        
        foreach ($pg in $bpages) {
            if (-not $pg.revisions) { continue }
            $wikitext = $pg.revisions[0].'*'
            $safeName = $pg.title -replace '[^a-zA-Z0-9]', '_'
            $wikiFile = Join-Path $tmpDir "${safeName}_wiki.json"
            [System.IO.File]::WriteAllText($wikiFile, $wikitext, [System.Text.UTF8Encoding]::new($false))
            
            $extract = if ($extracts.ContainsKey($pg.title)) { $extracts[$pg.title] } else { "" }
            $raw = @{
                name = $pg.title
                extract = $extract
            }
            $rawFile = Join-Path $tmpDir "${safeName}_raw.json"
            $raw | ConvertTo-Json -Depth 2 | Out-File -LiteralPath $rawFile -Encoding UTF8
            
            Write-Host "  OK: $($pg.title) (ext:$($extract.Length))"
        }
    } catch {
        Write-Host "  FAIL: $_"
        # If rate limited, save what we've processed and try to continue after a long pause
        if ($_.Exception.Message -match "too many") {
            Write-Host "  RATE LIMITED - waiting 30s..."
            Start-Sleep -Seconds 30
            $i -= $batchSize  # Retry this batch
        }
    }
    
    Start-Sleep -Seconds 4
}

Write-Host "Done!"
