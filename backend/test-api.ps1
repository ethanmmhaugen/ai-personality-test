# API Test Script for AI Personality Quiz
# This script demonstrates the complete quiz flow

Write-Host "`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║        AI Personality Quiz - API Test Script              ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:3000"

# Step 1: Health Check
Write-Host "📋 Step 1: Health Check" -ForegroundColor Yellow
Write-Host "GET $baseUrl/health" -ForegroundColor Gray
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    Write-Host "✅ Status: $($health.status)" -ForegroundColor Green
    Write-Host "   Database: $($health.services.database)" -ForegroundColor Gray
    Write-Host "   Redis: $($health.services.redis)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ Health check failed: $_`n" -ForegroundColor Red
    exit 1
}

# Step 2: Start Quiz
Write-Host "🎮 Step 2: Start Quiz" -ForegroundColor Yellow
Write-Host "POST $baseUrl/quiz/start" -ForegroundColor Gray
try {
    $startResponse = Invoke-RestMethod -Uri "$baseUrl/quiz/start" -Method Post -ContentType "application/json" -Body '{"theme":"fantasy"}'
    $sessionId = $startResponse.sessionId
    Write-Host "✅ Quiz Started!" -ForegroundColor Green
    Write-Host "   Session ID: $sessionId" -ForegroundColor Gray
    Write-Host "   Theme: $($startResponse.theme)" -ForegroundColor Gray
    Write-Host "   Total Rounds: $($startResponse.totalRounds)" -ForegroundColor Gray
    Write-Host "   Initial Prompt: $($startResponse.initialPrompt)`n" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Failed to start quiz: $_`n" -ForegroundColor Red
    exit 1
}

# Step 3: Answer Round 1
Write-Host "💬 Step 3: Answer Round 1" -ForegroundColor Yellow
Write-Host "POST $baseUrl/quiz/$sessionId/respond" -ForegroundColor Gray
$answer1 = "I would carefully examine the ancient ruins, looking for clues about their history and any hidden dangers before proceeding."
try {
    $response1 = Invoke-RestMethod -Uri "$baseUrl/quiz/$sessionId/respond" -Method Post -ContentType "application/json" -Body (@{answer=$answer1} | ConvertTo-Json)
    Write-Host "✅ Round 1 Complete!" -ForegroundColor Green
    Write-Host "   Current Round: $($response1.currentRound)" -ForegroundColor Gray
    Write-Host "   Next Prompt: $($response1.nextPrompt)`n" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Failed to submit answer: $_`n" -ForegroundColor Red
    exit 1
}

# Step 4: Answer Rounds 2-6
for ($round = 2; $round -le 6; $round++) {
    Write-Host "💬 Step $($round + 2): Answer Round $round" -ForegroundColor Yellow
    Write-Host "POST $baseUrl/quiz/$sessionId/respond" -ForegroundColor Gray
    
    $answers = @(
        "I decide to help others I meet along the way, working together to overcome challenges.",
        "I use logic and careful planning to navigate through the obstacles ahead.",
        "I embrace the adventure and explore new possibilities with enthusiasm!",
        "I stay focused on my goal and push forward with determination.",
        "I take a moment to reflect and consider all my options before making a decision."
    )
    
    $answer = $answers[$round - 2]
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/quiz/$sessionId/respond" -Method Post -ContentType "application/json" -Body (@{answer=$answer} | ConvertTo-Json)
        
        if ($response.isComplete) {
            Write-Host "✅ Round $round Complete - Quiz Finished!" -ForegroundColor Green
            Write-Host "   Status: Quiz is now complete`n" -ForegroundColor Gray
        } else {
            Write-Host "✅ Round $round Complete!" -ForegroundColor Green
            Write-Host "   Current Round: $($response.currentRound)" -ForegroundColor Gray
            Write-Host "   Next Prompt: $($response.nextPrompt)`n" -ForegroundColor Cyan
        }
    } catch {
        Write-Host "❌ Failed to submit answer: $_`n" -ForegroundColor Red
        exit 1
    }
}

# Step 5: Get Status
Write-Host "📊 Step 9: Check Quiz Status" -ForegroundColor Yellow
Write-Host "GET $baseUrl/quiz/$sessionId/status" -ForegroundColor Gray
try {
    $status = Invoke-RestMethod -Uri "$baseUrl/quiz/$sessionId/status" -Method Get
    Write-Host "✅ Status Retrieved!" -ForegroundColor Green
    Write-Host "   Session Status: $($status.status)" -ForegroundColor Gray
    Write-Host "   Current Round: $($status.currentRound)" -ForegroundColor Gray
    Write-Host "   Total Rounds: $($status.totalRounds)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ Failed to get status: $_`n" -ForegroundColor Red
    exit 1
}

# Step 6: Get Results
Write-Host "🎉 Step 10: Get Final Results" -ForegroundColor Yellow
Write-Host "GET $baseUrl/quiz/$sessionId/results" -ForegroundColor Gray
try {
    $results = Invoke-RestMethod -Uri "$baseUrl/quiz/$sessionId/results" -Method Get
    Write-Host "`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
    Write-Host "║                    YOUR CHARACTER RESULTS                  ║" -ForegroundColor Magenta
    Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Magenta
    Write-Host "`n🎭 Character: $($results.character.name)" -ForegroundColor Cyan
    Write-Host "`n📝 Description:" -ForegroundColor Yellow
    Write-Host "   $($results.character.description)" -ForegroundColor Gray
    Write-Host "`n💼 Work Style Strengths:" -ForegroundColor Yellow
    Write-Host "   $($results.character.workStyleStrengths)" -ForegroundColor Gray
    Write-Host "`n🤝 Interpersonal Dynamics:" -ForegroundColor Yellow
    Write-Host "   $($results.character.interpersonalDynamics)" -ForegroundColor Gray
    Write-Host "`n📊 Your Trait Scores (0-100):" -ForegroundColor Yellow
    Write-Host "   F (Focused):       $($results.traitScores.F)" -ForegroundColor Gray
    Write-Host "   I (Independence):  $($results.traitScores.I)" -ForegroundColor Gray
    Write-Host "   S (Sensing):       $($results.traitScores.S)" -ForegroundColor Gray
    Write-Host "   G (Grounded):      $($results.traitScores.G)" -ForegroundColor Gray
    Write-Host "   E (Exploratory):   $($results.traitScores.E)" -ForegroundColor Gray
    Write-Host "   N (Network):       $($results.traitScores.N)" -ForegroundColor Gray
    Write-Host "   A (Analytical):    $($results.traitScores.A)" -ForegroundColor Gray
    Write-Host "   D (Driven):        $($results.traitScores.D)" -ForegroundColor Gray
    Write-Host "`n✅ All API endpoints working perfectly!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to get results: $_`n" -ForegroundColor Red
    exit 1
}

Write-Host "`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                  ✅ TEST COMPLETE!                         ║" -ForegroundColor Cyan
Write-Host "║  All endpoints tested successfully. Backend is ready! 🚀   ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

