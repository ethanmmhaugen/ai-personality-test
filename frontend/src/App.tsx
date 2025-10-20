import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center text-indigo-900 mb-8">
            AI Personality Quiz
          </h1>
          <p className="text-center text-gray-600">
            Setup complete! Ready to build the quiz application.
          </p>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

