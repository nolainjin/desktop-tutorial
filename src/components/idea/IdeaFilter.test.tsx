import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IdeaFilter } from './IdeaFilter';
import { IdeaType } from '../../types/idea';

describe('IdeaFilter', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('기본 렌더링', () => {
    it('제목이 렌더링되어야 함', () => {
      render(<IdeaFilter selectedTypes={[]} onChange={mockOnChange} />);

      expect(screen.getByText('🎯 검색할 분류 선택')).toBeInTheDocument();
    });

    it('전체 선택 버튼이 렌더링되어야 함', () => {
      render(<IdeaFilter selectedTypes={[]} onChange={mockOnChange} />);

      expect(screen.getByText('전체 선택')).toBeInTheDocument();
    });

    it('전체 해제 버튼이 렌더링되어야 함', () => {
      render(<IdeaFilter selectedTypes={[]} onChange={mockOnChange} />);

      expect(screen.getByText('전체 해제')).toBeInTheDocument();
    });

    it('모든 아이디어 타입이 렌더링되어야 함', () => {
      render(<IdeaFilter selectedTypes={[]} onChange={mockOnChange} />);

      expect(screen.getByText('🎬 영화')).toBeInTheDocument();
      expect(screen.getByText('📺 드라마')).toBeInTheDocument();
      expect(screen.getByText('🎨 애니메이션')).toBeInTheDocument();
      expect(screen.getByText('📚 책')).toBeInTheDocument();
      expect(screen.getByText('✍️ 에세이')).toBeInTheDocument();
      expect(screen.getByText('📖 시')).toBeInTheDocument();
      expect(screen.getByText('💭 위인 명언')).toBeInTheDocument();
      expect(screen.getByText('📜 속담')).toBeInTheDocument();
      expect(screen.getByText('🎓 학문')).toBeInTheDocument();
      expect(screen.getByText('🌐 웹자료')).toBeInTheDocument();
    });

    it('10개의 타입 버튼이 렌더링되어야 함', () => {
      render(<IdeaFilter selectedTypes={[]} onChange={mockOnChange} />);

      const typeButtons = screen.getAllByRole('button').filter(
        btn => !['전체 선택', '전체 해제'].includes(btn.textContent || '')
      );

      expect(typeButtons).toHaveLength(10);
    });
  });

  describe('전체 선택 기능', () => {
    it('전체 선택 버튼 클릭 시 모든 타입이 선택되어야 함', async () => {
      const user = userEvent.setup();
      render(<IdeaFilter selectedTypes={[]} onChange={mockOnChange} />);

      const selectAllButton = screen.getByText('전체 선택');
      await user.click(selectAllButton);

      expect(mockOnChange).toHaveBeenCalledWith([
        'movie',
        'drama',
        'animation',
        'book',
        'essay',
        'poem',
        'famous-quote',
        'proverb',
        'academic',
        'web',
      ]);
    });

    it('일부 선택된 상태에서 전체 선택을 클릭하면 모든 타입이 선택되어야 함', async () => {
      const user = userEvent.setup();
      render(
        <IdeaFilter
          selectedTypes={['movie', 'book']}
          onChange={mockOnChange}
        />
      );

      const selectAllButton = screen.getByText('전체 선택');
      await user.click(selectAllButton);

      expect(mockOnChange).toHaveBeenCalledWith([
        'movie',
        'drama',
        'animation',
        'book',
        'essay',
        'poem',
        'famous-quote',
        'proverb',
        'academic',
        'web',
      ]);
    });
  });

  describe('전체 해제 기능', () => {
    it('전체 해제 버튼 클릭 시 모든 타입이 해제되어야 함', async () => {
      const user = userEvent.setup();
      render(
        <IdeaFilter
          selectedTypes={['movie', 'book', 'drama']}
          onChange={mockOnChange}
        />
      );

      const deselectAllButton = screen.getByText('전체 해제');
      await user.click(deselectAllButton);

      expect(mockOnChange).toHaveBeenCalledWith([]);
    });

    it('빈 상태에서 전체 해제를 클릭해도 빈 배열이 전달되어야 함', async () => {
      const user = userEvent.setup();
      render(<IdeaFilter selectedTypes={[]} onChange={mockOnChange} />);

      const deselectAllButton = screen.getByText('전체 해제');
      await user.click(deselectAllButton);

      expect(mockOnChange).toHaveBeenCalledWith([]);
    });
  });

  describe('개별 타입 토글', () => {
    it('선택되지 않은 타입을 클릭하면 추가되어야 함', async () => {
      const user = userEvent.setup();
      render(<IdeaFilter selectedTypes={[]} onChange={mockOnChange} />);

      const movieButton = screen.getByText('🎬 영화');
      await user.click(movieButton);

      expect(mockOnChange).toHaveBeenCalledWith(['movie']);
    });

    it('이미 선택된 타입을 클릭하면 제거되어야 함', async () => {
      const user = userEvent.setup();
      render(
        <IdeaFilter
          selectedTypes={['movie', 'book']}
          onChange={mockOnChange}
        />
      );

      const movieButton = screen.getByText('🎬 영화');
      await user.click(movieButton);

      expect(mockOnChange).toHaveBeenCalledWith(['book']);
    });

    it('여러 타입을 순차적으로 선택할 수 있어야 함', async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <IdeaFilter selectedTypes={[]} onChange={mockOnChange} />
      );

      // 첫 번째 타입 선택
      const movieButton = screen.getByText('🎬 영화');
      await user.click(movieButton);
      expect(mockOnChange).toHaveBeenCalledWith(['movie']);

      // 두 번째 타입 선택 (상태 업데이트 시뮬레이션)
      rerender(
        <IdeaFilter selectedTypes={['movie']} onChange={mockOnChange} />
      );
      const bookButton = screen.getByText('📚 책');
      await user.click(bookButton);
      expect(mockOnChange).toHaveBeenCalledWith(['movie', 'book']);
    });

    it('모든 타입을 개별적으로 토글할 수 있어야 함', async () => {
      const user = userEvent.setup();
      render(<IdeaFilter selectedTypes={[]} onChange={mockOnChange} />);

      const allTypeButtons = [
        '🎬 영화',
        '📺 드라마',
        '🎨 애니메이션',
        '📚 책',
        '✍️ 에세이',
        '📖 시',
        '💭 위인 명언',
        '📜 속담',
        '🎓 학문',
        '🌐 웹자료',
      ];

      for (const buttonText of allTypeButtons) {
        mockOnChange.mockClear();
        const button = screen.getByText(buttonText);
        await user.click(button);
        expect(mockOnChange).toHaveBeenCalled();
      }
    });
  });

  describe('선택 상태 표시', () => {
    it('선택된 타입은 활성화 스타일이 적용되어야 함', () => {
      render(
        <IdeaFilter
          selectedTypes={['movie', 'book']}
          onChange={mockOnChange}
        />
      );

      const movieButton = screen.getByText('🎬 영화');
      expect(movieButton).toHaveClass('bg-blue-100', 'border-blue-300', 'text-blue-700');
    });

    it('선택되지 않은 타입은 기본 스타일이 적용되어야 함', () => {
      render(
        <IdeaFilter
          selectedTypes={['movie']}
          onChange={mockOnChange}
        />
      );

      const bookButton = screen.getByText('📚 책');
      expect(bookButton).toHaveClass('bg-gray-50', 'border-gray-200', 'text-gray-700');
    });

    it('여러 타입이 선택된 상태를 올바르게 표시해야 함', () => {
      const selectedTypes: IdeaType[] = ['movie', 'book', 'drama'];
      render(
        <IdeaFilter
          selectedTypes={selectedTypes}
          onChange={mockOnChange}
        />
      );

      const movieButton = screen.getByText('🎬 영화');
      const bookButton = screen.getByText('📚 책');
      const dramaButton = screen.getByText('📺 드라마');
      const essayButton = screen.getByText('✍️ 에세이');

      expect(movieButton).toHaveClass('bg-blue-100');
      expect(bookButton).toHaveClass('bg-blue-100');
      expect(dramaButton).toHaveClass('bg-blue-100');
      expect(essayButton).toHaveClass('bg-gray-50');
    });
  });

  describe('엣지 케이스', () => {
    it('선택된 타입이 없을 때 올바르게 렌더링되어야 함', () => {
      render(<IdeaFilter selectedTypes={[]} onChange={mockOnChange} />);

      const movieButton = screen.getByText('🎬 영화');
      expect(movieButton).toHaveClass('bg-gray-50');
    });

    it('모든 타입이 선택된 상태를 올바르게 표시해야 함', () => {
      const allTypes: IdeaType[] = [
        'movie',
        'drama',
        'animation',
        'book',
        'essay',
        'poem',
        'famous-quote',
        'proverb',
        'academic',
        'web',
      ];

      render(
        <IdeaFilter selectedTypes={allTypes} onChange={mockOnChange} />
      );

      const movieButton = screen.getByText('🎬 영화');
      const webButton = screen.getByText('🌐 웹자료');

      expect(movieButton).toHaveClass('bg-blue-100');
      expect(webButton).toHaveClass('bg-blue-100');
    });

    it('마지막 선택된 타입을 해제할 수 있어야 함', async () => {
      const user = userEvent.setup();
      render(
        <IdeaFilter selectedTypes={['movie']} onChange={mockOnChange} />
      );

      const movieButton = screen.getByText('🎬 영화');
      await user.click(movieButton);

      expect(mockOnChange).toHaveBeenCalledWith([]);
    });
  });
});
