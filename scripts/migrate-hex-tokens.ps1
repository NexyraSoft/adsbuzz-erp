# migrate-hex-tokens.ps1
# Replaces arbitrary hex Tailwind classes with the new design tokens.
# Run from project root: .\scripts\migrate-hex-tokens.ps1
$ErrorActionPreference = 'Stop'

# Map of {pattern: replacement} - order matters (longer/more specific first)
$replacements = @(
  # === Brand Blue ===
  @{ Pattern = 'text-[#0c4275]/65';          Replace = 'text-brand-blue-deep/65' }
  @{ Pattern = 'text-[#0c4275]/70';          Replace = 'text-brand-blue-deep/70' }
  @{ Pattern = 'text-[#0c4275]/75';          Replace = 'text-brand-blue-deep/75' }
  @{ Pattern = 'text-[#0c4275]/80';          Replace = 'text-brand-blue-deep/80' }
  @{ Pattern = 'text-[#0c4275]';             Replace = 'text-brand-blue-deep' }
  @{ Pattern = 'bg-[#0c4275]';               Replace = 'bg-brand-blue-deep' }
  @{ Pattern = 'border-[#0c4275]';           Replace = 'border-brand-blue-deep' }
  @{ Pattern = 'text-[#1F5E98]';             Replace = 'text-brand-blue' }
  @{ Pattern = 'bg-[#1F5E98]';               Replace = 'bg-brand-blue' }
  @{ Pattern = 'border-[#1F5E98]';           Replace = 'border-brand-blue' }
  @{ Pattern = 'ring-[#1F5E98]';             Replace = 'ring-brand-blue' }
  @{ Pattern = 'from-[#1F5E98]';             Replace = 'from-brand-blue' }
  @{ Pattern = 'dark:text-[#1F5E98]';        Replace = 'dark:text-brand-blue' }
  @{ Pattern = 'dark:bg-[#1F5E98]';          Replace = 'dark:bg-brand-blue' }
  @{ Pattern = 'text-[#154A7D]';             Replace = 'text-brand-blue-dark' }
  @{ Pattern = 'bg-[#154A7D]';               Replace = 'bg-brand-blue-dark' }
  @{ Pattern = 'border-[#154A7D]';           Replace = 'border-brand-blue-dark' }
  @{ Pattern = 'dark:text-[#154A7D]';        Replace = 'dark:text-brand-blue-dark' }
  @{ Pattern = 'dark:bg-[#154A7D]';          Replace = 'dark:bg-brand-blue-dark' }
  @{ Pattern = 'text-[#1F5F98]';             Replace = 'text-brand-blue' }
  @{ Pattern = 'bg-[#1F5F98]';               Replace = 'bg-brand-blue' }
  @{ Pattern = 'border-[#1F5F98]';           Replace = 'border-brand-blue' }

  # === Brand Orange ===
  @{ Pattern = 'bg-[#F68B2D]';               Replace = 'bg-brand-orange' }
  @{ Pattern = 'text-[#F68B2D]';             Replace = 'text-brand-orange' }
  @{ Pattern = 'border-[#F68B2D]';           Replace = 'border-brand-orange' }
  @{ Pattern = 'ring-[#F68B2D]';             Replace = 'ring-brand-orange' }
  @{ Pattern = 'from-[#F68B2D]';             Replace = 'from-brand-orange' }
  @{ Pattern = 'to-[#F68B2D]';               Replace = 'to-brand-orange' }
  @{ Pattern = 'bg-[#e07920]';               Replace = 'bg-brand-orange-dark' }
  @{ Pattern = 'hover:bg-[#e07920]';         Replace = 'hover:bg-brand-orange-dark' }
  @{ Pattern = 'to-[#e07920]';               Replace = 'to-brand-orange-dark' }
  @{ Pattern = 'dark:from-[#e07920]';        Replace = 'dark:from-brand-orange-dark' }
  @{ Pattern = 'dark:to-[#e07920]';          Replace = 'dark:to-brand-orange-dark' }
  @{ Pattern = 'ring-[#e07920]';             Replace = 'ring-brand-orange-dark' }

  # === Status green deep ===
  @{ Pattern = 'text-[#0a5c3a]/65';          Replace = 'text-status-green-deep/65' }
  @{ Pattern = 'text-[#0a5c3a]/70';          Replace = 'text-status-green-deep/70' }
  @{ Pattern = 'text-[#0a5c3a]/75';          Replace = 'text-status-green-deep/75' }
  @{ Pattern = 'text-[#0a5c3a]';             Replace = 'text-status-green-deep' }
  @{ Pattern = 'bg-[#0a5c3a]';               Replace = 'bg-status-green-deep' }
  @{ Pattern = 'border-[#0a5c3a]';           Replace = 'border-status-green-deep' }

  # === Surface tints ===
  @{ Pattern = 'bg-[#FCFEFF]';               Replace = 'bg-surface' }
  @{ Pattern = 'dark:bg-[#FCFEFF]';          Replace = 'dark:bg-surface' }
  @{ Pattern = 'bg-[#F0F7FF]';               Replace = 'bg-surface-blue' }
  @{ Pattern = 'dark:bg-[#F0F7FF]';          Replace = 'dark:bg-surface-blue' }
  @{ Pattern = 'bg-[#F7FBFF]';               Replace = 'bg-surface-blue-light' }
  @{ Pattern = 'bg-[#F1FBF5]';               Replace = 'bg-surface-green' }
  @{ Pattern = 'dark:bg-[#F1FBF5]';          Replace = 'dark:bg-surface-green' }
  @{ Pattern = 'bg-[#FFF7ED]';               Replace = 'bg-surface-orange' }
  @{ Pattern = 'dark:bg-[#FFF7ED]';          Replace = 'dark:bg-surface-orange' }
  @{ Pattern = 'bg-[#FFF1F2]';               Replace = 'bg-surface-rose' }
  @{ Pattern = 'dark:bg-[#FFF1F2]';          Replace = 'dark:bg-surface-rose' }

  # === Border tints ===
  @{ Pattern = 'border-[#CFE1F5]';           Replace = 'border-border-blue' }
  @{ Pattern = 'dark:border-[#CFE1F5]';      Replace = 'dark:border-border-blue' }
  @{ Pattern = 'border-[#D8E6F3]';           Replace = 'border-border-blue-light' }
  @{ Pattern = 'dark:border-[#D8E6F3]';      Replace = 'dark:border-border-blue-light' }
  @{ Pattern = 'border-[#CFEBDD]';           Replace = 'border-border-green' }
  @{ Pattern = 'dark:border-[#CFEBDD]';      Replace = 'dark:border-border-green' }
  @{ Pattern = 'border-[#FBD9B9]';           Replace = 'border-border-orange' }
  @{ Pattern = 'dark:border-[#FBD9B9]';      Replace = 'dark:border-border-orange' }
  @{ Pattern = 'border-[#F8D6DC]';           Replace = 'border-border-rose' }
  @{ Pattern = 'dark:border-[#F8D6DC]';      Replace = 'dark:border-border-rose' }
  @{ Pattern = 'border-[#E6EEF6]';           Replace = 'border-border-blue-light' }

  # === App & sidebar ===
  @{ Pattern = 'bg-[#F8F5F0]';               Replace = 'bg-app-bg' }
  @{ Pattern = 'bg-[#131926]';               Replace = 'bg-sidebar-navy' }
)

$files = Get-ChildItem -Path "src" -Recurse -Include *.tsx,*.ts | Where-Object { $_.FullName -notmatch 'node_modules' }

$totalChanges = 0
foreach ($f in $files) {
  $content = Get-Content $f.FullName -Raw
  $origContent = $content
  $fileChanges = 0
  foreach ($r in $replacements) {
    $count = ([regex]::Matches($content, [regex]::Escape($r.Pattern))).Count
    if ($count -gt 0) {
      $content = $content.Replace($r.Pattern, $r.Replace)
      $fileChanges += $count
    }
  }
  if ($content -ne $origContent) {
    Set-Content -Path $f.FullName -Value $content -NoNewline
    $totalChanges += $fileChanges
    Write-Host "  $($f.Name): $fileChanges changes"
  }
}
Write-Host "`nTotal changes: $totalChanges"
