# IdeaConnect v2.0 완벽 가이드
## 이론적 깊이 + 실용적 구현 + UX 혁신

**버전**: 2.0
**작성일**: 2025-11-10
**기준**: 언어학·인지심리학·AI 학제간 통합 + 실전 구현

---

# Part 1: 비전 & 이론적 기반

## 1.1 목표 재정의

### 기존 목표의 문제점

❌ **단순 키워드 매칭 중심** → 맥락 손실
- "습관"이라는 단어만 찾아서 연결
- 깊은 의미 연결 부재
- 사용자가 기대하지 못한 발견 어려움

❌ **카테고리 분류 중심** → 개념 간 관계 부재
- "명언", "책", "영화"로만 분류
- 아이디어 간 유기적 연결 미흡
- 지식의 네트워크가 아닌 단순 리스트

❌ **검색 최적화 중심** → 발견(discovery) 경험 부족
- 검색하면 나오는 것만 볼 수 있음
- 우연한 발견(세렌디피티) 부재
- 창의적 연결 경험 제한

### 새로운 비전

> **"사고의 그래프를 구축하여 아이디어 간 유기적 연결과 창발적 발견을 가능하게 한다"**

#### 정량적 목표

| 지표 | 목표 | 설명 |
|------|------|------|
| **노드(아이디어)** | 50,000개 이상 | 다양한 출처의 고품질 인사이트 |
| **엣지(관계)** | 500,000개 이상 | 평균 노드당 10개 연결 |
| **관계망 구조** | 다층적 | 의미적, 감정적, 실용적, 역사적 |
| **검색 정확도** | 85% 이상 | 상위 5개 결과 중 4개 이상 관련성 높음 |

#### 정성적 목표

1. **맥락적 유사도**: 표면적 키워드가 아닌 심층 의미 연결
2. **창발적 발견**: 예상치 못한 아이디어 간 연결 지원
3. **인지 부하 최적화**: 정보 과부하 없이 통찰 제공
4. **개인화 가능성**: 사용자 사고 패턴 학습 기반

---

## 1.2 인지심리학적 설계

### 원리 1: 스키마 이론 (Schema Theory)

**핵심 개념**: 인간은 개념을 독립된 점이 아닌, 연결된 구조(스키마)로 저장한다.

**창시자**: Jean Piaget, Frederic Bartlett

**IdeaConnect 적용**:
```typescript
interface SchemaMapping {
  schema_type: string;        // "습관 형성 스키마"
  slot: string;               // "결과"
  related_slots: {
    원인: string[];           // ["반복", "실천"]
    메커니즘: string[];       // ["신경가소성", "자동화"]
    시간성: string[];         // ["장기적", "누적적"]
  };
}

// 예시 데이터
{
  id: "node_001",
  content: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
  schema_mappings: [
    {
      schema_type: "습관 형성 스키마",
      slot: "결과",
      related_slots: {
        원인: ["반복", "실천"],
        메커니즘: ["신경가소성", "자동화"],
        시간성: ["장기적", "누적적"]
      }
    }
  ]
}
```

**카테고리 → 스키마 변환표**:

| 기존 카테고리 | 스키마 | 하위 스키마 |
|-------------|--------|------------|
| 습관 | 행동 변화 스키마 | 습관 형성, 습관 깨기, 자동화 |
| 성장 | 발달 스키마 | 학습, 적응, 진화, 극복 |
| 관계 | 사회적 인지 스키마 | 공감, 소통, 갈등, 신뢰 |
| 시간 | 시간 인식 스키마 | 현재 중심, 미래 지향, 과거 성찰 |
| 목표 | 동기 스키마 | 내재 동기, 외재 동기, 자기효능감 |

**구현 효과**:
- 단순 키워드 매칭을 넘어선 개념적 연결
- 사용자가 "습관"을 검색하면 "정체성", "반복", "시간" 등 관련 스키마 노드 자동 연결
- 더 풍부한 탐색 경험

---

### 원리 2: 확산 활성화 이론 (Spreading Activation)

**핵심 개념**: 하나의 개념이 활성화되면 관련된 개념들이 연쇄적으로 활성화된다.

**창시자**: Allan Collins, Elizabeth Loftus (1975)

**IdeaConnect 적용**:
```javascript
// 가중치 기반 관계망
{
  from: "습관",
  to: "정체성",
  edge_type: "인과관계",
  weight: 0.87,              // 강한 연결
  activation_decay: 0.15,    // 전파 감쇠율
  bidirectional: true
}
```

**관계 유형별 가중치**:

| 관계 유형 | 가중치 범위 | 강도 | 예시 |
|----------|------------|------|------|
| **인과관계** (A → B) | 0.8-0.95 | 강함 | "반복" → "습관" |
| **유사관계** (A ≈ B) | 0.6-0.8 | 중간 | "꾸준함" ≈ "인내" |
| **대조관계** (A ≠ B) | 0.5-0.7 | 약함 | "계획" ≠ "즉흥" |
| **맥락적** | 0.4-0.6 | 약함 | "아침" contextual→ "루틴" |

**전파 알고리즘**:
```python
def spreading_activation(start_node, max_depth=3, threshold=0.5):
    """
    시작 노드로부터 활성화를 전파
    """
    activation = {start_node: 1.0}
    queue = [(start_node, 1.0, 0)]  # (node, activation, depth)

    while queue:
        node, act, depth = queue.pop(0)

        if depth >= max_depth:
            continue

        # 연결된 노드들에게 활성화 전파
        for edge in get_edges(node):
            new_activation = act * edge.weight * (1 - edge.activation_decay)

            if new_activation >= threshold:
                neighbor = edge.to

                # 기존 활성화와 비교하여 더 높으면 업데이트
                if neighbor not in activation or activation[neighbor] < new_activation:
                    activation[neighbor] = new_activation
                    queue.append((neighbor, new_activation, depth + 1))

    return activation
```

**실제 사용 예시**:
```
사용자가 "습관" 메모 작성
  ↓ (weight: 0.87)
"정체성" 아이디어 활성화
  ↓ (weight: 0.75)
"가치관" 아이디어 활성화
  ↓ (weight: 0.68)
"선택" 아이디어 활성화

→ 사용자는 "습관 → 정체성 → 가치관 → 선택"의 연결 고리 발견!
```

---

### 원리 3: 정교화 가능성 모델 (Elaboration Likelihood Model)

**핵심 개념**: 정보 처리 깊이에 따라 중심 경로(깊은 사고)와 주변 경로(휴리스틱) 구분

**창시자**: Richard Petty, John Cacioppo (1986)

**IdeaConnect 적용**: 이중 검색 경로

```typescript
interface SearchResult {
  // 중심 경로: 깊은 의미 매칭 (사용자가 진지하게 탐색할 때)
  deep_matches: {
    content: string;
    semantic_similarity: number;  // 0.8+
    reasoning: string;             // 왜 연결되는지 설명
    evidence: string[];            // 연결 근거
  }[];

  // 주변 경로: 빠른 연상 (브라우징 모드)
  quick_associations: {
    content: string;
    association_type: 'keyword' | 'emotion' | 'metaphor';
    strength: number;  // 0.5-0.7
    preview: string;   // 한 줄 요약
  }[];
}
```

**사용자 상황에 따른 경로 선택**:

| 상황 | 경로 | 특징 | UI 표시 |
|------|------|------|---------|
| 메모 작성 중 | 주변 경로 | 빠른 힌트, 가벼운 영감 | 사이드바에 3-5개 미리보기 |
| "연결 찾기" 클릭 | 중심 경로 | 깊은 분석, 상세한 설명 | 전체 페이지, 근거 제시 |
| 그래프 탐색 중 | 혼합 | 주변으로 시작 → 클릭 시 중심 | 호버: 요약 / 클릭: 상세 |

---

## 1.3 언어학적 설계

### 원리 1: 프레임 의미론 (Frame Semantics)

**핵심 개념**: 단어는 프레임(상황 구조) 내에서 의미를 가진다.

**창시자**: Charles Fillmore (1982)

**예시**: "구매" 프레임
```yaml
프레임: 상업적_거래
핵심_요소:
  - 구매자 (Buyer)
  - 판매자 (Seller)
  - 상품 (Goods)
  - 대가 (Money)
  - 시점 (Time)

연결_프레임:
  - 소유_변경
  - 경제_교환
  - 선택_행위
```

**IdeaConnect 데이터 구조 적용**:
```json
{
  "id": "quote_315",
  "content": "The best time to plant a tree was 20 years ago. The second best time is now.",
  "author": "Chinese Proverb",

  "linguistic": {
    "primary_frame": "시간과_행동",
    "frame_elements": {
      "action": "심기 (식수)",
      "optimal_time": "과거 (20년 전)",
      "alternative_time": "현재",
      "implicit_message": "지금_시작하기"
    },
    "frame_relations": [
      {
        "related_frame": "후회와_회복",
        "relation": "inheritance"
      },
      {
        "related_frame": "기회_포착",
        "relation": "subframe"
      }
    ]
  }
}
```

**프레임 기반 검색의 장점**:
- "나무 심기"를 검색하지 않아도 "지금 시작하기" 프레임으로 연결
- "후회"와 "기회" 개념도 자동으로 연결
- 맥락적 이해 가능

---

### 원리 2: 개념적 은유 이론 (Conceptual Metaphor Theory)

**핵심 개념**: 추상적 개념은 구체적 은유로 이해된다.

**창시자**: George Lakoff, Mark Johnson (1980)

**핵심 은유 체계**:

#### 은유 1: "시간은 자원이다"
```javascript
{
  system: "시간은_자원이다",
  source_domain: "물질적_자원",
  target_domain: "시간",
  mappings: {
    spending: "보내다",
    saving: "아끼다",
    wasting: "낭비하다",
    investing: "투자하다"
  },
  example_quotes: [
    "Time is money",
    "Don't waste your time",
    "Invest your time wisely"
  ]
}
```

#### 은유 2: "인생은 여정이다"
```javascript
{
  system: "인생은_여정이다",
  source_domain: "물리적_여행",
  target_domain: "인생",
  mappings: {
    path: "길/경로",
    obstacles: "장애물",
    destination: "목표",
    companions: "동반자",
    crossroads: "선택의_순간"
  },
  example_quotes: [
    "Life is a journey, not a destination",
    "We're all on different paths",
    "Every setback is a setup for a comeback"
  ]
}
```

