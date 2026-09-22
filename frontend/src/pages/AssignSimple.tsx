import { useState } from 'react';
import { members } from '../data/mockMembers';
import { tasks as initialTasks } from '../data/mockTasks';

// Naive equal-split shuffle — real logic will live on the backend later
function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function distribute() {
  const shuffled = shuffle(initialTasks);
  const buckets: Record<string, typeof initialTasks> = {};
  members.forEach(m => (buckets[m.id] = []));
  shuffled.forEach((task, i) => {
    const member = members[i % members.length];
    buckets[member.id].push(task);
  });
  return buckets;
}

function AssignSimple() {
  const [buckets, setBuckets] = useState(distribute());

  return (
    <div>
      <div className="flex flex-wrap gap-3.5">
        {members.map(member => (
          <div
            key={member.id}
            className={`w-37.5 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl p-3.5 text-white bg-${member.color}`}
          >
            <div className="font-display font-bold text-[13.5px] mb-2.5">{member.name}</div>
            {buckets[member.id].map(task => (
              <div key={task.id} className="bg-white/20 rounded-md px-2 py-1.5 text-[11.5px] mb-1.5">
                {task.title}
              </div>
            ))}
          </div>
        ))}
      </div>

      <button
        onClick={() => setBuckets(distribute())}
        className="mt-4 inline-flex items-center gap-2 bg-white border border-slate-light px-4 py-2.5 rounded-full font-display font-semibold text-[13px] text-ink"
      >
        <span className="w-4 h-4 rounded-full border-2 border-salmon border-t-transparent inline-block" />
        Reroll assignment
      </button>
    </div>
  );
}
export default AssignSimple;