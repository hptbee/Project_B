$content = Get-Content 'staff.spec.ts' -Raw
# Fix the selector to match actual modal text
$content = $content -replace 'const accessDenied = pageA\.getByText\(/Access Denied.*?first\(\);', 'const sessionModal = pageA.getByText(/Đăng xuất bắt buộc|thiết bị khác|Forced logout|another device/i).first();'
# Update variable name in assertion
$content = $content -replace 'await expect\(accessDenied\)\.toBeVisible', 'await expect(sessionModal).toBeVisible'
Set-Content 'staff.spec.ts' -Value $content -NoNewline
