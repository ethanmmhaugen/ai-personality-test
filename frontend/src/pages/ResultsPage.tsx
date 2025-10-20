import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../stores/quizStore';
import { useResultsStore } from '../stores/resultsStore';
import LoadingSpinner from '../components/common/LoadingSpinner';
import TraitBar from '../components/results/TraitBar';

const traitInfo = [
  { code: 'F', name: 'Focused', color: 'bg-gradient-to-r from-blue-500 to-blue-600' },
  { code: 'I', name: 'Independence', color: 'bg-gradient-to-r from-purple-500 to-purple-600' },
  { code: 'S', name: 'Sensing', color: 'bg-gradient-to-r from-green-500 to-green-600' },
  { code: 'G', name: 'Grounded', color: 'bg-gradient-to-r from-yellow-500 to-yellow-600' },
  { code: 'E', name: 'Exploratory', color: 'bg-gradient-to-r from-orange-500 to-orange-600' },
  { code: 'N', name: 'Network', color: 'bg-gradient-to-r from-pink-500 to-pink-600' },
  { code: 'A', name: 'Analytical', color: 'bg-gradient-to-r from-indigo-500 to-indigo-600' },
  { code: 'D', name: 'Driven', color: 'bg-gradient-to-r from-red-500 to-red-600' },
];

export default function ResultsPage() {
  const navigate = useNavigate();
  const { sessionId, resetQuiz } = useQuizStore();
  const { character, traitScores, isLoading, error, fetchResults, resetResults } =
    useResultsStore();

  useEffect(() => {
    if (!sessionId) {
      navigate('/');
      return;
    }

    if (!character && !isLoading && !error) {
      fetchResults(sessionId);
    }
  }, [sessionId, character, isLoading, error, fetchResults, navigate]);

  const handleRetakeQuiz = () => {
    resetQuiz();
    resetResults();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <LoadingSpinner message="Revealing your character..." />
      </div>
    );
  }

  if (error || !character || !traitScores) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4">
        <div className="card bg-white/95 max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Oops!</h2>
          <p className="text-gray-700 mb-6">
            {error || 'Unable to load your results. Please try again.'}
          </p>
          <button onClick={handleRetakeQuiz} className="btn-primary w-full">
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold text-white mb-4">Your Character Revealed!</h1>
          <p className="text-xl text-indigo-200">Your journey has unveiled your true nature</p>
        </div>

        {/* Character Card */}
        <div className="card bg-white/95 backdrop-blur-lg shadow-2xl mb-8 animate-fade-in">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎭</div>
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 mb-2">
              {character.name}
            </h2>
            <p className="text-gray-600 italic">{character.theme} realm</p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-indigo-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{character.description}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-indigo-900 mb-3">
                💼 Work Style Strengths
              </h3>
              <p className="text-gray-700 leading-relaxed">{character.workStyleStrengths}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-indigo-900 mb-3">
                🤝 Interpersonal Dynamics
              </h3>
              <p className="text-gray-700 leading-relaxed">{character.interpersonalDynamics}</p>
            </div>
          </div>
        </div>

        {/* Trait Scores Card */}
        <div className="card bg-white/95 backdrop-blur-lg shadow-2xl mb-8 animate-fade-in">
          <h3 className="text-2xl font-bold text-indigo-900 mb-6">📊 Your Personality Traits</h3>
          <p className="text-gray-600 mb-8">
            Each trait is scored from 0-100 based on your responses throughout the journey.
          </p>

          <div className="space-y-2">
            {traitInfo.map((trait) => (
              <TraitBar
                key={trait.code}
                code={trait.code}
                name={trait.name}
                score={traitScores[trait.code as keyof typeof traitScores]}
                color={trait.color}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleRetakeQuiz}
            className="btn-secondary px-8 py-3 rounded-lg font-semibold transform transition-all duration-200 hover:scale-105"
          >
            Take Quiz Again
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-indigo-200 text-sm">
          <p>Share your results with friends and see what character they get!</p>
        </div>
      </div>
    </div>
  );
}
