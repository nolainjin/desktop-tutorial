import { useEffect } from 'react';
import { Memo } from '../../types/memo';
import { useIdeaStore } from '../../stores/ideaStore';
import { IdeaCard } from '../idea/IdeaCard';
import { IdeaFilter } from '../idea/IdeaFilter';
import { Loading } from '../common/Loading';
import { EmptyState } from '../common/EmptyState';
import ReactMarkdown from 'react-markdown';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface MemoDetailProps {
  memo: Memo;
  onEdit: () => void;
  onBack: () => void;
}

export function MemoDetail({ memo, onEdit, onBack }: MemoDetailProps) {
  const {
    ideas,
    isSearching,
    selectedTypes,
    loadIdeas,
    searchIdeas,
    updateFeedback,
    setSelectedTypes
  } = useIdeaStore();

  useEffect(() => {
    loadIdeas(memo.id);
  }, [memo.id, loadIdeas]);

  const handleSearch = async () => {
    await searchIdeas(memo);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* 뒤로가기 버튼 */}
      <button onClick={onBack} className="btn btn-secondary mb-4">
        ← 목록으로
      </button>

      {/* 메모 내용 */}
      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {memo.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>
                {formatDistanceToNow(memo.updatedAt, { addSuffix: true, locale: ko })}
              </span>
              {memo.connectionCount > 0 && (
                <span className="flex items-center gap-1">
                  🔗 {memo.connectionCount}개 연결
                </span>
              )}
            </div>
          </div>
          <button onClick={onEdit} className="btn btn-secondary">
            ✏️ 수정
          </button>
        </div>

        {/* 태그 */}
        {memo.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {memo.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 내용 (마크다운) */}
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown>{memo.content}</ReactMarkdown>
        </div>
      </div>

      {/* 연결된 지혜 섹션 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            🔗 연결된 지혜
          </h2>
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="btn btn-primary"
          >
            {isSearching ? '🔍 검색 중...' : '🔍 연결 찾기'}
          </button>
        </div>

        {/* 필터 */}
        <IdeaFilter selectedTypes={selectedTypes} onChange={setSelectedTypes} />

        {/* 아이디어 목록 */}
        {isSearching ? (
          <Loading />
        ) : ideas.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="아직 연결된 지혜가 없습니다"
            description='"연결 찾기" 버튼을 눌러 관련된 명언, 책, 영화를 발견하세요!'
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ideas.map(idea => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onFeedback={updateFeedback}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
