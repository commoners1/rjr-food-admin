# Cleanup script for admin-web - Remove old ERP/HR features
# Run this from the project root: .\apps\admin-web\cleanup.ps1

$dashboardPath = "apps\admin-web\src\app\(dashboard)"

# Directories to remove
$dirsToRemove = @(
    "benefits",
    "division",
    "inventory",
    "job-order",
    "leave",
    "location",
    "master-data",
    "medical",
    "overtime",
    "reimbursement",
    "salary",
    "timesheet",
    "users",
    "workflow"
)

Write-Host "Cleaning up admin-web old ERP/HR features..." -ForegroundColor Yellow

foreach ($dir in $dirsToRemove) {
    $fullPath = Join-Path $dashboardPath $dir
    if (Test-Path $fullPath) {
        Write-Host "Removing: $dir" -ForegroundColor Red
        Remove-Item -Recurse -Force $fullPath -ErrorAction SilentlyContinue
    }
}

# Remove old settings/company-profile
$companyProfilePath = Join-Path $dashboardPath "settings\company-profile"
if (Test-Path $companyProfilePath) {
    Write-Host "Removing: settings/company-profile" -ForegroundColor Red
    Remove-Item -Recurse -Force $companyProfilePath -ErrorAction SilentlyContinue
}

Write-Host "`nCleanup completed!" -ForegroundColor Green
Write-Host "`nRemaining pages (food ordering related):" -ForegroundColor Cyan
Write-Host "  - Dashboard (page.tsx)" -ForegroundColor Green
Write-Host "  - Orders" -ForegroundColor Green
Write-Host "  - Menu" -ForegroundColor Green
Write-Host "  - Banner" -ForegroundColor Green
Write-Host "  - Media" -ForegroundColor Green
Write-Host "  - KDS" -ForegroundColor Green
Write-Host "  - Reviews" -ForegroundColor Green
Write-Host "  - Attendance" -ForegroundColor Green
Write-Host "  - Finance" -ForegroundColor Green
Write-Host "  - Profile" -ForegroundColor Green
Write-Host "  - Settings/General" -ForegroundColor Green