#### 은유 3: "아이디어는 건물이다"
```javascript
{
  system: "아이디어는_건물이다",
  source_domain: "건축",
  target_domain: "추론",
  mappings: {
    foundation: "기초/전제",
    structure: "논리_구조",
    collapse: "논리_붕괴",
    support: "근거"
  },
  example_quotes: [
    "Build your argument on solid foundations",
    "That theory doesn't hold up",
    "Strong evidence supports this claim"
  ]
}
```

**IdeaConnect 데이터에 은유 태깅**:
```json
{
  "content": "Build your dreams one brick at a time",
  "metaphor": {
    "system": "목표는_건물이다",
    "elements": ["build", "brick", "one at a time"],
    "source_domain": "건축",
    "target_domain": "목표_달성",
    "related_metaphors": ["인생은_여정이다"]
  }
}
```

**은유 기반 연결의 힘**:
- "벽돌"을 검색하지 않아도 "습관", "꾸준함"과 연결
- 서로 다른 은유 시스템 간의 교차 연결
- 창의적 아이디어 발견

---

### 원리 3: 의미 역할 이론 (Semantic Role Labeling)

**핵심 개념**: 문장의 심층 구조를 행위자-행위-대상으로 분해

**IdeaConnect 적용**:
```python
{
  "content": "Courage is not the absence of fear, but the triumph over it.",
  "author": "Nelson Mandela",

  "semantic_roles": {
    "theme": "용기",               # 주제
    "attribute": "두려움의_부재가_아님",  # 속성 (부정)
    "attribute_corrected": "두려움에_대한_승리",  # 실제 속성
    "implicit_agent": "용기있는_사람"  # 암묵적 행위자
  },

  "deep_structure": {
    "proposition": "용기 = 극복(행위자, 두려움)",
    "negation": "용기 ≠ 부재(두려움)"
  }
}
```

**의미 역할 자동 추출 프로세스**:
```python
import spacy

nlp = spacy.load("en_core_web_trf")

def extract_semantic_roles(text):
    doc = nlp(text)

    roles = {
        "agents": [],      # 행위자
        "patients": [],    # 피행위자
        "themes": [],      # 주제
        "instruments": [], # 도구
        "locations": [],   # 장소
        "times": []        # 시간
    }

    for token in doc:
        if token.dep_ == "nsubj":
            roles["agents"].append(token.text)
        elif token.dep_ == "dobj":
            roles["patients"].append(token.text)
        elif token.dep_ == "attr":
            roles["themes"].append(token.text)

    return roles
```

---

## 1.4 AI/NLP 기술 스택

### 기술 1: 임베딩 벡터 공간 (Embedding Space)

**사용 모델**: Sentence Transformers / OpenAI Embeddings

**다중 임베딩 전략**:
```python
from sentence_transformers import SentenceTransformer

class MultiEmbedding:
    def __init__(self):
        # 1. 의미적 임베딩 (semantic)
        self.semantic_model = SentenceTransformer('all-MiniLM-L6-v2')

        # 2. 감정적 임베딩 (emotional)
        self.emotion_model = SentenceTransformer('j-hartmann/emotion-english-distilroberta-base')

        # 3. 의도 임베딩 (pragmatic)
        self.intent_model = SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')

    def encode(self, text):
        return {
            'semantic': self.semantic_model.encode(text),    # 768-dim
            'emotional': self.emotion_model.encode(text),    # 768-dim
            'pragmatic': self.intent_model.encode(text)      # 768-dim
        }
```

**다차원 유사도 계산**:
```python
from sklearn.metrics.pairwise import cosine_similarity

def multi_dimensional_similarity(vec1, vec2, weights):
    """
    weights 예시:
    {
        'semantic': 0.5,    # 의미적 유사도에 50% 가중치
        'emotional': 0.3,   # 감정적 유사도에 30% 가중치
        'pragmatic': 0.2    # 실용적 유사도에 20% 가중치
    }
    """
    similarities = {}

    for dimension in ['semantic', 'emotional', 'pragmatic']:
        cos_sim = cosine_similarity(
            vec1[dimension].reshape(1, -1),
            vec2[dimension].reshape(1, -1)
        )[0][0]
        similarities[dimension] = cos_sim

    # 가중 평균
    weighted_sim = sum(
        similarities[dim] * weights[dim]
        for dim in weights
    )

    return weighted_sim, similarities
```

**데이터 저장 구조**:
```json
{
  "id": "node_001",
  "content": "We are what we repeatedly do.",
  "embeddings": {
    "semantic_v": [0.123, -0.456, 0.789, ...],   // 768 dim
    "emotional_v": [0.234, 0.567, -0.123, ...],  // 768 dim
    "pragmatic_v": [-0.345, 0.678, 0.234, ...]   // 768 dim
  },
  "embedding_model": "sentence-transformers/all-MiniLM-L6-v2",
  "version": "2.0"
}
```

---

### 기술 2: 지식 그래프 임베딩 (Knowledge Graph Embedding)

**사용 모델**: TransE, ComplEx, RotatE

**TransE 모델 개념**:
```
h + r ≈ t
(head entity) + (relation) ≈ (tail entity)

예시:
"습관" + "결과는" ≈ "정체성"
```

**구현 예시**:
```python
import numpy as np

class TransE:
    """
    TransE: Translating Embeddings for Knowledge Graphs
    """

    def __init__(self, entity_dim=128, relation_dim=128):
        self.entity_embeddings = {}
        self.relation_embeddings = {}
        self.entity_dim = entity_dim
        self.relation_dim = relation_dim

    def train(self, triples, epochs=100, learning_rate=0.01):
        """
        triples: [("습관", "leads_to", "정체성"), ...]
        """

        # 임베딩 초기화
        entities = set()
        relations = set()

        for (h, r, t) in triples:
            entities.add(h)
            entities.add(t)
            relations.add(r)

        for entity in entities:
            self.entity_embeddings[entity] = np.random.randn(self.entity_dim)

        for relation in relations:
            self.relation_embeddings[relation] = np.random.randn(self.relation_dim)

        # 학습
        for epoch in range(epochs):
            for (h, r, t) in triples:
                h_vec = self.entity_embeddings[h]
                r_vec = self.relation_embeddings[r]
                t_vec = self.entity_embeddings[t]

                # 손실: ||h + r - t||
                loss = np.linalg.norm(h_vec + r_vec - t_vec)

                # 그래디언트 업데이트 (간단히 표현)
                grad = (h_vec + r_vec - t_vec) / (loss + 1e-8)

                self.entity_embeddings[h] -= learning_rate * grad
                self.relation_embeddings[r] -= learning_rate * grad
                self.entity_embeddings[t] += learning_rate * grad

    def predict_tail(self, head, relation):
        """주어진 (head, relation)으로 tail 예측"""
        h_vec = self.entity_embeddings[head]
        r_vec = self.relation_embeddings[relation]

        predicted_t = h_vec + r_vec

        # 가장 가까운 entity 찾기
        min_distance = float('inf')
        best_entity = None

        for entity, vec in self.entity_embeddings.items():
            distance = np.linalg.norm(predicted_t - vec)
            if distance < min_distance:
                min_distance = distance
                best_entity = entity

        return best_entity, min_distance

# 사용 예시
model = TransE()
triples = [
    ("습관", "결과는", "정체성"),
    ("반복", "leads_to", "습관"),
    ("시간", "enables", "변화"),
    ("의지", "requires", "동기")
]

model.train(triples)

# "습관" + "결과는" → ?
result, confidence = model.predict_tail("습관", "결과는")
print(f"예측: {result}, 신뢰도: {1 - confidence}")  # → "정체성"
```

---

### 기술 3: 관계 추출 (Relation Extraction)

**관계 온톨로지 (Ontology)**:
```yaml
관계_체계:
  인과_관계:
    - causes: A가 B를 야기함
    - enables: A가 B를 가능하게 함
    - prevents: A가 B를 막음
    - requires: A가 B를 필요로 함

  구조_관계:
    - part_of: A는 B의 부분
    - instance_of: A는 B의 사례
    - contrasts_with: A는 B와 대조됨

  시간_관계:
    - precedes: A가 B보다 먼저
    - follows: A가 B를 따름
    - during: A는 B 동안

  의미_관계:
    - similar_to: 유사함
    - analogous_to: 유추 가능
    - metaphor_of: 은유 관계

  감정_관계:
    - evokes: A가 B 감정을 유발
    - expressed_by: A는 B로 표현됨
```

**자동 관계 추출 구현**:
```python
import spacy
from transformers import pipeline

nlp = spacy.load("en_core_web_trf")

def extract_relations(quote1, quote2):
    """두 명언 간 관계 자동 추출"""

    doc1 = nlp(quote1.content)
    doc2 = nlp(quote2.content)

    relations = []

    # 1. 공통 개념 추출
    concepts1 = [ent.text for ent in doc1.ents]
    concepts2 = [ent.text for ent in doc2.ents]
    shared = set(concepts1) & set(concepts2)

    # 2. 의미적 유사도
    similarity = doc1.similarity(doc2)

    if similarity > 0.8:
        relations.append({
            "type": "similar_to",
            "strength": similarity,
            "evidence": f"코사인 유사도 {similarity:.2f}"
        })

    # 3. 인과 관계 마커 감지
    causal_markers = ["because", "therefore", "thus", "leads to", "results in"]

    if any(marker in quote1.content.lower() for marker in causal_markers):
        if any(marker in quote2.content.lower() for marker in causal_markers):
            relations.append({
                "type": "causal_chain",
                "strength": 0.7,
                "evidence": "인과 관계 마커 발견"
            })

    # 4. 대조 관계 마커
    contrast_markers = ["but", "however", "although", "while", "whereas"]

    if any(marker in quote1.content.lower() for marker in contrast_markers):
        relations.append({
            "type": "contrasts_with",
            "strength": 0.6,
            "evidence": "대조 관계 마커 발견"
        })

    return relations
```

---

## 1.5 이론적 기반 요약

### 핵심 원리 통합

| 학문 분야 | 핵심 이론 | IdeaConnect 적용 | 효과 |
|---------|---------|----------------|------|
| **인지심리학** | 스키마 이론 | 개념의 구조화된 저장 | 맥락적 연결 |
| **인지심리학** | 확산 활성화 | 가중치 기반 전파 | 연쇄적 발견 |
| **인지심리학** | ELM | 이중 검색 경로 | 상황별 최적화 |
| **언어학** | 프레임 의미론 | 상황 구조 매핑 | 깊은 이해 |
| **언어학** | 개념적 은유 | 은유 시스템 태깅 | 창의적 연결 |
| **언어학** | 의미 역할 | 심층 구조 분석 | 정확한 관계 |
| **AI/NLP** | 임베딩 공간 | 다차원 벡터 | 수치적 유사도 |
| **AI/NLP** | 지식 그래프 임베딩 | TransE 모델 | 관계 예측 |
| **AI/NLP** | 관계 추출 | 자동 온톨로지 | 대규모 처리 |

