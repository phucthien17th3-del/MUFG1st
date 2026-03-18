import React from 'react';
import { FileText } from 'lucide-react';
import { Order } from './types';

interface OrdersViewProps {
  userOrders: Order[];
}

const OrdersView = ({ userOrders }: OrdersViewProps) => {
  return (
    <div className="pb-24 animate-fade-in">
      <div className="bg-[#c00001] pt-8 pb-12 px-6 rounded-b-[40px] shadow-lg text-center">
        <h1 className="text-white font-bold text-xl">Lịch Sử Lệnh</h1>
        <p className="text-white/70 text-xs mt-1">Theo dõi các lệnh giao dịch của bạn</p>
      </div>

      <div className="mx-5 -mt-6 space-y-4">
        {userOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-3xl p-5 shadow-xl border border-gray-50 relative overflow-hidden">
            {order.status !== 'pending' && (
              <div className={`absolute top-0 right-0 px-4 py-1 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest ${order.status === 'win' ? 'bg-green-50 text-white' : 'bg-rose-50 text-white'}`}>
                {order.status === 'win' ? 'Thắng' : 'Thua'}
              </div>
            )}
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Phiên {order.expect}</div>
                <div className="text-lg font-black text-gray-800">{order.room} • {order.betCode}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Số tiền</div>
                <div className="text-lg font-black text-blue-600">{order.amount.toLocaleString('vi-VN')}</div>
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
              <div className="text-[10px] text-gray-400 font-medium">{order.time}</div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Kết quả:</span>
                <span className={`font-black ${order.status === 'win' ? 'text-green-600' : order.status === 'loss' ? 'text-rose-600' : 'text-gray-400'}`}>
                  {order.result || 'Đang chờ...'}
                </span>
              </div>
            </div>
          </div>
        ))}
        {userOrders.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center shadow-xl border border-gray-50">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-gray-300 w-8 h-8" />
            </div>
            <div className="text-gray-400 font-medium">Bạn chưa đặt lệnh nào</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersView;