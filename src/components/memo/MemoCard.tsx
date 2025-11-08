import { Memo } from '../../types/memo';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface MemoCardProps {
  memo: Memo;
  onClick: () => void;
}

export function MemoCard({ memo, onClick }: MemoCardProps) {
  return (
    <div
      onClick={onClick}
      className="card-hover p-4 cursor-pointer"
    >
      {/* 제목 */}
      <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
        {memo.title}
      </h3>

      {/* 내용 미리보기 */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
        {memo.content}
      </p>

      {/* 태그 */}
      {memo.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {memo.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded"
            >
              #{tag}
            </span>
          ))}
          {memo.tags.length > 3 && (
            <span className="text-xs text-gray-500">
              +{memo.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* 메타 정보 */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>
          {formatDistanceToNow(memo.updatedAt, { addSuffix: true, locale: ko })}
        </span>
        {memo.connectionCount > 0 && (
          <span className="flex items-center gap-1">
            <span>🔗</span>
            {memo.connectionCount}
          </span>
        )}
      </div>
    </div>
  );
}
