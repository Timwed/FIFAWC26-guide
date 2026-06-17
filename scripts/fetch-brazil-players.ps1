# Batch fetch Wikipedia data for all Brazil players
param(
  [string]$Team = "Brazil"
)

$teamDir = "temp-players/$Team"
New-Item -ItemType Directory -Path $teamDir -Force | Out-Null

$names = @(
  "Alisson Becker",
  "Éderson Silva",
  "Gabriel Magalhães",
  "Marquinhos",
  "Casemiro",
  "Alex Sandro",
  "Vinícius Júnior",
  "Bruno Guimarães",
  "Matheus Cunha",
  "Neymar",
  "Raphinha",
  "Weverton",
  "Danilo Luiz da Silva",
  "Bremer",
  "Léo Pereira",
  "Douglas Santos",
  "Fabinho",
  "Danilo Santos",
  "Endrick",
  "Lucas Paquetá",
  "Luiz Henrique",
  "Gabriel Martinelli",
  "Ederson Moraes",
  "Roger Ibañez",
  "Igor Thiago",
  "Rayan"
)

$header = @{
  "User-Agent" = "FIFAWC26Guide/1.0 (educational project)"
}

# Batch 5 per request using query+revisions
$batchSize = 5
for ($i = 0; $i -lt $names.Count; $i += $batchSize) {
  $batch = $names[$i..([Math]::Min($i + $batchSize - 1, $names.Count - 1))]
  $titles = ($batch | ForEach-Object { "`"$_`"" }) -join "|"
  $titles = $batch -join "|"
  $encoded = [System.Web.HttpUtility]::UrlEncode($titles)

  $urlExtracts = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=1&explaintext=1&titles=$encoded&origin=*"
  $urlRevisions = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=revisions&rvprop=content&rvslots=main&titles=$encoded&origin=*"

  Write-Output "Fetching batch $($i+1)-$([Math]::Min($i+$batchSize,$names.Count)): $titles"

  try {
    $extracts = Invoke-WebRequest -Uri $urlExtracts -Headers $header -TimeoutSec 30 | ConvertFrom-Json
    $revisions = Invoke-WebRequest -Uri $urlRevisions -Headers $header -TimeoutSec 30 | ConvertFrom-Json

    foreach ($name in $batch) {
      $safeName = $name -replace '[\\/:*?"<>|]', '_'
      $filePath = "$teamDir/${safeName}_raw.json"

      $raw = @{
        name = $name
        extracts = $extracts
        revisions = $revisions
      }

      $raw | ConvertTo-Json -Depth 10 | Out-File -FilePath $filePath -Encoding UTF8
      Write-Output "  Saved: $name"
    }
  } catch {
    Write-Output "  ERROR batch $($i+1): $_"
  }

  Start-Sleep -Seconds 2
}

Write-Output "Done fetching $Team players."
