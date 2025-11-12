#!/usr/bin/env python3
"""
웹 크롤링으로 arXiv 논문 수집
API 대신 웹페이지를 직접 파싱
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import re

def fetch_arxiv_search_page(category, start=0, max_results=100):
    """arXiv 검색 페이지 크롤링"""

    # arXiv 검색 URL
    url = f"https://arxiv.org/search/?query=cat:{category}&searchtype=all&abstracts=show&order=-announced_date_first&size={max_results}&start={start}"

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    try:
        print(f"Fetching {category} from arXiv web page...")
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')

        papers = []

        # 각 논문 항목 찾기
        results = soup.find_all('li', class_='arxiv-result')

        for result in results[:max_results]:
            try:
                # 제목
                title_tag = result.find('p', class_='title')
                title = title_tag.text.strip() if title_tag else ''

                # 저자들
                authors_tag = result.find('p', class_='authors')
                authors = []
                if authors_tag:
                    author_links = authors_tag.find_all('a')
                    authors = [a.text.strip() for a in author_links[:3]]

                # arXiv ID 및 링크
                link_tag = result.find('p', class_='list-title')
                arxiv_id = ''
                if link_tag:
                    a_tag = link_tag.find('a')
                    if a_tag and a_tag.get('href'):
                        arxiv_id = 'https://arxiv.org' + a_tag['href']

                # 연도 추출 (제출일에서)
                submitted_tag = result.find('p', class_='is-size-7')
                year = 2024  # 기본값
                if submitted_tag:
                    date_match = re.search(r'(\d{4})', submitted_tag.text)
                    if date_match:
                        year = int(date_match.group(1))

                # 요약
                abstract_tag = result.find('span', class_='abstract-full')
                if not abstract_tag:
                    abstract_tag = result.find('p', class_='abstract')
                summary = abstract_tag.text.strip()[:200] if abstract_tag else ''

                papers.append({
                    'title': title,
                    'authors': authors,
                    'year': year,
                    'url': arxiv_id,
                    'summary': summary
                })

            except Exception as e:
                print(f"  Error parsing a paper: {e}")
                continue

        print(f"  Found {len(papers)} papers")
        return papers

    except Exception as e:
        print(f"  Error fetching {category}: {e}")
        return []

def fetch_pubmed_papers(query, max_results=100):
    """PubMed 웹 크롤링 (간단한 검색)"""

    url = f"https://pubmed.ncbi.nlm.nih.gov/?term={query}&sort=date&size={max_results}"

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }

    try:
        print(f"Fetching PubMed for: {query}")
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')

        papers = []

        # PubMed 검색 결과 찾기
        articles = soup.find_all('article', class_='full-docsum')

        for article in articles[:max_results]:
            try:
                # 제목
                title_tag = article.find('a', class_='docsum-title')
                title = title_tag.text.strip() if title_tag else ''

                # 저자들
                authors_tag = article.find('span', class_='docsum-authors')
                authors = []
                if authors_tag:
                    author_text = authors_tag.text.strip()
                    authors = [a.strip() for a in author_text.split(',')[:3]]

                # PMID 및 링크
                pmid = ''
                if title_tag and title_tag.get('href'):
                    pmid = 'https://pubmed.ncbi.nlm.nih.gov' + title_tag['href']

                # 연도
                year_tag = article.find('span', class_='docsum-journal-citation')
                year = 2024
                if year_tag:
                    year_match = re.search(r'(\d{4})', year_tag.text)
                    if year_match:
                        year = int(year_match.group(1))

                papers.append({
                    'title': title,
                    'authors': authors,
                    'year': year,
                    'url': pmid,
                    'summary': ''
                })

            except Exception as e:
                print(f"  Error parsing article: {e}")
                continue

        print(f"  Found {len(papers)} papers")
        return papers

    except Exception as e:
        print(f"  Error fetching PubMed: {e}")
        return []

def generate_keywords_from_title(title):
    """제목에서 키워드 추출"""
    # 간단하게 처음 몇 단어
    words = title.split()[:5]
    return [w.strip('.,;:()[]{}') for w in words if len(w) > 2]

def main():
    """메인 함수"""

    all_results = {}

    # 1. arXiv 카테고리
    arxiv_categories = {
        '수학': 'math',
        '물리학': 'physics',
        '컴퓨터과학': 'cs'
    }

    for field, category in arxiv_categories.items():
        print(f"\n=== Collecting {field} papers ===")
        papers = fetch_arxiv_search_page(category, max_results=20)

        # 2010년 이후만
        papers = [p for p in papers if p['year'] >= 2010]

        # 키워드 생성
        for paper in papers:
            paper['keywords'] = generate_keywords_from_title(paper['title'])
            if 'summary' in paper:
                del paper['summary']

        all_results[field] = papers
        time.sleep(3)  # 요청 간격

    # 2. PubMed (의학/생물학)
    pubmed_queries = {
        '의학': 'medicine[MeSH Terms] AND 2010:2024[dp]',
        '생물학': 'biology[MeSH Terms] AND 2010:2024[dp]'
    }

    for field, query in pubmed_queries.items():
        print(f"\n=== Collecting {field} papers ===")
        papers = fetch_pubmed_papers(query, max_results=20)

        for paper in papers:
            paper['keywords'] = generate_keywords_from_title(paper['title'])

        all_results[field] = papers
        time.sleep(3)

    # JSON 저장
    output_file = 'web_crawled_papers.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_results, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Saved to {output_file}")

    # 통계
    print("\n📊 Statistics:")
    for field, papers in all_results.items():
        print(f"  - {field}: {len(papers)}개")
    print(f"  Total: {sum(len(p) for p in all_results.values())}개")

if __name__ == '__main__':
    main()
