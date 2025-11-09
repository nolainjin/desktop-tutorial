# 시놀로지 NAS 빠른 시작 가이드 (5분 완성!)

## 🎯 목표
시놀로지 NAS에 명언 JSON 파일을 업로드하고, Claude에서 바로 사용하기

---

## 📋 필요한 것
- ✅ 시놀로지 NAS (DSM 7.0 이상)
- ✅ 인터넷 연결
- ✅ 5분의 시간

---

## 🚀 단계별 설정 (가장 간단한 방법)

### 1단계: 폴더 생성 (1분)

1. **File Station** 열기
2. 새 폴더 생성:
   ```
   /web/ideaconnect/data/
   ```

3. 현재 프로젝트의 JSON 파일 업로드:
   - `public/data/quotes.json` → NAS의 `/web/ideaconnect/data/quotes.json`
   - `public/data/korean-quotes.json` → NAS의 `/web/ideaconnect/data/korean-quotes.json`

### 2단계: Web Station 설치 (1분)

1. **Package Center** 열기
2. **Web Station** 검색 및 설치
3. 설치 완료 대기

### 3단계: 웹 서버 설정 (2분)

1. **Web Station** 열기
2. **Web Service Portal** 탭 클릭
3. **Create** 클릭

설정값:
```
Portal type: Name-based
Hostname: ideaconnect  (또는 원하는 이름)
Port:
  - HTTP: 80
  - HTTPS: 443 (권장)
Document root: /web/ideaconnect
PHP: (선택 안 함 - JSON만 서빙)
```

4. **OK** 클릭

### 4단계: CORS 설정 (1분)

**방법 A: 간단한 방법 (File Station 사용)**

`/web/ideaconnect/.htaccess` 파일 생성:

```apache
# CORS 허용
Header set Access-Control-Allow-Origin "*"
Header set Access-Control-Allow-Methods "GET, OPTIONS"
AddType application/json .json
```

**방법 B: Web Station 설정 (더 확실)**

1. Web Station → 방금 만든 포털 선택 → **Edit**
2. **HTTP Backend Server** 탭
3. Custom Headers 추가:
   ```
   Access-Control-Allow-Origin: *
   Access-Control-Allow-Methods: GET, OPTIONS
   ```

### 5단계: 접근 테스트 (10초)

브라우저에서:
```
http://NAS-IP-주소/data/quotes.json
```

또는 (DDNS 설정된 경우):
```
http://your-nas.synology.me/data/quotes.json
```

**✅ JSON 데이터가 보이면 성공!**

---

## 🌐 외부 접속 설정 (선택사항 - Claude에서 사용하려면 필수)

### 방법 1: QuickConnect 사용 (가장 쉬움!)

1. **Control Panel** → **QuickConnect**
2. **Enable QuickConnect** 체크
3. QuickConnect ID 생성 (예: `mynas`)

접속 URL:
```
https://mynas.quickconnect.to/data/quotes.json
```

### 방법 2: DDNS + 포트포워딩 (더 빠름)

**A. DDNS 설정**
1. **Control Panel** → **External Access** → **DDNS**
2. **Add** 클릭
3. Service provider: Synology 선택
4. Hostname: `ideaconnect` (예시)
5. **OK**

**B. 라우터 포트포워딩**
1. 라우터 관리 페이지 접속
2. Port Forwarding 설정:
   ```
   External Port: 80 → NAS IP: 80
   External Port: 443 → NAS IP: 443
   ```

**C. 방화벽 설정**
1. **Control Panel** → **Security** → **Firewall**
2. Rule 추가:
   ```
   Ports: 80, 443
   Source IP: All
   Action: Allow
   ```

접속 URL:
```
http://ideaconnect.synology.me/data/quotes.json
```

### 방법 3: Tailscale (가장 안전!)

VPN 없이 안전하게 외부 접속

