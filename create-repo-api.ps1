# GitHub Repository Creation using REST API
param(
    [string]$RepoName = "beauty-mvp",
    [string]$Description = "どうなりたいかドリブン美容MVP Webアプリ",
    [string]$Visibility = "public"
)

# GitHub Personal Access Token
$Token = "YOUR_GITHUB_TOKEN_HERE"

# GitHub API headers
$headers = @{
    "Authorization" = "Bearer $Token"
    "Accept" = "application/vnd.github.v3+json"
    "User-Agent" = "PowerShell"
}

# Repository creation payload
$body = @{
    name = $RepoName
    description = $Description
    private = ($Visibility -eq "private")
    auto_init = $false
} | ConvertTo-Json

try {
    Write-Host "Creating GitHub repository using REST API..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method POST -Headers $headers -Body $body -ContentType "application/json"
    
    Write-Host "Repository created successfully!" -ForegroundColor Green
    Write-Host "Repository URL: $($response.html_url)" -ForegroundColor Cyan
    Write-Host "Clone URL: $($response.clone_url)" -ForegroundColor Cyan
    
    # Add remote repository
    Write-Host "Adding remote repository..." -ForegroundColor Yellow
    git remote add origin $response.clone_url
    
    # Push to GitHub
    Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
    git push -u origin main
    
    Write-Host "GitHub repository creation and push completed!" -ForegroundColor Green
    Write-Host "Repository URL: $($response.html_url)" -ForegroundColor Cyan
    
} catch {
    Write-Host "Error occurred:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "Authentication error: Invalid Personal Access Token" -ForegroundColor Red
    } elseif ($_.Exception.Response.StatusCode -eq 422) {
        Write-Host "Repository may already exist or validation failed" -ForegroundColor Red
    } elseif ($_.Exception.Response.StatusCode -eq 403) {
        Write-Host "Permission denied: Token may not have repository creation rights" -ForegroundColor Red
    }
}
