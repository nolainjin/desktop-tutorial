# IdeaConnect 지식 그래프 데이터 수집 가이드 v2.0
## 언어학·인지심리학·AI 기반 고해상도 설계

---

## 🎯 핵심 목표 재정의

### 기존 목표의 문제점
- ❌ 단순 키워드 매칭 중심 → 맥락 손실
- ❌ 카테고리 분류 중심 → 개념 간 관계 부재
- ❌ 검색 최적화 중심 → 발견(discovery) 경험 부족

### 새로운 목표
**"사고의 그래프를 구축하여 아이디어 간 유기적 연결과 창발적 발견을 가능하게 한다"**

#### 정량적 목표
- **50,000개 이상의 노드(아이디어)** 수집
- **500,000개 이상의 엣지(관계)** 생성
- **다층적 관계망** 구축 (의미적, 감정적, 실용적, 역사적)

#### 정성적 목표
1. **맥락적 유사도**: 표면적 키워드가 아닌 심층 의미 연결
2. **창발적 발견**: 예상치 못한 아이디어 간 연결 지원
3. **인지 부하 최적화**: 정보 과부하 없이 통찰 제공
4. **개인화 가능성**: 사용자 사고 패턴 학습 기반

---

## 🧠 인지심리학적 기반 설계

### 1. 스키마 이론 (Schema Theory) 적용

**원리**: 인간은 개념을 독립된 점이 아닌, 연결된 구조(스키마)로 저장한다.

**구현 전략**:
```json
{
  "id": "node_001",
  "content": "We are what we repeatedly do.",
  "schema_mappings": [
    {
      "schema_type": "습관 형성 스키마",
      "slot": "결과",
      "related_slots": {
        "원인": ["반복", "실천"],
        "메커니즘": ["신경가소성", "자동화"],
        "시간성": ["장기적", "누적적"]
      }
    }
  ]
}
```

**카테고리 → 스키마 변환**:
| 기존 카테고리 | 스키마 | 하위 스키마 |
|-------------|--------|------------|
| 습관 | 행동 변화 스키마 | 습관 형성, 습관 깨기, 자동화 |
| 성장 | 발달 스키마 | 학습, 적응, 진화, 극복 |
| 관계 | 사회적 인지 스키마 | 공감, 소통, 갈등, 신뢰 |

### 2. 확산 활성화 이론 (Spreading Activation)

**원리**: 하나의 개념이 활성화되면 관련된 개념들이 연쇄적으로 활성화된다.

**구현**: 가중치 기반 관계망
```javascript
{
  "from": "습관",
  "to": "정체성",
  "edge_type": "인과관계",
  "weight": 0.87,  // 강한 연결
  "activation_decay": 0.15,  // 전파 감쇠율
  "bidirectional": true
}
```

**관계 유형별 가중치**:
- **인과관계** (A → B): 0.8-0.95 (강함)
- **유사관계** (A ≈ B): 0.6-0.8 (중간)
- **대조관계** (A ≠ B): 0.5-0.7 (약함, 그러나 중요)
- **맥락적** (A contextual→ B): 0.4-0.6 (약함)

### 3. 정교화 가능성 모델 (Elaboration Likelihood Model)

**원리**: 정보 처리 깊이에 따라 중심 경로(깊은 사고)와 주변 경로(휴리스틱) 구분

**구현**: 이중 검색 경로
```typescript
interface SearchResult {
  // 중심 경로: 깊은 의미 매칭
  deep_matches: {
    content: string;
    semantic_similarity: number;  // 0.8+
    reasoning: string;  // 왜 연결되는지 설명
  }[];
  
  // 주변 경로: 빠른 연상
  quick_associations: {
    content: string;
    association_type: 'keyword' | 'emotion' | 'metaphor';
    strength: number;  // 0.5-0.7
  }[];
}
```

---

## 🔤 언어학적 기반 설계

### 1. 프레임 의미론 (Frame Semantics)

**원리** (Charles Fillmore): 단어는 프레임(상황 구조) 내에서 의미를 가진다.

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

**데이터 구조 적용**:
```json
{
  "id": "quote_315",
  "content": "The best time to plant a tree was 20 years ago. The second best time is now.",
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
      "relation": "inheritance"  // 상속 관계
    },
    {
      "related_frame": "기회_포착",
      "relation": "subframe"
    }
  ]
}
```