1. **Package Center** → **Tailscale** 설치
2. Tailscale 계정으로 로그인
3. 모든 기기에서 Tailscale 설치

접속 URL:
```
http://100.x.x.x/data/quotes.json
(Tailscale이 자동으로 할당한 IP)
```

---

## 🔐 SSL 인증서 설정 (HTTPS) - 추천!

### Let's Encrypt 무료 인증서

1. **Control Panel** → **Security** → **Certificate**
2. **Add** → **Add a new certificate**
3. **Get a certificate from Let's Encrypt** 선택
4. 입력:
   ```
   Domain name: ideaconnect.synology.me
   Email: your@email.com
   ```
5. **Apply**

이제 HTTPS로 접속 가능:
```
https://ideaconnect.synology.me/data/quotes.json
```

---

## 💻 IdeaConnect에서 NAS 데이터 사용하기

### 설정 파일 수정

`src/features/search/api/NASQuotesAPI.ts` 생성:

```typescript
import { Idea, IdeaSource } from '../../../types/idea';

// ⭐ 여기에 본인의 NAS 주소 입력
const NAS_URL = 'https://ideaconnect.synology.me';  // 또는 QuickConnect URL

interface LocalQuote {
  id: string;
  content: string;
  author: string;
  keywords: string[];
  category: string;
  type: 'famous-quote' | 'proverb';
  language: 'ko' | 'en';
}

let nasCache: LocalQuote[] | null = null;

/**
 * NAS에서 명언 로드
 */
async function loadFromNAS(): Promise<LocalQuote[]> {
  if (nasCache) {
    return nasCache;
  }

  try {
    const [enResponse, koResponse] = await Promise.all([
      fetch(`${NAS_URL}/data/quotes.json`),
      fetch(`${NAS_URL}/data/korean-quotes.json`)
    ]);

    const enQuotes = await enResponse.json();
    const koQuotes = await koResponse.json();

    nasCache = [...enQuotes, ...koQuotes];
    console.log(`✅ NAS에서 ${nasCache.length}개 명언 로드 완료`);

    return nasCache;
  } catch (error) {
    console.error('❌ NAS 명언 로드 실패:', error);
    // 폴백: 로컬 파일 사용
    return [];
  }
}

/**
 * NAS 명언 검색
 */
export async function searchNASQuotes(keywords: string[]): Promise<Partial<Idea>[]> {
  try {
    const quotes = await loadFromNAS();

    if (quotes.length === 0) {
      return [];
    }

    const matches = quotes.filter(quote =>
      keywords.some(keyword => quote.keywords.includes(keyword))
    );

    const scored = matches.map(quote => {
      const matchCount = keywords.filter(k => quote.keywords.includes(k)).length;
      const similarity = 0.65 + (matchCount * 0.1);

      return {
        quote,
        similarity: Math.min(similarity, 0.95)
      };
    });

    const topMatches = scored
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);

    return topMatches.map(({ quote, similarity }) => ({
      type: 'famous-quote' as const,
      content: quote.content,
      source: {
        author: quote.author,
        category: quote.category,
        platform: 'NAS 데이터베이스'
      } as IdeaSource,
      similarity,
      reasoning: `"${keywords.join(', ')}"와 관련된 명언입니다. ${quote.author}의 통찰로부터 영감을 얻을 수 있습니다.`
    }));

  } catch (error) {
    console.error('NAS 명언 검색 실패:', error);
    return [];
  }
}
```

### SearchService에 통합

`src/features/search/SearchService.ts` 수정:

```typescript
import { searchNASQuotes } from './api/NASQuotesAPI';

// ... (기존 코드)

if (shouldSearch['famous-quote']) {
  // 로컬 DB
  searchPromises.push(searchLocalQuotes(keywords));

  // NAS DB ⭐ 추가!
  searchPromises.push(
    searchNASQuotes(keywords).catch(err => {
      console.error('NAS 검색 오류:', err);
      return [];
    })
  );

  // Quotable API (보조)
  searchPromises.push(searchQuotes(keywords));
}
```

