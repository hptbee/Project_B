$content = Get-Content 'staff.spec.ts' -Raw
$content = $content -replace [regex]::Escape("const warning = pageA.locator('.toast-warning, .notification-warning, .modal:has-text(`"Warning`"), text=/Warning|Cảnh báo/i').first();"), "const warning = pageA.getByText(/Warning|Cảnh báo|session|phiên/i).first();"
$content = $content -replace [regex]::Escape("const accessDenied = pageA.locator('.access-denied, .modal:has-text(`"Access Denied`"), text=/Access Denied|Không có quyền/i').first();"), "const accessDenied = pageA.getByText(/Access Denied|Không có quyền|logged out|khác đăng nhập/i).first();"
Set-Content 'staff.spec.ts' -Value $content -NoNewline
