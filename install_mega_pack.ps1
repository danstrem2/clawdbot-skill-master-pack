
$files = @("skills_list_all.json", "skills_list_newest.json", "skills_list_trending.json")
$allSlugs = @()

foreach ($file in $files) {
    if (Test-Path $file) {
        $json = Get-Content $file | ConvertFrom-Json
        foreach ($item in $json.items) {
            $allSlugs += $item.slug
        }
    }
}

$uniqueSlugs = $allSlugs | Select-Object -Unique
$installedSkills = Get-ChildItem -Path "skills" -Directory | Select-Object -ExpandProperty Name

$toInstall = $uniqueSlugs | Where-Object { $installedSkills -notcontains $_ }

Write-Host "Total de slugs únicos encontrados: $($uniqueSlugs.Count)"
Write-Host "Já instalados: $($installedSkills.Count)"
Write-Host "Novas skills para baixar: $($toInstall.Count)"

$count = 0
foreach ($slug in $toInstall) {
    $count++
    Write-Host "[$count/$($toInstall.Count)] Instalando: $slug..."
    npx clawhub@latest install $slug --force
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Erro ao instalar $slug"
    }
    # Limitar a mais 200 novas para não estender demais
    if ($count -ge 200) { break }
}

Write-Host "Processo concluído!"