### 차별화 포인트

**기존 접근 vs IdeaConnect v2.0:**

| 항목 | 기존 | IdeaConnect v2.0 |
|------|------|-----------------|
| 검색 방식 | 키워드 매칭 | 다차원 임베딩 (의미·감정·실용) |
| 분류 | 단일 카테고리 | 다중 스키마 + 프레임 |
| 관계 | 정적 | 동적·가중·맥락적 |
| 사용자 경험 | 검색 중심 | 발견(discovery) 중심 |
| 추천 | 일률적 | 개인화·컨텍스트 인식 |
| 시각화 | 2D 리스트 | 3D 지식 그래프 |
| 품질 관리 | 알고리즘만 | 알고리즘 + 전문가 + 커뮤니티 |

---

# Part 2: 데이터 아키텍처

## 2.1 향상된 노드(Node) 구조

### 다층적 표현 시스템

**설계 철학**: 하나의 아이디어를 다양한 각도에서 분석하고 저장

```typescript
interface IdeaNode {
  // ===== 기본 식별 정보 =====
  id: string;                    // UUID
  content: string;               // 원문 (영어)
  content_ko?: string;           // 번역 (한국어)
  created_at: Date;
  updated_at: Date;

  // ===== 출처 메타데이터 =====
  source: {
    author: string;              // 저자/인물
    author_ko?: string;          // 저자 한국어명
    work?: string;               // 작품명
    work_ko?: string;
    year?: number;               // 연도
    url?: string;                // 웹 출처
    isbn?: string;               // 책
    doi?: string;                // 논문
    imdb_id?: string;            // 영화
    verified: boolean;           // 출처 검증 여부
  };

  // ===== 언어학적 분석 =====
  linguistic: {
    // 프레임 의미론
    primary_frame: string;       // "시간과_행동"
    frame_elements: Record<string, string>;
    related_frames: {
      frame: string;
      relation: 'inheritance' | 'subframe' | 'uses' | 'perspective';
    }[];

    // 은유 분석
    metaphors: {
      system: string;            // "시간은_자원이다"
      elements: string[];        // ["spending", "saving"]
      source_domain: string;     // "물질적_자원"
      target_domain: string;     // "시간"
      strength: number;          // 0.0-1.0
    }[];

    // 의미 역할
    semantic_roles: {
      theme?: string;            // 주제
      agent?: string;            // 행위자
      patient?: string;          // 피행위자
      instrument?: string;       // 도구
      location?: string;         // 장소
      time?: string;             // 시간
    };

    // 화행 이론 (Speech Act)
    speech_act: 'assertive' | 'directive' | 'commissive' | 'expressive' | 'declarative';

    // 부정 표현 분석
    negation?: {
      has_negation: boolean;
      negated_concept: string;
      affirmative_alternative?: string;
    };
  };

  // ===== 인지심리학적 분석 =====
  cognitive: {
    // 스키마 매핑
    schemas: {
      type: string;              // "습관 형성 스키마"
      slot: string;              // "결과"
      related_slots: Record<string, string[]>;
      activation_strength: number; // 0.0-1.0
    }[];

    // 정보 처리 수준
    processing_level: 'surface' | 'semantic' | 'pragmatic';

    // 인지 부하
    cognitive_load: {
      level: 'low' | 'medium' | 'high';
      complexity_score: number;  // 0-100
      abstractness: number;      // 0.0-1.0 (구체적 vs 추상적)
    };

    // 기억 인출 단서
    retrieval_cues: string[];    // ["습관", "반복", "정체성"]

    // 정교화 수준
    elaboration: {
      level: 'basic' | 'intermediate' | 'advanced';
      requires_context: boolean;
    };
  };

  // ===== 감정/태도 분석 =====
  affective: {
    // 감정 벡터 (Plutchik의 8가지 기본 감정)
    emotions: {
      joy: number;               // 0.0-1.0
      trust: number;
      fear: number;
      surprise: number;
      sadness: number;
      disgust: number;
      anger: number;
      anticipation: number;
    };

    // 감정가 (Valence): 긍정/부정
    valence: number;             // -1.0 (매우 부정) ~ +1.0 (매우 긍정)

    // 각성도 (Arousal): 차분함/흥분
    arousal: number;             // 0.0 (차분) ~ 1.0 (흥분)

    // 지배성 (Dominance): 통제감
    dominance: number;           // 0.0 (수동적) ~ 1.0 (지배적)

    // 감정 강도
    intensity: number;           // 0.0-1.0

    // 주요 감정 (자동 계산)
    primary_emotion: string;     // "희망", "동기부여", "성찰" 등
  };

  // ===== 실용적 차원 =====
  pragmatic: {
    // 적용 가능한 상황/맥락
    applicable_contexts: string[]; // ["자기계발", "습관 형성", "동기부여"]

    // 행동 유도성 (Affordance)
    action_tendencies: string[]; // ["반복 실천", "자기 성찰", "목표 설정"]

    // 실천 난이도
    implementation: {
      difficulty: 'easy' | 'medium' | 'hard';
      time_required: 'immediate' | 'days' | 'weeks' | 'months' | 'years';
      resources_needed: string[];
    };

    // 시간 지평
    time_horizon: 'immediate' | 'short-term' | 'long-term' | 'lifelong';

    // 대상 청중
    target_audience: string[];   // ["학생", "직장인", "창업가", "일반"]
  };

  // ===== 벡터 임베딩 =====
  embeddings: {
    semantic: number[];          // 768-dim (의미적 유사도)
    emotional: number[];         // 768-dim (감정적 유사도)
    pragmatic: number[];         // 768-dim (실용적 유사도)
    kg_embedding?: number[];     // 128-dim (지식 그래프)

    // 임베딩 메타정보
    model_version: string;       // "all-MiniLM-L6-v2"
    generated_at: Date;
  };

  // ===== 분류 정보 =====
  classification: {
    // 기본 카테고리
    primary_category: IdeaType;  // "famous-quote", "book", etc.
    secondary_categories: IdeaType[];

    // 주제 태그
    topics: string[];            // ["습관", "성장", "시간관리"]

    // 키워드 (검색용)
    keywords: string[];          // 자동 추출 + 수동 큐레이션

    // 난이도
    difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  };

  // ===== 품질 & 통계 =====
  quality: {
    // 자동 품질 점수
    auto_score: number;          // 0-100

    // 전문가 큐레이션
    curated: boolean;
    curator_notes?: string;

    // 완성도
    completeness: {
      has_embeddings: boolean;
      has_linguistic: boolean;
      has_cognitive: boolean;
      has_affective: boolean;
      overall: number;           // 0-100
    };
  };

  stats: {
    view_count: number;
    connection_count: number;    // 몇 개의 엣지와 연결되어 있는가
    user_saved_count: number;    // 몇 명이 저장했는가
    avg_rating: number;          // 0-5
    last_accessed: Date;
  };
}

// 아이디어 타입 정의
type IdeaType =
  | 'famous-quote'
  | 'book'
  | 'proverb'
  | 'movie'
  | 'drama'
  | 'animation'
  | 'academic'
  | 'web'
  | 'essay'
  | 'poem';
```

### 노드 구조 설계 의도

| 섹션 | 목적 | 활용 |
|------|------|------|
| **기본 식별** | 고유성, 버전 관리 | CRUD 작업 |
| **출처 메타데이터** | 신뢰성, 추적성 | 검증, 인용 |
| **언어학적 분석** | 깊은 의미 이해 | 프레임 기반 검색, 은유 연결 |
| **인지심리학적 분석** | 사고 구조 파악 | 스키마 기반 연결, 활성화 전파 |
| **감정/태도 분석** | 감정적 공명 | 감정 기반 추천, 무드별 탐색 |
| **실용적 차원** | 적용 가능성 | 컨텍스트 인식 추천 |
| **벡터 임베딩** | 수치적 유사도 | 빠른 검색, 클러스터링 |
| **분류 정보** | 조직화 | 필터링, 탐색 |
| **품질 & 통계** | 신뢰성, 인기도 | 랭킹, 큐레이션 |

---

## 2.2 다차원 엣지(Edge) 구조

### 관계의 복잡성 표현

**설계 철학**: 두 아이디어 간의 관계는 단순한 "연결됨"이 아닌 다층적 의미

```typescript
interface IdeaEdge {
  // ===== 기본 식별 =====
  id: string;                    // UUID
  from: string;                  // 출발 노드 ID
  to: string;                    // 도착 노드 ID
  created_at: Date;

  // ===== 관계 유형 =====
  relation_type: RelationType;

  // ===== 관계 강도 =====
  strength: number;              // 0.0-1.0 (종합 강도)

  // ===== 차원별 점수 =====
  dimensions: {
    semantic_similarity: number;     // 의미적 유사성 (0-1)
    emotional_resonance: number;     // 감정적 공명 (0-1)
    pragmatic_alignment: number;     // 실용적 정렬 (0-1)
    metaphorical_connection: number; // 은유적 연결 (0-1)
    causal_strength: number;         // 인과 관계 강도 (0-1)
    temporal_proximity: number;      // 시간적 근접성 (0-1)
  };

  // ===== 관계 설명 =====
  reasoning: {
    automatic: string;           // AI 자동 생성
    curated?: string;            // 큐레이터 수동 작성
    evidence: string[];          // 근거 리스트
  };

  // ===== 양방향성 =====
  bidirectional: boolean;        // 양방향 관계인가?
  reverse_relation?: RelationType; // 역방향 관계 유형

  // ===== 컨텍스트 의존성 =====
  context_dependent: boolean;    // 특정 맥락에서만 유효한가?
  contexts?: string[];           // ["자기계발", "리더십"]

  // ===== 신뢰도 & 출처 =====
  confidence: number;            // 0.0-1.0
  source: 'algorithm' | 'expert' | 'community' | 'user';

  // ===== 활성화 이력 =====
  activation: {
    count: number;               // 몇 번 활성화되었는가
    last_activated: Date;
    decay_rate: number;          // 확산 활성화 감쇠율
  };

  // ===== 검증 & 품질 =====
  verified: boolean;             // 전문가 검증 여부
  quality_score: number;         // 0-100

  // ===== 메타정보 =====
  version: string;
  notes?: string;
}

// 관계 유형 온톨로지
type RelationType =
  // === 의미적 관계 ===
  | 'similar_to'              // 유사함
  | 'opposite_to'             // 반대됨
  | 'part_of'                 // 부분-전체
  | 'example_of'              // 사례
  | 'generalizes_to'          // 일반화
  | 'specializes_to'          // 특수화

  // === 인과적 관계 ===
  | 'causes'                  // A가 B를 야기
  | 'enables'                 // A가 B를 가능하게 함
  | 'prevents'                // A가 B를 막음
  | 'requires'                // A가 B를 필요로 함
  | 'contributes_to'          // A가 B에 기여

  // === 시간적 관계 ===
  | 'precedes'                // A가 B보다 먼저
  | 'follows'                 // A가 B를 따름
  | 'concurrent_with'         // A와 B가 동시

  // === 논리적 관계 ===
  | 'supports'                // A가 B를 지지
  | 'contradicts'             // A가 B와 모순
  | 'refines'                 // A가 B를 정제
  | 'extends'                 // A가 B를 확장
  | 'implies'                 // A가 B를 함의

  // === 은유적 관계 ===
  | 'metaphor_of'             // A는 B의 은유
  | 'analogy_to'              // A는 B와 유추

  // === 감정적 관계 ===
  | 'evokes_same_emotion'     // 같은 감정 유발
  | 'contrasting_emotion'     // 대조되는 감정

  // === 실용적 관계 ===
  | 'implements_same_principle' // 같은 원리 구현
  | 'alternative_approach'    // 대안적 접근
  | 'complements'             // 보완 관계

  // === 구조적 관계 ===
  | 'belongs_to_category'     // 카테고리 소속
  | 'shares_frame'            // 프레임 공유
  | 'shares_metaphor';        // 은유 공유
```

