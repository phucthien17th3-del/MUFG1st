import React from 'react';
import { User, ChevronLeft, Settings, PlusCircle, Wallet, Receipt, ArrowRightLeft, UserPen, MessageCircle, LogOut, ShieldCheck } from 'lucide-react';
import { ViewType, Order } from './types';

interface ProfileViewProps {
  user: any;
  balance: number;
  setView: React.Dispatch<React.SetStateAction<ViewType>>;
  setShowChangePass: React.Dispatch<React.SetStateAction<boolean>>;
  isAdmin: boolean;
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogout: () => void;
  unreadCount: number;
  userOrders: Order[];
}

const ProfileView = ({ user, balance, setView, setShowChangePass, isAdmin, setIsChatOpen, handleLogout, unreadCount, userOrders }: ProfileViewProps) => {
  const netProfit = userOrders.reduce((acc, order) => {
    if (order.status === 'win') return acc + order.amount;
    if (order.status === 'loss') return acc - order.amount;
    return acc;
  }, 0);

  return (
    <div className="pb-24 animate-fade-in">
      <div className="bg-gradient-to-br from-[#1e3c72] to-[#2a5298] pt-8 pb-12 px-6 rounded-b-[40px] shadow-lg relative">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-white font-bold text-lg">Trung Tâm Hội Viên</h1>
          <button onClick={() => setShowChangePass(true)} className="text-white/80 active:scale-90 transition-transform">
            <Settings className="w-6 h-6" />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full border-4 border-white/20 shadow-xl overflow-hidden">
            <img src={user.avatar} className="w-full h-full object-cover" alt="Avatar" />
          </div>
          <div>
            <div className="text-white font-bold text-2xl">{user.username}</div>
            <div className="bg-white/10 px-3 py-1 rounded-full text-[10px] text-white/80 inline-block mt-1">
              ID: {user.id} • VIP {user.vip}
            </div>
            <div className="block mt-2">
              <span className="bg-yellow-500/20 text-yellow-400 text-[10px] font-bold px-2 py-1 rounded-lg border border-yellow-500/30">
                Mã mời: {user.id}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-5 -mt-8 bg-white rounded-3xl p-6 shadow-xl relative z-10 border border-gray-50">
        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Số dư hiện tại</div>
        <div className="flex items-center gap-2 mb-6">
          <span className="text-3xl font-black text-gray-900">{balance.toLocaleString('vi-VN')}</span>
          <ShieldCheck className="text-blue-500 w-5 h-5" />
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setView('deposit')}
            className="flex-1 h-12 bg-gradient-to-r from-[#bf953f] to-[#fcf6ba] rounded-xl flex items-center justify-center gap-2 text-[#4b3621] font-bold text-sm shadow-md active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" /> Nạp tiền
          </button>
          <button 
            onClick={() => setView('withdraw')}
            className="flex-1 h-12 bg-gray-100 rounded-xl flex items-center justify-center gap-2 text-gray-700 font-bold text-sm active:scale-95 transition-all"
          >
            <Wallet className="w-4 h-4" /> Rút tiền
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mx-5 mt-6">
        <div className="bg-white p-4 rounded-2xl text-center shadow-sm border border-gray-50">
          <div className={`text-lg font-bold ${netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {netProfit >= 0 ? '+' : ''}{netProfit.toLocaleString('vi-VN')}
          </div>
          <div className="text-[10px] text-gray-400 font-medium">Lợi nhuận ròng</div>
        </div>
        <div className="bg-white p-4 rounded-2xl text-center shadow-sm border border-gray-50">
          <div className="text-lg font-bold text-green-500">100.00%</div>
          <div className="text-[10px] text-gray-400 font-medium">Tỉ lệ tín nhiệm</div>
        </div>
      </div>

      <div className="mx-5 mt-6 space-y-3">
        {[
          ...(isAdmin ? [{ 
            label: 'Quản trị hệ thống', 
            icon: Settings, 
            color: 'bg-slate-900 text-white', 
            action: () => setView('admin'),
            badge: unreadCount
          }] : []),
          { label: 'Lịch sử giao dịch nạp', icon: Receipt, color: 'bg-blue-50 text-blue-500', action: () => setView('deposit-history') },
          { label: 'Lịch sử giao dịch rút', icon: ArrowRightLeft, color: 'bg-purple-50 text-purple-500', action: () => setView('withdraw-history') },
          { label: 'Chỉnh sửa hồ sơ', icon: UserPen, color: 'bg-green-50 text-green-500', action: () => setView('edit-profile') },
          { label: 'Hỗ trợ trực tuyến 24/7', icon: MessageCircle, color: 'bg-orange-50 text-orange-500', action: () => setIsChatOpen(true) },
          { label: 'Đăng xuất ứng dụng', icon: LogOut, color: 'bg-gray-50 text-gray-500', action: handleLogout },
        ].map((item: any, i) => (
          <button 
            key={i} 
            onClick={item.action}
            className="w-full bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm active:bg-gray-50 transition-colors relative"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <span className="flex-1 text-left font-bold text-gray-700 text-sm">{item.label}</span>
            {item.badge > 0 && (
              <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full mr-2">
                {item.badge}
              </div>
            )}
            <ChevronLeft className="text-gray-300 w-4 h-4 rotate-180" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileView;