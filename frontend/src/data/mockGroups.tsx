export interface Group {
  id: string;
  name: string;
  taskCount: number;
}

export const groups: Group[] = [
  { id: '1', name: 'Roomies — Flat 4B', taskCount: 6 },
  { id: '2', name: 'Mndi Household', taskCount: 9 },
];