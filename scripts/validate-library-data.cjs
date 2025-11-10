/**
 * 지식 라이브러리 데이터 검증 스크립트
 * - 중복 컨텐츠 확인
 * - 출처 논리 오류 확인
 * - 문법 오류 확인
 */

const fs = require('fs');
const path = require('path');

const LIBRARY_DIR = path.join(__dirname, '../public/data/knowledge-base/library');

// 검증 결과
const validationResults = {
  totalItems: 0,
  duplicateContent: [],
  invalidSources: [],
  grammarErrors: [],
  templatePatterns: [],
  recommendations: []
};

/**
 * 모든 라이브러리 파일 로드
 */
function loadAllLibraries() {
  const files = [
    'famous-quotes.json',
    'movie-quotes.json',
    'book-quotes.json',
    'proverbs.json',
    'academic.json',
    'essays.json',
    'poems.json',
    'drama-quotes.json',
    'animation-quotes.json',
    'web-articles.json'
  ];

  const allData = [];

  for (const file of files) {
    const filePath = path.join(LIBRARY_DIR, file);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      allData.push(...data.map(item => ({ ...item, sourceFile: file })));
    }
  }

  return allData;
}

/**
 * 중복 컨텐츠 확인
 */
function checkDuplicates(items) {
  const contentMap = new Map();

  for (const item of items) {
    // 영화/저자 정보 제거하고 순수 내용만 추출
    const content = item.content.replace(/\s*-\s*.+$/, '').trim();

    if (contentMap.has(content)) {
      contentMap.get(content).push(item);
    } else {
      contentMap.set(content, [item]);
    }
  }

  // 2개 이상 중복된 것만 반환
  const duplicates = [];
  for (const [content, items] of contentMap.entries()) {
    if (items.length > 1) {
      duplicates.push({
        content,
        count: items.length,
        sources: items.map(i => ({
          id: i.id,
          source: i.source?.title || i.author || 'Unknown',
          file: i.sourceFile
        }))
      });
    }
  }

  return duplicates;
}

/**
 * 템플릿 패턴 감지
 */
function detectTemplatePatterns(items) {
  const patterns = [
    { pattern: /는 선택이 아니라 필수다/, name: '선택-필수 패턴' },
    { pattern: /진정한 .+은 .+에서 온다/, name: '진정한-온다 패턴' },
    { pattern: /우리에게 필요한 건 .+이 아니라 .+이다/, name: '필요한-아니라 패턴' },
    { pattern: /삶은 .+이다/, name: '삶은 패턴' },
    { pattern: /인생에서 가장 중요한 것은/, name: '인생-중요 패턴' }
  ];

  const detected = [];

  for (const pattern of patterns) {
    const matches = items.filter(item => pattern.pattern.test(item.content));
    if (matches.length > 10) { // 10개 이상이면 템플릿으로 간주
      detected.push({
        patternName: pattern.name,
        count: matches.length,
        examples: matches.slice(0, 3).map(m => ({
          id: m.id,
          content: m.content,
          source: m.source?.title || m.author || 'Unknown'
        }))
      });
    }
  }

  return detected;
}

/**
 * 문법 오류 확인
 */
function checkGrammarErrors(items) {
  const errors = [];

  // 조사 오류: "친구은", "습관은" 등
  const wrongParticles = items.filter(item =>
    /[ㄱ-ㅎ가-힣]+이(?=\s)/g.test(item.content) &&
    /[받침없음]이/.test(item.content)
  );

  if (wrongParticles.length > 0) {
    errors.push({
      type: '조사 오류',
      count: wrongParticles.length,
      examples: wrongParticles.slice(0, 5).map(i => ({
        id: i.id,
        content: i.content
      }))
    });
  }

  return errors;
}

/**
 * 영화 연도 검증
 */
function validateMovieYears(items) {
  const knownMovies = {
    '쇼생크 탈출': 1994,
    '대부': 1972,
    '다크 나이트': 2008,
    '포레스트 검프': 1994,
    '인셉션': 2010,
    '매트릭스': 1999,
    '스타워즈': 1977,
    '타이타닉': 1997,
    '기생충': 2019,
    '어벤져스': 2012
  };

  const invalid = [];

  for (const item of items) {
    const title = item.source?.title;
    const year = item.source?.year;

    if (title && year && knownMovies[title]) {
      const correctYear = knownMovies[title];
      if (parseInt(year) !== correctYear) {
        invalid.push({
          id: item.id,
          title,
          wrongYear: year,
          correctYear
        });
      }
    }
  }

  return invalid;
}