### 엣지 자동 생성 알고리즘

```python
def create_edge_automatically(node1: IdeaNode, node2: IdeaNode) -> IdeaEdge | None:
    """
    두 노드 간 엣지를 자동으로 생성
    """

    # 1. 차원별 유사도 계산
    dimensions = calculate_multi_dimensional_similarity(node1, node2)

    # 2. 종합 강도 계산 (가중 평균)
    strength = (
        dimensions['semantic_similarity'] * 0.35 +
        dimensions['emotional_resonance'] * 0.25 +
        dimensions['pragmatic_alignment'] * 0.20 +
        dimensions['metaphorical_connection'] * 0.15 +
        dimensions['causal_strength'] * 0.05
    )

    # 3. 임계값 체크 (0.65 이상만 엣지 생성)
    if strength < 0.65:
        return None

    # 4. 관계 유형 추론
    relation_type = infer_relation_type(node1, node2, dimensions)

    # 5. 양방향성 판단
    bidirectional = is_bidirectional(relation_type)

    # 6. 설명 생성
    reasoning = generate_reasoning(node1, node2, relation_type, dimensions)

    # 7. 엣지 객체 생성
    edge = IdeaEdge(
        id=generate_uuid(),
        from=node1.id,
        to=node2.id,
        relation_type=relation_type,
        strength=strength,
        dimensions=dimensions,
        reasoning=reasoning,
        bidirectional=bidirectional,
        confidence=calculate_confidence(dimensions),
        source='algorithm',
        created_at=datetime.now()
    )

    return edge

def infer_relation_type(node1, node2, dimensions) -> RelationType:
    """관계 유형 자동 추론"""

    # 의미적 유사도가 매우 높으면
    if dimensions['semantic_similarity'] > 0.85:
        return 'similar_to'

    # 감정이 비슷하면
    if dimensions['emotional_resonance'] > 0.8:
        return 'evokes_same_emotion'

    # 같은 은유 시스템을 공유하면
    if dimensions['metaphorical_connection'] > 0.8:
        return 'shares_metaphor'

    # 인과 관계 마커가 있으면
    if has_causal_markers(node1, node2):
        return 'causes' if dimensions['causal_strength'] > 0.7 else 'contributes_to'

    # 프레임이 같으면
    if shares_frame(node1, node2):
        return 'shares_frame'

    # 기본값
    return 'similar_to'
```

---

## 2.3 임베딩 전략

### 다중 임베딩 시스템

**목적**: 서로 다른 차원의 유사도를 독립적으로 계산

```python
# scripts/embeddings/multi_embedding.py

from sentence_transformers import SentenceTransformer
import numpy as np
from typing import Dict, List
import pickle

class MultiEmbeddingSystem:
    """다중 임베딩 생성 및 관리"""

    def __init__(self):
        print("🔧 임베딩 모델 로딩 중...")

        # 1. 의미적 임베딩
        self.semantic_model = SentenceTransformer('all-MiniLM-L6-v2')
        print("✅ Semantic 모델 로딩 완료")

        # 2. 감정적 임베딩
        self.emotion_model = SentenceTransformer('j-hartmann/emotion-english-distilroberta-base')
        print("✅ Emotion 모델 로딩 완료")

        # 3. 다국어 임베딩 (한국어 지원)
        self.multilingual_model = SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')
        print("✅ Multilingual 모델 로딩 완료")

        # 캐시
        self.cache = {}

    def encode_node(self, node: IdeaNode) -> Dict[str, np.ndarray]:
        """노드를 다중 임베딩으로 인코딩"""

        # 캐시 체크
        if node.id in self.cache:
            return self.cache[node.id]

        content = node.content
        content_ko = node.content_ko or content

        # 임베딩 생성
        embeddings = {
            'semantic': self.semantic_model.encode(content),
            'emotional': self.emotion_model.encode(content),
            'multilingual': self.multilingual_model.encode(content_ko)
        }

        # 정규화 (코사인 유사도 최적화)
        for key in embeddings:
            embeddings[key] = embeddings[key] / np.linalg.norm(embeddings[key])

        # 캐시 저장
        self.cache[node.id] = embeddings

        return embeddings

    def batch_encode(self, nodes: List[IdeaNode]) -> Dict[str, List[np.ndarray]]:
        """배치 인코딩 (효율적)"""

        contents = [node.content for node in nodes]
        contents_ko = [node.content_ko or node.content for node in nodes]

        # 배치 처리
        semantic_batch = self.semantic_model.encode(contents, show_progress_bar=True)
        emotional_batch = self.emotion_model.encode(contents, show_progress_bar=True)
        multilingual_batch = self.multilingual_model.encode(contents_ko, show_progress_bar=True)

        # 정규화
        semantic_batch = semantic_batch / np.linalg.norm(semantic_batch, axis=1, keepdims=True)
        emotional_batch = emotional_batch / np.linalg.norm(emotional_batch, axis=1, keepdims=True)
        multilingual_batch = multilingual_batch / np.linalg.norm(multilingual_batch, axis=1, keepdims=True)

        return {
            'semantic': semantic_batch,
            'emotional': emotional_batch,
            'multilingual': multilingual_batch
        }

    def save_cache(self, filepath: str):
        """캐시 저장"""
        with open(filepath, 'wb') as f:
            pickle.dump(self.cache, f)
        print(f"💾 캐시 저장 완료: {filepath}")

    def load_cache(self, filepath: str):
        """캐시 로드"""
        with open(filepath, 'rb') as f:
            self.cache = pickle.load(f)
        print(f"📂 캐시 로드 완료: {len(self.cache)}개 항목")
```

### 벡터 인덱싱 (FAISS)

**목적**: 50,000개 노드에서 빠른 유사도 검색

```python
# scripts/embeddings/vector_index.py

import faiss
import numpy as np
from typing import List, Tuple

class VectorIndex:
    """FAISS 기반 벡터 인덱스"""

    def __init__(self, dimension: int = 768):
        self.dimension = dimension

        # FAISS 인덱스 생성 (Inner Product = 코사인 유사도)
        self.index = faiss.IndexFlatIP(dimension)

        # ID 매핑
        self.id_to_idx = {}  # node_id -> index
        self.idx_to_id = {}  # index -> node_id

        self.next_idx = 0

    def add_vector(self, node_id: str, vector: np.ndarray):
        """벡터 추가"""

        # 정규화 확인
        if np.linalg.norm(vector) - 1.0 > 1e-6:
            vector = vector / np.linalg.norm(vector)

        # 인덱스에 추가
        self.index.add(vector.reshape(1, -1))

        # 매핑 저장
        self.id_to_idx[node_id] = self.next_idx
        self.idx_to_id[self.next_idx] = node_id

        self.next_idx += 1

    def batch_add(self, node_ids: List[str], vectors: np.ndarray):
        """배치 추가"""

        # 정규화
        norms = np.linalg.norm(vectors, axis=1, keepdims=True)
        vectors = vectors / norms

        # 인덱스에 추가
        self.index.add(vectors)

        # 매핑 저장
        for node_id in node_ids:
            self.id_to_idx[node_id] = self.next_idx
            self.idx_to_id[self.next_idx] = node_id
            self.next_idx += 1

    def search(self, query_vector: np.ndarray, k: int = 10) -> List[Tuple[str, float]]:
        """가장 유사한 k개 노드 검색"""

        # 정규화
        query_vector = query_vector / np.linalg.norm(query_vector)

        # 검색
        distances, indices = self.index.search(query_vector.reshape(1, -1), k)

        # 결과 변환
        results = []
        for idx, distance in zip(indices[0], distances[0]):
            if idx in self.idx_to_id:
                node_id = self.idx_to_id[idx]
                similarity = float(distance)  # Inner Product = 코사인 유사도
                results.append((node_id, similarity))

        return results

    def save(self, filepath: str):
        """인덱스 저장"""
        faiss.write_index(self.index, filepath)

        # 매핑 저장
        import pickle
        with open(filepath + '.mapping', 'wb') as f:
            pickle.dump((self.id_to_idx, self.idx_to_id, self.next_idx), f)

        print(f"💾 인덱스 저장 완료: {filepath}")

    def load(self, filepath: str):
        """인덱스 로드"""
        self.index = faiss.read_index(filepath)

        # 매핑 로드
        import pickle
        with open(filepath + '.mapping', 'rb') as f:
            self.id_to_idx, self.idx_to_id, self.next_idx = pickle.load(f)

        print(f"📂 인덱스 로드 완료: {self.next_idx}개 벡터")
```

---

## 2.4 NAS 저장소 설계

### 폴더 구조

