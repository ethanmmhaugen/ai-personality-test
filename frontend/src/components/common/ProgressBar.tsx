interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-indigo-300">
          Question {current} of {total}
        </span>
        <span className="text-sm font-medium text-indigo-300">{Math.round(percentage)}%</span>
      </div>
      <div className="w-full bg-indigo-900/50 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-cyan-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
