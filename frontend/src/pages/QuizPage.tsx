import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../stores/quizStore';
import ProgressBar from '../components/common/ProgressBar';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function QuizPage() {
  const navigate = useNavigate();
  const {
    sessionId,
    currentRound,
    totalRounds,
    currentPrompt,
    backgroundImageUrl,
    userAnswer,
    isLoading,
    error,
    submitAnswer,
    setAnswer,
  } = useQuizStore();

  const [localAnswer, setLocalAnswer] = useState('');
  const [charCount, setCharCount] = useState(0);
  const maxChars = 500;

  useEffect(() => {
    // If no active session, redirect to home
    if (!sessionId && !isLoading) {
      navigate('/');
    }
  }, [sessionId, isLoading, navigate]);

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxChars) {
      setLocalAnswer(value);
      setCharCount(value.length);
      setAnswer(value);
    }
  };

  const handleSubmit = async () => {
    if (localAnswer.trim().length === 0) {
      return;
    }

    const isComplete = await submitAnswer(localAnswer);
    setLocalAnswer('');
    setCharCount(0);

    if (isComplete) {
      // Navigate to results
      navigate('/results');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <LoadingSpinner message="Initializing your journey..." />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4 flex items-center justify-center"
      style={{
        backgroundImage: backgroundImageUrl
          ? `linear-gradient(rgba(99, 102, 241, 0.9), rgba(168, 85, 247, 0.9)), url(${backgroundImageUrl})`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-3xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar current={currentRound} total={totalRounds} />
        </div>

        {/* Story Prompt Card */}
        <div className="card bg-white/95 backdrop-blur-lg shadow-2xl mb-6 animate-fade-in">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-indigo-900 mb-4">Your Journey Continues...</h2>
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
              {currentPrompt}
            </p>
          </div>

          {/* Answer Input */}
          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-700 font-semibold mb-2 block">What do you do?</span>
              <textarea
                value={localAnswer}
                onChange={handleAnswerChange}
                onKeyPress={handleKeyPress}
                placeholder="Type your response here... (Ctrl+Enter to submit)"
                className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-colors resize-none"
                rows={4}
                disabled={isLoading}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">Press Ctrl+Enter to submit quickly</span>
                <span
                  className={`text-sm ${
                    charCount > maxChars * 0.9 ? 'text-red-500' : 'text-gray-500'
                  }`}
                >
                  {charCount} / {maxChars}
                </span>
              </div>
            </label>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isLoading || localAnswer.trim().length === 0}
              className="w-full btn-primary py-4 text-lg font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transform transition-all duration-200 hover:scale-[1.02]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Weaving your story...
                </span>
              ) : (
                'Continue Journey →'
              )}
            </button>
          </div>
        </div>

        {/* Hint Text */}
        <div className="text-center text-indigo-200 text-sm">
          <p>There are no wrong answers. Be yourself and let your instincts guide you.</p>
        </div>
      </div>
    </div>
  );
}
