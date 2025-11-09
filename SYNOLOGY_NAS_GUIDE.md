# 시놀로지 NAS를 IdeaConnect 데이터베이스로 활용하기

## 🎯 목표
- 2만개 명언/대사 데이터를 시놀로지 NAS에 저장
- Claude Code와 일반 Claude에서 모두 접근 가능
- HTTPS로 안전하게 데이터 제공

---

## 📋 준비사항

### 1. 시놀로지 NAS 기본 설정
- DSM 7.0 이상
- Docker/Container Manager 설치
- Web Station 설치
- DDNS 설정 (QuickConnect 또는 Synology DDNS)

### 2. 네트워크 설정
- 포트포워딩: 80, 443 (HTTP/HTTPS)
- 방화벽 설정
- SSL 인증서 (Let's Encrypt 권장)

---

## 🚀 방법 1: Static File Hosting (가장 간단!)

### 단계 1: 데이터 파일 준비

NAS File Station에서 폴더 생성:
```
/web/ideaconnect/
  ├── data/
  │   ├── quotes.json        (20,000개 명언)
  │   ├── movies.json        (5,000개 영화 대사)
  │   ├── books.json         (5,000개 책 구절)
  │   └── academic.json      (10,000개 학술 내용)
  └── index.html             (API 문서 페이지)
```

### 단계 2: Web Station 설정

1. **Package Center** → **Web Station** 설치
2. **Web Station** 열기 → **Virtual Host** 클릭
3. **Create** 클릭:
   ```
   Hostname: ideaconnect.your-nas.synology.me
   Port: HTTP 80, HTTPS 443
   Document root: /web/ideaconnect
   ```

### 단계 3: CORS 설정 (중요!)

`/web/ideaconnect/.htaccess` 파일 생성:
```apache
# CORS 허용
Header set Access-Control-Allow-Origin "*"
Header set Access-Control-Allow-Methods "GET, OPTIONS"
Header set Access-Control-Allow-Headers "Content-Type"

# JSON MIME 타입 설정
AddType application/json .json

# 캐시 설정 (1주일)
<FilesMatch "\.(json)$">
    Header set Cache-Control "max-age=604800, public"
</FilesMatch>
```

### 단계 4: SSL 인증서 설정

**Control Panel** → **Security** → **Certificate**:
1. **Add** → **Add a new certificate**
2. **Get a certificate from Let's Encrypt** 선택
3. Domain name: `ideaconnect.your-nas.synology.me`
4. Email 입력
5. **Apply**

### 단계 5: 접근 테스트

브라우저에서:
```
https://ideaconnect.your-nas.synology.me/data/quotes.json
```

✅ JSON 데이터가 보이면 성공!

---

## 🐳 방법 2: Docker API 서버 (고급 기능)

더 강력한 검색과 필터링이 필요하면 Docker로 API 서버 구축

### 단계 1: Docker Compose 파일 생성

NAS SSH 접속 후:
```bash
mkdir -p /volume1/docker/ideaconnect-api
cd /volume1/docker/ideaconnect-api
```

`docker-compose.yml` 생성:
```yaml
version: '3.8'

services:
  api:
    image: node:20-alpine
    container_name: ideaconnect-api
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - ./app:/app
      - ./data:/app/data
    working_dir: /app
    command: npm start
    environment:
      - NODE_ENV=production
      - PORT=3000
```

### 단계 2: API 서버 코드

`app/package.json`:
```json
{
  "name": "ideaconnect-api",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }
}
```

`app/server.js`:
```javascript
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS 허용
app.use(cors());
app.use(express.json());

// 데이터 로드 (캐싱)
let quotesCache = null;

function loadQuotes() {
  if (!quotesCache) {
    const quotesPath = path.join(__dirname, 'data', 'quotes.json');
    quotesCache = JSON.parse(fs.readFileSync(quotesPath, 'utf8'));
    console.log(`✅ ${quotesCache.length}개 명언 로드 완료`);
  }
  return quotesCache;
}

// 명언 검색 API
app.get('/api/search', (req, res) => {
  const { keywords, limit = 10 } = req.query;

  if (!keywords) {
    return res.status(400).json({ error: 'keywords 필수' });
  }

  const keywordArray = keywords.split(',').map(k => k.trim());
  const quotes = loadQuotes();

  // 키워드 매칭
  const matches = quotes.filter(quote => {
    return keywordArray.some(keyword =>
      quote.keywords.includes(keyword) ||
      quote.content.includes(keyword)
    );
  });

  // 점수 계산
  const scored = matches.map(quote => {
    const score = keywordArray.filter(k =>
      quote.keywords.includes(k)
    ).length;

    return { ...quote, score };
  });

  // 정렬 및 제한
  const results = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, parseInt(limit));

  res.json({
    total: results.length,
    keywords: keywordArray,
    results
  });
});

// 랜덤 명언 API
app.get('/api/random', (req, res) => {
  const { count = 5 } = req.query;
  const quotes = loadQuotes();

  const random = [];
  for (let i = 0; i < Math.min(count, quotes.length); i++) {
    const idx = Math.floor(Math.random() * quotes.length);
    random.push(quotes[idx]);
  }

  res.json({ results: random });
});

// 헬스체크
app.get('/health', (req, res) => {
  res.json({ status: 'ok', quotes: quotesCache?.length || 0 });
});

app.listen(PORT, () => {
  console.log(`🚀 API 서버 실행 중: http://localhost:${PORT}`);
  loadQuotes();
});
```

### 단계 3: Docker 실행

```bash
cd /volume1/docker/ideaconnect-api
npm install
docker-compose up -d
```

### 단계 4: Nginx Reverse Proxy 설정

Web Station에서 Reverse Proxy 추가:
```
Source:
  Protocol: HTTPS
  Hostname: api.your-nas.synology.me
  Port: 443