---

## 🧪 Claude에서 NAS 데이터 사용하기

### 일반 Claude (claude.ai)에서 사용

Claude에게 이렇게 요청:

```
내 시놀로지 NAS에 명언 데이터가 있어:
https://ideaconnect.synology.me/data/quotes.json

이 데이터에서 "습관", "반복", "학습"과 관련된 명언을 찾아줘.
각 명언이 왜 관련있는지도 설명해줘.
```

Claude가 직접 NAS에서 데이터를 가져와서 분석합니다!

### Claude Code에서 사용

```
이 명언 데이터를 분석해줘:
https://ideaconnect.synology.me/data/quotes.json

"반복된 행동은 학습이 된다"라는 메모와 가장 관련있는 명언 10개를 찾고,
각각의 연관성을 설명해줘.
```

---

## 📊 데이터 추가하기

### 명언 추가

`/web/ideaconnect/data/quotes.json` 파일 편집:

```json
[
  {
    "id": "q041",
    "content": "Success is the sum of small efforts repeated day in and day out.",
    "author": "Robert Collier",
    "keywords": ["습관", "반복", "노력", "성공", "꾸준함"],
    "category": "습관",
    "type": "famous-quote",
    "language": "en"
  }
]
```

### 파일 구조 확장

더 많은 데이터 추가 시:

```
/web/ideaconnect/
├── data/
│   ├── quotes.json           (5,000개)
│   ├── korean-quotes.json    (2,000개)
│   ├── movies.json           (3,000개 영화 대사)
│   ├── books.json            (5,000개 책 구절)
│   └── academic.json         (5,000개 학술 내용)
└── index.html                (API 문서)
```

---

## 🔧 문제 해결

### 1. "404 Not Found"
→ Web Station에서 Document root 확인
→ 파일 경로 재확인: `/web/ideaconnect/data/quotes.json`

### 2. "CORS Error"
→ `.htaccess` 파일 확인
→ Web Station 재시작: `sudo systemctl restart nginx`

### 3. "외부에서 접속 안됨"
→ 라우터 포트포워딩 확인 (80, 443)
→ 방화벽 규칙 확인
→ DDNS 주소 확인

### 4. "느린 응답"
→ Gzip 압축 활성화
→ 파일을 SSD에 저장
→ Cloudflare CDN 사용 고려

---

## 📈 성능 최적화

### Gzip 압축 활성화

`.htaccess`에 추가:

```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE application/json
  AddOutputFilterByType DEFLATE text/html
</IfModule>
```

### 캐시 설정

`.htaccess`에 추가:

```apache
<FilesMatch "\.(json)$">
  Header set Cache-Control "max-age=3600, public"
</FilesMatch>
```

---

## ✅ 체크리스트

- [ ] NAS에 `/web/ideaconnect/data/` 폴더 생성
- [ ] JSON 파일 업로드 완료
- [ ] Web Station 설치 및 설정 완료
- [ ] 로컬에서 접속 테스트 성공 (http://NAS-IP/data/quotes.json)
- [ ] CORS 설정 완료
- [ ] 외부 접속 설정 (QuickConnect 또는 DDNS)
- [ ] SSL 인증서 설정 (선택)
- [ ] Claude에서 테스트 성공

---

## 🎉 다음 단계

1. ✅ 기본 60개 명언으로 시작
2. 📝 명언 수집 (5,000개 목표)
3. 🚀 NAS에 대용량 데이터 업로드
4. 🤖 Claude Code + 일반 Claude 연동
5. 📊 사용 통계 수집 (선택)

---

**문제가 생기면 SYNOLOGY_NAS_GUIDE.md의 상세 가이드를 참고하세요!**

**궁금한 점이 있으면 언제든 물어보세요! 🙌**
