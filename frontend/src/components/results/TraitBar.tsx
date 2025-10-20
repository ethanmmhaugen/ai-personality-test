interface TraitBarProps {
  code: string;
  name: string;
  score: number;
  color: string;
}

export default function TraitBar({ code, name, score, color }: TraitBarProps) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-indigo-900">{code}</span>
          <span className="text-gray-700 font-medium">{name}</span>
        </div>
        <span className="text-lg font-bold text-indigo-600">{score}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className={`h-4 rounded-full transition-all duration-1000 ease-out ${color}`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );
}