```
/Volumes/work-sync/project/ideamemo/
├── nodes/                          # 노드 데이터
│   ├── famous-quote/
│   │   ├── en/
│   │   │   ├── batch_0001.json     # 1,000개씩
│   │   │   ├── batch_0002.json
│   │   │   └── ...
│   │   └── ko/
│   │       ├── batch_0001.json
│   │       └── ...
│   ├── book/
│   │   ├── classic/
│   │   ├── self-help/
│   │   └── philosophy/
│   ├── movie/
│   ├── proverb/
│   ├── academic/
│   ├── web/
│   ├── essay/
│   ├── poem/
│   ├── drama/
│   └── animation/
│
├── edges/                          # 엣지 데이터
│   ├── semantic/                   # 의미적 관계
│   ├── emotional/                  # 감정적 관계
│   ├── causal/                     # 인과 관계
│   └── metaphorical/               # 은유적 관계
│
├── embeddings/                     # 임베딩 벡터
│   ├── semantic/
│   │   ├── vectors.faiss           # FAISS 인덱스
│   │   └── vectors.faiss.mapping   # ID 매핑
│   ├── emotional/
│   └── multilingual/
│
├── indexes/                        # 메타 인덱스
│   ├── master_index.json           # 전체 노드 목록
│   ├── category_index.json         # 카테고리별 통계
│   ├── keyword_index.json          # 키워드 역색인
│   ├── frame_index.json            # 프레임별 노드
│   └── metaphor_index.json         # 은유별 노드
│
├── quality/                        # 품질 관리
│   ├── validation_reports/
│   ├── curated_nodes.json          # 전문가 검증 완료
│   └── flagged_nodes.json          # 문제 있는 노드
│
└── versions/                       # 버전 관리
    ├── v1.0/
    ├── v1.1/
    └── v2.0/
```

### 데이터 파일 포맷

#### nodes/famous-quote/en/batch_0001.json
```json
{
  "batch_info": {
    "version": "2.0",
    "created_at": "2025-11-10T12:00:00Z",
    "node_count": 1000,
    "category": "famous-quote",
    "language": "en"
  },
  "nodes": [
    {
      "id": "fq_en_001",
      "content": "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
      "source": {
        "author": "Aristotle",
        "year": -350,
        "verified": true
      },
      "linguistic": {
        "primary_frame": "identity_formation",
        "metaphors": [
          {
            "system": "identity_is_construction",
            "strength": 0.85
          }
        ]
      },
      "embeddings": {
        "semantic": [...],
        "emotional": [...],
        "pragmatic": [...]
      }
    },
    ...
  ]
}
```

#### edges/semantic/batch_0001.json
```json
{
  "batch_info": {
    "version": "2.0",
    "created_at": "2025-11-10T14:00:00Z",
    "edge_count": 5000,
    "relation_type": "semantic"
  },
  "edges": [
    {
      "id": "edge_001",
      "from": "fq_en_001",
      "to": "fq_en_042",
      "relation_type": "similar_to",
      "strength": 0.87,
      "dimensions": {
        "semantic_similarity": 0.92,
        "emotional_resonance": 0.75
      },
      "reasoning": {
        "automatic": "Both quotes discuss habit formation and identity",
        "evidence": ["shared frame: habit_formation", "similar keywords"]
      }
    },
    ...
  ]
}
```

#### indexes/master_index.json
```json
{
  "version": "2.0",
  "updated_at": "2025-11-10T20:00:00Z",
  "stats": {
    "total_nodes": 52000,
    "total_edges": 548000,
    "categories": {
      "famous-quote": 10000,
      "book": 8000,
      "movie": 7000,
      "academic": 6000,
      "proverb": 5000,
      "web": 5000,
      "essay": 4000,
      "poem": 3000,
      "drama": 2000,
      "animation": 2000
    }
  },
  "files": [
    {
      "path": "nodes/famous-quote/en/batch_0001.json",
      "node_count": 1000,
      "size_mb": 15.3,
      "checksum": "sha256:abc123..."
    },
    ...
  ]
}
```

---

# Part 3: 데이터 수집 실행 계획

## 3.1 50,000개 노드 수집 전략

### 3단계 파이프라인

**Phase 1: Raw Collection (원시 수집)** - Week 1-4
- 목표: 50,000개 원시 데이터
- 방법: API + 웹 스크래핑
- 품질: 기본 검증만

**Phase 2: Enrichment (강화)** - Week 5-8
- 목표: 언어학·심리학적 주석 추가
- 방법: NLP 파이프라인 자동화
- 품질: 자동 품질 점수

**Phase 3: Graph Construction (그래프 구축)** - Week 9-12
- 목표: 500,000+ 엣지 생성
- 방법: 다차원 유사도 계산
- 품질: 3-Tier 검증

---

## 3.2 카테고리별 수집 기준 (요약)

| 카테고리 | 목표 | 주요 소스 | 우선순위 |
|---------|------|----------|---------|
| famous-quote | 10,000 | Quotable API, Wikiquote | ⭐⭐⭐ |
| book | 8,000 | Google Books API, Gutenberg | ⭐⭐⭐ |
| movie | 7,000 | IMDb, 영화 대본 DB | ⭐⭐⭐ |
| academic | 6,000 | arXiv, Google Scholar | ⭐⭐ |
| proverb | 5,000 | 속담 사전, 사자성어 DB | ⭐⭐ |
| web | 5,000 | Medium, 브런치 | ⭐⭐ |
| essay | 4,000 | 유명 에세이스트 작품 | ⭐ |
| poem | 3,000 | 공개 도메인 시집 | ⭐ |
| drama | 2,000 | 드라마 명대사 | ⭐ |
| animation | 2,000 | 애니메이션 명대사 | ⭐ |

---

## 3.3 자동 수집 스크립트

### 수집 스크립트 구조

```python
# scripts/collection/collector_base.py

from abc import ABC, abstractmethod
from typing import List, Dict
import asyncio

class BaseCollector(ABC):
    """기본 수집기 추상 클래스"""

    def __init__(self, category: str, target_count: int):
        self.category = category
        self.target_count = target_count
        self.collected = []

    @abstractmethod
    async def fetch_batch(self, batch_size: int = 100) -> List[Dict]:
        """배치 단위로 데이터 수집"""
        pass

    @abstractmethod
    def validate(self, item: Dict) -> bool:
        """데이터 검증"""
        pass

    def transform(self, raw_item: Dict) -> Dict:
        """원시 데이터를 표준 형식으로 변환"""
        return {
            'id': self.generate_id(),
            'content': raw_item['text'],
            'source': {
                'author': raw_item.get('author', 'Unknown'),
                'verified': False
            },
            'classification': {
                'primary_category': self.category,
                'keywords': []
            }
        }

    async def collect_all(self):
        """전체 수집 프로세스"""
        print(f"🚀 {self.category} 수집 시작 (목표: {self.target_count})")

        while len(self.collected) < self.target_count:
            try:
                batch = await self.fetch_batch()

                for item in batch:
                    if self.validate(item):
                        transformed = self.transform(item)
                        self.collected.append(transformed)

                print(f"  ✅ {len(self.collected)} / {self.target_count}")

                # Rate limiting
                await asyncio.sleep(1)

            except Exception as e:
                print(f"  ❌ 오류: {e}")
                await asyncio.sleep(5)

        print(f"🎉 {self.category} 수집 완료!")
        return self.collected
```

### Quotable API 수집기

```python
# scripts/collection/quotable_collector.py

import aiohttp
from collector_base import BaseCollector

class QuotableCollector(BaseCollector):
    """Quotable.io API 수집기"""

    def __init__(self):
        super().__init__('famous-quote', 10000)
        self.api_url = 'https://api.quotable.io'
        self.current_page = 1

    async def fetch_batch(self, batch_size: int = 100):
        """Quotable API에서 배치 가져오기"""
        async with aiohttp.ClientSession() as session:
            url = f"{self.api_url}/quotes?page={self.current_page}&limit={batch_size}"

            async with session.get(url) as response:
                data = await response.json()
                self.current_page += 1

                return data.get('results', [])

    def validate(self, item: Dict) -> bool:
        """검증"""
        # 길이 체크
        if len(item.get('content', '')) < 10:
            return False
        if len(item.get('content', '')) > 500:
            return False

        # 저자 체크
        if not item.get('author'):
            return False

        return True

    def transform(self, raw_item: Dict) -> Dict:
        """Quotable 데이터를 표준 형식으로"""
        return {
            'id': f"fq_quotable_{raw_item['_id']}",
            'content': raw_item['content'],
            'source': {
                'author': raw_item['author'],
                'verified': True,
                'url': f"https://quotable.io/quotes/{raw_item['_id']}"
            },
            'classification': {
                'primary_category': 'famous-quote',
                'keywords': raw_item.get('tags', [])
            }
        }
```

---

## 3.4 품질 관리 (3-Tier 검증)

### Tier 1: 자동 검증 (100%)

```python
# scripts/quality/auto_validator.py

class AutoValidator:
    """자동 품질 검증"""

    def validate_node(self, node: Dict) -> Dict:
        """노드 검증 및 점수 산정"""

        errors = []
        warnings = []
        score = 100

        # 1. 필수 필드
        required_fields = ['id', 'content', 'source']
        for field in required_fields:
            if field not in node:
                errors.append(f"필수 필드 누락: {field}")
                score -= 30

        # 2. 길이 검증
        content_len = len(node.get('content', ''))
        if content_len < 10:
            errors.append("내용이 너무 짧음")
            score -= 40
        elif content_len > 500:
            warnings.append("내용이 길어 인지 부하 우려")
            score -= 10

        # 3. 중복 검사
        if self.is_duplicate(node['content']):
            errors.append("중복된 내용")
            score -= 50

        # 4. 언어 감지
        detected_lang = self.detect_language(node['content'])
        if detected_lang not in ['en', 'ko']:
            warnings.append(f"비표준 언어: {detected_lang}")
            score -= 5

        return {
            'valid': len(errors) == 0,
            'score': max(0, score),
            'errors': errors,
            'warnings': warnings
        }

    def is_duplicate(self, content: str) -> bool:
        """중복 체크 (첫 50자 fingerprint)"""
        fingerprint = content[:50].lower()
        fingerprint = ''.join(c for c in fingerprint if c.isalnum())

        if fingerprint in self.seen_fingerprints:
            return True

        self.seen_fingerprints.add(fingerprint)
        return False
```

### Tier 2: 전문가 큐레이션 (10%)