### 2. 개념적 은유 이론 (Conceptual Metaphor Theory)

**원리** (Lakoff & Johnson): 추상적 개념은 구체적 은유로 이해된다.

**핵심 은유 체계 식별**:
```javascript
const CONCEPTUAL_METAPHORS = {
  "시간은_자원이다": {
    "source_domain": "물질적_자원",
    "target_domain": "시간",
    "mappings": {
      "spending": "보내다",
      "saving": "아끼다",
      "wasting": "낭비하다",
      "investing": "투자하다"
    },
    "example_quotes": [
      "Time is money",
      "Don't waste your time"
    ]
  },
  
  "인생은_여정이다": {
    "source_domain": "물리적_여행",
    "target_domain": "인생",
    "mappings": {
      "path": "길/경로",
      "obstacles": "장애물",
      "destination": "목표",
      "companions": "동반자"
    }
  },
  
  "아이디어는_건물이다": {
    "source_domain": "건축",
    "target_domain": "추론",
    "mappings": {
      "foundation": "기초/전제",
      "structure": "논리_구조",
      "collapse": "논리_붕괴"
    }
  }
}
```

**데이터 수집 시 은유 태깅**:
```json
{
  "content": "Build your argument on solid foundations",
  "metaphor": {
    "system": "아이디어는_건물이다",
    "elements": ["build", "foundations"],
    "related_metaphors": ["아이디어는_식물이다"]  // 교차 은유
  }
}
```

### 3. 의미 역할 이론 (Semantic Role Labeling)

**원리**: 문장의 심층 구조를 행위자-행위-대상으로 분해

**적용**:
```python
# 의미 역할 자동 태깅
{
  "content": "Courage is not the absence of fear, but the triumph over it.",
  "semantic_roles": {
    "theme": "용기",  # 주제
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

---

## 🤖 AI/NLP 기술 기반 설계

### 1. 임베딩 벡터 공간 (Embedding Space)

**기술**: Sentence Transformers / OpenAI Embeddings

**구현**:
```python
from sentence_transformers import SentenceTransformer
import numpy as np

# 다중 임베딩 전략
class MultiEmbedding:
    def __init__(self):
        # 의미적 임베딩 (semantic)
        self.semantic_model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # 감정적 임베딩 (emotional)
        self.emotion_model = SentenceTransformer('emotion-english-distilroberta-base')
        
        # 의도 임베딩 (pragmatic)
        self.intent_model = SentenceTransformer('intent-classification')
    
    def encode(self, text):
        return {
            'semantic': self.semantic_model.encode(text),
            'emotional': self.emotion_model.encode(text),
            'pragmatic': self.intent_model.encode(text)
        }

# 다차원 유사도 계산
def multi_dimensional_similarity(vec1, vec2, weights):
    """
    weights: {
        'semantic': 0.5,
        'emotional': 0.3,
        'pragmatic': 0.2
    }
    """
    similarities = {}
    for dimension in ['semantic', 'emotional', 'pragmatic']:
        cos_sim = cosine_similarity(
            vec1[dimension], 
            vec2[dimension]
        )
        similarities[dimension] = cos_sim
    
    weighted_sim = sum(
        similarities[dim] * weights[dim] 
        for dim in weights
    )
    
    return weighted_sim, similarities
```

**데이터 저장**:
```json
{
  "id": "node_001",
  "content": "...",
  "embeddings": {
    "semantic_v": [0.123, -0.456, ...],  // 768 dim
    "emotional_v": [0.789, 0.234, ...],  // 768 dim
    "pragmatic_v": [-0.345, 0.678, ...]  // 768 dim
  },
  "embedding_model": "sentence-transformers/all-MiniLM-L6-v2",
  "version": "2.0"
}
```

### 2. 지식 그래프 임베딩 (Knowledge Graph Embedding)

**기술**: TransE, ComplEx, RotatE

**목적**: (entity, relation, entity) 삼중항을 벡터 공간에 배치

**구현**:
```python
# TransE 모델 (간단하지만 효과적)
class TransE:
    """
    h + r ≈ t
    head entity + relation ≈ tail entity
    """
    
    def train(self, triples):
        # triples: [("습관", "leads_to", "정체성"), ...]
        
        for (h, r, t) in triples:
            h_vec = self.entity_embeddings[h]
            r_vec = self.relation_embeddings[r]
            t_vec = self.entity_embeddings[t]
            
            # 손실: ||h + r - t||
            loss = np.linalg.norm(h_vec + r_vec - t_vec)
            self.optimize(loss)
    
    def predict_tail(self, head, relation):
        """주어진 (head, relation)으로 tail 예측"""
        h_vec = self.entity_embeddings[head]
        r_vec = self.relation_embeddings[relation]
        
        predicted_t = h_vec + r_vec
        
        # 가장 가까운 entity 찾기
        return self.find_nearest_entity(predicted_t)

