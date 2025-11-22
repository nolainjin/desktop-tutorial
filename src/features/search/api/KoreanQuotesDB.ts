// 한국어 명언 데이터베이스 (100개)
export interface KoreanQuote {
  content: string;
  author: string;
  category: string;
  keywords: string[];
}

export const koreanQuotes: KoreanQuote[] = [
  // 성장 & 자기계발 (20개)
  {
    content: "오늘의 나보다 나은 내일의 내가 되는 것, 그것이 진정한 성공이다.",
    author: "법정 스님",
    category: "성장",
    keywords: ["성장", "성공", "노력", "자기계발"]
  },
  {
    content: "나무는 열매로 평가되고, 사람은 행동으로 평가된다.",
    author: "장 폴 사르트르",
    category: "성장",
    keywords: ["행동", "평가", "성장", "실천"]
  },
  {
    content: "완벽을 기다리지 마라. 시작이 곧 완벽이다.",
    author: "익명",
    category: "성장",
    keywords: ["시작", "완벽", "도전", "용기"]
  },
  {
    content: "습관은 제2의 천성이다. 좋은 습관을 들이면 삶이 바뀐다.",
    author: "아리스토텔레스",
    category: "성장",
    keywords: ["습관", "천성", "변화", "삶"]
  },
  {
    content: "실패는 성공의 어머니다. 포기하지 않는 자만이 성공한다.",
    author: "토마스 에디슨",
    category: "성장",
    keywords: ["실패", "성공", "포기", "도전"]
  },
  {
    content: "천 리 길도 한 걸음부터. 작은 시작이 큰 변화를 만든다.",
    author: "노자",
    category: "성장",
    keywords: ["시작", "변화", "노력", "인내"]
  },
  {
    content: "배움에는 끝이 없다. 평생 학습하는 자가 진정한 지혜를 얻는다.",
    author: "공자",
    category: "성장",
    keywords: ["배움", "학습", "지혜", "성장"]
  },
  {
    content: "어제의 실수는 오늘의 교훈이다. 과거에서 배우고 미래로 나아가라.",
    author: "익명",
    category: "성장",
    keywords: ["실수", "교훈", "배움", "성장"]
  },
  {
    content: "변화를 두려워하지 마라. 변화는 성장의 시작이다.",
    author: "법정 스님",
    category: "성장",
    keywords: ["변화", "성장", "용기", "도전"]
  },
  {
    content: "자신을 믿는 자만이 타인의 신뢰를 얻을 수 있다.",
    author: "괴테",
    category: "성장",
    keywords: ["자신감", "신뢰", "믿음", "성장"]
  },
  {
    content: "오늘 할 수 있는 일을 내일로 미루지 마라.",
    author: "벤자민 프랭클린",
    category: "성장",
    keywords: ["실천", "행동", "미루기", "습관"]
  },
  {
    content: "목표를 이루고 싶다면, 먼저 그 목표를 분명히 하라.",
    author: "익명",
    category: "성장",
    keywords: ["목표", "명확", "계획", "성공"]
  },
  {
    content: "인내는 쓰지만 그 열매는 달다.",
    author: "장 자크 루소",
    category: "성장",
    keywords: ["인내", "노력", "성공", "보상"]
  },
  {
    content: "가장 큰 위험은 위험 없는 삶을 사는 것이다.",
    author: "스티븐 코비",
    category: "성장",
    keywords: ["도전", "위험", "용기", "성장"]
  },
  {
    content: "실력은 거짓말을 하지 않는다. 노력한 만큼 결과가 따른다.",
    author: "익명",
    category: "성장",
    keywords: ["실력", "노력", "결과", "성공"]
  },
  {
    content: "비교는 불행의 시작이다. 자신만의 속도로 성장하라.",
    author: "익명",
    category: "성장",
    keywords: ["비교", "성장", "자존감", "행복"]
  },
  {
    content: "작은 성공들이 모여 큰 성취를 이룬다.",
    author: "익명",
    category: "성장",
    keywords: ["성공", "성취", "노력", "축적"]
  },
  {
    content: "될 때까지 하면 된다. 포기만 하지 않으면 실패는 없다.",
    author: "익명",
    category: "성장",
    keywords: ["포기", "실패", "도전", "성공"]
  },
  {
    content: "지금 이 순간이 가장 중요하다. 현재에 충실하라.",
    author: "법정 스님",
    category: "성장",
    keywords: ["현재", "순간", "충실", "집중"]
  },
  {
    content: "꿈을 꾸는 것도 중요하지만, 행동하는 것이 더 중요하다.",
    author: "익명",
    category: "성장",
    keywords: ["꿈", "행동", "실천", "성공"]
  },

  // 행복 & 긍정 (15개)
  {
    content: "행복은 습관이다. 매일 감사하는 마음을 가지라.",
    author: "익명",
    category: "행복",
    keywords: ["행복", "습관", "감사", "긍정"]
  },
  {
    content: "웃으며 사는 하루와 찡그리며 사는 하루는 같은 하루다. 웃으며 살자.",
    author: "익명",
    category: "행복",
    keywords: ["웃음", "긍정", "행복", "태도"]
  },
  {
    content: "행복은 멀리 있지 않다. 작은 것에서 기쁨을 찾아라.",
    author: "법정 스님",
    category: "행복",
    keywords: ["행복", "기쁨", "작은것", "감사"]
  },
  {
    content: "감사하는 마음이 행복의 문을 연다.",
    author: "익명",
    category: "행복",
    keywords: ["감사", "행복", "마음", "긍정"]
  },
  {
    content: "긍정적인 생각이 긍정적인 삶을 만든다.",
    author: "익명",
    category: "행복",
    keywords: ["긍정", "생각", "삶", "행복"]
  },
  {
    content: "오늘 하루도 감사하다. 살아있음에 감사하라.",
    author: "익명",
    category: "행복",
    keywords: ["감사", "하루", "삶", "행복"]
  },
  {
    content: "행복은 성취가 아니라 과정에 있다.",
    author: "익명",
    category: "행복",
    keywords: ["행복", "과정", "성취", "여정"]
  },
  {
    content: "미소는 가장 아름다운 언어다.",
    author: "익명",
    category: "행복",
    keywords: ["미소", "웃음", "소통", "긍정"]
  },
  {
    content: "불평하는 시간에 감사할 것을 찾아라.",
    author: "익명",
    category: "행복",
    keywords: ["불평", "감사", "긍정", "태도"]
  },
  {
    content: "행복의 비결은 원하는 것을 갖는 게 아니라 가진 것을 사랑하는 것이다.",
    author: "익명",
    category: "행복",
    keywords: ["행복", "만족", "사랑", "감사"]
  },
  {
    content: "좋은 하루를 보내려면 좋은 마음가짐으로 시작하라.",
    author: "익명",
    category: "행복",
    keywords: ["마음", "긍정", "하루", "시작"]
  },
  {
    content: "행복은 돈으로 살 수 없다. 마음에서 나온다.",
    author: "익명",
    category: "행복",
    keywords: ["행복", "마음", "돈", "가치"]
  },
  {
    content: "지금 이 순간을 즐겨라. 행복은 지금 여기에 있다.",
    author: "익명",
    category: "행복",
    keywords: ["순간", "지금", "행복", "현재"]
  },
  {
    content: "웃음은 최고의 약이다.",
    author: "익명",
    category: "행복",
    keywords: ["웃음", "건강", "행복", "치유"]
  },
  {
    content: "작은 행복을 놓치지 마라. 그것들이 모여 큰 행복이 된다.",
    author: "익명",
    category: "행복",
    keywords: ["작은행복", "행복", "감사", "일상"]
  },

  // 사랑 & 관계 (15개)
  {
    content: "사랑은 주는 것이다. 받기를 기대하지 말고 먼저 주어라.",
    author: "마더 테레사",
    category: "사랑",
    keywords: ["사랑", "주다", "베풀다", "관계"]
  },
  {
    content: "진정한 사랑은 조건이 없다.",
    author: "익명",
    category: "사랑",
    keywords: ["사랑", "조건", "진실", "관계"]
  },
  {
    content: "가족은 세상에서 가장 소중한 보물이다.",
    author: "익명",
    category: "사랑",
    keywords: ["가족", "소중", "사랑", "관계"]
  },
  {
    content: "말 한마디가 천 냥 빚을 갚는다. 따뜻한 말을 건네라.",
    author: "익명",
    category: "사랑",
    keywords: ["말", "따뜻함", "소통", "관계"]
  },
  {
    content: "용서는 상대를 위한 것이 아니라 나를 위한 것이다.",
    author: "익명",
    category: "사랑",
    keywords: ["용서", "화해", "관계", "치유"]
  },
  {
    content: "경청은 사랑의 다른 이름이다.",
    author: "익명",
    category: "사랑",
    keywords: ["경청", "사랑", "소통", "관계"]
  },
  {
    content: "함께 있으면 행복한 사람을 소중히 하라.",
    author: "익명",
    category: "사랑",
    keywords: ["함께", "행복", "소중", "관계"]
  },
  {
    content: "우정은 천천히 자라지만 오래 간다.",
    author: "익명",
    category: "사랑",
    keywords: ["우정", "친구", "관계", "시간"]
  },
  {
    content: "진심은 통한다. 거짓은 오래가지 못한다.",
    author: "익명",
    category: "사랑",
    keywords: ["진심", "거짓", "관계", "신뢰"]
  },
  {
    content: "사랑하는 사람에게 오늘 사랑한다고 말하라.",
    author: "익명",
    category: "사랑",
    keywords: ["사랑", "표현", "말", "관계"]
  },
  {
    content: "배려는 사랑의 시작이다.",
    author: "익명",
    category: "사랑",
    keywords: ["배려", "사랑", "관계", "존중"]
  },
  {
    content: "좋은 관계는 노력으로 유지된다.",
    author: "익명",
    category: "사랑",
    keywords: ["관계", "노력", "유지", "사랑"]
  },
  {
    content: "이해하려고 노력하는 것이 사랑이다.",
    author: "익명",
    category: "사랑",
    keywords: ["이해", "노력", "사랑", "관계"]
  },
  {
    content: "함께 웃을 수 있는 사람이 진정한 친구다.",
    author: "익명",
    category: "사랑",
    keywords: ["웃음", "친구", "우정", "관계"]
  },
  {
    content: "사랑은 말이 아니라 행동으로 보여주는 것이다.",
    author: "익명",
    category: "사랑",
    keywords: ["사랑", "행동", "실천", "표현"]
  },

  // 지혜 & 사고 (15개)
  {
    content: "아는 것이 힘이다. 배움을 멈추지 마라.",
    author: "프랜시스 베이컨",
    category: "지혜",
    keywords: ["지식", "힘", "배움", "학습"]
  },
  {
    content: "질문하는 자는 5분간 바보지만, 질문하지 않는 자는 평생 바보다.",
    author: "중국 속담",
    category: "지혜",
    keywords: ["질문", "배움", "지혜", "학습"]
  },
  {
    content: "책을 읽는 것은 다른 사람의 인생을 사는 것이다.",
    author: "익명",
    category: "지혜",
    keywords: ["책", "독서", "배움", "경험"]
  },
  {
    content: "생각이 바뀌면 행동이 바뀌고, 행동이 바뀌면 삶이 바뀐다.",
    author: "익명",
    category: "지혜",
    keywords: ["생각", "행동", "삶", "변화"]
  },
  {
    content: "현명한 사람은 듣기를 많이 하고 말하기를 적게 한다.",
    author: "솔로몬",
    category: "지혜",
    keywords: ["경청", "말", "지혜", "소통"]
  },
  {
    content: "과거는 바꿀 수 없지만, 미래는 지금의 선택으로 만들어진다.",
    author: "익명",
    category: "지혜",
    keywords: ["과거", "미래", "선택", "결정"]
  },
  {
    content: "실수에서 배우는 자가 현명한 자다.",
    author: "익명",
    category: "지혜",
    keywords: ["실수", "배움", "지혜", "성장"]
  },
  {
    content: "비판하기 전에 먼저 이해하려 하라.",
    author: "익명",
    category: "지혜",
    keywords: ["이해", "비판", "공감", "지혜"]
  },
  {
    content: "진정한 지혜는 자신의 무지를 아는 것이다.",
    author: "소크라테스",
    category: "지혜",
    keywords: ["지혜", "무지", "겸손", "배움"]
  },
  {
    content: "생각은 현실을 만든다. 긍정적으로 생각하라.",
    author: "익명",
    category: "지혜",
    keywords: ["생각", "현실", "긍정", "마음"]
  },
  {
    content: "경험은 최고의 스승이다.",
    author: "익명",
    category: "지혜",
    keywords: ["경험", "배움", "스승", "성장"]
  },
  {
    content: "단순함 속에 진리가 있다.",
    author: "레오나르도 다빈치",
    category: "지혜",
    keywords: ["단순", "진리", "지혜", "본질"]
  },
  {
    content: "말은 은이요, 침묵은 금이다.",
    author: "익명",
    category: "지혜",
    keywords: ["말", "침묵", "지혜", "소통"]
  },
  {
    content: "깊이 생각하는 자가 멀리 본다.",
    author: "익명",
    category: "지혜",
    keywords: ["생각", "깊이", "통찰", "지혜"]
  },
  {
    content: "지혜로운 자는 상황에 맞춰 변한다.",
    author: "익명",
    category: "지혜",
    keywords: ["지혜", "변화", "적응", "유연"]
  },

  // 용기 & 도전 (15개)
  {
    content: "두려움은 상상일 뿐이다. 용기를 내어 도전하라.",
    author: "익명",
    category: "용기",
    keywords: ["두려움", "용기", "도전", "상상"]
  },
  {
    content: "실패는 성공으로 가는 과정이다.",
    author: "익명",
    category: "용기",
    keywords: ["실패", "성공", "과정", "도전"]
  },
  {
    content: "안전지대를 벗어나야 성장한다.",
    author: "익명",
    category: "용기",
    keywords: ["안전", "성장", "도전", "변화"]
  },
  {
    content: "최고의 방어는 공격이다. 먼저 시도하라.",
    author: "익명",
    category: "용기",
    keywords: ["방어", "공격", "도전", "시도"]
  },
  {
    content: "할 수 있다고 믿는 순간, 이미 절반은 이룬 것이다.",
    author: "테오도어 루즈벨트",
    category: "용기",
    keywords: ["믿음", "자신감", "성공", "도전"]
  },
  {
    content: "불가능은 없다. 단지 시도하지 않았을 뿐이다.",
    author: "익명",
    category: "용기",
    keywords: ["불가능", "시도", "도전", "가능"]
  },
  {
    content: "위대한 일은 편안함 속에서 이루어지지 않는다.",
    author: "익명",
    category: "용기",
    keywords: ["위대", "편안", "도전", "성취"]
  },
  {
    content: "넘어지는 것은 부끄러운 게 아니다. 일어나지 않는 것이 부끄럽다.",
    author: "익명",
    category: "용기",
    keywords: ["넘어짐", "일어남", "용기", "도전"]
  },
  {
    content: "용기는 두려움이 없는 것이 아니라 두려움을 극복하는 것이다.",
    author: "넬슨 만델라",
    category: "용기",
    keywords: ["용기", "두려움", "극복", "도전"]
  },
  {
    content: "새로운 시작을 두려워하지 마라.",
    author: "익명",
    category: "용기",
    keywords: ["시작", "두려움", "새로움", "도전"]
  },
  {
    content: "도전하지 않으면 기회도 없다.",
    author: "익명",
    category: "용기",
    keywords: ["도전", "기회", "시도", "가능"]
  },
  {
    content: "한계는 스스로 만드는 것이다.",
    author: "익명",
    category: "용기",
    keywords: ["한계", "스스로", "도전", "가능"]
  },
  {
    content: "리스크를 감수하는 자만이 얻을 수 있다.",
    author: "익명",
    category: "용기",
    keywords: ["리스크", "도전", "성공", "용기"]
  },
  {
    content: "오늘의 도전이 내일의 성공을 만든다.",
    author: "익명",
    category: "용기",
    keywords: ["도전", "성공", "오늘", "내일"]
  },
  {
    content: "시작이 반이다. 지금 시작하라.",
    author: "익명",
    category: "용기",
    keywords: ["시작", "반", "도전", "행동"]
  },

  // 시간 & 인생 (10개)
  {
    content: "시간은 금이다. 헛되이 보내지 마라.",
    author: "벤자민 프랭클린",
    category: "인생",
    keywords: ["시간", "금", "소중", "인생"]
  },
  {
    content: "인생은 짧다. 후회 없이 살아라.",
    author: "익명",
    category: "인생",
    keywords: ["인생", "짧다", "후회", "삶"]
  },
  {
    content: "지나간 시간은 돌아오지 않는다. 지금을 소중히 하라.",
    author: "익명",
    category: "인생",
    keywords: ["시간", "지금", "소중", "현재"]
  },
  {
    content: "인생은 선택의 연속이다. 현명하게 선택하라.",
    author: "익명",
    category: "인생",
    keywords: ["인생", "선택", "결정", "지혜"]
  },
  {
    content: "하루하루를 마지막인 것처럼 살아라.",
    author: "스티브 잡스",
    category: "인생",
    keywords: ["하루", "마지막", "삶", "충실"]
  },
  {
    content: "과거에 연연하지 말고 미래를 준비하라.",
    author: "익명",
    category: "인생",
    keywords: ["과거", "미래", "준비", "삶"]
  },
  {
    content: "인생의 의미는 스스로 만드는 것이다.",
    author: "익명",
    category: "인생",
    keywords: ["인생", "의미", "스스로", "삶"]
  },
  {
    content: "늦었다고 생각할 때가 가장 빠른 때다.",
    author: "익명",
    category: "인생",
    keywords: ["늦음", "빠름", "시작", "도전"]
  },
  {
    content: "인생은 마라톤이다. 천천히 꾸준히 가라.",
    author: "익명",
    category: "인생",
    keywords: ["인생", "마라톤", "꾸준", "인내"]
  },
  {
    content: "매 순간이 새로운 시작이다.",
    author: "익명",
    category: "인생",
    keywords: ["순간", "시작", "새로움", "기회"]
  },

  // 일 & 직업 (10개)
  {
    content: "좋아하는 일을 하면 평생 일하지 않아도 된다.",
    author: "공자",
    category: "일",
    keywords: ["일", "좋아함", "직업", "열정"]
  },
  {
    content: "완벽을 추구하되 완료를 우선하라.",
    author: "익명",
    category: "일",
    keywords: ["완벽", "완료", "일", "우선순위"]
  },
  {
    content: "계획 없는 목표는 단지 소망일 뿐이다.",
    author: "앙투안 드 생텍쥐페리",
    category: "일",
    keywords: ["계획", "목표", "소망", "실행"]
  },
  {
    content: "전문가는 하루아침에 만들어지지 않는다.",
    author: "익명",
    category: "일",
    keywords: ["전문가", "시간", "노력", "성장"]
  },
  {
    content: "팀워크는 꿈을 현실로 만든다.",
    author: "익명",
    category: "일",
    keywords: ["팀워크", "꿈", "현실", "협력"]
  },
  {
    content: "준비된 자에게 기회가 온다.",
    author: "익명",
    category: "일",
    keywords: ["준비", "기회", "성공", "노력"]
  },
  {
    content: "작은 일도 정성을 다하면 큰 일이 된다.",
    author: "익명",
    category: "일",
    keywords: ["작은일", "정성", "큰일", "성실"]
  },
  {
    content: "혁신은 현상에 의문을 제기하는 것에서 시작된다.",
    author: "익명",
    category: "일",
    keywords: ["혁신", "의문", "질문", "변화"]
  },
  {
    content: "실력은 배신하지 않는다.",
    author: "익명",
    category: "일",
    keywords: ["실력", "배신", "노력", "성공"]
  },
  {
    content: "열정이 없는 일은 고역이다.",
    author: "익명",
    category: "일",
    keywords: ["열정", "일", "고역", "동기"]
  }
];
