export type ViewType = 
  | 'login' 
  | 'home' 
  | 'market' 
  | 'orders' 
  | 'trading-vip1' 
  | 'trading-vip2' 
  | 'profile' 
  | 'deposit' 
  | 'withdraw' 
  | 'about' 
  | 'deposit-history' 
  | 'withdraw-history' 
  | 'edit-profile'
  | 'admin';

export interface Message {
  id: string;
  nickname: string;
  avatar: string;
  content: string;
  addtime: string;
  isService?: boolean;
  userId?: string;
  isRead?: boolean;
}

export interface HistoryItem {
  time: string;
  expect: string;
  result: string;
}

export interface RoomState {
  currentExpect: string;
  timeLeft: number;
  isRunning: boolean;
  symbols: string[];
  result: string;
  history: HistoryItem[];
  messages: Message[];
  futureResults?: string[];
}

export interface Order {
  id: string;
  userId: string;
  time: string;
  room: 'VIP1' | 'VIP2';
  expect: string;
  betCode: string;
  amount: number;
  status: 'pending' | 'win' | 'loss';
  result?: string;
}

export interface Transaction {
  id: string;
  time: string;
  amount: number;
  status: 'success' | 'pending' | 'failed';
  method?: string;
  bankInfo?: string;
}