# 사용 예시
model = TransE()
model.train(knowledge_triples)

# "습관" + "결과는" → ?
result = model.predict_tail("습관", "결과는")
# → "정체성" (높은 확률)
```

### 3. 관계 추출 (Relation Extraction)

**방법**: 사전 정의 + 기계학습

**관계 온톨로지**:
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

**자동 관계 추출**:
```python
import spacy
from transformers import pipeline

nlp = spacy.load("en_core_web_trf")
relation_extractor = pipeline(
    "text-classification",
    model="relation-extraction-model"
)

def extract_relations(quote1, quote2):
    """두 명언 간 관계 자동 추출"""
    
    # 1. 공통 개념 추출
    doc1 = nlp(quote1)
    doc2 = nlp(quote2)
    
    concepts1 = [ent.text for ent in doc1.ents]
    concepts2 = [ent.text for ent in doc2.ents]
    
    shared = set(concepts1) & set(concepts2)
    
    # 2. 의미적 유사도
    similarity = doc1.similarity(doc2)
    
    # 3. 논리적 관계 추론
    relations = []
    
    if similarity > 0.8:
        relations.append(("similar_to", similarity))
    
    if has_causal_markers(quote1, quote2):
        relations.append(("causes", 0.7))
    
    if has_contrast_markers(quote1, quote2):
        relations.append(("contrasts_with", 0.6))
    
    return relations
```

---

## 📊 향상된 데이터 스키마

### 노드(Node) 구조 - 다층적 표현

```typescript
interface IdeaNode {
  // === 기본 식별 ===
  id: string;
  content: string;
  content_ko?: string;
  
  // === 출처 메타데이터 ===
  source: {
    author: string;
    work: string;
    year: number;
    url?: string;
    isbn?: string;
    doi?: string;
  };
  
  // === 언어학적 분석 ===
  linguistic: {
    // 프레임 의미론
    primary_frame: string;
    frame_elements: Record<string, string>;
    related_frames: string[];
    
    // 은유 분석
    metaphors: {
      system: string;  // "시간은_자원이다"
      elements: string[];
      source_domain: string;
      target_domain: string;
    }[];
    
    // 의미 역할
    semantic_roles: {
      theme: string;
      agent?: string;
      patient?: string;
      instrument?: string;
    };
    
    // 화행 이론 (Speech Act)
    speech_act: 'assertive' | 'directive' | 'commissive' | 'expressive';
  };
  
  // === 인지심리학적 분석 ===
  cognitive: {
    // 스키마 매핑
    schemas: {
      type: string;
      slot: string;
      related_slots: Record<string, string[]>;
    }[];
    
    // 정보 처리 수준
    processing_level: 'surface' | 'semantic' | 'pragmatic';
    
    // 인지 부하
    cognitive_load: 'low' | 'medium' | 'high';
    
    // 기억 인출 단서
    retrieval_cues: string[];
  };
  
  // === 감정/태도 분석 ===
  affective: {
    // 감정 벡터 (Plutchik의 8가지 기본 감정)
    emotions: {
      joy: number;
      trust: number;
      fear: number;
      surprise: number;
      sadness: number;
      disgust: number;
      anger: number;
      anticipation: number;
    };
    
    // 감정가 (Valence)
    valence: number;  // -1 (negative) ~ +1 (positive)
    
    // 각성도 (Arousal)
    arousal: number;  // 0 (calm) ~ 1 (excited)
    
    // 지배성 (Dominance)
    dominance: number;  // 0 (submissive) ~ 1 (dominant)
  };
  
  // === 실용적 차원 ===
  pragmatic: {
    // 적용 가능한 상황
    applicable_contexts: string[];
    
    // 행동 유도성 (Affordance)
    action_tendencies: string[];
    
    // 실천 난이도
    implementation_difficulty: 'easy' | 'medium' | 'hard';
    
    // 시간 지평
    time_horizon: 'immediate' | 'short-term' | 'long-term';
  };
  