```python
# scripts/quality/expert_curation.py

class ExpertCuration:
    """전문가 큐레이션 시스템"""

    def select_for_review(self, nodes: List[Dict]) -> List[Dict]:
        """검토가 필요한 노드 선별"""

        candidates = []

        for node in nodes:
            # 1. 낮은 자동 점수
            if node.get('quality', {}).get('auto_score', 100) < 70:
                candidates.append(('low_score', node))

            # 2. 높은 연결성 (허브 노드)
            if node.get('stats', {}).get('connection_count', 0) > 50:
                candidates.append(('hub', node))

            # 3. 복잡한 언어학적 구조
            if len(node.get('linguistic', {}).get('metaphors', [])) > 2:
                candidates.append(('complex', node))

        # 상위 10% 선택
        selected = candidates[:len(nodes) // 10]
        return selected

    def create_review_task(self, node: Dict, reason: str) -> Dict:
        """검토 작업 생성"""
        return {
            'node_id': node['id'],
            'reason': reason,
            'content': node['content'],
            'auto_analysis': {
                'frame': node.get('linguistic', {}).get('primary_frame'),
                'metaphors': node.get('linguistic', {}).get('metaphors'),
                'emotions': node.get('affective', {}).get('primary_emotion')
            },
            'questions': [
                "프레임 분류가 정확한가?",
                "은유 감지가 적절한가?",
                "감정 분석이 타당한가?",
                "놓친 관계가 있는가?"
            ],
            'status': 'pending'
        }
```

### Tier 3: 커뮤니티 피드백

```python
# scripts/quality/community_feedback.py

class CommunityFeedback:
    """커뮤니티 피드백 수집"""

    def collect_implicit_feedback(self, user_session: Dict) -> List[Dict]:
        """사용자 행동 기반 암묵적 피드백"""

        feedback = []

        # 1. 체류 시간 (10초 이상 = 관심)
        for node_id, duration in user_session.get('dwell_times', {}).items():
            if duration > 10:
                feedback.append({
                    'type': 'positive_engagement',
                    'node_id': node_id,
                    'strength': min(duration / 60, 1.0),
                    'timestamp': user_session['timestamp']
                })

        # 2. 저장/북마크
        for node_id in user_session.get('saved_nodes', []):
            feedback.append({
                'type': 'explicit_save',
                'node_id': node_id,
                'strength': 1.0,
                'timestamp': user_session['timestamp']
            })

        # 3. 사용자 메모와 연결
        for link in user_session.get('user_note_links', []):
            feedback.append({
                'type': 'user_integration',
                'node_id': link['idea_node'],
                'strength': 0.9,
                'timestamp': user_session['timestamp']
            })

        return feedback
```

---

## 3.5 그래프 구축 파이프라인

```python
# scripts/graph/graph_builder.py

import networkx as nx
from typing import List, Dict
import numpy as np

class KnowledgeGraphBuilder:
    """지식 그래프 구축기"""

    def __init__(self):
        self.graph = nx.DiGraph()
        self.embedding_system = MultiEmbeddingSystem()
        self.vector_index = VectorIndex()

    def build(self, nodes: List[Dict]) -> nx.DiGraph:
        """노드 리스트로부터 그래프 구축"""

        print("🔨 지식 그래프 구축 시작...")

        # 1. 노드 추가
        print("  📍 노드 추가 중...")
        for node in nodes:
            self.graph.add_node(node['id'], data=node)
        print(f"    ✅ {len(nodes)}개 노드 추가 완료")

        # 2. 임베딩 생성
        print("  🧬 임베딩 생성 중...")
        embeddings = self.embedding_system.batch_encode(nodes)

        # FAISS 인덱스에 추가
        node_ids = [node['id'] for node in nodes]
        self.vector_index.batch_add(node_ids, embeddings['semantic'])
        print(f"    ✅ 임베딩 생성 완료")

        # 3. 엣지 자동 생성
        print("  🔗 엣지 생성 중...")
        edge_count = 0

        for i, node1 in enumerate(nodes):
            # 각 노드마다 가장 유사한 k개 노드 찾기
            similar = self.vector_index.search(
                embeddings['semantic'][i],
                k=20  # 상위 20개
            )

            for node2_id, similarity in similar:
                if node2_id == node1['id']:
                    continue

                node2 = self.graph.nodes[node2_id]['data']

                # 다차원 유사도 계산
                edge = self.create_edge(node1, node2, similarity)

                if edge and edge['strength'] >= 0.65:
                    self.graph.add_edge(
                        node1['id'],
                        node2_id,
                        data=edge
                    )
                    edge_count += 1

            if (i + 1) % 1000 == 0:
                print(f"    진행: {i + 1}/{len(nodes)} 노드 처리 ({edge_count}개 엣지)")

        print(f"    ✅ {edge_count}개 엣지 생성 완료")

        # 4. 그래프 최적화
        print("  ⚡ 그래프 최적화 중...")
        self.optimize_graph()
        print(f"    ✅ 최적화 완료")

        print(f"🎉 그래프 구축 완료!")
        print(f"   노드: {self.graph.number_of_nodes()}")
        print(f"   엣지: {self.graph.number_of_edges()}")
        print(f"   평균 연결도: {self.graph.number_of_edges() / self.graph.number_of_nodes():.2f}")

        return self.graph

    def optimize_graph(self):
        """그래프 최적화"""

        # 1. 약한 엣지 제거 (strength < 0.5)
        weak_edges = [
            (u, v) for u, v, data in self.graph.edges(data=True)
            if data['data']['strength'] < 0.5
        ]
        self.graph.remove_edges_from(weak_edges)
        print(f"      - {len(weak_edges)}개 약한 엣지 제거")

        # 2. 커뮤니티 감지
        from networkx.algorithms import community
        communities = community.greedy_modularity_communities(self.graph.to_undirected())
        print(f"      - {len(communities)}개 커뮤니티 감지")

        # 3. 중심성 계산
        pagerank = nx.pagerank(self.graph)

        # 노드에 중심성 점수 추가
        for node_id, score in pagerank.items():
            self.graph.nodes[node_id]['data']['centrality'] = score
```

---

# Part 4: UI/UX 개선 (MZ세대 맞춤)

## 4.1 현재 UI 문제점

```
┌─────────────────────────────┐
│ Header                       │ ← 평범
├──────────┬──────────────────┤
│ Sidebar  │ Main             │
│          │                  │
│ 메모     │ 에디터           │ ← 기능적이지만 밋밋
│ 목록     │                  │
│          │                  │
└──────────┴──────────────────┘
```

**문제:**
- ❌ TailwindCSS 기본 스타일 (다른 앱과 구별 안 됨)
- ❌ 감성 제로
- ❌ SNS 공유하고 싶지 않음
- ❌ 마이크로 인터랙션 부재

---

## 4.2 6가지 감성 테마

```typescript
// src/themes/index.ts

export const themes = {
  // 1. 미니멀 화이트 (기본)
  minimal: {
    name: '미니멀 화이트',
    colors: {
      primary: '#000000',
      background: '#FFFFFF',
      surface: '#F8F9FA',
      text: '#1A1A1A',
      accent: '#4A90E2'
    },
    fonts: {
      body: 'Pretendard Variable',
      heading: 'Pretendard Variable',
      quote: 'Georgia'
    }
  },

  // 2. 다크 모드 (AMOLED Black)
  dark: {
    name: '다크 모드',
    colors: {
      primary: '#FFFFFF',
      background: '#000000',  // Pure black for AMOLED
      surface: '#1A1A1A',
      text: '#E5E5E5',
      accent: '#7C3AED'
    }
  },

  // 3. 따뜻한 베이지 (카페 감성)
  warm: {
    name: '따뜻한 베이지',
    colors: {
      primary: '#3E2723',
      background: '#FFF8E1',
      surface: '#FFECB3',
      text: '#4E342E',
      accent: '#FF6F00'
    }
  },

  // 4. 파스텔 블루 (차분함)
  pastel: {
    name: '파스텔 블루',
    colors: {
      primary: '#1565C0',
      background: '#E3F2FD',
      surface: '#BBDEFB',
      text: '#0D47A1',
      accent: '#42A5F5'
    }
  },

  // 5. 선셋 그라디언트 (감성)
  sunset: {
    name: '선셋 그라디언트',
    colors: {
      primary: '#FF6B6B',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      surface: 'rgba(255, 255, 255, 0.1)',
      text: '#FFFFFF',
      accent: '#FFA07A'
    }
  },

  // 6. 포레스트 그린 (자연)
  forest: {
    name: '포레스트 그린',
    colors: {
      primary: '#2E7D32',
      background: '#E8F5E9',
      surface: '#C8E6C9',
      text: '#1B5E20',
      accent: '#66BB6A'
    }
  }
};
```

---

## 4.3 마이크로 인터랙션

```typescript
// src/components/MicroInteractions.tsx

import { motion, AnimatePresence } from 'framer-motion';

// 1. 메모 저장 시 반짝임 효과
export function SparkleEffect({ x, y }: { x: number; y: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: 1.5, opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      ✨
    </motion.div>
  );
}

// 2. 아이디어 연결 시 체인 애니메이션
export function ConnectionChain({ from, to }: { from: Element; to: Element }) {
  const fromRect = from.getBoundingClientRect();
  const toRect = to.getBoundingClientRect();

  return (
    <svg className="absolute inset-0 pointer-events-none">
      <motion.path
        d={`M ${fromRect.left} ${fromRect.top} Q ${(fromRect.left + toRect.left) / 2} ${(fromRect.top + toRect.top) / 2 - 50} ${toRect.left} ${toRect.top}`}
        stroke="#4A90E2"
        strokeWidth={2}
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
    </svg>
  );
}

// 3. 좋아요 클릭 시 하트 터지기
export function HeartBurst({ x, y }: { x: number; y: number }) {
  const hearts = Array.from({ length: 8 }, (_, i) => ({
    angle: (i * 360) / 8,
    delay: i * 0.05
  }));

  return (
    <div className="absolute pointer-events-none" style={{ left: x, top: y }}>
      {hearts.map(({ angle, delay }, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{
            x: Math.cos((angle * Math.PI) / 180) * 50,
            y: Math.sin((angle * Math.PI) / 180) * 50,
            opacity: 0,
            scale: 1.5
          }}
          transition={{ duration: 0.8, delay }}
        >
          ❤️
        </motion.div>
      ))}
    </div>
  );
}

// 4. 그래프 노드 호버 효과
export function GraphNode({ node, onHover }: { node: any; onHover: () => void }) {
  return (
    <motion.div
      className="graph-node"
      whileHover={{
        scale: 1.2,
        boxShadow: '0 0 20px rgba(74, 144, 226, 0.5)'
      }}
      onHoverStart={onHover}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {node.content.substring(0, 50)}...
    </motion.div>
  );
}
```

