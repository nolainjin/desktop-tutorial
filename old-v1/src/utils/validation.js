// 연결 데이터 검증
export function validateConnection(connection) {
  const warnings = [];

  // 필수 필드
  if (!connection.content) {
    warnings.push("콘텐츠가 없습니다");
  }

  if (!connection.type) {
    warnings.push("타입이 지정되지 않았습니다");
  }

  // 타입별 필수 정보
  switch (connection.type) {
    case "quote":
      if (!connection.source.author) {
        warnings.push("저자 정보가 없습니다");
      }
      if (!connection.source.title && !connection.source.category) {
        warnings.push("출처 또는 카테고리가 필요합니다");
      }
      break;

    case "web":
      if (!connection.source.url) {
        warnings.push("웹 결과에는 URL이 필요합니다");
      }
      if (!connection.source.title) {
        warnings.push("제목이 필요합니다");
      }
      break;

    case "movie":
      if (!connection.source.title) {
        warnings.push("영화 제목이 필요합니다");
      }
      break;

    case "memo":
      // 내 메모는 출처가 없어도 됨
      break;

    default:
      warnings.push(`알 수 없는 타입: ${connection.type}`);
  }

  if (warnings.length > 0) {
    console.warn(`연결 ${connection.id} 검증 실패:`, warnings);
    connection.incomplete = true;
    connection.warnings = warnings;
  }

  return warnings;
}

// 출처 정보 완전성 체크
export function isSourceComplete(source) {
  if (!source) return false;

  // 최소한 하나의 정보는 있어야 함
  return !!(
    source.author ||
    source.title ||
    source.url ||
    source.category
  );
}

// 출처 정보를 읽기 좋은 텍스트로 변환
export function formatSourceInfo(source, type) {
  const parts = [];

  if (source.author) {
    parts.push(source.author);
  }

  if (source.title) {
    parts.push(source.title);
  }

  if (source.year) {
    parts.push(`(${source.year})`);
  }

  if (parts.length === 0) {
    return "출처 불명";
  }

  return parts.join(', ');
}

// 아이디어 검증
export function validateIdea(idea) {
  const errors = [];

  if (!idea.title || idea.title.trim() === '') {
    errors.push("제목을 입력해주세요");
  }

  if (!idea.content || idea.content.trim() === '') {
    errors.push("내용을 입력해주세요");
  }

  if (idea.title && idea.title.length > 100) {
    errors.push("제목은 100자 이내로 입력해주세요");
  }

  return errors;
}

// 태그 파싱
export function parseTags(tagString) {
  if (!tagString || tagString.trim() === '') {
    return [];
  }

  return tagString
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
    .slice(0, 10); // 최대 10개
}
