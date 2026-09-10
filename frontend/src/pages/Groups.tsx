import { useState } from "react";

interface Group {
  id: string;
  name: string;
}

const groups: Group[] = [
  { id: '1', name: 'Roomies — Flat 4B' },
  { id: '2', name: 'Mndi Household' },
  { id: '3', name: 'Res Cleanup Squad' },
];

function Groups() {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const selectedGroup = groups.find(g => g.id === selectedId) ?? null;

  return (
    <div className="master-detail">
      <div className="master-list">
        {groups.map(g => (
          <button
            key={g.id}
            className={`group-btn ${g.id === selectedId ? 'active' : ''}`}
            onClick={() => setSelectedId(g.id)}
          >
            {g.name}
          </button>
        ))}
      </div>

      <div className="detail-panel">
        {selectedGroup ? (
          <GroupDetails group={selectedGroup} />
        ) : (
          <div className="empty-state">Nothing to display</div>
        )}
      </div>
    </div>
  );
}

function GroupDetails({ group }: { group: Group }) {
  return <h2>{group.name}</h2>; 
}

export default Groups