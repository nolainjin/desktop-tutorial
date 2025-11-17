import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoList } from './MemoList';
import { Memo } from '../../types/memo';

// date-fns 모킹
vi.mock('date-fns', () => ({
  formatDistanceToNow: () => '5분 전',
}));

describe('MemoList', () => {
  const mockOnMemoClick = vi.fn();
  const mockOnNewMemo = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('빈 상태', () => {
    it('메모가 없을 때 EmptyState가 렌더링되어야 함', () => {
      render(
        <MemoList
          memos={[]}
          onMemoClick={mockOnMemoClick}
          onNewMemo={mockOnNewMemo}
        />
      );

      expect(screen.getByText('아직 메모가 없습니다')).toBeInTheDocument();
      expect(screen.getByText('첫 메모를 작성해보세요!')).toBeInTheDocument();
      expect(screen.getByText('📝')).toBeInTheDocument();
    });

    it('새 메모 작성 버튼이 렌더링되어야 함', () => {
      render(
        <MemoList
          memos={[]}
          onMemoClick={mockOnMemoClick}
          onNewMemo={mockOnNewMemo}
        />
      );

      expect(screen.getByText(/새 메모 작성/)).toBeInTheDocument();
    });

    it('새 메모 작성 버튼 클릭 시 onNewMemo가 호출되어야 함', async () => {
      const user = userEvent.setup();
      render(
        <MemoList
          memos={[]}
          onMemoClick={mockOnMemoClick}
          onNewMemo={mockOnNewMemo}
        />
      );

      const button = screen.getByText(/새 메모 작성/);
      await user.click(button);

      expect(mockOnNewMemo).toHaveBeenCalledTimes(1);
    });
  });

  describe('메모 목록 렌더링', () => {
    const mockMemos: Memo[] = [
      {
        id: 'memo-1',
        title: '첫 번째 메모',
        content: '첫 번째 메모의 내용입니다.',
        tags: ['태그1', '태그2'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
        connectionCount: 3,
      },
      {
        id: 'memo-2',
        title: '두 번째 메모',
        content: '두 번째 메모의 내용입니다.',
        tags: ['태그3'],
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-04'),
        connectionCount: 0,
      },
    ];

    it('메모가 있을 때 그리드가 렌더링되어야 함', () => {
      render(
        <MemoList
          memos={mockMemos}
          onMemoClick={mockOnMemoClick}
          onNewMemo={mockOnNewMemo}
        />
      );

      expect(screen.getByText('첫 번째 메모')).toBeInTheDocument();
      expect(screen.getByText('두 번째 메모')).toBeInTheDocument();
    });

    it('올바른 개수의 MemoCard가 렌더링되어야 함', () => {
      render(
        <MemoList
          memos={mockMemos}
          onMemoClick={mockOnMemoClick}
          onNewMemo={mockOnNewMemo}
        />
      );

      const memoCards = screen.getAllByText(/메모/);
      expect(memoCards.length).toBeGreaterThanOrEqual(2);
    });

    it('메모 내용이 표시되어야 함', () => {
      render(
        <MemoList
          memos={mockMemos}
          onMemoClick={mockOnMemoClick}
          onNewMemo={mockOnNewMemo}
        />
      );

      expect(screen.getByText('첫 번째 메모의 내용입니다.')).toBeInTheDocument();
      expect(screen.getByText('두 번째 메모의 내용입니다.')).toBeInTheDocument();
    });

    it('태그가 표시되어야 함', () => {
      render(
        <MemoList
          memos={mockMemos}
          onMemoClick={mockOnMemoClick}
          onNewMemo={mockOnNewMemo}
        />
      );

      expect(screen.getByText('#태그1')).toBeInTheDocument();
      expect(screen.getByText('#태그2')).toBeInTheDocument();
      expect(screen.getByText('#태그3')).toBeInTheDocument();
    });

    it('연결 개수가 표시되어야 함', () => {
      render(
        <MemoList
          memos={mockMemos}
          onMemoClick={mockOnMemoClick}
          onNewMemo={mockOnNewMemo}
        />
      );

      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('🔗')).toBeInTheDocument();
    });

    it('메모 카드 클릭 시 onMemoClick이 호출되어야 함', async () => {
      const user = userEvent.setup();
      render(
        <MemoList
          memos={mockMemos}
          onMemoClick={mockOnMemoClick}
          onNewMemo={mockOnNewMemo}
        />
      );

      const firstMemoCard = screen.getByText('첫 번째 메모');
      await user.click(firstMemoCard);

      expect(mockOnMemoClick).toHaveBeenCalledTimes(1);
      expect(mockOnMemoClick).toHaveBeenCalledWith(mockMemos[0]);
    });

    it('다른 메모 카드 클릭 시 올바른 메모가 전달되어야 함', async () => {
      const user = userEvent.setup();
      render(
        <MemoList
          memos={mockMemos}
          onMemoClick={mockOnMemoClick}
          onNewMemo={mockOnNewMemo}
        />
      );

      const secondMemoCard = screen.getByText('두 번째 메모');
      await user.click(secondMemoCard);

      expect(mockOnMemoClick).toHaveBeenCalledWith(mockMemos[1]);
    });
  });

  describe('태그 표시', () => {
    it('태그가 3개 이하일 때 모두 표시되어야 함', () => {
      const memo: Memo = {
        id: 'memo-1',
        title: '메모',
        content: '내용',
        tags: ['태그1', '태그2', '태그3'],
        createdAt: new Date(),
        updatedAt: new Date(),
        connectionCount: 0,
      };

      render(
        <MemoList
          memos={[memo]}
          onMemoClick={mockOnMemoClick}
          onNewMemo={mockOnNewMemo}
        />
      );

      expect(screen.getByText('#태그1')).toBeInTheDocument();
      expect(screen.getByText('#태그2')).toBeInTheDocument();
      expect(screen.getByText('#태그3')).toBeInTheDocument();
    });

    it('태그가 3개를 초과하면 처음 3개만 표시하고 나머지 개수를 표시해야 함', () => {
      const memo: Memo = {
        id: 'memo-1',
        title: '메모',
        content: '내용',
        tags: ['태그1', '태그2', '태그3', '태그4', '태그5'],
        createdAt: new Date(),
        updatedAt: new Date(),
        connectionCount: 0,
      };

      render(
        <MemoList
          memos={[memo]}
          onMemoClick={mockOnMemoClick}
          onNewMemo={mockOnNewMemo}
        />
      );

      expect(screen.getByText('#태그1')).toBeInTheDocument();
      expect(screen.getByText('#태그2')).toBeInTheDocument();
      expect(screen.getByText('#태그3')).toBeInTheDocument();
      expect(screen.getByText('+2')).toBeInTheDocument();
    });

    it('태그가 없을 때 태그 섹션이 렌더링되지 않아야 함', () => {
      const memo: Memo = {
        id: 'memo-1',
        title: '메모',
        content: '내용',
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        connectionCount: 0,
      };

      render(
        <MemoList
          memos={[memo]}
          onMemoClick={mockOnMemoClick}
          onNewMemo={mockOnNewMemo}
        />
      );

      const tags = screen.queryByText(/#/);
      expect(tags).not.toBeInTheDocument();
    });
  });

  describe('연결 개수', () => {
    it('연결이 없을 때 연결 개수가 표시되지 않아야 함', () => {
      const memo: Memo = {
        id: 'memo-1',
        title: '메모',
        content: '내용',
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        connectionCount: 0,
      };

      render(
        <MemoList
          memos={[memo]}
          onMemoClick={mockOnMemoClick}
          onNewMemo={mockOnNewMemo}
        />
      );

      const connectionIcon = screen.queryByText('🔗');
      expect(connectionIcon).not.toBeInTheDocument();
    });

    it('연결이 있을 때 연결 개수가 표시되어야 함', () => {
      const memo: Memo = {
        id: 'memo-1',
        title: '메모',
        content: '내용',
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        connectionCount: 5,
      };

      render(
        <MemoList
          memos={[memo]}
          onMemoClick={mockOnMemoClick}
          onNewMemo={mockOnNewMemo}
        />
      );

      expect(screen.getByText('🔗')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  describe('여러 메모', () => {
    it('10개의 메모를 렌더링할 수 있어야 함', () => {
      const manyMemos: Memo[] = Array.from({ length: 10 }, (_, i) => ({
        id: `memo-${i}`,
        title: `메모 ${i}`,
        content: `내용 ${i}`,
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        connectionCount: 0,
      }));

      render(
        <MemoList
          memos={manyMemos}
          onMemoClick={mockOnMemoClick}
          onNewMemo={mockOnNewMemo}
        />
      );

      expect(screen.getByText('메모 0')).toBeInTheDocument();
      expect(screen.getByText('메모 9')).toBeInTheDocument();
    });
  });
});
