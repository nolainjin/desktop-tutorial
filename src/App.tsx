import { useEffect, useState } from 'react';
import { Layout } from './components/common/Layout';
import { Loading } from './components/common/Loading';
import { MemoList } from './components/memo/MemoList';
import { MemoEditor } from './components/memo/MemoEditor';
import { MemoDetail } from './components/memo/MemoDetail';
import { GraphView } from './components/graph/GraphView';
import { DataManager } from './components/storage/DataManager';
import { useMemoStore } from './stores/memoStore';
import { Memo, CreateMemoInput, UpdateMemoInput } from './types/memo';
import { Idea } from './types/idea';
import { Connection } from './types/connection';
import { db } from './db/schema';
import { GraphNode } from './features/graph/GraphBuilder';
import { initAutoSync } from './features/storage/AutoSync';

type View = 'list' | 'editor' | 'detail';
type Tab = 'list' | 'graph' | 'data';

function App() {
  const {memos,isLoading,loadMemos,createMemo,updateMemo,setCurrentMemo}=useMemoStore();
  const [view,setView]=useState<View>('list');
  const [tab,setTab]=useState<Tab>('list');
  const [editingMemo,setEditingMemo]=useState<Memo|undefined>();
  const [viewingMemo,setViewingMemo]=useState<Memo|undefined>();
  const [allIdeas,setAllIdeas]=useState<Map<string,Idea[]>>(new Map());
  const [connections,setConnections]=useState<Connection[]>([]);

  useEffect(()=>{
    // 데이터 로드
    loadMemos();
    loadAllIdeas();
    loadAllConnections();

    // 자동 동기화 초기화
    initAutoSync();
  },[loadMemos]);

  const loadAllIdeas=async()=>{
    const ideas=await db.ideas.toArray();
    const ideasByMemo=new Map<string,Idea[]>();
    ideas.forEach(idea=>{
      const existing=ideasByMemo.get(idea.memoId)||[];
      ideasByMemo.set(idea.memoId,[...existing,idea]);
    });
    setAllIdeas(ideasByMemo);
  };

  const loadAllConnections=async()=>{
    const allConnections=await db.connections.toArray();
    setConnections(allConnections);
  };

  const handleNewMemo=()=>{
    setEditingMemo(undefined);
    setView('editor');
  };

  const handleEditMemo=(memo:Memo)=>{
    setEditingMemo(memo);
    setView('editor');
  };

  const handleMemoClick=(memo:Memo)=>{
    setCurrentMemo(memo);
    setViewingMemo(memo);
    setView('detail');
  };

  const handleNodeClick=(node:GraphNode)=>{
    if(node.type==='memo'&&node.memo){
      handleMemoClick(node.memo);
    }
  };

  const handleSaveMemo=async(input:CreateMemoInput|UpdateMemoInput)=>{
    if(editingMemo){
      await updateMemo(editingMemo.id,input as UpdateMemoInput);
      await loadMemos();
      const updated=memos.find(m=>m.id===editingMemo.id);
      if(updated){
        setViewingMemo(updated);
        setView('detail');
      }else{
        setView('list');
      }
    }else{
      const newMemo=await createMemo(input as CreateMemoInput);
      setViewingMemo(newMemo);
      setView('detail');
    }
    setEditingMemo(undefined);
    await loadAllIdeas();
    await loadAllConnections();
  };

  const handleCancel=()=>{
    if(viewingMemo){
      setView('detail');
    }else{
      setView('list');
    }
    setEditingMemo(undefined);
  };

  const handleBackToList=()=>{
    setView('list');
    setViewingMemo(undefined);
    setEditingMemo(undefined);
  };

  return (
    <Layout>
      {view==='list'&&(
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">내 메모</h2>
            <button onClick={handleNewMemo} className="btn btn-primary">➕ 새 메모 작성</button>
          </div>
          <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
            <button onClick={()=>setTab('list')} className={'px-4 py-2 font-medium transition-colors '+(tab==='list'?'text-blue-600 border-b-2 border-blue-600':'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100')}>📝 목록 보기</button>
            <button onClick={()=>setTab('graph')} className={'px-4 py-2 font-medium transition-colors '+(tab==='graph'?'text-blue-600 border-b-2 border-blue-600':'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100')}>🔗 그래프 보기</button>
            <button onClick={()=>setTab('data')} className={'px-4 py-2 font-medium transition-colors '+(tab==='data'?'text-blue-600 border-b-2 border-blue-600':'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100')}>💾 데이터 관리</button>
          </div>
        </>
      )}
      {isLoading ? (
        <Loading />
      ) : view === 'list' ? (
        tab === 'list' ? (
          <MemoList memos={memos} onMemoClick={handleMemoClick} onNewMemo={handleNewMemo} />
        ) : tab === 'graph' ? (
          <GraphView memos={memos} allIdeas={allIdeas} connections={connections} onNodeClick={handleNodeClick} />
        ) : (
          <DataManager />
        )
      ) : view === 'editor' ? (
        <MemoEditor memo={editingMemo} onSave={handleSaveMemo} onCancel={handleCancel} />
      ) : (
        viewingMemo && <MemoDetail memo={viewingMemo} onEdit={() => handleEditMemo(viewingMemo)} onBack={handleBackToList} />
      )}
    </Layout>
  );
}

export default App;