---

## 4.4 이미지 공유 기능

```typescript
// src/features/share/MemoToImage.tsx

import html2canvas from 'html2canvas';

export function MemoToImage({ memo, idea }: { memo: Memo; idea: Idea }) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const generateImage = async () => {
    if (!canvasRef.current) return;

    const canvas = await html2canvas(canvasRef.current, {
      width: 1080,
      height: 1080,
      scale: 2
    });

    // PNG로 변환
    const dataUrl = canvas.toDataURL('image/png');

    // 다운로드
    const link = document.createElement('a');
    link.download = `ideaconnect-${memo.id}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div>
      {/* 실제 렌더링될 이미지 (hidden) */}
      <div
        ref={canvasRef}
        className="hidden"
        style={{
          width: '1080px',
          height: '1080px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        {/* 메모 내용 */}
        <div style={{ background: 'white', borderRadius: '24px', padding: '48px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '24px' }}>
            {memo.title}
          </h1>
          <p style={{ fontSize: '24px', color: '#555', lineHeight: '1.6' }}>
            {memo.content.substring(0, 200)}...
          </p>
        </div>

        {/* 연결된 아이디어 */}
        <div style={{
          borderTop: '4px solid rgba(255,255,255,0.3)',
          paddingTop: '24px',
          color: 'white'
        }}>
          <p style={{ fontSize: '32px', fontStyle: 'italic', marginBottom: '16px' }}>
            "{idea.content}"
          </p>
          <p style={{ textAlign: 'right', fontSize: '20px', opacity: 0.8 }}>
            — {idea.source.author}
          </p>
        </div>

        {/* 로고 */}
        <div style={{ textAlign: 'center', color: 'white', fontSize: '18px', opacity: 0.7 }}>
          💡 IdeaConnect
        </div>
      </div>

      {/* 생성 버튼 */}
      <Button onClick={generateImage}>
        📸 이미지로 저장
      </Button>
    </div>
  );
}
```

---

## 4.5 그래프 시각화 (옵시디언 스타일)

```typescript
// src/features/graph/GraphView3D.tsx

import { useRef, useEffect } from 'react';
import ForceGraph3D from 'react-force-graph-3d';

export function GraphView3D({ nodes, edges }: { nodes: any[]; edges: any[] }) {
  const fgRef = useRef<any>();

  const graphData = {
    nodes: nodes.map(node => ({
      id: node.id,
      name: node.content.substring(0, 50),
      val: node.stats.connection_count,
      color: getNodeColor(node.affective.primary_emotion)
    })),
    links: edges.map(edge => ({
      source: edge.from,
      target: edge.to,
      value: edge.strength,
      color: getEdgeColor(edge.relation_type)
    }))
  };

  useEffect(() => {
    // 카메라 애니메이션
    const fg = fgRef.current;
    if (fg) {
      fg.cameraPosition({ z: 300 }, null, 2000);
    }
  }, []);

  return (
    <div className="h-screen w-full">
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        nodeLabel="name"
        nodeAutoColorBy="group"
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover}
        nodeThreeObject={(node: any) => {
          // 커스텀 3D 오브젝트
          const sprite = new SpriteText(node.name);
          sprite.color = node.color;
          sprite.textHeight = 8;
          return sprite;
        }}
      />
    </div>
  );
}

function getNodeColor(emotion: string): string {
  const emotionColors = {
    joy: '#FFD700',
    trust: '#87CEEB',
    fear: '#9370DB',
    surprise: '#FF69B4',
    sadness: '#4682B4',
    anger: '#DC143C',
    anticipation: '#FFA500'
  };
  return emotionColors[emotion] || '#808080';
}
```

---

# Part 5: 기술 부채 & 개선

## 5.1 현재 기술 스택 평가

### ✅ 잘한 선택

| 기술 | 이유 | 평가 |
|------|------|------|
| React + TypeScript | 업계 표준, 타입 안전 | ⭐⭐⭐⭐⭐ |
| Vite | 빠른 빌드, HMR | ⭐⭐⭐⭐⭐ |
| TailwindCSS | 생산성, 일관성 | ⭐⭐⭐⭐⭐ |
| Zustand | 가볍고 간단한 상태 관리 | ⭐⭐⭐⭐⭐ |
| IndexedDB (Dexie) | 오프라인 우선, 대용량 | ⭐⭐⭐⭐⭐ |

### ⚠️ 개선 필요

| 항목 | 현재 상태 | 문제 | 해결 방안 |
|------|---------|------|----------|
| **테스트** | 0개 | 버그 위험 높음 | Vitest + Testing Library |
| **에러 처리** | 기본만 | UX 불친절 | Error Boundary + Sentry |
| **성능 측정** | 없음 | 최적화 어려움 | Lighthouse CI |
| **접근성** | 미흡 | 장애인 사용 불가 | ARIA + 키보드 지원 |

---

## 5.2 테스트 전략

```typescript
// tests/unit/ideaStore.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { useIdeaStore } from '@/stores/ideaStore';

describe('IdeaStore', () => {
  beforeEach(() => {
    // 각 테스트 전 초기화
    useIdeaStore.getState().reset();
  });

  it('should add a new idea', async () => {
    const store = useIdeaStore.getState();

    const idea = {
      content: 'Test quote',
      source: { author: 'Test Author' },
      type: 'famous-quote' as const
    };

    await store.addIdea(idea);

    const ideas = store.ideas;
    expect(ideas).toHaveLength(1);
    expect(ideas[0].content).toBe('Test quote');
  });

  it('should update feedback correctly', async () => {
    const store = useIdeaStore.getState();

    // 아이디어 추가
    await store.addIdea({
      content: 'Test',
      source: { author: 'Author' },
      type: 'famous-quote'
    });

    const ideaId = store.ideas[0].id;

    // 피드백 업데이트
    await store.updateFeedback(ideaId, 'up');

    const idea = store.ideas.find(i => i.id === ideaId);
    expect(idea?.feedback).toBe('up');
  });
});
```

---

## 5.3 에러 처리 & 모니터링

```typescript
// src/components/ErrorBoundary.tsx

import { Component, ReactNode } from 'react';
import * as Sentry from '@sentry/react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Sentry에 에러 보고
    Sentry.captureException(error, { extra: errorInfo });

    console.error('Caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md p-8 bg-white rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                ⚠️ 오류가 발생했습니다
              </h2>
              <p className="text-gray-700 mb-4">
                죄송합니다. 예상치 못한 오류가 발생했습니다.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                {this.state.error?.message}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                페이지 새로고침
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// Sentry 초기화
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay()
  ]
});
```

---

## 5.4 성능 최적화

```typescript
// src/hooks/useVirtualScroll.ts

import { useEffect, useRef, useState } from 'react';

export function useVirtualScroll<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 보이는 항목만 렌더링
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );

  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollTop(container.scrollTop);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return {
    containerRef,
    visibleItems,
    offsetY,
    totalHeight: items.length * itemHeight
  };
}

