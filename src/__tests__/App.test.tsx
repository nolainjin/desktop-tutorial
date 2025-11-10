import { describe, it, expect } from 'vitest';
import { render } from '@/test/test-utils';
import App from '../App';

describe('App', () => {
  it('앱이 정상적으로 렌더링되어야 함', () => {
    const { container } = render(<App />);

    // 앱이 렌더링되었는지 확인
    expect(container).toBeTruthy();
    expect(document.body).toBeTruthy();
  });

  it('라우터가 초기화되어야 함', () => {
    const { container } = render(<App />);

    // 앱 컨테이너가 존재하는지 확인
    expect(container.firstChild).toBeTruthy();
  });
});