  // === 벡터 임베딩 ===
  embeddings: {
    semantic: number[];     // 768-dim
    emotional: number[];    // 768-dim
    pragmatic: number[];    // 768-dim
    kg_embedding: number[]; // 128-dim (지식 그래프)
  };
  
  // === 통계 정보 ===
  stats: {
    view_count: number;
    connection_count: number;
    user_saved_count: number;
    avg_rating: number;
  };
}
```

### 엣지(Edge) 구조 - 다중 관계

```typescript
interface IdeaEdge {
  id: string;
  from: string;  // node id
  to: string;    // node id
  
  // === 관계 유형 ===
  relation_type: RelationType;
  
  // === 관계 강도 ===
  strength: number;  // 0.0 ~ 1.0
  
  // === 관계 차원별 점수 ===
  dimensions: {
    semantic_similarity: number;     // 의미적 유사성
    emotional_resonance: number;     // 감정적 공명
    pragmatic_alignment: number;     // 실용적 정렬
    metaphorical_connection: number; // 은유적 연결
    causal_strength: number;         // 인과 관계 강도
  };
  
  // === 관계 설명 ===
  reasoning: {
    automatic: string;  // AI 자동 생성
    curated?: string;   // 큐레이터 수동 작성
  };
  
  // === 양방향성 ===
  bidirectional: boolean;
  reverse_relation?: RelationType;
  
  // === 컨텍스트 ===
  context_dependent: boolean;
  contexts?: string[];  // 어떤 맥락에서 이 관계가 유효한가
  
  // === 신뢰도 ===
  confidence: number;  // 0.0 ~ 1.0
  source: 'algorithm' | 'expert' | 'community';
  
  // === 시간 정보 ===
  created_at: Date;
  last_activated: Date;
  activation_count: number;
}

type RelationType = 
  // 의미적
  | 'similar_to'
  | 'opposite_to'
  | 'part_of'
  | 'example_of'
  | 'generalizes_to'
  
  // 인과적
  | 'causes'
  | 'enables'
  | 'prevents'
  | 'requires'
  
  // 시간적
  | 'precedes'
  | 'follows'
  | 'concurrent_with'
  
  // 논리적
  | 'supports'
  | 'contradicts'
  | 'refines'
  | 'extends'
  
  // 은유적
  | 'metaphor_of'
  | 'analogy_to'
  
  // 감정적
  | 'evokes_same_emotion'
  | 'contrasting_emotion'
  
  // 실용적
  | 'implements_same_principle'
  | 'alternative_approach';
```

---

## 🔬 수집 방법론 - 3단계 파이프라인

### Phase 1: Raw Collection (원시 수집)
**목표**: 50,000개 원시 데이터

```python
# 1. API 기반 대량 수집
quotable_quotes = fetch_from_quotable_api(10000)
goodreads_quotes = fetch_from_goodreads(8000)
wikiquote = scrape_wikiquote(7000)

# 2. 기본 메타데이터 추가
for quote in raw_quotes:
    quote['id'] = generate_id()
    quote['source'] = extract_source(quote)
    quote['basic_keywords'] = extract_keywords_tfidf(quote.content)
```

### Phase 2: Enrichment (강화)
**목표**: 언어학·심리학적 주석 추가

```python
from transformers import pipeline
import spacy

# 언어학적 분석기
nlp = spacy.load("en_core_web_trf")
metaphor_detector = pipeline("text-classification", model="metaphor-detection")
emotion_analyzer = pipeline("text-classification", model="emotion")

def enrich_quote(quote):
    doc = nlp(quote.content)
    
    # 1. 프레임 의미론 분석
    quote.linguistic.primary_frame = detect_frame(doc)
    quote.linguistic.frame_elements = extract_frame_elements(doc)
    
    # 2. 은유 분석
    metaphors = metaphor_detector(quote.content)
    quote.linguistic.metaphors = classify_metaphors(metaphors)
    
    # 3. 감정 분석
    emotions = emotion_analyzer(quote.content)
    quote.affective.emotions = parse_emotions(emotions)
    
    # 4. 임베딩 생성
    quote.embeddings.semantic = semantic_model.encode(quote.content)
    quote.embeddings.emotional = emotion_model.encode(quote.content)
    quote.embeddings.pragmatic = intent_model.encode(quote.content)
    
    return quote