// 사용 예시
function MemoList({ memos }: { memos: Memo[] }) {
  const { containerRef, visibleItems, offsetY, totalHeight } = useVirtualScroll(
    memos,
    80,  // 각 항목 높이
    window.innerHeight
  );

  return (
    <div ref={containerRef} className="h-screen overflow-auto">
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map(memo => (
            <MemoItem key={memo.id} memo={memo} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## 5.5 접근성 (a11y)

```typescript
// src/components/AccessibleButton.tsx

interface Props {
  onClick: () => void;
  children: React.ReactNode;
  ariaLabel: string;
  variant?: 'primary' | 'secondary';
}

export function AccessibleButton({ onClick, children, ariaLabel, variant = 'primary' }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`
        px-4 py-2 rounded
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${variant === 'primary' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}
        hover:opacity-90
        transition-opacity
      `}
      // 키보드 네비게이션
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {children}
    </button>
  );
}

// Skip to content 링크
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-500 text-white p-4 z-50"
    >
      본문으로 건너뛰기
    </a>
  );
}
```

---

# Part 6: 확장성 설계

## 6.1 플러그인 시스템

```typescript
// src/plugins/types.ts

export interface Plugin {
  id: string;
  name: string;
  version: string;
  author: string;

  // 훅
  onMemoCreated?: (memo: Memo) => void | Promise<void>;
  onIdeaAdded?: (idea: Idea) => void | Promise<void>;
  onConnectionCreated?: (connection: Connection) => void | Promise<void>;

  // UI 확장
  sidebarWidget?: React.ComponentType;
  editorButton?: React.ComponentType<{ memo: Memo }>;
  settingsPanel?: React.ComponentType;

  // API
  api?: {
    search?: (query: string) => Promise<Idea[]>;
    export?: (data: any) => Promise<void>;
    import?: (file: File) => Promise<any>;
  };

  // 설정
  settings?: Record<string, any>;

  // 라이프사이클
  onActivate?: () => void | Promise<void>;
  onDeactivate?: () => void | Promise<void>;
}

// 플러그인 매니저
export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();

  register(plugin: Plugin) {
    this.plugins.set(plugin.id, plugin);
    plugin.onActivate?.();
    console.log(`✅ 플러그인 등록: ${plugin.name}`);
  }

  unregister(pluginId: string) {
    const plugin = this.plugins.get(pluginId);
    if (plugin) {
      plugin.onDeactivate?.();
      this.plugins.delete(pluginId);
      console.log(`❌ 플러그인 제거: ${plugin.name}`);
    }
  }

  // 훅 실행
  async triggerHook(hookName: string, ...args: any[]) {
    for (const plugin of this.plugins.values()) {
      const hook = plugin[hookName as keyof Plugin];
      if (typeof hook === 'function') {
        await hook(...args);
      }
    }
  }
}
```

### 플러그인 예시: 맞춤법 검사기

```typescript
// plugins/grammar-checker/index.ts

const grammarPlugin: Plugin = {
  id: 'grammar-checker',
  name: '맞춤법 검사기',
  version: '1.0.0',
  author: 'IdeaConnect Team',

  onMemoCreated: async (memo) => {
    // 맞춤법 검사
    const errors = await checkGrammar(memo.content);

    if (errors.length > 0) {
      // 알림 표시
      showNotification({
        title: '맞춤법 오류 발견',
        message: `${errors.length}개의 오류가 있습니다.`,
        type: 'warning'
      });
    }
  },

  editorButton: ({ memo }) => (
    <button onClick={() => correctGrammar(memo)}>
      ✓ 맞춤법 검사
    </button>
  ),

  settingsPanel: () => (
    <div>
      <h3>맞춤법 검사 설정</h3>
      <label>
        <input type="checkbox" />
        자동 검사 활성화
      </label>
    </div>
  )
};

async function checkGrammar(text: string): Promise<GrammarError[]> {
  // 한글 맞춤법 API 호출
  const response = await fetch('https://api.example.com/grammar', {
    method: 'POST',
    body: JSON.stringify({ text })
  });

  return response.json();
}
```

---

## 6.2 Public API

```typescript
// src/api/public/index.ts

import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// GET /api/memos - 전체 메모 조회
app.get('/api/memos', async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;

  const memos = await db.memos
    .where('content')
    .startsWithIgnoreCase(search as string || '')
    .offset((+page - 1) * +limit)
    .limit(+limit)
    .toArray();

  res.json({
    data: memos,
    pagination: {
      page: +page,
      limit: +limit,
      total: await db.memos.count()
    }
  });
});

// POST /api/memos - 새 메모 생성
app.post('/api/memos', async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: '제목과 내용은 필수입니다' });
  }

  const memo = await createMemo({ title, content });

  res.status(201).json({ data: memo });
});

// GET /api/ideas?memoId=xxx - 메모의 아이디어 조회
app.get('/api/ideas', async (req, res) => {
  const { memoId } = req.query;

  if (!memoId) {
    return res.status(400).json({ error: 'memoId는 필수입니다' });
  }

  const ideas = await db.ideas
    .where('memoId')
    .equals(memoId as string)
    .toArray();

  res.json({ data: ideas });
});

// GET /api/graph?memoId=xxx - 그래프 데이터
app.get('/api/graph', async (req, res) => {
  const { memoId } = req.query;

  const nodes = await db.ideas.where('memoId').equals(memoId as string).toArray();
  const edges = await db.connections.where('memoId').equals(memoId as string).toArray();

  res.json({
    nodes,
    edges
  });
});

app.listen(3000, () => {
  console.log('🚀 API server running on http://localhost:3000');
});
```

---

## 6.3 통합 (Notion, Obsidian, Zapier)

### Notion 내보내기

```typescript
// src/integrations/notion.ts

import { Client } from '@notionhq/client';

export async function exportToNotion(memo: Memo, ideas: Idea[]) {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });

  // 페이지 생성
  const page = await notion.pages.create({
    parent: { database_id: process.env.NOTION_DATABASE_ID! },
    properties: {
      Name: {
        title: [{ text: { content: memo.title } }]
      },
      Created: {
        date: { start: memo.createdAt.toISOString() }
      }
    },
    children: [
      // 메모 내용
      {
        type: 'paragraph',
        paragraph: {
          rich_text: [{ text: { content: memo.content } }]
        }
      },
      // 연결된 아이디어들
      {
        type: 'heading_2',
        heading_2: {
          rich_text: [{ text: { content: '연결된 아이디어' } }]
        }
      },
      ...ideas.map(idea => ({
        type: 'quote' as const,
        quote: {
          rich_text: [{
            text: {
              content: `"${idea.content}" - ${idea.source.author}`
            }
          }]
        }
      }))
    ]
  });

  return page;
}
```

### Obsidian 마크다운 변환

```typescript
// src/integrations/obsidian.ts

export function convertToObsidianMarkdown(memo: Memo, ideas: Idea[]): string {
  let markdown = `# ${memo.title}\n\n`;
  markdown += `Created: ${memo.createdAt.toLocaleDateString()}\n\n`;
  markdown += `${memo.content}\n\n`;
  markdown += `---\n\n`;
  markdown += `## 연결된 아이디어\n\n`;

  for (const idea of ideas) {
    markdown += `### ${idea.source.author}\n\n`;
    markdown += `> ${idea.content}\n\n`;
    markdown += `Tags: ${idea.keywords?.join(', ')}\n\n`;
  }

  return markdown;
}

export function downloadAsMarkdown(memo: Memo, ideas: Idea[]) {
  const markdown = convertToObsidianMarkdown(memo, ideas);
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${memo.title}.md`;
  link.click();

  URL.revokeObjectURL(url);
}
```

---

# Part 7: 구현 로드맵

## 7.1 16주 단계별 계획

### Phase 1: Foundation (Week 1-4)
**목표**: 기본 인프라 + 10,000개 노드

```bash
Week 1:
  ✓ 데이터 스키마 최종 확정
  ✓ 수집 파이프라인 구축
  ✓ NLP 모델 셋업 (spaCy, Sentence Transformers)

Week 2-3:
  ✓ 10,000개 노드 수집 (Quotable, Wikiquote)
  ✓ 기본 임베딩 생성
  ✓ FAISS 인덱스 구축

Week 4:
  ✓ 자동 검증 시스템
  ✓ NAS 저장소 설정
  ✓ 첫 배치 데이터 검증
```

### Phase 2: Enrichment (Week 5-8)
**목표**: 언어학·심리학적 주석 + 30,000개 노드

```bash
Week 5-6:
  ✓ 프레임 의미론 분석기
  ✓ 은유 감지 시스템
  ✓ 감정 분석 (Plutchik 8감정)

Week 7-8:
  ✓ 30,000개 추가 노드 수집
  ✓ 전체 노드 강화 (enrichment)
  ✓ 품질 검증 및 큐레이션
```

### Phase 3: Graph Construction (Week 9-12)
**목표**: 50,000개 노드 + 500,000개 엣지

```bash
Week 9-10:
  ✓ 관계 추출 알고리즘 구현
  ✓ 엣지 자동 생성 (다차원 유사도)
  ✓ 그래프 최적화

Week 11-12:
  ✓ 커뮤니티 감지 (Louvain)
  ✓ 중심성 계산 (PageRank)
  ✓ 50,000개 노드 완성
```

### Phase 4: UI/UX (Week 13-14)
**목표**: 옵시디언 스타일 UI + 통합

```bash
Week 13:
  ✓ 6가지 테마 구현
  ✓ 마이크로 인터랙션
  ✓ 이미지 공유 기능

Week 14:
  ✓ 3D 그래프 시각화
  ✓ 반응형 디자인
  ✓ 접근성 개선
```

### Phase 5: Quality & Testing (Week 15-16)
**목표**: 안정화 + 배포

```bash
Week 15:
  ✓ 단위 테스트 (90% 커버리지)
  ✓ 통합 테스트
  ✓ 성능 최적화

Week 16:
  ✓ 전문가 큐레이션 (상위 10%)
  ✓ 최종 검증
  ✓ NAS 배포
  ✓ GitHub Pages 업데이트
```

---

## 7.2 마일스톤 & KPI

### Milestone 1 (Week 4): 기반 완성
- [x] 10,000개 노드 수집
- [x] 임베딩 시스템 구축
- [x] NAS 저장소 설정
- **KPI**: 데이터 품질 점수 > 80

### Milestone 2 (Week 8): 강화 완료
- [ ] 40,000개 노드 (누적)
- [ ] 언어학·심리학 주석 100%
- **KPI**: 메타데이터 완성도 > 85%

### Milestone 3 (Week 12): 그래프 완성
- [ ] 52,000개 노드
- [ ] 500,000개 이상 엣지
- **KPI**: 평균 연결도 > 10, 검색 정확도 > 85%

### Milestone 4 (Week 14): UI 완성
- [ ] 6가지 테마
- [ ] 3D 그래프 시각화
- **KPI**: 사용자 체류 시간 > 10분

### Milestone 5 (Week 16): 런칭
- [ ] 테스트 커버리지 > 90%
- [ ] 성능 최적화 완료
- **KPI**: Lighthouse 점수 > 90

---

## 7.3 성공 지표 (종합)

### 정량적 지표

| 지표 | 목표 | 측정 방법 |
|------|------|----------|
| **노드 수** | 52,000+ | master_index.json |
| **엣지 수** | 500,000+ | 그래프 통계 |
| **엣지 품질** | 평균 0.7+ | confidence 점수 |
| **검색 정확도** | 85%+ | 사용자 피드백 |
| **응답 시간** | < 200ms | Performance API |
| **번들 크기** | < 500KB | Vite build 분석 |

### 정성적 지표

- **메타데이터 완성도**: 80% 이상 노드가 모든 차원 주석 보유
- **커뮤니티 구조**: 10-20개 명확한 주제 클러스터
- **다양성**: 10개 카테고리 균형잡힌 분포

### 사용자 경험 지표

- **발견 비율**: 세션당 2개 이상 예상치 못한 유용한 연결 발견
- **저장률**: 탐색한 노드의 10% 이상 저장
- **통합률**: 사용자 메모의 30% 이상이 DB 노드와 연결

---

## 7.4 런칭 체크리스트

### 코드 품질
- [ ] ESLint 경고 0개
- [ ] TypeScript 에러 0개
- [ ] 테스트 커버리지 > 90%
- [ ] 모든 컴포넌트 문서화

### 성능
- [ ] Lighthouse Performance > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] 번들 크기 < 500KB

### 접근성
- [ ] WCAG 2.1 AA 준수
- [ ] 키보드 네비게이션 100%
- [ ] 스크린 리더 테스트 완료
- [ ] 색상 대비 4.5:1 이상

### 데이터
- [ ] 52,000개 노드 검증 완료
- [ ] 500,000개 엣지 검증 완료
- [ ] NAS 백업 완료
- [ ] 버전 관리 시스템 구축

### 배포
- [ ] GitHub Pages 빌드 성공
- [ ] HTTPS 설정 완료
- [ ] 커스텀 도메인 연결
- [ ] CDN 설정 (선택)

### 문서화
- [ ] README.md 업데이트
- [ ] 사용자 가이드 작성
- [ ] API 문서 작성
- [ ] 기여 가이드라인

---

**🎉 IdeaConnect v2.0 완벽 가이드 완성!**

이 가이드는 이론적 깊이와 실용적 구현, 그리고 UX 혁신을 모두 담은 완전한 로드맵입니다.

**다음 단계:**
1. Part별로 우선순위에 따라 구현
2. 각 Phase 완료 시 마일스톤 체크
3. 지속적인 개선 및 커뮤니티 피드백 반영

**문의 및 기여**: [GitHub Issues](https://github.com/yourusername/ideaconnect)

---

**버전**: 2.0
**최종 업데이트**: 2025-11-10
**작성자**: Claude + IdeaConnect Team

