import { useEffect, useState } from 'react';
import { Layout } from './components/common/Layout';
import { Loading } from './components/common/Loading';
import { MemoList } from './components/memo/MemoList';
import { MemoEditor } from './components/memo/MemoEditor';
import { useMemoStore } from './stores/memoStore';
import { Memo, CreateMemoInput, UpdateMemoInput } from './types/memo';

type View = 'list' | 'editor' | 'detail';

function App() {
  const { memos, isLoading, loadMemos, createMemo, updateMemo, setCurrentMemo } =
    useMemoStore();

  const [view, setView] = useState<View>('list');
  const [editingMemo, setEditingMemo] = useState<Memo | undefined>();

  useEffect(() => {
    loadMemos();
  }, [loadMemos]);

  const handleNewMemo = () => {
    setEditingMemo(undefined);
    setView('editor');
  };

  const handleEditMemo = (memo: Memo) => {
    setEditingMemo(memo);
    setView('editor');
  };

  const handleMemoClick = (memo: Memo) => {
    setCurrentMemo(memo);
    // 나중에 상세 보기로 이동
    handleEditMemo(memo);
  };

  const handleSaveMemo = async (input: CreateMemoInput | UpdateMemoInput) => {
    if (editingMemo) {
      await updateMemo(editingMemo.id, input as UpdateMemoInput);
    } else {
      await createMemo(input as CreateMemoInput);
    }
    setView('list');
    setEditingMemo(undefined);
  };

  const handleCancel = () => {
    setView('list');
    setEditingMemo(undefined);
  };

  return (
    <Layout>
      {/* 헤더 액션 */}
      {view === 'list' && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">내 메모</h2>
          <button onClick={handleNewMemo} className="btn btn-primary">
            ➕ 새 메모 작성
          </button>
        </div>
      )}

      {/* 컨텐츠 */}
      {isLoading ? (
        <Loading />
      ) : view === 'list' ? (
        <MemoList
          memos={memos}
          onMemoClick={handleMemoClick}
          onNewMemo={handleNewMemo}
        />
      ) : (
        <MemoEditor
          memo={editingMemo}
          onSave={handleSaveMemo}
          onCancel={handleCancel}
        />
      )}
    </Layout>
  );
}

export default App;
