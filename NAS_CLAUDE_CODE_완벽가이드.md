# 시놀로지 NAS와 Claude Code 연동 완벽 가이드

## 📋 목차
1. [시스템 정보](#시스템-정보)
2. [초기 설정 완료](#초기-설정-완료)
3. [일상 사용법](#일상-사용법)
4. [자동화 스크립트](#자동화-스크립트)
5. [트러블슈팅](#트러블슈팅)

---

## 🖥️ 시스템 정보

### NAS 정보
- **모델**: Synology VIDA
- **로컬 IP**: 192.168.0.175
- **DSM 버전**: 7.2.1
- **사용자 계정**: yo

### 폴더 구조
```
/volume1/work-sync/          # 공유 폴더
└── project/                 # 프로젝트 폴더
    ├── README.md           # 프로젝트 문서
    └── (여기에 작업 파일들)
```

### Mac 마운트 경로
```
/Volumes/work-sync/          # SMB로 마운트된 NAS
└── project/                 # 프로젝트 폴더
```

---

## ✅ 초기 설정 완료

이미 완료된 설정들:

1. ✅ **NAS SSH 활성화** (포트 22)
2. ✅ **SMB 서비스 활성화**
3. ✅ **work-sync 공유 폴더 생성**
4. ✅ **project 하위 폴더 생성**
5. ✅ **yo 계정 권한 설정** (읽기/쓰기)
6. ✅ **Mac SMB 연결 성공**
7. ✅ **자동화 스크립트 작성**

---

## 🚀 일상 사용법

### 방법 1: 간단한 사용 (추천!)

```bash
# 터미널에서 한 줄로 실행
nas-cc "이 프로젝트의 README.md를 업데이트해줘"
```

### 방법 2: 대화형 사용

```bash
# NAS 프로젝트 폴더로 이동
nas

# Claude Code 실행
claude-code
```

### 방법 3: Finder에서 직접

1. Finder에서 `/Volumes/work-sync/project` 열기
2. VS Code 또는 다른 에디터로 파일 편집
3. 자동으로 NAS에 저장됨

---

## 🔄 자동화 스크립트

### 설치된 스크립트

#### 1. NAS 자동 마운트
```bash
~/scripts/mount-nas.sh
```

**기능**:
- NAS가 이미 마운트되어 있는지 확인
- 마운트 안 되어 있으면 자동으로 연결
- 상태 메시지 출력

**사용 예시**:
```bash
mount-nas.sh
# 출력: ✅ NAS가 이미 마운트되어 있습니다: /Volumes/work-sync
```

#### 2. Claude Code 빠른 실행
```bash
~/scripts/nas-claude.sh "작업 내용"
```

**기능**:
- NAS 마운트 자동 확인
- project 폴더로 자동 이동
- Claude Code 실행

**사용 예시**:
```bash
nas-claude.sh "Python 데이터 분석 스크립트 만들어줘"
```

#### 3. 별칭(Alias) 목록

| 별칭 | 명령어 | 설명 |
|------|--------|------|
| `nas` | `cd /Volumes/work-sync/project` | 프로젝트 폴더로 이동 |
| `nas-mount` | `~/scripts/mount-nas.sh` | NAS 마운트 |
| `nas-cc` | `~/scripts/nas-claude.sh` | Claude Code 실행 |
| `ccnas` | `cd /Volumes/work-sync/project && claude-code` | 이동 후 실행 |
| `nas-status` | 상태 확인 명령어 | NAS 연결 상태 확인 |

**사용 예시**:
```bash
# 상태 확인
nas-status
# 출력: ✅ NAS 연결됨

# 프로젝트 폴더로 이동
nas

# Claude Code 실행
ccnas
```

---

## 📝 실전 시나리오

### 시나리오 1: 아침에 출근해서 작업 시작

```bash
# 1. NAS 상태 확인
nas-status

# 2. 프로젝트 폴더로 이동
nas

# 3. 어제 작업 확인
ls -la
cat README.md

# 4. Claude Code로 새 작업 시작
claude-code "오늘 할 작업 리스트를 만들어줘"
```

### 시나리오 2: 집에서 이어서 작업

```bash
# 1. NAS 마운트 (자동)
nas-mount

# 2. Claude Code 바로 실행
nas-cc "회사에서 하던 작업 이어서 해줘"
```

### 시나리오 3: 빠른 파일 생성

```bash
# 한 줄로 실행
nas-cc "API 문서를 마크다운으로 작성해줘"
```

### 시나리오 4: SSH로 직접 접속

```bash
# NAS에 SSH 접속
ssh yo@192.168.0.175

# 프로젝트 폴더 확인
cd /volume1/work-sync/project
ls -la

# 파일 내용 확인
cat README.md

# 로그아웃
exit
```

---

## 🔧 트러블슈팅

### 문제 1: NAS 연결이 안 됨

**증상**: `/Volumes/work-sync`가 없음

**해결**:
```bash
# 1. 네트워크 연결 확인
ping 192.168.0.175

# 2. 수동 마운트
open smb://yo@192.168.0.175/work-sync

# 3. 또는 스크립트 실행
~/scripts/mount-nas.sh
```

### 문제 2: 권한 오류

**증상**: "Permission denied"

**해결**:
```bash
# SSH로 NAS 접속
ssh yo@192.168.0.175

# 권한 확인
ls -la /volume1/work-sync/project

# 필요시 DSM에서 권한 재설정
# 제어판 > 공유 폴더 > work-sync > 권한
```

### 문제 3: Claude Code가 느림

**원인**: 네트워크 속도

**해결**:
```bash
# 1. 유선 연결 사용 (가능하면)
# 2. 로컬 네트워크 사용 (같은 Wi-Fi)
# 3. 큰 파일은 제외

# node_modules 등 제외 설정
echo "node_modules/
__pycache__/
*.pyc
.git/" > /Volumes/work-sync/project/.gitignore
```

### 문제 4: 자동 마운트 안 됨

**해결**:
```bash
# 시스템 설정 > 일반 > 로그인 항목
# 또는 LaunchAgent 사용

mkdir -p ~/Library/LaunchAgents

cat > ~/Library/LaunchAgents/com.user.mount-nas.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.user.mount-nas</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>-c</string>
        <string>sleep 10 && open smb://yo@192.168.0.175/work-sync</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
</dict>
</plist>
EOF

launchctl load ~/Library/LaunchAgents/com.user.mount-nas.plist
```

### 문제 5: 별칭이 작동 안 함

**해결**:
```bash
# zsh 재시작
source ~/.zshrc

# 또는 터미널 재시작
```

---

## 💡 고급 팁

### 1. Git 연동

```bash
# NAS 프로젝트에서 Git 초기화
cd /Volumes/work-sync/project
git init

# .gitignore 설정
cat > .gitignore << 'EOF'
.DS_Store
node_modules/
__pycache__/
*.pyc
.env
.idea/
.vscode/
EOF

# 첫 커밋
git add .
git commit -m "Initial commit"

# GitHub 연결 (선택)
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. VS Code 연동

```bash
# VS Code로 NAS 프로젝트 열기
code /Volumes/work-sync/project
```

**추천 VS Code 확장**:
- Remote - SSH
- GitLens
- Markdown All in One
- Python
- ESLint

### 3. 자동 백업 스크립트

```bash
cat > ~/scripts/backup-nas-project.sh << 'EOF'
#!/bin/bash

# NAS 프로젝트 로컬 백업
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="$HOME/Documents/nas-backups"
mkdir -p "$BACKUP_DIR"

rsync -avh --progress \
    --exclude '.git' \
    --exclude 'node_modules' \
    --exclude '__pycache__' \
    /Volumes/work-sync/project/ \
    "$BACKUP_DIR/backup_$TIMESTAMP/"

echo "✅ 백업 완료: $BACKUP_DIR/backup_$TIMESTAMP/"

# 30일 이상 된 백업 삭제
find "$BACKUP_DIR" -type d -name "backup_*" -mtime +30 -exec rm -rf {} \;
EOF

chmod +x ~/scripts/backup-nas-project.sh

# Cron으로 자동 백업 (매일 오후 6시)
# crontab -e
# 0 18 * * * ~/scripts/backup-nas-project.sh
```

### 4. 성능 최적화

```bash
# SMB 성능 향상 (macOS 13+)
# /etc/nsmb.conf 파일 생성
sudo nano /etc/nsmb.conf

# 아래 내용 추가:
[default]
signing_required=no
validate_neg_off=yes
streams=yes
```

---

## 📊 유용한 명령어

### NAS 관련

```bash
# NAS 상태 확인
ssh yo@192.168.0.175 'uptime'

# 디스크 사용량
ssh yo@192.168.0.175 'df -h'

# 프로세스 확인
ssh yo@192.168.0.175 'top -n 1'
```

### 로컬 관련

```bash
# 마운트된 볼륨 확인
mount | grep work-sync

# 네트워크 속도 테스트
# NAS에 iperf3 설치 필요
ssh yo@192.168.0.175 'iperf3 -s'
iperf3 -c 192.168.0.175
```

---

## ✅ 체크리스트

### 초기 설정 (완료됨)
- [x] NAS SSH 활성화
- [x] SMB 서비스 활성화
- [x] work-sync 공유 폴더 생성
- [x] project 하위 폴더 생성
- [x] Mac SMB 연결 성공
- [x] 자동화 스크립트 작성
- [x] 별칭 설정 완료

### 일상 사용
- [ ] 아침에 NAS 연결 확인
- [ ] Claude Code로 작업
- [ ] 퇴근 전 작업 커밋 (Git 사용 시)
- [ ] 주기적 백업 (선택)

---

## 🎉 완료!

이제 집과 회사 어디서나 NAS를 통해 동기화된 환경에서 Claude Code로 작업할 수 있습니다!

**빠른 시작**:
```bash
# 1. 상태 확인
nas-status

# 2. Claude Code 실행
nas-cc "작업할 내용"
```

---

**작성일**: 2025-11-09
**작성자**: yo
**마지막 업데이트**: 2025-11-09

---

## 📝 변경 이력

### 2025-11-09
- ✅ 초기 설정 완료
- ✅ SMB 연결 설정
- ✅ 자동화 스크립트 작성
- ✅ 완벽 가이드 문서 작성
