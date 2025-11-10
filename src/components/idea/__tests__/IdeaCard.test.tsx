import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { IdeaCard } from '../IdeaCard';
import { Idea } from '@/types/idea';
import userEvent from '@testing-library/user-event';

describe('IdeaCard', () => {
  const mockIdea: Idea = {
    id: 'test-idea-1',
    memoId: 'memo-1',
    type: 'famous-quote',
    content: '성공은 매일의 작은 습관에서 나온다.',
    source: {
      author: '아리스토텔레스',
      title: '니코마코스 윤리학',
      year: '기원전 350년',
      category: '철학',
    },
    similarity: 0.85,
    reasoning: '습관과 성장에 대한 통찰이 유사합니다',
    createdAt: new Date('2024-01-01'),
  };

  const mockOnFeedback = vi.fn();

  it('아이디어 카드가 렌더링되어야 함', () => {
    render(<IdeaCard idea={mockIdea} onFeedback={mockOnFeedback} />);

    expect(screen.getByText('성공은 매일의 작은 습관에서 나온다.')).toBeInTheDocument();
  });

  it('아이디어 타입 라벨을 표시해야 함', () => {
    render(<IdeaCard idea={mockIdea} onFeedback={mockOnFeedback} />);

    expect(screen.getByText(/위인 명언/)).toBeInTheDocument();
  });

  it('유사도 퍼센트를 표시해야 함', () => {
    render(<IdeaCard idea={mockIdea} onFeedback={mockOnFeedback} />);

    // 85% 관련도
    expect(screen.getByText(/85% 관련도/)).toBeInTheDocument();
  });

  it('출처 정보를 표시해야 함', () => {
    render(<IdeaCard idea={mockIdea} onFeedback={mockOnFeedback} />);

    expect(screen.getByText(/아리스토텔레스/)).toBeInTheDocument();
    expect(screen.getByText(/니코마코스 윤리학/)).toBeInTheDocument();
    expect(screen.getByText(/기원전 350년/)).toBeInTheDocument();
    expect(screen.getByText(/철학/)).toBeInTheDocument();
  });

  it('연결 이유를 표시해야 함', () => {
    render(<IdeaCard idea={mockIdea} onFeedback={mockOnFeedback} />);

    expect(screen.getByText(/습관과 성장에 대한 통찰이 유사합니다/)).toBeInTheDocument();
  });

  it('URL이 있으면 바로가기 링크를 표시해야 함', () => {
    const ideaWithUrl: Idea = {
      ...mockIdea,
      source: {
        ...mockIdea.source,
        url: 'https://example.com',
      },
    };

    render(<IdeaCard idea={ideaWithUrl} onFeedback={mockOnFeedback} />);

    const link = screen.getByRole('link', { name: /바로가기/ });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('관련있음 버튼 클릭 시 onFeedback이 호출되어야 함', async () => {
    const user = userEvent.setup();
    render(<IdeaCard idea={mockIdea} onFeedback={mockOnFeedback} />);

    const upButton = screen.getByRole('button', { name: /관련있음/ });
    await user.click(upButton);

    expect(mockOnFeedback).toHaveBeenCalledWith('test-idea-1', 'up');
  });

  it('관련없음 버튼 클릭 시 onFeedback이 호출되어야 함', async () => {
    const user = userEvent.setup();
    render(<IdeaCard idea={mockIdea} onFeedback={mockOnFeedback} />);

    const downButton = screen.getByRole('button', { name: /관련없음/ });
    await user.click(downButton);

    expect(mockOnFeedback).toHaveBeenCalledWith('test-idea-1', 'down');
  });

  it('사용자 피드백이 up이면 관련있음 버튼이 활성화되어야 함', () => {
    const ideaWithFeedback: Idea = {
      ...mockIdea,
      userFeedback: 'up',
    };

    render(<IdeaCard idea={ideaWithFeedback} onFeedback={mockOnFeedback} />);

    const upButton = screen.getByRole('button', { name: /관련있음/ });
    expect(upButton).toHaveClass('bg-green-600');
  });

  it('사용자 피드백이 down이면 관련없음 버튼이 활성화되어야 함', () => {
    const ideaWithFeedback: Idea = {
      ...mockIdea,
      userFeedback: 'down',
    };

    render(<IdeaCard idea={ideaWithFeedback} onFeedback={mockOnFeedback} />);

    const downButton = screen.getByRole('button', { name: /관련없음/ });
    expect(downButton).toHaveClass('bg-red-600');
  });

  it('다양한 아이디어 타입에 대해 올바른 아이콘을 표시해야 함', () => {
    const types: Array<{ type: Idea['type']; icon: string }> = [
      { type: 'movie', icon: '🎬' },
      { type: 'book', icon: '📚' },
      { type: 'poem', icon: '📖' },
    ];

    types.forEach(({ type, icon }) => {
      const idea: Idea = { ...mockIdea, type };
      const { unmount } = render(<IdeaCard idea={idea} onFeedback={mockOnFeedback} />);

      expect(screen.getByText(new RegExp(icon))).toBeInTheDocument();
      unmount();
    });
  });

  it('출처 정보가 없어도 오류 없이 렌더링되어야 함', () => {
    const ideaWithoutSource: Idea = {
      ...mockIdea,
      source: {},
    };

    render(<IdeaCard idea={ideaWithoutSource} onFeedback={mockOnFeedback} />);

    expect(screen.getByText(mockIdea.content)).toBeInTheDocument();
  });
});
