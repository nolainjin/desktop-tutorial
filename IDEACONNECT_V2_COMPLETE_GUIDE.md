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

**Part 1 완료! 다음 Part 2를 진행할까요?**

