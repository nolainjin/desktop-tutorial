import { useState, useEffect } from 'react';
import { Memo, CreateMemoInput, UpdateMemoInput } from '../../types/memo';
import ReactMarkdown from 'react-markdown';

interface MemoEditorProps {
  memo?: Memo;
  onSave: (input: CreateMemoInput | UpdateMemoInput) => Promise<void>;
  onCancel: () => void;
}

export function MemoEditor({ memo, onSave, onCancel }: MemoEditorProps) {
  const [title, setTitle] = useState(memo?.title || '');
  const [content, setContent] = useState(memo?.content || '');
  const [tags, setTags] = useState(memo?.tags.join(', ') || '');
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 자동 저장 (5초 디바운스)
  useEffect(() => {
    if (!title && !content) return;

    const timer = setTimeout(() => {
      // 자동 저장 로직은 나중에 추가
      console.log('Auto save triggered');
    }, 5000);

    return () => clearTimeout(timer);
  }, [title, content, tags]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const input = {
        title: title.trim() || content.split('\n')[0].substring(0, 50) + '...',
        content: content.trim(),
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };

      await onSave(input);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">
          {memo ? '메모 수정' : '새 메모 작성'}
        </h2>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="btn btn-secondary btn-sm"
        >
          {showPreview ? '📝 편집' : '👁️ 미리보기'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 제목 */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            제목 (선택사항)
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
            placeholder="제목을 입력하세요 (비어있으면 자동 생성)"
          />
        </div>

        {/* 내용 */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            내용 (마크다운 지원)
          </label>
          {showPreview ? (
            <div className="card p-4 min-h-[300px] prose dark:prose-invert max-w-none">
              <ReactMarkdown>{content || '*내용이 없습니다*'}</ReactMarkdown>
            </div>
          ) : (
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="textarea min-h-[300px]"
              placeholder="메모 내용을 입력하세요..."
              required
            />
          )}
        </div>

        {/* 태그 */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium mb-1">
            태그 (쉼표로 구분)
          </label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="input"
            placeholder="예: 성장, 습관, 동기부여"
          />
        </div>

        {/* 버튼 */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="btn btn-primary"
          >
            {isSaving ? '저장 중...' : '저장'}
          </button>
        </div>
      </form>
    </div>
  );
}
