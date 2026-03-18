import React from 'react';
import { Bell, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { ViewType } from './types';

interface HomeViewProps {
  setView: React.Dispatch<React.SetStateAction<ViewType>>;
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const HomeView = ({ setView, setIsChatOpen }: HomeViewProps) => (
  <div className="pb-24 animate-fade-in">
    <div className="bg-gradient-to-b from-[#f13031] to-[#c00001] h-14 flex items-center justify-center shadow-md w-full">
      <h1 className="text-white font-bold text-lg tracking-wide">MUFG GLOBAL</h1>
    </div>

    <div className="p-4">
      <div className="rounded-2xl overflow-hidden shadow-lg mb-6">
        <img src="https://extgw.dsc.com.vn/eback/uploads/loi_ich_va_rui_ro_khi_tham_gia_thi_truong_tai_chinh_b81897acfe.jpg" className="w-full h-40 object-cover" alt="Banner" />
      </div>

      <div className="grid grid-cols-4 gap-3 bg-white p-4 rounded-2xl shadow-sm mb-4">
        {[
          { label: 'CSKH', icon: 'https://images.careerviet.vn/content/images/cham-soc-khach-hang-la-gi-1.jpg', action: () => setIsChatOpen(true) },
          { label: 'Thông tin', icon: 'https://cdn-icons-png.flaticon.com/512/471/471663.png', action: () => setView('about') },
          { label: 'Rút tiền', icon: 'https://cdn-icons-png.flaticon.com/512/2489/2489756.png', action: () => setView('withdraw') },
          { label: 'Nạp tiền', icon: 'https://png.pngtree.com/png-vector/20251012/ourlarge/pngtree-cartoon-of-clipart-top-up-money-vector-illustration-png-image_17689626.webp', action: () => setView('deposit') },
        ].map((item, i) => (
          <button key={i} onClick={item.action} className="flex flex-col items-center active:scale-90 transition-transform">
            <div className="w-12 h-12 rounded-xl border-2 border-white shadow-sm mb-1 overflow-hidden">
              <img src={item.icon} className="w-full h-full object-cover" alt={item.label} />
            </div>
            <span className="text-[10px] font-bold text-gray-600">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl p-3 flex items-center mb-6 border border-gray-100">
        <Bell className="text-[#c00001] w-5 h-5 mr-3" />
        <div className="overflow-hidden whitespace-nowrap">
          <motion.p 
            animate={{ x: [300, -800] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="text-xs font-semibold text-[#c00001]"
          >
            Vui lòng liên hệ CSKH lấy số tài khoản mới nhất trước mỗi lần nạp tiền. Nền tảng không chịu trách nhiệm nếu nạp sai kênh.
          </motion.p>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-800 border-l-4 border-[#c00001] pl-2 mb-4">Danh mục đầu tư</h2>
        
        <div 
          onClick={() => setView('trading-vip1')}
          className="relative h-32 rounded-2xl overflow-hidden mb-4 shadow-md cursor-pointer active:scale-[0.98] transition-all"
        >
          <img src="https://static.tikop.vn/article/2024/02/25/quy-mo-la-gi-1png-65da2f0db1654.jpg" className="absolute inset-0 w-full h-full object-cover brightness-50" />
          <div className="absolute inset-0 p-4 flex flex-col justify-end">
            <span className="text-[10px] text-white/80 font-medium">An toàn - Bền vững</span>
            <div className="flex justify-between items-center">
              <span className="text-lg font-extrabold text-white">Giao Dịch Quỹ Mở (VIP1)</span>
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                <ChevronRight className="text-white w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        <div 
          onClick={() => setView('trading-vip2')}
          className="relative h-32 rounded-2xl overflow-hidden shadow-md cursor-pointer active:scale-[0.98] transition-all"
        >
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoGK9hOM_2rM65EzkodOJctprsrxAEtSSgjw&s" className="absolute inset-0 w-full h-full object-cover brightness-50" />
          <div className="absolute inset-0 p-4 flex flex-col justify-end">
            <span className="text-[10px] text-white/80 font-medium">Linh hoạt - Tối ưu</span>
            <div className="flex justify-between items-center">
              <span className="text-lg font-extrabold text-white">Giao Dịch Ngắn Hạn (VIP2)</span>
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                <ChevronRight className="text-white w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default HomeView;