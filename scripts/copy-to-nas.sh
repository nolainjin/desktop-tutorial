#!/bin/bash

# NAS 데이터 복사 스크립트
# 프로젝트의 지식 라이브러리를 NAS로 복사합니다

set -e

# 색상 정의
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}📦 IdeaConnect 데이터를 NAS로 복사합니다...${NC}\n"

# 현재 디렉토리 (프로젝트 루트)
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
echo "프로젝트 경로: $PROJECT_ROOT"

# 소스 경로 (프로젝트 내부)
SOURCE_DIR="$PROJECT_ROOT/public/data/knowledge-base"

# NAS 경로들 (순서대로 시도)
NAS_PATHS=(
    "/Volumes/work-sync/project/data/knowledge-base"        # Mac SMB 마운트
    "/volume1/work-sync/project/data/knowledge-base"        # NAS 직접 접근
    "$HOME/Documents/nas-sync/data/knowledge-base"          # 로컬 백업 폴더
)

# 소스 디렉토리 확인
if [ ! -d "$SOURCE_DIR" ]; then
    echo -e "${YELLOW}⚠️  소스 디렉토리가 없습니다: $SOURCE_DIR${NC}"
    exit 1
fi

# 파일 개수 및 크기 확인
FILE_COUNT=$(find "$SOURCE_DIR/library" -name "*.json" 2>/dev/null | wc -l)
TOTAL_SIZE=$(du -sh "$SOURCE_DIR" | cut -f1)

echo -e "\n${GREEN}📊 복사할 데이터:${NC}"
echo "  - 파일 개수: $FILE_COUNT개"
echo "  - 전체 크기: $TOTAL_SIZE"
echo ""

# NAS 경로 찾기 및 복사
COPIED=false

for NAS_PATH in "${NAS_PATHS[@]}"; do
    NAS_PARENT=$(dirname "$NAS_PATH")

    # 상위 디렉토리가 존재하는지 확인
    if [ -d "$NAS_PARENT" ] || [ -L "$NAS_PARENT" ]; then
        echo -e "${BLUE}📁 NAS 경로 발견: $NAS_PATH${NC}"

        # 디렉토리 생성
        mkdir -p "$NAS_PATH/library"

        # 데이터 복사
        echo -e "${YELLOW}🔄 데이터 복사 중...${NC}"
        rsync -av --progress \
            "$SOURCE_DIR/" \
            "$NAS_PATH/"

        echo -e "${GREEN}✅ 복사 완료: $NAS_PATH${NC}\n"

        # 복사된 파일 확인
        COPIED_COUNT=$(find "$NAS_PATH/library" -name "*.json" 2>/dev/null | wc -l)
        echo -e "${GREEN}📦 복사된 파일: $COPIED_COUNT개${NC}"

        COPIED=true
        break
    fi
done

if [ "$COPIED" = false ]; then
    echo -e "${YELLOW}⚠️  NAS 경로를 찾을 수 없습니다.${NC}"
    echo ""
    echo "다음 중 하나를 수동으로 설정하세요:"
    echo ""
    echo "1️⃣  Mac에서 NAS 마운트:"
    echo "   Finder > 이동 > 서버에 연결"
    echo "   smb://192.168.0.175/work-sync"
    echo ""
    echo "2️⃣  또는 로컬 백업 폴더 사용:"
    echo "   mkdir -p $HOME/Documents/nas-sync/data/knowledge-base"
    echo "   cp -r $SOURCE_DIR/* $HOME/Documents/nas-sync/data/knowledge-base/"
    echo ""
    echo "3️⃣  SSH로 NAS에 직접 복사:"
    echo "   scp -r $SOURCE_DIR yo@192.168.0.175:/volume1/work-sync/project/data/"
    echo ""
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 모든 데이터가 NAS에 복사되었습니다!${NC}"
echo ""
echo "📁 복사된 위치:"
for NAS_PATH in "${NAS_PATHS[@]}"; do
    if [ -d "$NAS_PATH/library" ]; then
        echo "   ✓ $NAS_PATH"
    fi
done
echo ""
echo "💡 다음 명령으로 확인할 수 있습니다:"
echo "   ls -lh $NAS_PATH/library/"
