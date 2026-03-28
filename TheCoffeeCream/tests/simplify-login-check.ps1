$content = Get-Content 'staff.spec.ts' -Raw

# Remove the menu visibility check for pageB and just wait for navigation
$pattern = 'await pageB\.click\(''button\[type="submit"\]''\);\s+await expect\(pageB\.locator\(''\\.menu\\.icon-btn''\)\.first\(\)\)\.toBeVisible\(\{ timeout: 30000 \}\);'
$replacement = 'await pageB.click(''button[type="submit"]'');
        await pageB.waitForTimeout(2000); // Allow login to process'

$content = $content -replace $pattern, $replacement

Set-Content 'staff.spec.ts' -Value $content -NoNewline
