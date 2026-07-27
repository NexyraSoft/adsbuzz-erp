$files = Get-ChildItem -Path "src\components" -Recurse -Include *.tsx | Where-Object { $_.FullName -notmatch '\\ui\\' }
$report = @()
foreach ($f in $files) {
    $content = Get-Content $f.FullName -Raw
    $matches = [regex]::Matches($content, '(?s)<button\b[^>]*?>.*?</button>')
    foreach ($m in $matches) {
        $block = $m.Value
        $hasIcon = $block -match 'lucide|<svg|<img\s'
        $hasAria = $block -match 'aria-label'
        if ($hasIcon -and -not $hasAria) {
            $textContent = ($block -replace '<[^>]+>', '').Trim() -replace '\s+', ' '
            if ($textContent.Length -lt 8) {
                $startIdx = $m.Index
                $lineNum = ($content.Substring(0, $startIdx) -split "`n").Count
                $snippet = ($block -replace '\s+', ' ').Trim().Substring(0, [Math]::Min(160, $block.Length))
                $report += [PSCustomObject]@{ File = $f.Name; Line = $lineNum; Text = $textContent; Snippet = $snippet }
            }
        }
    }
}
$report | Format-Table -AutoSize -Wrap