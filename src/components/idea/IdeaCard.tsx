import { Idea, IdeaType } from '../../types/idea';

interface IdeaCardProps {
  idea: Idea;
  onFeedback: (ideaId: string, feedback: 'up' | 'down') => void;
}

const TYPE_ICONS: Record<IdeaType, string> = {
  'movie': '🎬',
  'drama': '📺',
  'animation': '🎨',
  'book': '📚',
  'essay': '✍️',
  'poem': '📖',
  'famous-quote': '💭',
  'proverb': '📜',
  'academic': '🎓',
  'web': '🌐',
  'memo': '📝'
};

const TYPE_LABELS: Record<IdeaType, string> = {
  'movie': '영화 대사',
  'drama': '드라마 대사',
  'animation': '애니메이션',
  'book': '책',
  'essay': '에세이',
  'poem': '시',
  'famous-quote': '위인 명언',
  'proverb': '고전 속담',
  'academic': '학문적 내용',
  'web': '웹 자료',
  'memo': '내 메모'
};

const TYPE_COLORS: Record<IdeaType, string> = {
  'movie': 'bg-red-100 text-red-700 border-red-200',
  'drama': 'bg-pink-100 text-pink-700 border-pink-200',
  'animation': 'bg-orange-100 text-orange-700 border-orange-200',
  'book': 'bg-blue-100 text-blue-700 border-blue-200',
  'essay': 'bg-cyan-100 text-cyan-700 border-cyan-200',
  'poem': 'bg-teal-100 text-teal-700 border-teal-200',
  'famous-quote': 'bg-purple-100 text-purple-700 border-purple-200',
  'proverb': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'academic': 'bg-green-100 text-green-700 border-green-200',
  'web': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'memo': 'bg-violet-100 text-violet-700 border-violet-200'
};

export function IdeaCard({ idea, onFeedback }: IdeaCardProps) {
  const icon = TYPE_ICONS[idea.type];
  const label = TYPE_LABELS[idea.type];
  const colorClass = TYPE_COLORS[idea.type];

  return (
    <div className="card p-4 hover:shadow-md transition-shadow">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${colorClass}`}>
          {icon} {label}
        </span>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {Math.round(idea.similarity * 100)}% 관련도
        </span>
      </div>

      {/* 내용 */}
      <p className="text-gray-900 dark:text-gray-100 mb-3 leading-relaxed">
        {idea.content}
      </p>

      {/* 출처 */}
      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md mb-3 text-sm">
        <div className="font-medium text-gray-700 dark:text-gray-300 mb-2">
          📦 출처 정보
        </div>
        <div className="space-y-1 text-gray-600 dark:text-gray-400">
          {idea.source.author && (
            <div>
              <span className="font-medium">저자:</span> {idea.source.author}
            </div>
          )}
          {idea.source.title && (
            <div>
              <span className="font-medium">제목:</span> {idea.source.title}
            </div>
          )}
          {idea.source.year && (
            <div>
              <span className="font-medium">연도:</span> {idea.source.year}
            </div>
          )}
          {idea.source.category && (
            <div>
              <span className="font-medium">분류:</span> {idea.source.category}
            </div>
          )}
          {idea.source.url && (
            <div>
              <a
                href={idea.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                🔗 바로가기
              </a>
            </div>
          )}
        </div>
      </div>

      {/* 연결 이유 */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md mb-3">
        <div className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
          💭 연결 이유
        </div>
        <div className="text-sm text-blue-800 dark:text-blue-400">
          {idea.reasoning}
        </div>
      </div>

      {/* 피드백 */}
      <div className="flex gap-2">
        <button
          onClick={() => onFeedback(idea.id, 'up')}
          className={`flex-1 btn btn-sm ${
            idea.userFeedback === 'up'
              ? 'bg-green-600 text-white'
              : 'btn-secondary'
          }`}
        >
          👍 관련있음
        </button>
        <button
          onClick={() => onFeedback(idea.id, 'down')}
          className={`flex-1 btn btn-sm ${
            idea.userFeedback === 'down'
              ? 'bg-red-600 text-white'
              : 'btn-secondary'
          }`}
        >
          👎 관련없음
        </button>
      </div>
    </div>
  );
}