```

### Phase 3: Graph Construction (그래프 구축)
**목표**: 500,000+ 관계 생성

```python
import networkx as nx
from sklearn.metrics.pairwise import cosine_similarity

def construct_knowledge_graph(enriched_quotes):
    G = nx.DiGraph()
    
    # 1. 노드 추가
    for quote in enriched_quotes:
        G.add_node(quote.id, data=quote)
    
    # 2. 엣지 자동 생성
    for i, q1 in enumerate(enriched_quotes):
        for q2 in enriched_quotes[i+1:]:
            # 다차원 유사도 계산
            similarities = calculate_multi_dim_similarity(q1, q2)
            
            # 임계값 이상이면 엣지 생성
            if similarities['weighted'] > 0.65:
                edge = create_edge(q1, q2, similarities)
                G.add_edge(q1.id, q2.id, data=edge)
    
    # 3. 추가 관계 추론
    infer_causal_relations(G)
    infer_metaphorical_relations(G)
    detect_communities(G)
    
    # 4. 그래프 최적화
    prune_weak_edges(G, threshold=0.5)
    add_shortcuts(G)  # 자주 함께 접근되는 노드 간 직접 연결
    
    return G

def calculate_multi_dim_similarity(q1, q2):
    """다차원 유사도 계산"""
    
    # 의미적 유사도 (semantic)
    sem_sim = cosine_similarity(
        q1.embeddings.semantic,
        q2.embeddings.semantic
    )[0][0]
    
    # 감정적 유사도 (emotional)
    emo_sim = calculate_emotion_similarity(
        q1.affective.emotions,
        q2.affective.emotions
    )
    
    # 실용적 유사도 (pragmatic)
    prag_sim = jaccard_similarity(
        q1.pragmatic.applicable_contexts,
        q2.pragmatic.applicable_contexts
    )
    
    # 은유적 연결 (metaphorical)
    meta_sim = check_shared_metaphors(
        q1.linguistic.metaphors,
        q2.linguistic.metaphors
    )
    
    # 가중 평균 (사용자 컨텍스트에 따라 동적 조정 가능)
    weighted = (
        sem_sim * 0.4 +
        emo_sim * 0.25 +
        prag_sim * 0.2 +
        meta_sim * 0.15
    )
    
    return {
        'semantic': sem_sim,
        'emotional': emo_sim,
        'pragmatic': prag_sim,
        'metaphorical': meta_sim,
        'weighted': weighted
    }
```

---

## 🎨 그래프 시각화 - 옵시디언 스타일

### 시각화 계층

```typescript
interface GraphVisualization {
  // Layer 1: 글로벌 뷰 (전체 지식 공간)
  global: {
    layout: 'force-directed' | '3d-sphere';
    node_size: 'by_connections' | 'by_importance';
    color_scheme: 'by_category' | 'by_emotion' | 'by_time';
    clusters: Community[];
  };
  
  // Layer 2: 로컬 뷰 (현재 노드 중심)
  local: {
    focus_node: string;
    depth: 1 | 2 | 3;  // 연결 깊이
    highlighted_relations: RelationType[];
    filter: {
      min_strength: number;
      relation_types: RelationType[];
    };
  };
  
  // Layer 3: 패스 뷰 (아이디어 여정)
  path: {
    start_node: string;
    end_node: string;
    paths: Path[];  // 여러 경로 표시
    path_score: number;  // 경로 강도
  };
}

// 커뮤니티 감지 (Louvain Algorithm)
interface Community {
  id: string;
  name: string;  // "습관과 정체성 클러스터"
  nodes: string[];
  cohesion: number;  // 응집도
  central_node: string;  // 중심 노드
  description: string;
}
```

### 인터랙션 디자인

```typescript
// 노드 호버 시
onNodeHover(node: IdeaNode) {
  // 1차 연결 하이라이트
  highlightConnections(node, depth: 1);
  
  // 미리보기 표시
  showPreview({
    content: node.content,
    author: node.source.author,
    key_connections: getTopConnections(node, 5),
    emotional_tone: visualizeEmotions(node.affective),
  });
}

