import React, { useState } from 'react';
import { ChevronLeft, BarChart2 } from 'lucide-react';
import { RoomState } from './types';

interface MarketViewProps {
  vipState: RoomState;
  : RoomState;
}

const MarketView = ({ vipState,  }: MarketViewProps) => {
  const [activeTab, setActiveTab] = useState<'VIP1' | 'VIP2'>('VIP1');
  const history = activeTab === 'VIP1' ? vip1vipState.history : vip2vipState.history;

  return (
    <div className="pb-24 animate-fade-in">
      <div className="bg-[#c00001] pt-8 pb-12 px-6 rounded-b-[40px] shadow-lg text-center">
        <h1 className="text-white font-bold text-xl mb-4">Lịch Sử Phiên</h1>
        <div className="flex bg-white/20 p-1 rounded-2xl backdrop-blur-md">
          <button 
            onClick={() => setActiveTab('VIP1')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'VIP1' ? 'bg-white text-[#c00001]' : 'text-white'}`}
          >
            Quỹ Mở (VIP1)
          </button>
          <button 
            onClick={() => setActiveTab('VIP2')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'VIP2' ? 'bg-white text-[#c00001]' : 'text-white'}`}
          >
            Ngắn Hạn (VIP2)
          </button>
        </div>
      </div>

      <div className="mx-5 -mt-6 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-50">
        <table className="w-full text-sm text-center">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="py-4 text-gray-400 font-bold text-[10px] uppercase tracking-wider">Thời gian</th>
              <th className="text-gray-400 font-bold text-[10px] uppercase tracking-wider">Kỳ</th>
              <th className="text-gray-400 font-bold text-[10px] uppercase tracking-wider">Kết quả</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <tr key={i} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                <td className="py-4 text-gray-500 text-xs">{h.time}</td>
                <td className="text-gray-900 font-medium text-xs">{h.expect}</td>
                <td className="font-black text-[#c00001]">{h.result}</td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td colSpan={3} className="py-12 text-gray-400 text-sm italic">Chưa có dữ liệu phiên</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketView;