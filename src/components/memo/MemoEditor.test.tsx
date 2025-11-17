import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoEditor } from './MemoEditor';
import { Memo } from '../../types/memo';

describe('MemoEditor', () => {
  const mockOnSave = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('렌더링', () => {
    it('새 메모 작성 모드로 렌더링되어야 함', () => {
      render(<MemoEditor onSave={mockOnSave} onCancel={mockOnCancel} />);

      expect(screen.getByText('새 메모 작성')).toBeInTheDocument();
      expect(screen.getByLabelText(/제목/)).toBeInTheDocument();
      expect(screen.getByLabelText(/내용/)).toBeInTheDocument();
      expect(screen.getByLabelText(/태그/)).toBeInTheDocument();
    });

    it('메모 수정 모드로 렌더링되어야 함', () => {
      const memo: Memo = {
        id: 'test-memo',
        title: '테스트 제목',
        content: '테스트 내용',
        tags: ['태그1', '태그2'],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      render(<MemoEditor memo={memo} onSave={mockOnSave} onCancel={mockOnCancel} />);

      expect(screen.getByText('메모 수정')).toBeInTheDocument();
      expect(screen.getByDisplayValue('테스트 제목')).toBeInTheDocument();
      expect(screen.getByDisplayValue('테스트 내용')).toBeInTheDocument();
      expect(screen.getByDisplayValue('태그1, 태그2')).toBeInTheDocument();
    });

    it('미리보기 버튼이 렌더링되어야 함', () => {
      render(<MemoEditor onSave={mockOnSave} onCancel={mockOnCancel} />);

      expect(screen.getByText(/미리보기/)).toBeInTheDocument();
    });
  });

  describe('폼 입력', () => {
    it('제목을 입력할 수 있어야 함', async () => {
      const user = userEvent.setup();
      render(<MemoEditor onSave={mockOnSave} onCancel={mockOnCancel} />);

      const titleInput = screen.getByLabelText(/제목/) as HTMLInputElement;
      await user.type(titleInput, '새 제목');

      expect(titleInput.value).toBe('새 제목');
    });

    it('내용을 입력할 수 있어야 함', async () => {
      const user = userEvent.setup();
      render(<MemoEditor onSave={mockOnSave} onCancel={mockOnCancel} />);

      const contentTextarea = screen.getByLabelText(/내용/) as HTMLTextAreaElement;
      await user.type(contentTextarea, '새 내용');

      expect(contentTextarea.value).toBe('새 내용');
    });

    it('태그를 입력할 수 있어야 함', async () => {
      const user = userEvent.setup();
      render(<MemoEditor onSave={mockOnSave} onCancel={mockOnCancel} />);

      const tagsInput = screen.getByLabelText(/태그/) as HTMLInputElement;
      await user.type(tagsInput, '태그1, 태그2');

      expect(tagsInput.value).toBe('태그1, 태그2');
    });
  });

  describe('미리보기 기능', () => {
    it('미리보기 버튼을 클릭하면 미리보기 모드로 전환되어야 함', async () => {
      const user = userEvent.setup();
      render(<MemoEditor onSave={mockOnSave} onCancel={mockOnCancel} />);

      const previewButton = screen.getByText(/미리보기/);
      await user.click(previewButton);

      expect(screen.getByText(/편집/)).toBeInTheDocument();
    });

    it('미리보기 모드에서는 textarea가 숨겨져야 함', async () => {
      const user = userEvent.setup();
      render(<MemoEditor onSave={mockOnSave} onCancel={mockOnCancel} />);

      const contentTextarea = screen.getByLabelText(/내용/);
      const previewButton = screen.getByText(/미리보기/);

      await user.click(previewButton);

      expect(contentTextarea).not.toBeVisible();
    });

    it('편집 버튼을 클릭하면 편집 모드로 돌아가야 함', async () => {
      const user = userEvent.setup();
      render(<MemoEditor onSave={mockOnSave} onCancel={mockOnCancel} />);

      const previewButton = screen.getByText(/미리보기/);
      await user.click(previewButton);

      const editButton = screen.getByText(/편집/);
      await user.click(editButton);

      expect(screen.getByText(/미리보기/)).toBeInTheDocument();
    });
  });

  describe('폼 제출', () => {
    it('저장 버튼을 클릭하면 onSave가 호출되어야 함', async () => {
      const user = userEvent.setup();
      mockOnSave.mockResolvedValue(undefined);

      render(<MemoEditor onSave={mockOnSave} onCancel={mockOnCancel} />);

      const titleInput = screen.getByLabelText(/제목/);
      const contentTextarea = screen.getByLabelText(/내용/);
      const tagsInput = screen.getByLabelText(/태그/);
      const saveButton = screen.getByText('저장');

      await user.type(titleInput, '테스트 제목');
      await user.type(contentTextarea, '테스트 내용');
      await user.type(tagsInput, '태그1, 태그2');

      await user.click(saveButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith({
          title: '테스트 제목',
          content: '테스트 내용',
          tags: ['태그1', '태그2']
        });
      });
    });

    it('제목이 없으면 내용 첫 줄로 자동 생성되어야 함', async () => {
      const user = userEvent.setup();
      mockOnSave.mockResolvedValue(undefined);

      render(<MemoEditor onSave={mockOnSave} onCancel={mockOnCancel} />);

      const contentTextarea = screen.getByLabelText(/내용/);
      const saveButton = screen.getByText('저장');

      await user.type(contentTextarea, '첫 번째 줄입니다\n두 번째 줄입니다');
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith(
          expect.objectContaining({
            title: expect.stringContaining('첫 번째 줄입니다')
          })
        );
      });
    });

    it('태그는 쉼표로 구분되어 배열로 변환되어야 함', async () => {
      const user = userEvent.setup();
      mockOnSave.mockResolvedValue(undefined);

      render(<MemoEditor onSave={mockOnSave} onCancel={mockOnCancel} />);

      const contentTextarea = screen.getByLabelText(/내용/);
      const tagsInput = screen.getByLabelText(/태그/);
      const saveButton = screen.getByText('저장');

      await user.type(contentTextarea, '내용');
      await user.type(tagsInput, '태그1, 태그2, 태그3');
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith(
          expect.objectContaining({
            tags: ['태그1', '태그2', '태그3']
          })
        );
      });
    });

    it('빈 태그는 필터링되어야 함', async () => {
      const user = userEvent.setup();
      mockOnSave.mockResolvedValue(undefined);

      render(<MemoEditor onSave={mockOnSave} onCancel={mockOnCancel} />);

      const contentTextarea = screen.getByLabelText(/내용/);
      const tagsInput = screen.getByLabelText(/태그/);
      const saveButton = screen.getByText('저장');

      await user.type(contentTextarea, '내용');
      await user.type(tagsInput, 'tag1,  , tag2,   ,tag3');
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith(
          expect.objectContaining({
            tags: ['tag1', 'tag2', 'tag3']
          })
        );
      });
    });

    it('저장 중에는 버튼이 비활성화되어야 함', async () => {
      const user = userEvent.setup();
      let resolvePromise: () => void;
      const promise = new Promise<void>((resolve) => {
        resolvePromise = resolve;
      });
      mockOnSave.mockReturnValue(promise);

      render(<MemoEditor onSave={mockOnSave} onCancel={mockOnCancel} />);

      const contentTextarea = screen.getByLabelText(/내용/);
      const saveButton = screen.getByText('저장');

      await user.type(contentTextarea, '내용');
      await user.click(saveButton);

      expect(screen.getByText('저장 중...')).toBeInTheDocument();
      expect(saveButton).toBeDisabled();

      resolvePromise!();
      await waitFor(() => {
        expect(screen.getByText('저장')).toBeInTheDocument();
      });
    });
  });

  describe('취소 버튼', () => {
    it('취소 버튼을 클릭하면 onCancel이 호출되어야 함', async () => {
      const user = userEvent.setup();
      render(<MemoEditor onSave={mockOnSave} onCancel={mockOnCancel} />);

      const cancelButton = screen.getByText('취소');
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  describe('자동 저장', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('5초 후 자동 저장 로직이 트리거되어야 함', async () => {
      const consoleSpy = vi.spyOn(console, 'log');

      render(<MemoEditor onSave={mockOnSave} onCancel={mockOnCancel} />);

      const titleInput = screen.getByLabelText(/제목/);
      // fake timers와 함께 사용할 때는 fireEvent 사용
      fireEvent.change(titleInput, { target: { value: '제목' } });

      // 타이머를 비동기로 진행
      await vi.advanceTimersByTimeAsync(5000);

      expect(consoleSpy).toHaveBeenCalledWith('Auto save triggered');
    });

    it('제목과 내용이 모두 비어있으면 자동 저장이 트리거되지 않아야 함', () => {
      const consoleSpy = vi.spyOn(console, 'log');

      render(<MemoEditor onSave={mockOnSave} onCancel={mockOnCancel} />);

      vi.advanceTimersByTime(5000);

      expect(consoleSpy).not.toHaveBeenCalledWith('Auto save triggered');
    });
  });

  describe('필수 입력 검증', () => {
    it('내용 필드는 required여야 함', () => {
      render(<MemoEditor onSave={mockOnSave} onCancel={mockOnCancel} />);

      const contentTextarea = screen.getByLabelText(/내용/);
      expect(contentTextarea).toBeRequired();
    });

    it('제목 필드는 선택사항이어야 함', () => {
      render(<MemoEditor onSave={mockOnSave} onCancel={mockOnCancel} />);

      const titleInput = screen.getByLabelText(/제목/);
      expect(titleInput).not.toBeRequired();
    });
  });
});