// 노드 클릭 시
onNodeClick(node: IdeaNode) {
  // 로컬 그래프로 전환
  transitionToLocalView(node);
  
  // 관련 아이디어 패널 표시
  showRelatedIdeas({
    similar: findSimilarNodes(node, threshold: 0.8),
    contrasting: findContrastingNodes(node),
    causal_next: findCausallyRelatedNodes(node, direction: 'forward'),
    metaphorical: findMetaphoricallyRelatedNodes(node),
  });
  
  // 사용자 메모와 연결
  connectToUserNotes(node);
}

// 엣지 클릭 시
onEdgeClick(edge: IdeaEdge) {
  // 관계 설명 표시
  showRelationshipExplanation({
    type: edge.relation_type,
    strength: edge.strength,
    reasoning: edge.reasoning,
    dimensions: visualizeDimensions(edge.dimensions),
  });
  
  // 유사한 관계 찾기
  findSimilarRelationships(edge);
}

// 검색 시
onSearch(query: string, userContext: UserContext) {
  // 사용자 컨텍스트 기반 동적 가중치
  const weights = adaptWeights(userContext);
  
  // 다중 검색 전략
  const results = {
    semantic: searchSemantic(query, weights.semantic),
    emotional: searchByEmotion(query, weights.emotional),
    pragmatic: searchByContext(userContext.current_goals, weights.pragmatic),
    serendipitous: findUnexpectedConnections(query, 0.3),  // 30% 우연한 발견
  };
  
  // 통합 및 순위화
  return mergeAndRank(results, weights);
}
```

---

## 🧪 품질 관리 - 3-Tier 검증

### Tier 1: 자동 검증 (100%)

```python
class AutomaticValidator:
    def validate_node(self, node: IdeaNode) -> ValidationReport:
        errors = []
        warnings = []
        
        # 1. 필수 필드 존재
        if not node.id or not node.content:
            errors.append("필수 필드 누락")
        
        # 2. 길이 검증
        if len(node.content) < 10:
            errors.append("내용이 너무 짧음")
        if len(node.content) > 500:
            warnings.append("내용이 너무 길어 인지 부하 우려")
        
        # 3. 임베딩 품질
        if np.isnan(node.embeddings.semantic).any():
            errors.append("임베딩 벡터 오류")
        
        # 4. 메타데이터 완성도
        completeness = self.check_completeness(node)
        if completeness < 0.7:
            warnings.append(f"메타데이터 완성도 낮음: {completeness}")
        
        # 5. 중복 체크
        if self.is_duplicate(node):
            errors.append("중복된 콘텐츠")
        
        return ValidationReport(errors, warnings)
    
    def validate_edge(self, edge: IdeaEdge) -> ValidationReport:
        errors = []
        warnings = []
        
        # 1. 노드 존재 확인
        if not self.node_exists(edge.from) or not self.node_exists(edge.to):
            errors.append("존재하지 않는 노드 참조")
        
        # 2. 관계 강도 검증
        if edge.strength < 0.5:
            warnings.append("약한 관계 (제거 고려)")
        
        # 3. 순환 관계 체크
        if self.creates_cycle(edge) and not edge.bidirectional:
            warnings.append("순환 관계 생성")
        
        # 4. 차원별 일관성
        if self.dimension_inconsistency(edge):
            warnings.append("차원 간 불일치")
        
        return ValidationReport(errors, warnings)
```

### Tier 2: 전문가 큐레이션 (10%)

```python
class ExpertCuration:
    """
    목표: 상위 10% 노드/엣지를 전문가가 수동 검토
    """
    
    def select_for_curation(self, nodes: List[IdeaNode]) -> List[IdeaNode]:
        # 1. 높은 연결성 (허브 노드)
        high_degree = [n for n in nodes if n.stats.connection_count > 50]
        
        # 2. 낮은 신뢰도
        low_confidence = [n for n in nodes if self.get_avg_edge_confidence(n) < 0.7]
        
        # 3. 감정적 복잡성
        complex_emotions = [n for n in nodes if self.emotion_entropy(n) > 2.0]
        
        # 4. 은유적 중요성
        metaphorical_key = [n for n in nodes if len(n.linguistic.metaphors) > 2]
        
        return list(set(high_degree + low_confidence + complex_emotions + metaphorical_key))
    
    def expert_review_interface(self, node: IdeaNode):
        """전문가 리뷰 UI"""
        return {
            "content": node.content,
            "current_analysis": {
                "frames": node.linguistic.primary_frame,
                "metaphors": node.linguistic.metaphors,
                "emotions": node.affective.emotions,
            },
            "questions": [
                "프레임 분류가 정확한가?",
                "은유 감지가 적절한가?",
                "감정 분석이 타당한가?",
                "놓친 관계가 있는가?",
            ],
            "suggested_connections": self.find_potential_connections(node),
            "revision_history": node.revisions,
        }
