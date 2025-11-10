/**
 * 지식 라이브러리 데이터 정제 스크립트
 * - 중복 데이터 제거
 * - 템플릿 패턴 제거
 * - 논리적 오류 수정
 * - 출처 정보 검증
 */

const fs = require('fs');
const path = require('path');

const LIBRARY_DIR = path.join(__dirname, '../public/data/knowledge-base/library');
const BACKUP_DIR = path.join(__dirname, '../public/data/knowledge-base/backup');

// 템플릿 패턴 정규식
const TEMPLATE_PATTERNS = [
  /는 선택이 아니라 필수다/,
  /진정한 .+[은는] .+에서 온다/,
  /우리에게 필요한 건 .+[이가] 아니라 .+[이이]다/,
  /인생에서 가장 중요한 것은 .+[이가] 아니라 .+[이이]다/,
];

// 정확한 영화 연도
const MOVIE_YEARS = {
  '쇼생크 탈출': 1994,
  '대부': 1972,
  '다크 나이트': 2008,
  '포레스트 검프': 1994,
  '인셉션': 2010,
  '매트릭스': 1999,
  '스타워즈': 1977,
  '타이타닉': 1997,
  '기생충': 2019,
  '어벤져스': 2012,
  '반지의 제왕': 2001,
  '펄프 픽션': 1994,
  '인터스텔라': 2014,
  '아이언맨': 2008,
  '겨울왕국': 2013
};

/**
 * 백업 생성
 */
function createBackup() {
  console.log('📦 백업 생성 중...');

  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const files = fs.readdirSync(LIBRARY_DIR).filter(f => f.endsWith('.json'));

  for (const file of files) {
    const sourcePath = path.join(LIBRARY_DIR, file);
    const backupPath = path.join(BACKUP_DIR, file);
    fs.copyFileSync(sourcePath, backupPath);
  }

  console.log(`✅ 백업 완료: ${BACKUP_DIR}\n`);
}

/**
 * 템플릿 패턴 감지
 */
function isTemplateGenerated(content) {
  return TEMPLATE_PATTERNS.some(pattern => pattern.test(content));
}

/**
 * 중복 제거 (컨텐츠 기준)
 */
function removeDuplicates(items) {
  const seen = new Set();
  const unique = [];

  for (const item of items) {
    // 영화/저자 정보 제거하고 순수 내용만 추출
    const content = item.content.replace(/\s*-\s*.+$/, '').trim();

    if (!seen.has(content)) {
      seen.add(content);
      unique.push(item);
    }
  }

  return unique;
}

/**
 * 영화 연도 수정
 */
function fixMovieYear(item) {
  if (item.source && item.source.title) {
    const title = item.source.title;
    if (MOVIE_YEARS[title]) {
      item.source.year = String(MOVIE_YEARS[title]);
    }
  }
  return item;
}

/**
 * 파일 정제
 */
function cleanFile(fileName) {
  const filePath = path.join(LIBRARY_DIR, fileName);

  console.log(`🔧 ${fileName} 정제 중...`);

  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const originalCount = data.length;

  // 1. 템플릿 생성 데이터 제거
  let cleaned = data.filter(item => !isTemplateGenerated(item.content));
  const templateRemoved = originalCount - cleaned.length;

  // 2. 중복 제거
  cleaned = removeDuplicates(cleaned);
  const duplicatesRemoved = (originalCount - templateRemoved) - cleaned.length;

  // 3. 영화 연도 수정
  cleaned = cleaned.map(fixMovieYear);

  // 4. ID 재배정
  cleaned = cleaned.map((item, index) => {
    const prefix = fileName.replace('.json', '').replace(/-/g, '').substring(0, 3);
    return {
      ...item,
      id: `${prefix}${String(index + 1).padStart(5, '0')}`
    };
  });

  // 저장
  fs.writeFileSync(filePath, JSON.stringify(cleaned, null, 2));

  console.log(`   📊 원본: ${originalCount.toLocaleString()}개`);
  console.log(`   ❌ 템플릿 제거: ${templateRemoved.toLocaleString()}개`);
  console.log(`   ❌ 중복 제거: ${duplicatesRemoved.toLocaleString()}개`);
  console.log(`   ✅ 최종: ${cleaned.length.toLocaleString()}개\n`);

  return {
    file: fileName,
    original: originalCount,
    cleaned: cleaned.length,
    removed: originalCount - cleaned.length
  };
}

/**
 * 메인 실행
 */
function main() {
  console.log('🧹 지식 라이브러리 데이터 정제 시작...\n');

  // 백업 생성
  createBackup();

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

  const results = [];
  let totalOriginal = 0;
  let totalCleaned = 0;
  let totalRemoved = 0;

  for (const file of files) {
    const result = cleanFile(file);
    results.push(result);
    totalOriginal += result.original;
    totalCleaned += result.cleaned;
    totalRemoved += result.removed;
  }

  // 결과 요약
  console.log('📊 정제 결과 요약:\n');
  console.log(`총 원본 데이터: ${totalOriginal.toLocaleString()}개`);
  console.log(`제거된 데이터: ${totalRemoved.toLocaleString()}개 (${(totalRemoved / totalOriginal * 100).toFixed(1)}%)`);
  console.log(`정제된 데이터: ${totalCleaned.toLocaleString()}개\n`);

  // 파일별 상세
  console.log('📁 파일별 상세:\n');
  results.forEach((r, i) => {
    const percentage = (r.removed / r.original * 100).toFixed(1);
    console.log(`${i + 1}. ${r.file}`);
    console.log(`   ${r.original.toLocaleString()} → ${r.cleaned.toLocaleString()} (-${r.removed.toLocaleString()}, ${percentage}%)`);
  });

  console.log('\n✅ 데이터 정제 완료!');
  console.log(`📂 백업 위치: ${BACKUP_DIR}`);
  console.log(`📂 정제된 데이터: ${LIBRARY_DIR}\n`);

  // 권장사항
  if (totalCleaned < 1000) {
    console.log('⚠️  경고: 정제 후 데이터가 너무 적습니다.');
    console.log('💡 실제 검증된 데이터로 보강이 필요합니다.\n');
  } else {
    console.log('💡 다음 단계:');
    console.log('   1. npm run build로 빌드');
    console.log('   2. npm run dev로 테스트');
    console.log('   3. 실제 검증된 데이터로 점진적 보강\n');
  }
}

main();
