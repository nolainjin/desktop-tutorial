import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IdeaCard } from './IdeaCard';
import { Idea } from '../../types/idea';

describe('IdeaCard', () => {
  const mockOnFeedback = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const baseIdea: Idea = {
    id: 'idea-1',
    memoId: 'memo-1',
    type: 'book',
    content: '테스트 아이디어 내용입니다.',
    source: {
      author: '저자명',
      title: '책 제목',
      year: '2024',
      category: '자기계발',
      url: 'https://example.com',
      platform: 'Google Books',
    },
    similarity: 0.85,
    reasoning: '이 내용은 메모와 관련이 있습니다.',
    createdAt: new Date(),
  };

  describe('기본 렌더링', () => {
    it('아이디어 카드가 렌더링되어야 함', () => {
      render(<IdeaCard idea={baseIdea} onFeedback={mockOnFeedback} />);

      expect(screen.getByText('테스트 아이디어 내용입니다.')).toBeInTheDocument();
    });

    it('타입 아이콘과 레이블이 표시되어야 함', () => {
      render(<IdeaCard idea={baseIdea} onFeedback={mockOnFeedback} />);

      expect(screen.getByText('📚 책')).toBeInTheDocument();
    });

    it('유사도가 퍼센트로 표시되어야 함', () => {
      render(<IdeaCard idea={baseIdea} onFeedback={mockOnFeedback} />);

      expect(screen.getByText('85% 관련도')).toBeInTheDocument();
    });

    it('연결 이유가 표시되어야 함', () => {
      render(<IdeaCard idea={baseIdea} onFeedback={mockOnFeedback} />);

      expect(screen.getByText('💭 연결 이유')).toBeInTheDocument();
      expect(screen.getByText('이 내용은 메모와 관련이 있습니다.')).toBeInTheDocument();
    });
  });

  describe('출처 정보', () => {
    it('저자 정보가 표시되어야 함', () => {
      render(<IdeaCard idea={baseIdea} onFeedback={mockOnFeedback} />);

      expect(screen.getByText('저자:')).toBeInTheDocument();
      expect(screen.getByText('저자명')).toBeInTheDocument();
    });

    it('제목 정보가 표시되어야 함', () => {
      render(<IdeaCard idea={baseIdea} onFeedback={mockOnFeedback} />);

      expect(screen.getByText('제목:')).toBeInTheDocument();
      expect(screen.getByText('책 제목')).toBeInTheDocument();
    });

    it('연도 정보가 표시되어야 함', () => {
      render(<IdeaCard idea={baseIdea} onFeedback={mockOnFeedback} />);

      expect(screen.getByText('연도:')).toBeInTheDocument();
      expect(screen.getByText('2024')).toBeInTheDocument();
    });

    it('분류 정보가 표시되어야 함', () => {
      render(<IdeaCard idea={baseIdea} onFeedback={mockOnFeedback} />);

      expect(screen.getByText('분류:')).toBeInTheDocument();
      expect(screen.getByText('자기계발')).toBeInTheDocument();
    });

    it('URL 링크가 표시되어야 함', () => {
      render(<IdeaCard idea={baseIdea} onFeedback={mockOnFeedback} />);

      const link = screen.getByText('🔗 바로가기');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', 'https://example.com');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('저자가 없으면 저자 정보가 표시되지 않아야 함', () => {
      const ideaWithoutAuthor = {
        ...baseIdea,
        source: { ...baseIdea.source, author: undefined },
      };

      render(<IdeaCard idea={ideaWithoutAuthor} onFeedback={mockOnFeedback} />);

      expect(screen.queryByText('저자:')).not.toBeInTheDocument();
    });

    it('제목이 없으면 제목 정보가 표시되지 않아야 함', () => {
      const ideaWithoutTitle = {
        ...baseIdea,
        source: { ...baseIdea.source, title: undefined },
      };

      render(<IdeaCard idea={ideaWithoutTitle} onFeedback={mockOnFeedback} />);

      expect(screen.queryByText('제목:')).not.toBeInTheDocument();
    });

    it('연도가 없으면 연도 정보가 표시되지 않아야 함', () => {
      const ideaWithoutYear = {
        ...baseIdea,
        source: { ...baseIdea.source, year: undefined },
      };

      render(<IdeaCard idea={ideaWithoutYear} onFeedback={mockOnFeedback} />);

      expect(screen.queryByText('연도:')).not.toBeInTheDocument();
    });

    it('분류가 없으면 분류 정보가 표시되지 않아야 함', () => {
      const ideaWithoutCategory = {
        ...baseIdea,
        source: { ...baseIdea.source, category: undefined },
      };

      render(<IdeaCard idea={ideaWithoutCategory} onFeedback={mockOnFeedback} />);

      expect(screen.queryByText('분류:')).not.toBeInTheDocument();
    });

    it('URL이 없으면 링크가 표시되지 않아야 함', () => {
      const ideaWithoutUrl = {
        ...baseIdea,
        source: { ...baseIdea.source, url: undefined },
      };

      render(<IdeaCard idea={ideaWithoutUrl} onFeedback={mockOnFeedback} />);

      expect(screen.queryByText('🔗 바로가기')).not.toBeInTheDocument();
    });
  });

  describe('피드백 버튼', () => {
    it('관련있음 버튼이 렌더링되어야 함', () => {
      render(<IdeaCard idea={baseIdea} onFeedback={mockOnFeedback} />);

      expect(screen.getByText('👍 관련있음')).toBeInTheDocument();
    });

    it('관련없음 버튼이 렌더링되어야 함', () => {
      render(<IdeaCard idea={baseIdea} onFeedback={mockOnFeedback} />);

      expect(screen.getByText('👎 관련없음')).toBeInTheDocument();
    });

    it('관련있음 버튼 클릭 시 onFeedback이 호출되어야 함', async () => {
      const user = userEvent.setup();
      render(<IdeaCard idea={baseIdea} onFeedback={mockOnFeedback} />);

      const upButton = screen.getByText('👍 관련있음');
      await user.click(upButton);

      expect(mockOnFeedback).toHaveBeenCalledWith('idea-1', 'up');
    });

    it('관련없음 버튼 클릭 시 onFeedback이 호출되어야 함', async () => {
      const user = userEvent.setup();
      render(<IdeaCard idea={baseIdea} onFeedback={mockOnFeedback} />);

      const downButton = screen.getByText('👎 관련없음');
      await user.click(downButton);

      expect(mockOnFeedback).toHaveBeenCalledWith('idea-1', 'down');
    });

    it('userFeedback이 up일 때 관련있음 버튼이 활성화되어야 함', () => {
      const ideaWithUpFeedback = { ...baseIdea, userFeedback: 'up' as const };
      render(<IdeaCard idea={ideaWithUpFeedback} onFeedback={mockOnFeedback} />);

      const upButton = screen.getByText('👍 관련있음');
      expect(upButton).toHaveClass('bg-green-600', 'text-white');
    });

    it('userFeedback이 down일 때 관련없음 버튼이 활성화되어야 함', () => {
      const ideaWithDownFeedback = { ...baseIdea, userFeedback: 'down' as const };
      render(<IdeaCard idea={ideaWithDownFeedback} onFeedback={mockOnFeedback} />);

      const downButton = screen.getByText('👎 관련없음');
      expect(downButton).toHaveClass('bg-red-600', 'text-white');
    });
  });

  describe('아이디어 타입', () => {
    it('영화 타입이 올바르게 표시되어야 함', () => {
      const movieIdea = { ...baseIdea, type: 'movie' as const };
      render(<IdeaCard idea={movieIdea} onFeedback={mockOnFeedback} />);

      expect(screen.getByText('🎬 영화 대사')).toBeInTheDocument();
    });

    it('드라마 타입이 올바르게 표시되어야 함', () => {
      const dramaIdea = { ...baseIdea, type: 'drama' as const };
      render(<IdeaCard idea={dramaIdea} onFeedback={mockOnFeedback} />);

      expect(screen.getByText('📺 드라마 대사')).toBeInTheDocument();
    });

    it('명언 타입이 올바르게 표시되어야 함', () => {
      const quoteIdea = { ...baseIdea, type: 'famous-quote' as const };
      render(<IdeaCard idea={quoteIdea} onFeedback={mockOnFeedback} />);

      expect(screen.getByText('💭 위인 명언')).toBeInTheDocument();
    });

    it('속담 타입이 올바르게 표시되어야 함', () => {
      const proverbIdea = { ...baseIdea, type: 'proverb' as const };
      render(<IdeaCard idea={proverbIdea} onFeedback={mockOnFeedback} />);

      expect(screen.getByText('📜 고전 속담')).toBeInTheDocument();
    });

    it('학문적 타입이 올바르게 표시되어야 함', () => {
      const academicIdea = { ...baseIdea, type: 'academic' as const };
      render(<IdeaCard idea={academicIdea} onFeedback={mockOnFeedback} />);

      expect(screen.getByText('🎓 학문적 내용')).toBeInTheDocument();
    });

    it('메모 타입이 올바르게 표시되어야 함', () => {
      const memoIdea = { ...baseIdea, type: 'memo' as const };
      render(<IdeaCard idea={memoIdea} onFeedback={mockOnFeedback} />);

      expect(screen.getByText('📝 내 메모')).toBeInTheDocument();
    });
  });

  describe('유사도 표시', () => {
    it('유사도가 반올림되어 표시되어야 함', () => {
      const idea = { ...baseIdea, similarity: 0.754 };
      render(<IdeaCard idea={idea} onFeedback={mockOnFeedback} />);

      expect(screen.getByText('75% 관련도')).toBeInTheDocument();
    });

    it('유사도가 100%일 때 올바르게 표시되어야 함', () => {
      const idea = { ...baseIdea, similarity: 1.0 };
      render(<IdeaCard idea={idea} onFeedback={mockOnFeedback} />);

      expect(screen.getByText('100% 관련도')).toBeInTheDocument();
    });

    it('유사도가 0%일 때 올바르게 표시되어야 함', () => {
      const idea = { ...baseIdea, similarity: 0 };
      render(<IdeaCard idea={idea} onFeedback={mockOnFeedback} />);

      expect(screen.getByText('0% 관련도')).toBeInTheDocument();
    });
  });
});
