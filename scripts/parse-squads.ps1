$wikitext = [System.IO.File]::ReadAllText("$PSScriptRoot\squads-wikitext.txt", [System.Text.Encoding]::UTF8)

$currentGroup = ""
$currentTeam = ""
$currentCoach = ""
$inSquad = $false
$players = @()
$teams = @()

foreach ($line in $wikitext -split "\r?\n") {
    if ($line -match '^==Group (\S+)==') {
        $currentGroup = $matches[1]
        continue
    }
    if ($line -match '^===([^=]+)====?$') {
        $currentTeam = $matches[1].Trim()
        $currentCoach = ""
        $players = @()
        $inSquad = $false
        continue
    }
    if ($line -match '^Coach:\s*(.+)$') {
        $coach = $matches[1].Trim()
        $coach = $coach -replace '\{\{[^}]+\}\}', ''
        $coach = $coach -replace '\[\[|\]\]', ''
        $coach = $coach.Trim()
        $currentCoach = $coach
        continue
    }
    if ($line -match '\{\{nat fs g start\}') {
        $inSquad = $true
        continue
    }
    if ($line -match '\{\{nat fs end\}') {
        if ($currentTeam -and $players.Count -gt 0) {
            $teams += @{
                name = $currentTeam
                group = $currentGroup
                coach = $currentCoach
                players = $players
            }
        }
        $inSquad = $false
        $players = @()
        continue
    }
    if ($inSquad -and $line -match '\{\{nat fs g player') {
        $no = ""
        $pos = ""
        $name = ""
        $caps = 0
        $goals = 0
        $club = ""
        $age = 0
        
        if ($line -match '\|no=([^|]+)') { $no = $matches[1] }
        if ($line -match '\|pos=([^|]+)') { $pos = $matches[1] }
        if ($line -match '\|name=\[\[([^\]|]+)(?:\|([^\]]+))?\]\]') { 
            $name = if ($matches[2]) { $matches[2] } else { $matches[1] }
        }
        if ($line -match '\|caps=(\d+)') { $caps = [int]$matches[1] }
        if ($line -match '\|goals=(\d+)') { $goals = [int]$matches[1] }
        if ($line -match '\|club=\[\[([^\]|]+)(?:\|([^\]]+))?\]\]') {
            $club = if ($matches[2]) { $matches[2] } else { $matches[1] }
        }
        
        # Calculate age from birth date: {{birth date and age2|2026|6|11|2000|5|17}}
        if ($line -match '\|age=\{\{birth date and age2\|(\d+)\|(\d+)\|(\d+)\|(\d+)\|(\d+)\|(\d+)\}\}') {
            $age_temp = [int]$matches[4]  # birth year
            $refYear = 2026
            $refMonth = 6
            $refDay = 11
            $age = $refYear - $age_temp
            if ([int]$matches[5] -gt $refMonth -or ([int]$matches[5] -eq $refMonth -and [int]$matches[6] -gt $refDay)) {
                $age--
            }
        }
        
        $players += @{
            number = $no
            position = $pos
            name = $name
            age = $age
            caps = $caps
            goals = $goals
            club = $club
        }
    }
}

$json = $teams | ConvertTo-Json -Depth 4
[System.IO.File]::WriteAllText("$PSScriptRoot\..\src\data\squads.json", $json, [System.Text.UTF8Encoding]::new($false))
Write-Host "Teams: $($teams.Count)"
$totalPlayers = 0
foreach ($t in $teams) { $totalPlayers += $t.players.Count }
Write-Host "Total players: $totalPlayers"
Write-Host "First: $($teams[0].players[0].name), Age: $($teams[0].players[0].age)"
