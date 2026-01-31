
$allSkills = (Get-Content "skills_list_all.json" | ConvertFrom-Json).items
$installedSkills = Get-ChildItem -Path "skills" -Directory | Select-Object -ExpandProperty Name

$toInstall = $allSkills | Where-Object { $installedSkills -notcontains $_.slug }

Write-Host "Encontradas $($allSkills.Count) skills no total."
Write-Host "Já existem $($installedSkills.Count) skills instaladas."
Write-Host "Faltam $($toInstall.Count) novas skills para instalar."

$count = 0
foreach ($skill in $toInstall) {
    $count++
    $slug = $skill.slug
    Write-Host "[$count/$($toInstall.Count)] Instalando nova skill: $slug..."
    npx clawhub@latest install $slug --force
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Falha ao instalar $slug"
    }
}

Write-Host "Todas as skills solicitadas foram processadas!"
