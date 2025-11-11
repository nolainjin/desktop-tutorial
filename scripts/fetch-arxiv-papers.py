#!/usr/bin/env python3
"""
arXiv API를 사용해서 논문 데이터 수집
각 분야별로 2010년 이후 인용이 많은 논문 100개씩 수집
"""

import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
import json
import time
from datetime import datetime

# arXiv 카테고리 매핑
ARXIV_CATEGORIES = {
    '수학': ['math.AG', 'math.AT', 'math.CO', 'math.NT', 'math.DG'],
    '물리학': ['physics.gen-ph', 'astro-ph', 'cond-mat', 'quant-ph', 'hep-th'],
    '컴퓨터과학': ['cs.AI', 'cs.LG', 'cs.CV', 'cs.CL', 'cs.RO'],
}

def fetch_arxiv_papers(category, max_results=100, start_year=2010):
    """arXiv에서 논문 데이터 가져오기"""
    base_url = 'http://export.arxiv.org/api/query?'

    # 검색 쿼리: 카테고리별 최신 논문
    search_query = f'cat:{category}'

    params = {
        'search_query': search_query,
        'start': 0,
        'max_results': max_results,
        'sortBy': 'submittedDate',
        'sortOrder': 'descending'
    }

    url = base_url + urllib.parse.urlencode(params)

    try:
        print(f"Fetching papers from category: {category}")
        # User-Agent 추가
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Academic Research Bot) Python/3.x'
        })
        with urllib.request.urlopen(req) as response:
            data = response.read()

        # XML 파싱
        root = ET.fromstring(data)
        namespace = {'atom': 'http://www.w3.org/2005/Atom',
                    'arxiv': 'http://arxiv.org/schemas/atom'}

        papers = []
        for entry in root.findall('atom:entry', namespace):
            # 제목
            title_elem = entry.find('atom:title', namespace)
            title = title_elem.text.strip().replace('\n', ' ') if title_elem is not None else ''

            # 저자들
            authors = []
            for author in entry.findall('atom:author', namespace):
                name_elem = author.find('atom:name', namespace)
                if name_elem is not None:
                    authors.append(name_elem.text)

            # 출판일
            published_elem = entry.find('atom:published', namespace)
            published = published_elem.text if published_elem is not None else ''
            year = int(published[:4]) if published else 0

            # 2010년 이후만
            if year < start_year:
                continue

            # arXiv ID 및 링크
            id_elem = entry.find('atom:id', namespace)
            arxiv_id = id_elem.text if id_elem is not None else ''

            # 요약 (키워드 생성용)
            summary_elem = entry.find('atom:summary', namespace)
            summary = summary_elem.text.strip() if summary_elem is not None else ''

            # 카테고리
            category_elem = entry.find('arxiv:primary_category', namespace)
            primary_cat = category_elem.get('term') if category_elem is not None else category

            papers.append({
                'title': title,
                'authors': authors[:3],  # 최대 3명
                'year': year,
                'url': arxiv_id,
                'category': primary_cat,
                'summary': summary[:200]  # 처음 200자만
            })

        print(f"  Found {len(papers)} papers")
        return papers

    except Exception as e:
        print(f"  Error fetching {category}: {e}")
        return []

def collect_papers_by_field(field_name, categories, target_count=100):
    """특정 분야의 논문 수집"""
    all_papers = []
    per_category = target_count // len(categories)

    print(f"\n=== Collecting {field_name} papers ===")

    for cat in categories:
        papers = fetch_arxiv_papers(cat, max_results=per_category)
        all_papers.extend(papers)
        time.sleep(3)  # API 제한 대응

    # 중복 제거 (제목 기준)
    seen_titles = set()
    unique_papers = []
    for paper in all_papers:
        if paper['title'] not in seen_titles:
            seen_titles.add(paper['title'])
            unique_papers.append(paper)

    return unique_papers[:target_count]

def generate_keywords_from_summary(summary):
    """요약에서 키워드 추출 (간단한 버전)"""
    # 간단히 처음 몇 단어를 키워드로
    words = summary.split()[:5]
    return [w.strip('.,;:()[]{}') for w in words if len(w) > 3]

def main():
    """메인 함수"""
    all_results = {}

    # arXiv 카테고리별 수집
    for field_name, categories in ARXIV_CATEGORIES.items():
        papers = collect_papers_by_field(field_name, categories, target_count=100)

        # 키워드 생성
        for paper in papers:
            paper['keywords'] = generate_keywords_from_summary(paper.get('summary', ''))
            del paper['summary']  # 요약 제거
            del paper['category']  # 카테고리 제거

        all_results[field_name] = papers
        print(f"  Collected {len(papers)} papers for {field_name}")

    # JSON으로 저장
    output_file = 'arxiv_papers_collected.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_results, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Saved to {output_file}")

    # 통계 출력
    print("\n📊 Statistics:")
    for field, papers in all_results.items():
        print(f"  - {field}: {len(papers)}개")
    print(f"  Total: {sum(len(p) for p in all_results.values())}개")

if __name__ == '__main__':
    main()
