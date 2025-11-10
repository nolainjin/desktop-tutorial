import { useState, useEffect } from 'react';
import { FileStorage } from '@/features/storage/FileStorage';
import { AutoSync, toggleAutoSync } from '@/features/storage/AutoSync';

export function DataManager() {
  const [stats, setStats] = useState({ memos: 0, ideas: 0, connections: 0 });
  const [dataSize, setDataSize] = useState(0);
  const [syncStatus, setSyncStatus] = useState(AutoSync.getStatus());
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    loadStats();

    // 1초마다 동기화 상태 업데이트
    const interval = setInterval(() => {
      setSyncStatus(AutoSync.getStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    const newStats = await FileStorage.getStats();
    const size = await FileStorage.estimateDataSize();
    setStats(newStats);
    setDataSize(size);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await FileStorage.downloadAsFile();
      alert('✅ 데이터를 성공적으로 다운로드했습니다!');
    } catch (error) {
      alert('❌ 다운로드 실패: ' + (error as Error).message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveToNAS = async () => {
    setIsExporting(true);
    try {
      await FileStorage.saveToFileSystem('/Volumes/work-sync/project/data/knowledge-base');
      alert('✅ NAS에 저장 완료!');
    } catch (error) {
      alert('❌ NAS 저장 실패: ' + (error as Error).message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      await FileStorage.uploadFromFile(file);
      await loadStats();
      alert('✅ 데이터를 성공적으로 불러왔습니다!');
    } catch (error) {
      alert('❌ 불러오기 실패: ' + (error as Error).message);
    } finally {
      setIsImporting(false);
    }
  };

  const handleToggleAutoSync = () => {
    const newState = toggleAutoSync();
    setSyncStatus(AutoSync.getStatus());
    alert(newState ? '✅ 자동 동기화 활성화' : '⏸️ 자동 동기화 비활성화');
  };

  const handleManualSync = async () => {
    await AutoSync.sync();
    setSyncStatus(AutoSync.getStatus());
    alert('✅ 수동 동기화 완료!');
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '없음';
    return date.toLocaleString('ko-KR');
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          📦 데이터 관리
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          연결된 지식을 백업하고 복원하세요
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">메모</div>
          <div className="text-3xl font-bold text-blue-600">{stats.memos}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">아이디어</div>
          <div className="text-3xl font-bold text-purple-600">{stats.ideas}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">연결</div>
          <div className="text-3xl font-bold text-green-600">{stats.connections}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">데이터 크기</div>
          <div className="text-2xl font-bold text-orange-600">{formatBytes(dataSize)}</div>
        </div>
      </div>

      {/* 자동 동기화 */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              🔄 자동 동기화
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              데이터를 자동으로 백업합니다 (LocalStorage)
            </p>
          </div>
          <button
            onClick={handleToggleAutoSync}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              syncStatus.enabled
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
            }`}
          >
            {syncStatus.enabled ? '활성화됨' : '비활성화됨'}
          </button>
        </div>

        {syncStatus.enabled && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">마지막 동기화:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatDate(syncStatus.lastSync)}
              </span>
            </div>
            <button
              onClick={handleManualSync}
              className="w-full btn btn-secondary text-sm"
            >
              지금 동기화
            </button>
          </div>
        )}
      </div>

      {/* Export/Import */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          💾 백업 및 복원
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Export */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">
              📤 내보내기
            </h4>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full btn btn-primary"
            >
              {isExporting ? '내보내는 중...' : '💾 파일로 다운로드'}
            </button>
            <button
              onClick={handleSaveToNAS}
              disabled={isExporting}
              className="w-full btn bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isExporting ? '저장 중...' : '🗄️ NAS에 저장'}
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              모든 메모, 아이디어, 연결을 JSON 파일로 저장합니다
            </p>
          </div>

          {/* Import */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">
              📥 가져오기
            </h4>
            <label className="block">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={isImporting}
                className="hidden"
                id="import-file"
              />
              <label
                htmlFor="import-file"
                className={`w-full btn btn-secondary cursor-pointer inline-block text-center ${
                  isImporting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isImporting ? '불러오는 중...' : '📂 파일에서 불러오기'}
              </label>
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              백업 파일을 선택하여 데이터를 복원합니다
            </p>
          </div>
        </div>
      </div>

      {/* NAS 폴더 구조 안내 */}
      <div className="card p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">
          📁 NAS 저장 위치
        </h3>
        <div className="space-y-2 text-sm text-blue-800 dark:text-blue-400">
          <p className="font-mono bg-blue-100 dark:bg-blue-900/40 p-2 rounded">
            /Volumes/work-sync/project/data/knowledge-base/
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>메모, 아이디어, 연결이 JSON 파일로 저장됩니다</li>
            <li>타임스탬프가 포함된 파일명으로 버전 관리</li>
            <li>언제든지 파일에서 복원 가능</li>
          </ul>
        </div>
      </div>

      {/* 주의사항 */}
      <div className="card p-4 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
        <div className="flex gap-3">
          <div className="text-2xl">⚠️</div>
          <div className="flex-1">
            <h4 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-1">
              주의사항
            </h4>
            <ul className="text-sm text-yellow-800 dark:text-yellow-400 space-y-1">
              <li>• 가져오기는 기존 데이터에 추가됩니다 (덮어쓰지 않음)</li>
              <li>• 중복 데이터는 ID 기준으로 자동 병합됩니다</li>
              <li>• 정기적으로 백업하는 것을 권장합니다</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
