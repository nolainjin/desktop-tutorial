import { Memo } from '../../types/memo';
import { MemoCard } from './MemoCard';
import { EmptyState } from '../common/EmptyState';

interface MemoListProps {
  memos: Memo[];
  onMemoClick: (memo: Memo) => void;
  onNewMemo: () => void;
}

export function MemoList({ memos, onMemoClick, onNewMemo }: MemoListProps) {
  if (memos.length === 0) {
    return (
      <EmptyState
        icon="📝"
        title="아직 메모가 없습니다"
        description="첫 메모를 작성해보세요!"
        action={
          <button onClick={onNewMemo} className="btn btn-primary">
            ➕ 새 메모 작성
          </button>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {memos.map((memo) => (
        <MemoCard key={memo.id} memo={memo} onClick={() => onMemoClick(memo)} />
      ))}
    </div>
  );
}
