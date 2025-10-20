import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../stores/quizStore';
import { useState } from 'react';

export default function HomePage() {
  const navigate = useNavigate();
  const { startQuiz, isLoading } = useQuizStore();
  const [isStarting, setIsStarting] = useState(false);

  const handleStartQuiz = async () => {
    setIsStarting(true);
    await startQuiz('fantasy');
    setIsStarting(false);
    navigate('/quiz');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Discover Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">
              Inner Character
            </span>
          </h1>
          <p className="text-xl text-indigo-200 mb-8">
            Embark on a mystical journey through an interactive story.
            <br />
            Your choices will reveal your true personality.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="card bg-white/10 backdrop-blur-lg border border-white/20">
            <div className="text-4xl mb-2">✨</div>
            <h3 className="text-white font-semibold mb-1">AI-Powered</h3>
            <p className="text-indigo-200 text-sm">Dynamic story that adapts to your answers</p>
          </div>
          <div className="card bg-white/10 backdrop-blur-lg border border-white/20">
            <div className="text-4xl mb-2">🎭</div>
            <h3 className="text-white font-semibold mb-1">12 Characters</h3>
            <p className="text-indigo-200 text-sm">Unique fantasy personalities to discover</p>
          </div>
          <div className="card bg-white/10 backdrop-blur-lg border border-white/20">
            <div className="text-4xl mb-2">📊</div>
            <h3 className="text-white font-semibold mb-1">8 Dimensions</h3>
            <p className="text-indigo-200 text-sm">Detailed personality trait analysis</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={handleStartQuiz}
            disabled={isLoading || isStarting}
            className="btn-primary text-xl px-12 py-4 rounded-full shadow-2xl hover:scale-105 transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500"
          >
            {isStarting ? (
              <span className="flex items-center gap-3">
                <svg
                  className="animate-spin h-6 w-6"
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
                Preparing your journey...
              </span>
            ) : (
              'Begin Your Journey'
            )}
          </button>
          <p className="text-indigo-300 text-sm mt-4">
            Takes about 5 minutes • No account required
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-indigo-300 text-sm">
          <p>Powered by AI • Built with ❤️</p>
        </div>
      </div>
    </div>
  );
}
