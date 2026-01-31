$ErrorActionPreference = "Stop"
param (
    [Parameter(Mandatory=$true)]
    [string]$AppName
)

Write-Host "----------------------------------------"
Write-Host "☕ The Coffee Cream - Build Tool"
Write-Host "📱 App: $AppName"
Write-Host "----------------------------------------"

$appDir = "apps\$AppName"
if (!(Test-Path $appDir)) {
    Write-Error "❌ App directory not found: $appDir"
    exit 1
}

# 1. Build Web Assets
Write-Host "`n📦 1. Building Web Assets..."
Push-Location $appDir
npm run build
if ($LASTEXITCODE -ne 0) { Pop-Location; exit $LASTEXITCODE }
Pop-Location

# 2. Sync Capacitor
Write-Host "`n🔄 2. Syncing Capacitor..."
Push-Location $appDir
npx cap sync android
if ($LASTEXITCODE -ne 0) { Pop-Location; exit $LASTEXITCODE }
Pop-Location

# 3. Build APK with Gradle
Write-Host "`n🤖 3. Building Android APK..."
Push-Location "$appDir\android"
.\gradlew assembleDebug
if ($LASTEXITCODE -ne 0) { Pop-Location; exit $LASTEXITCODE }
Pop-Location

# 4. Export with Timestamp
Write-Host "`n🚀 4. Exporting to Publish directory..."
$timestamp = Get-Date -Format "yyyyMMdd_HHmm"
$sourceDir = "$appDir\android\app\build\outputs\apk\debug"
$publishDir = "publish"

# Create publish directory if it doesn't exist
if (!(Test-Path -Path $publishDir)) {
    New-Item -ItemType Directory -Path $publishDir | Out-Null
    Write-Host "Created directory: $publishDir"
}

# Find the generated APK
$apkFiles = Get-ChildItem -Path $sourceDir -Filter "*.apk" | Sort-Object LastWriteTime -Descending

if ($apkFiles) {
    $sourceApk = $apkFiles[0]
    $destFileName = "$AppName-debug-$timestamp.apk"
    $destPath = Join-Path $publishDir $destFileName
    
    Copy-Item -Path $sourceApk.FullName -Destination $destPath
    
    Write-Host "`n✅ BUILD SUCCESSFUL!"
    Write-Host "📂 APK Location: $destPath"
} else {
    Write-Error "❌ Could not find generated APK in $sourceDir"
    exit 1
}
