import { CODES } from './constants';
import { HistoryItem } from './types';

export const generateMockHistory = (startExpect: number, count: number): HistoryItem[] => {
  const history: HistoryItem[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const time = new Date(now.getTime() - (i + 1) * 300000); // 5 mins apart
    history.push({
      time: time.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      expect: (startExpect - (i + 1)).toString(),
      result: CODES[Math.floor(Math.random() * CODES.length)]
    });
  }
  return history;
};
