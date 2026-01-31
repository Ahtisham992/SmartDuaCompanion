// src/types/tasbih.types.ts

export interface TasbihPreset {
  id: string;
  name: string;
  nameUrdu: string;
  count: number;
  icon?: string;
}

export interface TasbihSession {
  id: string;
  preset: TasbihPreset;
  currentCount: number;
  targetCount: number;
  startTime: string;
  endTime?: string;
  completed: boolean;
}

export interface TasbihHistory {
  id: string;
  date: string;
  sessions: TasbihSession[];
  totalCount: number;
}

export interface TasbihState {
  currentCount: number;
  targetCount: number;
  selectedPreset: TasbihPreset | null;
  isActive: boolean;
  history: TasbihHistory[];
  vibrationEnabled: boolean;
  soundEnabled: boolean;
}

export const TASBIH_PRESETS: TasbihPreset[] = [
  {
    id: 'subhanallah',
    name: 'SubhanAllah',
    nameUrdu: 'سبحان اللہ',
    count: 33,
  },
  {
    id: 'alhamdulillah',
    name: 'Alhamdulillah',
    nameUrdu: 'الحمد للہ',
    count: 33,
  },
  {
    id: 'allahuakbar',
    name: 'Allahu Akbar',
    nameUrdu: 'اللہ اکبر',
    count: 33,
  },
  {
    id: 'astaghfirullah',
    name: 'Astaghfirullah',
    nameUrdu: 'استغفر اللہ',
    count: 100,
  },
  {
    id: 'custom',
    name: 'Custom Count',
    nameUrdu: 'کسٹم',
    count: 99,
  },
];