Destination:
  Protocol: HTTP
  Hostname: localhost
  Port: 3000
```

---

## 🌐 Claude에서 NAS 데이터 활용하기

### Claude Code에서 사용

`src/features/search/api/NASQuotesAPI.ts`:
```typescript
const NAS_URL = 'https://ideaconnect.your-nas.synology.me';

export async function searchNASQuotes(keywords: string[]) {
  const response = await fetch(
    `${NAS_URL}/api/search?keywords=${keywords.join(',')}`
  );

  const data = await response.json();
  return data.results;
}
```

### 일반 Claude (claude.ai)에서 사용

Claude에게 이렇게 요청:

```
내 시놀로지 NAS에 명언 데이터가 있어:
https://ideaconnect.your-nas.synology.me/data/quotes.json

이 데이터에서 "습관"과 관련된 명언 5개를 찾아줘.
```

Claude가 직접 NAS에서 데이터를 가져와서 분석합니다!

---

## 🔐 보안 설정

### 1. API 키 인증 (선택)

`server.js`에 추가:
```javascript
const API_KEY = process.env.API_KEY || 'your-secret-key';

app.use((req, res, next) => {
  const key = req.headers['x-api-key'];

  if (key !== API_KEY) {
    return res.status(401).json({ error: '인증 실패' });
  }

  next();
});
```

### 2. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100 // 100 요청
});

app.use('/api/', limiter);
```

### 3. IP 화이트리스트 (선택)

```javascript
const allowedIPs = ['your.home.ip.address', '127.0.0.1'];

app.use((req, res, next) => {
  const ip = req.ip;

  if (!allowedIPs.includes(ip)) {
    return res.status(403).json({ error: '접근 거부' });
  }

  next();
});
```

---

## 📊 데이터 준비 스크립트

### quotes.json 생성 스크립트

`scripts/generate-quotes.js`:
```javascript
const fs = require('fs');

// 출처: Quotable API, 직접 수집, 크롤링 등
const quotes = [
  {
    id: 'q001',
    content: '...',
    author: '...',
    keywords: ['습관', '반복'],
    category: '습관',
    type: 'famous-quote',
    language: 'ko'
  },
  // ... 19,999개 더
];

fs.writeFileSync(
  'data/quotes.json',
  JSON.stringify(quotes, null, 2)
);

console.log(`✅ ${quotes.length}개 명언 저장 완료`);
```

---

## 🧪 테스트

### cURL 테스트

```bash
# Static File
curl https://ideaconnect.your-nas.synology.me/data/quotes.json

# API 서버
curl "https://api.your-nas.synology.me/api/search?keywords=습관,반복&limit=5"

# 헬스체크
curl https://api.your-nas.synology.me/health
```

### 브라우저 테스트

```javascript
// 개발자 도구 Console에서
fetch('https://ideaconnect.your-nas.synology.me/data/quotes.json')
  .then(r => r.json())
  .then(data => console.log(`총 ${data.length}개`));
```

---

## 📈 성능 최적화

### 1. Gzip 압축

`.htaccess`:
```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE application/json
</IfModule>
```

### 2. CDN 캐싱

Cloudflare 무료 플랜:
1. Cloudflare 계정 생성
2. 도메인 추가
3. DNS 설정
4. SSL/TLS: Full
5. Caching Rules: Cache Everything for JSON

---

## 💡 사용 예시

### IdeaConnect에서 사용

```typescript
// SearchService.ts
import { searchNASQuotes } from './api/NASQuotesAPI';

if (shouldSearch['famous-quote']) {
  // 로컬 DB (40개)
  searchPromises.push(searchLocalQuotes(keywords));

  // NAS DB (20,000개) ⭐
  searchPromises.push(searchNASQuotes(keywords));

  // Quotable API (추가)
  searchPromises.push(searchQuotes(keywords));
}
```

### Claude에게 데이터 분석 요청

```
내 NAS에 2만개 명언이 있어:
https://ideaconnect.your-nas.synology.me/data/quotes.json

"반복된 행동은 학습이 된다"라는 메모와 관련된 명언 10개를 찾아서,
각 명언이 왜 관련있는지 설명해줘.
```

---

## 🔧 문제 해결

### CORS 오류
→ `.htaccess` 확인, Apache CORS 모듈 활성화

### SSL 인증서 오류
→ Let's Encrypt 재발급, DSM 재시작

### 접속 불가
→ 포트포워딩 확인, 방화벽 확인, DDNS 확인

### 느린 응답
→ Gzip 압축, CDN 사용, SSD 사용

---

## 📚 참고 자료

- [Synology Web Station 가이드](https://kb.synology.com/en-global/DSM/help/WebStation)
- [Docker on Synology](https://www.synology.com/en-global/dsm/feature/docker)
- [Let's Encrypt SSL](https://letsencrypt.org/getting-started/)
- [Express.js 공식 문서](https://expressjs.com/)

---

## 🎉 다음 단계

1. ✅ 방법 1 (Static File) 먼저 시도
2. 🚀 잘 작동하면 2만개 데이터 업로드
3. 🐳 고급 기능 필요하면 Docker API 구축
4. 🌐 Claude에서 테스트
5. 📊 IdeaConnect에 통합

---

**질문이나 문제가 있으면 언제든 물어보세요!** 🙌
