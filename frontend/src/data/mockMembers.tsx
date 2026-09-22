export interface Member {
  id: string;
  name: string;
  role: string;
  color: string; // maps to a Tailwind member-* token
}

export const members: Member[] = [
  { id: 'm1', name: 'Amahle', role: 'Housemate', color: 'member-c' },
  { id: 'm2', name: 'Sipho',  role: 'Housemate', color: 'member-d' },
  { id: 'm3', name: 'Lindi',  role: 'Housemate', color: 'member-e' },
  { id: 'm4', name: 'Iviwe',  role: 'Housemate', color: 'salmon' },
];