```

### Tier 3: 커뮤니티 피드백 (동적)

```python
class CommunityFeedback:
    def collect_implicit_feedback(self, user_id: str, session: Session):
        """사용자 행동 기반 암묵적 피드백"""
        
        feedback = []
        
        # 1. 노드 체류 시간
        for node_id, duration in session.node_dwell_times.items():
            if duration > 10:  # 10초 이상
                feedback.append({
                    "type": "positive_engagement",
                    "node": node_id,
                    "strength": min(duration / 60, 1.0),
                })
        
        # 2. 연결 탐색 패턴
        for path in session.exploration_paths:
            if len(path) > 3:  # 깊은 탐색
                feedback.append({
                    "type": "valuable_path",
                    "path": path,
                    "strength": 0.7,
                })
        
        # 3. 저장/북마크
        for saved_node in session.saved_nodes:
            feedback.append({
                "type": "explicit_save",
                "node": saved_node,
                "strength": 1.0,
            })
        
        # 4. 사용자 메모와 연결
        for note_link in session.user_note_links:
            feedback.append({
                "type": "user_integration",
                "node": note_link.idea_node,
                "user_note": note_link.user_note,
                "strength": 0.9,
            })
        
        return feedback
    
    def aggregate_feedback(self, node: IdeaNode) -> NodeQualityScore:
        """모든 사용자 피드백 집계"""
        
        all_feedback = self.get_feedback_for_node(node.id)
        
        quality_score = {
            "engagement": np.mean([f.strength for f in all_feedback if f.type == "positive_engagement"]),
            "utility": len([f for f in all_feedback if f.type == "explicit_save"]) / max(node.stats.view_count, 1),
            "integration": len([f for f in all_feedback if f.type == "user_integration"]) / max(node.stats.view_count, 1),
        }
        
        # 가중 평균
        overall = (
            quality_score["engagement"] * 0.3 +
            quality_score["utility"] * 0.4 +
            quality_score["integration"] * 0.3
        )
        
        return NodeQualityScore(overall, quality_score)
```

---

## 🚀 구현 로드맵

### Phase 1: Foundation (Week 1-4)
**목표**: 기본 인프라 + 10,000개 노드

```bash
# 작업 항목
□ 데이터 스키마 최종 확정
□ 수집 파이프라인 구축
  - API 통합 (Quotable, Wikiquote, Google Books)
  - 크롤러 구현 (Medium, 브런치)
□ NLP 모델 셋업
  - spaCy 파이프라인
  - Sentence Transformers
  - 감정 분석 모델
□ 데이터베이스 설계
  - 노드 테이블
  - 엣지 테이블
  - 임베딩 인덱스 (FAISS/Annoy)
□ 10,000개 노드 수집 및 강화
```

### Phase 2: Enrichment (Week 5-8)
**목표**: 언어학·심리학적 주석 + 30,000개 노드

```bash
# 작업 항목
□ 자동 주석 파이프라인 구축
  - 프레임 의미론 분석기
  - 은유 감지기
  - 의미 역할 레이블러
□ 감정 분석 고도화
  - Plutchik 8감정 모델
  - VAD (Valence-Arousal-Dominance)
□ 30,000개 추가 노드 수집 및 강화
□ 품질 검증 시스템 구축
```

### Phase 3: Graph Construction (Week 9-12)
**목표**: 지식 그래프 구축 + 50,000개 노드 + 500,000개 엣지

```bash
# 작업 항목
□ 관계 추출 알고리즘 구현
  - 의미적 유사도 (cosine similarity)
  - 인과 관계 추론
  - 은유적 연결 감지
□ 그래프 DB 구축 (Neo4j 또는 NetworkX)
□ 커뮤니티 감지 (Louvain)
□ 그래프 최적화
  - 약한 엣지 제거
  - 클러스터링
  - 중심성 계산