/**
 * 메인 검증
 */
function main() {
  console.log('🔍 지식 라이브러리 데이터 검증 시작...\n');

  const allItems = loadAllLibraries();
  validationResults.totalItems = allItems.length;

  console.log(`📊 총 데이터 개수: ${allItems.length.toLocaleString()}개\n`);

  // 1. 중복 검사
  console.log('1️⃣ 중복 컨텐츠 검사...');
  validationResults.duplicateContent = checkDuplicates(allItems);
  console.log(`   - 중복된 컨텐츠: ${validationResults.duplicateContent.length}개\n`);

  // 2. 템플릿 패턴 검사
  console.log('2️⃣ 템플릿 패턴 검사...');
  validationResults.templatePatterns = detectTemplatePatterns(allItems);
  console.log(`   - 감지된 템플릿 패턴: ${validationResults.templatePatterns.length}개\n`);

  // 3. 문법 오류 검사
  console.log('3️⃣ 문법 오류 검사...');
  validationResults.grammarErrors = checkGrammarErrors(allItems);
  console.log(`   - 문법 오류: ${validationResults.grammarErrors.length}개 유형\n`);

  // 4. 영화 연도 검증
  console.log('4️⃣ 영화 연도 검증...');
  validationResults.invalidSources = validateMovieYears(allItems);
  console.log(`   - 잘못된 연도: ${validationResults.invalidSources.length}개\n`);

  // 결과 상세 출력
  console.log('\n📋 검증 결과 상세:\n');

  if (validationResults.duplicateContent.length > 0) {
    console.log('❌ 중복 컨텐츠 (상위 10개):');
    validationResults.duplicateContent.slice(0, 10).forEach((dup, i) => {
      console.log(`   ${i + 1}. "${dup.content.substring(0, 50)}..."`);
      console.log(`      중복 횟수: ${dup.count}회`);
      console.log(`      출처: ${dup.sources.map(s => s.source).join(', ')}\n`);
    });
  }

  if (validationResults.templatePatterns.length > 0) {
    console.log('\n❌ 템플릿 패턴 감지:');
    validationResults.templatePatterns.forEach((pattern, i) => {
      console.log(`   ${i + 1}. ${pattern.patternName}: ${pattern.count}개`);
      pattern.examples.forEach(ex => {
        console.log(`      - ${ex.content}`);
      });
      console.log('');
    });
  }

  if (validationResults.invalidSources.length > 0) {
    console.log('\n❌ 잘못된 영화 연도 (상위 10개):');
    validationResults.invalidSources.slice(0, 10).forEach((inv, i) => {
      console.log(`   ${i + 1}. "${inv.title}": ${inv.wrongYear} → ${inv.correctYear} (실제)`);
    });
    console.log('');
  }

  // 권장사항
  console.log('\n💡 권장사항:\n');

  const issues = [];

  if (validationResults.duplicateContent.length > 100) {
    issues.push('중복 컨텐츠가 많습니다');
  }

  if (validationResults.templatePatterns.length > 0) {
    const totalTemplateItems = validationResults.templatePatterns.reduce((sum, p) => sum + p.count, 0);
    const percentage = (totalTemplateItems / allItems.length * 100).toFixed(1);
    issues.push(`템플릿으로 생성된 데이터가 ${totalTemplateItems.toLocaleString()}개 (${percentage}%)입니다`);
  }

  if (validationResults.invalidSources.length > 50) {
    issues.push('출처 정보가 부정확합니다');
  }

  if (issues.length > 0) {
    console.log('⚠️  심각한 데이터 품질 문제가 발견되었습니다:\n');
    issues.forEach((issue, i) => {
      console.log(`   ${i + 1}. ${issue}`);
    });
    console.log('\n🔧 해결 방법:');
    console.log('   1. 실제 검증된 데이터로 교체');
    console.log('   2. 템플릿 생성 데이터 제거');
    console.log('   3. 중복 데이터 정리');
    console.log('   4. 출처 정보 수정\n');
  } else {
    console.log('✅ 데이터 품질이 양호합니다.\n');
  }

  // JSON 리포트 저장
  const reportPath = path.join(__dirname, '../validation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(validationResults, null, 2));
  console.log(`📄 상세 리포트: ${reportPath}\n`);
}

main();
