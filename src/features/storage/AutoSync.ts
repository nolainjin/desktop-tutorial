import { FileStorage } from './FileStorage';
import { db } from '@/db/schema';

/**
 * 자동 동기화 관리자
 * 데이터 변경 시 자동으로 백업 생성
 */
export class AutoSync {
  private static syncInterval: number | null = null;
  private static lastSyncTime: Date | null = null;
  private static isEnabled: boolean = false;

  /**
   * 자동 동기화 활성화
   * @param intervalMinutes 동기화 간격 (분)
   */
  static enable(intervalMinutes: number = 5): void {
    if (this.syncInterval) {
      this.disable();
    }

    this.isEnabled = true;
    console.log(`✅ 자동 동기화 활성화 (${intervalMinutes}분 간격)`);

    // 즉시 한 번 동기화
    this.sync();

    // 주기적 동기화
    this.syncInterval = window.setInterval(() => {
      this.sync();
    }, intervalMinutes * 60 * 1000);

    // 페이지 언로드 시 동기화
    window.addEventListener('beforeunload', this.sync.bind(this));
  }

  /**
   * 자동 동기화 비활성화
   */
  static disable(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }

    this.isEnabled = false;
    console.log('⏸️ 자동 동기화 비활성화');
  }

  /**
   * 수동 동기화 실행
   */
  static async sync(): Promise<void> {
    if (!this.isEnabled) {
      return;
    }

    try {
      console.log('🔄 데이터 동기화 중...');

      // LocalStorage에 백업
      await FileStorage.saveToLocalStorage();

      this.lastSyncTime = new Date();
      console.log(`✅ 동기화 완료: ${this.lastSyncTime.toLocaleString()}`);

      // 상태를 localStorage에 저장
      localStorage.setItem('autosync-last-sync', this.lastSyncTime.toISOString());
    } catch (error) {
      console.error('❌ 동기화 실패:', error);
    }
  }

  /**
   * 마지막 동기화 시간 조회
   */
  static getLastSyncTime(): Date | null {
    const saved = localStorage.getItem('autosync-last-sync');
    if (saved) {
      return new Date(saved);
    }
    return this.lastSyncTime;
  }

  /**
   * 동기화 상태 조회
   */
  static getStatus(): {
    enabled: boolean;
    lastSync: Date | null;
    nextSync: Date | null;
  } {
    const lastSync = this.getLastSyncTime();
    let nextSync: Date | null = null;

    if (this.isEnabled && lastSync && this.syncInterval) {
      nextSync = new Date(lastSync.getTime() + this.syncInterval);
    }

    return {
      enabled: this.isEnabled,
      lastSync,
      nextSync,
    };
  }

  /**
   * 변경 사항 감지 및 자동 저장
   */
  static watchChanges(): void {
    // Dexie hooks를 사용하여 변경 감지
    db.memos.hook('creating', () => {
      this.scheduleSync();
    });

    db.memos.hook('updating', () => {
      this.scheduleSync();
    });

    db.memos.hook('deleting', () => {
      this.scheduleSync();
    });

    db.ideas.hook('creating', () => {
      this.scheduleSync();
    });

    db.connections.hook('creating', () => {
      this.scheduleSync();
    });

    console.log('👁️ 데이터 변경 감시 시작');
  }

  /**
   * 변경 후 짧은 딜레이로 동기화 예약
   * (여러 변경을 한 번에 처리)
   */
  private static syncTimeout: number | null = null;

  private static scheduleSync(): void {
    if (this.syncTimeout) {
      clearTimeout(this.syncTimeout);
    }

    this.syncTimeout = window.setTimeout(() => {
      this.sync();
      this.syncTimeout = null;
    }, 3000); // 3초 후 동기화
  }
}

/**
 * 앱 시작 시 자동 동기화 초기화
 */
export function initAutoSync(): void {
  // 이전 설정 복원
  const enabled = localStorage.getItem('autosync-enabled');

  if (enabled === 'true') {
    AutoSync.enable(5); // 5분 간격
    AutoSync.watchChanges();
  }
}

/**
 * 자동 동기화 토글
 */
export function toggleAutoSync(): boolean {
  const status = AutoSync.getStatus();

  if (status.enabled) {
    AutoSync.disable();
    localStorage.setItem('autosync-enabled', 'false');
    return false;
  } else {
    AutoSync.enable(5);
    AutoSync.watchChanges();
    localStorage.setItem('autosync-enabled', 'true');
    return true;
  }
}
