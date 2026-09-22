// data/mockTasks.ts
export type Frequency = 'daily' | 'weekly' | 'bi-weekly' | 'monthly';

export interface Task {
  id: string;
  title: string;
  category: 'Kitchen' | 'Bathroom' | 'Outdoor' | 'General';

  // Used by GroupChores.tsx (the static chore list view)
  assigneeId: string;
  status: 'done' | 'pending';

  // Used by AssignAdvanced.tsx (the schedule/report generator)
  frequency: Frequency;
  anchorDate: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
}

export const tasks: Task[] = [
  { id: 't1', title: 'Wash dishes',       category: 'Kitchen',  assigneeId: 'm1', status: 'done',    frequency: 'daily',     anchorDate: '2026-09-01', difficulty: 1 },
  { id: 't2', title: 'Take out trash',    category: 'General',  assigneeId: 'm2', status: 'pending', frequency: 'weekly',    anchorDate: '2026-09-02', difficulty: 2 },
  { id: 't3', title: 'Vacuum lounge',     category: 'General',  assigneeId: 'm3', status: 'pending', frequency: 'weekly',    anchorDate: '2026-09-03', difficulty: 3 },
  { id: 't4', title: 'Clean bathroom',    category: 'Bathroom', assigneeId: 'm4', status: 'pending', frequency: 'bi-weekly', anchorDate: '2026-09-01', difficulty: 4 },
  { id: 't5', title: 'Water plants',      category: 'Outdoor',  assigneeId: 'm1', status: 'done',    frequency: 'weekly',    anchorDate: '2026-09-04', difficulty: 1 },
  { id: 't6', title: 'Deep clean fridge', category: 'Kitchen',  assigneeId: 'm3', status: 'pending', frequency: 'monthly',   anchorDate: '2026-09-06', difficulty: 5 },
];