# Database Explorer Script - View Your Quiz Data

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   Database Explorer - Your Quiz Data  " -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if Docker is running
try {
    docker ps | Out-Null
} catch {
    Write-Host "ERROR: Docker is not running. Please start Docker Desktop.`n" -ForegroundColor Red
    exit 1
}

Write-Host "POSTGRESQL DATABASE" -ForegroundColor Yellow
Write-Host "===================`n" -ForegroundColor Yellow

# Show recent quiz sessions
Write-Host "[Recent Quiz Sessions]" -ForegroundColor Green
docker exec personality-quiz-db psql -U quiz_user -d personality_quiz -c "SELECT id, theme, status, current_round, total_rounds, TO_CHAR(started_at, 'YYYY-MM-DD HH24:MI:SS') as started FROM quiz_sessions ORDER BY started_at DESC LIMIT 5;" 2>$null
Write-Host ""

# Show character types
Write-Host "[Available Characters]" -ForegroundColor Green
docker exec personality-quiz-db psql -U quiz_user -d personality_quiz -c "SELECT name, theme FROM character_types ORDER BY name;" 2>$null
Write-Host ""

# Show trait dimensions
Write-Host "[Trait Dimensions]" -ForegroundColor Green
docker exec personality-quiz-db psql -U quiz_user -d personality_quiz -c "SELECT code, name FROM trait_dimensions ORDER BY display_order;" 2>$null
Write-Host ""

# Count total data
Write-Host "[Database Statistics]" -ForegroundColor Green
$sessionCount = docker exec personality-quiz-db psql -U quiz_user -d personality_quiz -t -c "SELECT COUNT(*) FROM quiz_sessions;" 2>$null
$responseCount = docker exec personality-quiz-db psql -U quiz_user -d personality_quiz -t -c "SELECT COUNT(*) FROM user_responses;" 2>$null
$characterCount = docker exec personality-quiz-db psql -U quiz_user -d personality_quiz -t -c "SELECT COUNT(*) FROM character_types;" 2>$null

Write-Host "  Total Quiz Sessions: $($sessionCount.Trim())" -ForegroundColor Gray
Write-Host "  Total User Responses: $($responseCount.Trim())" -ForegroundColor Gray
Write-Host "  Total Characters: $($characterCount.Trim())" -ForegroundColor Gray
Write-Host ""

Write-Host "REDIS CACHE" -ForegroundColor Yellow
Write-Host "===========`n" -ForegroundColor Yellow

# Show active sessions in Redis
Write-Host "[Active Sessions in Redis]" -ForegroundColor Green
$redisKeys = docker exec personality-quiz-redis redis-cli KEYS "session:*" 2>$null
if ($redisKeys) {
    Write-Host "  Found $(@($redisKeys).Count) active session(s)" -ForegroundColor Gray
    foreach ($key in $redisKeys) {
        if ($key -and $key -ne "(empty array)") {
            Write-Host "  - $key" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "  No active sessions (all expired or completed)" -ForegroundColor Gray
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "         Connection Details             " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[PostgreSQL]" -ForegroundColor Yellow
Write-Host "  Host: localhost" -ForegroundColor Gray
Write-Host "  Port: 5432" -ForegroundColor Gray
Write-Host "  Database: personality_quiz" -ForegroundColor Gray
Write-Host "  Username: quiz_user" -ForegroundColor Gray
Write-Host "  Password: quiz_password_dev" -ForegroundColor Gray
Write-Host ""
Write-Host "[Redis]" -ForegroundColor Yellow
Write-Host "  Host: localhost" -ForegroundColor Gray
Write-Host "  Port: 6379" -ForegroundColor Gray
Write-Host "  No password required" -ForegroundColor Gray
Write-Host ""

Write-Host "TIP: Use TablePlus or DBeaver for visual database exploration!" -ForegroundColor Cyan
Write-Host ""

