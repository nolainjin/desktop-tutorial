import { IdeaType } from '../../types/idea';

interface IdeaFilterProps {
  selectedTypes: IdeaType[];
  onChange: (types: IdeaType[]) => void;
}

const ALL_TYPES: { value: IdeaType; label: string; icon: string }[] = [
  { value: 'movie', label: '영화', icon: '🎬' },
  { value: 'drama', label: '드라마', icon: '📺' },
  { value: 'animation', label: '애니메이션', icon: '🎨' },
  { value: 'book', label: '책', icon: '📚' },
  { value: 'essay', label: '에세이', icon: '✍️' },
  { value: 'poem', label: '시', icon: '📖' },
  { value: 'famous-quote', label: '위인 명언', icon: '💭' },
  { value: 'proverb', label: '속담', icon: '📜' },
  { value: 'academic', label: '학문', icon: '🎓' },
  { value: 'web', label: '웹자료', icon: '🌐' }
];

export function IdeaFilter({ selectedTypes, onChange }: IdeaFilterProps) {
  const handleToggle = (type: IdeaType) => {
    if (selectedTypes.includes(type)) {
      onChange(selectedTypes.filter(t => t !== type));
    } else {
      onChange([...selectedTypes, type]);
    }
  };

  const handleSelectAll = () => {
    onChange(ALL_TYPES.map(t => t.value));
  };

  const handleDeselectAll = () => {
    onChange([]);
  };

  return (
    <div className="card p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
          🎯 검색할 분류 선택
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleSelectAll}
            className="btn btn-sm btn-secondary text-xs"
          >
            전체 선택
          </button>
          <button
            onClick={handleDeselectAll}
            className="btn btn-sm btn-secondary text-xs"
          >
            전체 해제
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {ALL_TYPES.map(type => (
          <button
            key={type.value}
            onClick={() => handleToggle(type.value)}
            className={`
              px-3 py-2 rounded-md border text-sm font-medium transition-colors
              ${
                selectedTypes.includes(type.value)
                  ? 'bg-blue-100 border-blue-300 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'
              }
            `}
          >
            {type.icon} {type.label}
          </button>
        ))}
      </div>
    </div>
  );
}
