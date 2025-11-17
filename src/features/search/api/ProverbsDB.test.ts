import { describe, it, expect } from 'vitest';
import { koreanProverbs } from './ProverbsDB';

describe('ProverbsDB', () => {
  it('10개의 속담을 포함해야 함', () => {
    expect(koreanProverbs).toHaveLength(10);
  });

  it('각 속담은 content, keywords, category를 가져야 함', () => {
    koreanProverbs.forEach(proverb => {
      expect(proverb).toHaveProperty('content');
      expect(proverb).toHaveProperty('keywords');
      expect(proverb).toHaveProperty('category');
      expect(typeof proverb.content).toBe('string');
      expect(Array.isArray(proverb.keywords)).toBe(true);
      expect(typeof proverb.category).toBe('string');
    });
  });

  it('성장 관련 속담을 찾을 수 있어야 함', () => {
    const growthProverbs = koreanProverbs.filter(p =>
      p.keywords.includes('성장')
    );
    expect(growthProverbs.length).toBeGreaterThan(0);
  });

  it('습관 관련 속담을 찾을 수 있어야 함', () => {
    const habitProverbs = koreanProverbs.filter(p =>
      p.keywords.includes('습관')
    );
    expect(habitProverbs.length).toBeGreaterThan(0);
  });

  it('실패 관련 속담을 찾을 수 있어야 함', () => {
    const failureProverbs = koreanProverbs.filter(p =>
      p.keywords.includes('실패')
    );
    expect(failureProverbs.length).toBeGreaterThan(0);
    expect(failureProverbs.some(p => p.content === '실패는 성공의 어머니')).toBe(true);
  });

  it('친구 관련 속담을 찾을 수 있어야 함', () => {
    const friendshipProverbs = koreanProverbs.filter(p =>
      p.keywords.includes('친구')
    );
    expect(friendshipProverbs.length).toBeGreaterThan(0);
  });

  it('유명한 속담들을 포함해야 함', () => {
    const contents = koreanProverbs.map(p => p.content);
    expect(contents).toContain('티끌 모아 태산');
    expect(contents).toContain('천 리 길도 한 걸음부터');
    expect(contents).toContain('백지장도 맞들면 낫다');
  });

  it('각 속담은 카테고리가 있어야 함', () => {
    const categories = koreanProverbs.map(p => p.category);
    expect(categories).toContain('노력');
    expect(categories).toContain('시작');
    expect(categories).toContain('협동');
    expect(categories).toContain('실패');
  });

  it('키워드가 비어있지 않아야 함', () => {
    koreanProverbs.forEach(proverb => {
      expect(proverb.keywords.length).toBeGreaterThan(0);
    });
  });
});
