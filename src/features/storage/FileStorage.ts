import { db } from '@/db/schema';
import { Memo } from '@/types/memo';
import { Idea } from '@/types/idea';
import { Connection } from '@/types/connection';

export interface KnowledgeBase {
  version: string;
  exportedAt: string;
  stats: {
    memos: number;
    ideas: number;
    connections: number;
  };
  data: {
    memos: Memo[];
    ideas: Idea[];
    connections: Connection[];
  };
}

/**
 * 파일 기반 저장소
 * IndexedDB 데이터를 JSON 파일로 export/import
 */
export class FileStorage {
  // 나중에 사용 예정
  // private static readonly DATA_DIR = '/data/knowledge-base';
  // private static readonly FILENAME = 'ideaconnect-data.json';

  /**
   * 현재 데이터를 JSON으로 export
   */
  static async exportToJSON(): Promise<KnowledgeBase> {
    const memos = await db.memos.toArray();
    const ideas = await db.ideas.toArray();
    const connections = await db.connections.toArray();

    const knowledgeBase: KnowledgeBase = {
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      stats: {
        memos: memos.length,
        ideas: ideas.length,
        connections: connections.length,
      },
      data: {
        memos,
        ideas,
        connections,
      },
    };

    return knowledgeBase;
  }

  /**
   * JSON 파일에서 데이터를 import
   */
  static async importFromJSON(knowledgeBase: KnowledgeBase): Promise<void> {
    // 기존 데이터 삭제 (선택적)
    // await db.memos.clear();
    // await db.ideas.clear();
    // await db.connections.clear();

    // 새 데이터 추가
    await db.memos.bulkPut(knowledgeBase.data.memos);
    await db.ideas.bulkPut(knowledgeBase.data.ideas);
    await db.connections.bulkPut(knowledgeBase.data.connections);

    console.log('✅ 데이터 import 완료', knowledgeBase.stats);
  }

  /**
   * JSON 파일로 다운로드
   */
  static async downloadAsFile(): Promise<void> {
    const knowledgeBase = await this.exportToJSON();
    const jsonStr = JSON.stringify(knowledgeBase, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `ideaconnect-backup-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('✅ 데이터 다운로드 완료');
  }

  /**
   * 파일에서 업로드
   */
  static async uploadFromFile(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const jsonStr = e.target?.result as string;
          const knowledgeBase = JSON.parse(jsonStr) as KnowledgeBase;
          await this.importFromJSON(knowledgeBase);
          resolve();
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }

  /**
   * LocalStorage에 임시 저장 (브라우저 간 동기화용)
   */
  static async saveToLocalStorage(): Promise<void> {
    const knowledgeBase = await this.exportToJSON();
    const jsonStr = JSON.stringify(knowledgeBase);

    // LocalStorage는 5-10MB 제한이 있으므로 큰 데이터는 압축 필요
    if (jsonStr.length > 5 * 1024 * 1024) {
      console.warn('⚠️ 데이터가 너무 큽니다. 파일로 export하세요.');
      return;
    }

    localStorage.setItem('ideaconnect-backup', jsonStr);
    localStorage.setItem('ideaconnect-backup-timestamp', new Date().toISOString());

    console.log('✅ LocalStorage에 저장 완료');
  }

  /**
   * LocalStorage에서 복원
   */
  static async loadFromLocalStorage(): Promise<void> {
    const jsonStr = localStorage.getItem('ideaconnect-backup');

    if (!jsonStr) {
      throw new Error('백업 데이터가 없습니다');
    }

    const knowledgeBase = JSON.parse(jsonStr) as KnowledgeBase;
    await this.importFromJSON(knowledgeBase);

    console.log('✅ LocalStorage에서 복원 완료');
  }

  /**
   * NAS/파일 시스템에 저장 (Node.js 환경 필요)
   * 브라우저에서는 사용 불가
   */
  static async saveToFileSystem(outputPath: string): Promise<void> {
    const knowledgeBase = await this.exportToJSON();
    const jsonStr = JSON.stringify(knowledgeBase, null, 2);

    // 브라우저에서는 File System Access API 사용
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: `ideaconnect-${Date.now()}.json`,
          types: [
            {
              description: 'JSON Files',
              accept: { 'application/json': ['.json'] },
            },
          ],
        });

        const writable = await handle.createWritable();
        await writable.write(jsonStr);
        await writable.close();

        console.log('✅ 파일 시스템에 저장 완료:', outputPath);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('파일 저장 실패:', error);
          throw error;
        }
      }
    } else {
      // 폴백: 다운로드
      await this.downloadAsFile();
    }
  }

  /**
   * 통계 정보 조회
   */
  static async getStats(): Promise<KnowledgeBase['stats']> {
    const memos = await db.memos.count();
    const ideas = await db.ideas.count();
    const connections = await db.connections.count();

    return {
      memos,
      ideas,
      connections,
    };
  }

  /**
   * 데이터 크기 추정 (bytes)
   */
  static async estimateDataSize(): Promise<number> {
    const knowledgeBase = await this.exportToJSON();
    const jsonStr = JSON.stringify(knowledgeBase);
    return new Blob([jsonStr]).size;
  }
}