□ 50,000개 노드 완성
```

### Phase 4: Visualization & Integration (Week 13-16)
**목표**: 옵시디언 스타일 UI + IdeaConnect 통합

```bash
# 작업 항목
□ 프론트엔드 그래프 시각화
  - D3.js 또는 Cytoscape.js
  - Force-directed layout
  - 인터랙티브 탐색
□ 검색 인터페이스
  - 다차원 검색
  - 컨텍스트 인식
  - 추천 시스템
□ 사용자 메모 통합
  - 양방향 링크
  - 자동 연결 제안
□ NAS 배포
```

### Phase 5: Intelligence & Iteration (Week 17+)
**목표**: AI 고도화 + 지속적 개선

```bash
# 작업 항목
□ 개인화 엔진
  - 사용자 행동 학습
  - 동적 가중치 조정
□ 창발적 발견 알고리즘
  - 세렌디피티 주입
  - 약한 신호 증폭
□ 전문가 큐레이션 시스템
□ 커뮤니티 피드백 루프
□ A/B 테스트 및 최적화
```

---

## 📚 참고 문헌

### 언어학
- Fillmore, C. J. (1982). *Frame Semantics*. Linguistics in the Morning Calm.
- Lakoff, G., & Johnson, M. (1980). *Metaphors We Live By*. University of Chicago Press.
- Palmer, M., et al. (2005). *The Proposition Bank*. Computational Linguistics.

### 인지심리학
- Schank, R. C., & Abelson, R. P. (1977). *Scripts, Plans, Goals and Understanding*.
- Collins, A. M., & Loftus, E. F. (1975). *A Spreading-Activation Theory of Semantic Processing*.
- Petty, R. E., & Cacioppo, J. T. (1986). *The Elaboration Likelihood Model of Persuasion*.

### AI/NLP
- Reimers, N., & Gurevych, I. (2019). *Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks*.
- Bordes, A., et al. (2013). *Translating Embeddings for Modeling Multi-relational Data* (TransE).
- Pennington, J., et al. (2014). *GloVe: Global Vectors for Word Representation*.

### 지식 그래프
- Hogan, A., et al. (2021). *Knowledge Graphs*. ACM Computing Surveys.
- Wang, Q., et al. (2017). *Knowledge Graph Embedding: A Survey*.

---

## ✅ 성공 지표 (KPIs)

### 정량적 지표
- **노드 수**: 50,000+ (달성률 측정)
- **엣지 수**: 500,000+ (평균 10 엣지/노드)
- **엣지 품질**: 평균 신뢰도 > 0.7
- **임베딩 품질**: 평균 코사인 유사도 > 0.6 (관련 노드 간)
- **그래프 밀도**: 0.001 ~ 0.01 (너무 희소하거나 조밀하지 않게)

### 정성적 지표
- **메타데이터 완성도**: 80% 이상 노드가 모든 차원 주석 보유
- **커뮤니티 구조**: 명확한 10-20개 주제 클러스터 형성
- **다양성**: 10개 카테고리에 균형잡힌 분포

### 사용자 경험 지표
- **검색 정확도**: 사용자 쿼리에 대해 상위 5개 결과 중 최소 3개 관련성 높음
- **발견 비율**: 사용자가 예상하지 못한 유용한 연결을 세션당 평균 2개 이상 발견
- **체류 시간**: 평균 세션 시간 > 10분 (몰입도)
- **저장률**: 탐색한 노드 중 10% 이상을 사용자가 저장
- **통합률**: 사용자 메모의 30% 이상이 데이터베이스 노드와 연결

---

## 🎯 핵심 차별점 요약

| 기존 접근 | 개선된 접근 |
|---------|-----------|
| 키워드 매칭 | 다차원 임베딩 (의미·감정·실용) |
| 단일 카테고리 | 다중 스키마 + 프레임 |
| 정적 관계 | 동적·가중·맥락적 관계 |
| 검색 중심 | 발견(discovery) 중심 |
| 일률적 추천 | 개인화된 컨텍스트 인식 |
| 2D 리스트 | 3D 지식 그래프 시각화 |
| 알고리즘만 | 알고리즘 + 전문가 + 커뮤니티 |

---

**이 가이드는 단순한 명언 수집을 넘어, 사고의 연결망을 구축하여 진정한 지식 창발을 가능하게 합니다.**

**작성일**: 2025-11-09  
**버전**: 2.0 (Enhanced)  
**작성 기준**: 언어학·인지심리학·AI 학제간 통합
