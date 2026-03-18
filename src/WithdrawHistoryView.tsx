import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { ViewType } from './types';

interface WithdrawHistoryViewProps {
  transactions: any[];
  user: any;
  setView: React.Dispatch<React.SetStateAction<ViewType>>;
}

const WithdrawHistoryView = ({ transactions, user, setView }: WithdrawHistoryViewProps) => {
  const withdrawHistory = transactions.filter(t => t.userId === user.id && t.type === 'withdraw');

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      <div className="bg-white p-4 flex items-center shadow-sm sticky top-0 z-50">
        <button onClick={() => setView('profile')} className="p-2">
          <ChevronLeft className="text-gray-600" />
        </button>
        <h1 className="flex-1 text-center font-bold text-gray-800 pr-8">Lịch Sử Rút Tiền</h1>
      </div>

      <div className="p-4 space-y-3">
        {withdrawHistory.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="text-sm font-bold text-gray-800">{item.bankInfo || 'Rút tiền về ngân hàng'}</div>
                <div className="text-[10px] text-gray-400">{item.time}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-rose-600">-{item.amount.toLocaleString('vi-VN')}</div>
                <div className={`text-[10px] font-bold ${
                  item.status === 'approved' ? 'text-green-500' : 
                  item.status === 'rejected' ? 'text-red-500' : 'text-orange-500'
                }`}>
                  {item.status === 'approved' ? 'Thành công' : item.status === 'rejected' ? 'Từ chối' : 'Đang xử lý'}
                </div>
              </div>
            </div>
            <div className="text-[10px] text-gray-300">Mã GD: {item.id}</div>
          </div>
        ))}
        {withdrawHistory.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">Chưa có giao dịch rút tiền nào.</div>
        )}
      </div>
    </div>
  );
};

export default WithdrawHistoryView;