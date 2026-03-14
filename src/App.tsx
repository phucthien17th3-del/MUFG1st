/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  BarChart2, 
  FileText, 
  User, 
  ChevronLeft, 
  Settings, 
  PlusCircle, 
  Wallet, 
  ChevronRight, 
  Receipt, 
  ArrowRightLeft, 
  UserPen, 
  MessageCircle, 
  LogOut,
  ShieldCheck,
  Bell,
  Lock,
  Info,
  Eye,
  EyeOff,
  Coins,
  X,
  SendHorizontal,
  Phone,
  Camera,
  Image,
  Smile,
  ThumbsUp,
  ShieldAlert,
  Trash2,
  Download,
  RefreshCw,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { io } from 'socket.io-client';
import { ViewType, RoomState, Order, Transaction, Message } from './types';
import { INITIAL_TIMER, CODES, VN_NAMES, FAMOUS_AVATARS } from './constants';
import { generateMockHistory } from './utils';

interface LoginViewProps {
  registeredUsers: any[];
  setRegisteredUsers: React.Dispatch<React.SetStateAction<any[]>>;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  setView: React.Dispatch<React.SetStateAction<ViewType>>;
  setShowAnnouncement: React.Dispatch<React.SetStateAction<boolean>>;
  showAlert: (title: string, msg: string, type?: 'success' | 'error') => void;
  socketRef: React.MutableRefObject<any>;
}

const LoginView = ({ 
  registeredUsers, 
  setRegisteredUsers, 
  setIsAdmin, 
  setIsLoggedIn, 
  setUser, 
  setBalance, 
  setView, 
  setShowAnnouncement, 
  showAlert,
  socketRef
}: LoginViewProps) => {
  const [isRegister, setIsRegister] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  const handleSubmit = () => {
    if (!username || !password) {
      showAlert('Lỗi', 'Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    if (isRegister) {
      if (!inviteCode) {
        showAlert('Lỗi', 'Vui lòng nhập mã mời để đăng ký.');
        return;
      }
      if (!registeredUsers.find(u => u.id === inviteCode || u.inviteCode === inviteCode || u.username === inviteCode)) {
        showAlert('Lỗi', 'Mã mời không hợp lệ hoặc không tồn tại.');
        return;
      }
      if (password !== confirmPass) {
        showAlert('Lỗi', 'Mật khẩu xác nhận không khớp.');
        return;
      }
      if (registeredUsers.find(u => u.username === username)) {
        showAlert('Lỗi', 'Tên tài khoản đã tồn tại.');
        return;
      }
      
      const newUserId = Math.floor(10000000 + Math.random() * 90000000).toString();
      const newUser = {
        username,
        password,
        id: newUserId,
        vip: 'Bronze',
        balance: 0,
        avatar: FAMOUS_AVATARS[0].url,
        isVirtual: false,
        withdrawBlockStatus: 'none',
        isBetBlocked: false,
        inviteCode: newUserId, // Their own code is their ID
        referredBy: inviteCode // The code they used to register
      };
      
      if (socketRef.current) {
        socketRef.current.emit('register', newUser);
      }
      showAlert('Thành công', 'Đăng ký tài khoản thành công. Vui lòng đăng nhập.', 'success');
      setIsRegister(false);
      setPassword('');
      setConfirmPass('');
    } else {
      const foundUser = registeredUsers.find(u => u.username === username && u.password === password);
      if (foundUser) {
        if (foundUser.username === 'admin') {
          setIsAdmin(true);
          setIsLoggedIn(true);
          setUser(foundUser);
          setBalance(foundUser.balance);
          setView('home');
          setShowAnnouncement(true);
        } else {
          setIsAdmin(false);
          setIsLoggedIn(true);
          setUser(foundUser);
          setBalance(foundUser.balance);
          setView('home');
          setShowAnnouncement(true);
        }
      } else {
        showAlert('Lỗi', 'Tên tài khoản hoặc mật khẩu không chính xác.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-6 relative overflow-hidden" 
         style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')" }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-black/70 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#ffc75a] to-[#b48500] rounded-2xl rotate-45 flex items-center justify-center shadow-lg mb-6">
            <ShieldCheck className="-rotate-45 text-[#331a00] w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-widest uppercase">
            {isRegister ? 'Tạo Tài Khoản' : 'Đăng Nhập'}
          </h1>
        </div>

        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center focus-within:border-[#ffc75a] transition-all">
            <User className="text-[#dfbc81] w-5 h-5 mr-3" />
            <input 
              type="text" 
              placeholder="Tên tài khoản" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-transparent border-none outline-none text-white w-full text-sm" 
            />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center focus-within:border-[#ffc75a] transition-all">
            <Lock className="text-[#dfbc81] w-5 h-5 mr-3" />
            <input 
              type={showPass ? "text" : "password"} 
              placeholder="Mật khẩu" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent border-none outline-none text-white w-full text-sm" 
            />
            <button onClick={() => setShowPass(!showPass)}>
              {showPass ? <EyeOff className="text-white/40 w-4 h-4" /> : <Eye className="text-white/40 w-4 h-4" />}
            </button>
          </div>

          {isRegister && (
            <>
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center focus-within:border-[#ffc75a] transition-all">
                <Lock className="text-[#dfbc81] w-5 h-5 mr-3" />
                <input 
                  type="password" 
                  placeholder="Xác nhận mật khẩu" 
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="bg-transparent border-none outline-none text-white w-full text-sm" 
                />
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center focus-within:border-[#ffc75a] transition-all">
                <PlusCircle className="text-[#dfbc81] w-5 h-5 mr-3" />
                <input 
                  type="text" 
                  placeholder="Mã mời (Bắt buộc)" 
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  className="bg-transparent border-none outline-none text-white w-full text-sm" 
                />
              </div>
            </>
          )}
        </div>

        <button 
          onClick={handleSubmit}
          className="w-full mt-8 h-14 bg-gradient-to-r from-[#ffd785] to-[#b48500] rounded-xl text-[#221100] font-bold text-lg uppercase tracking-wider shadow-lg active:scale-95 transition-all"
        >
          {isRegister ? 'Hoàn tất đăng ký' : 'Đăng nhập ngay'}
        </button>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="text-white/60 text-sm hover:text-white transition-colors"
          >
            {isRegister ? 'Đã có tài khoản? ' : 'Bạn là thành viên mới? '}
            <span className="text-[#ffc75a] font-bold underline">
              {isRegister ? 'Đăng nhập hệ thống' : 'Đăng ký tại đây'}
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

interface HomeViewProps {
  setView: React.Dispatch<React.SetStateAction<ViewType>>;
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const HomeView = ({ setView, setIsChatOpen }: HomeViewProps) => (
  <div className="pb-24 animate-fade-in">
    <div className="bg-gradient-to-b from-[#f13031] to-[#c00001] h-14 flex items-center justify-center shadow-md fixed top-0 w-full z-50">
      <h1 className="text-white font-bold text-lg tracking-wide">MUFG GLOBAL</h1>
    </div>

    <div className="mt-14 p-4">
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
        <Bell className="text-[#c00001] w-5 h-5 mr-3 flex-shrink-0" />
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

interface TradingViewProps {
  roomId: 'VIP1' | 'VIP2';
  vip1State: RoomState;
  vip2State: RoomState;
  user: any;
  balance: number;
  platformSettings: any;
  setVip1State: React.Dispatch<React.SetStateAction<RoomState>>;
  setVip2State: React.Dispatch<React.SetStateAction<RoomState>>;
  setUserOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  setView: React.Dispatch<React.SetStateAction<ViewType>>;
  showAlert: (title: string, msg: string, type?: 'success' | 'error') => void;
  socketRef: React.MutableRefObject<any>;
}

const TradingView = ({ 
  roomId, 
  vip1State, 
  vip2State, 
  user, 
  balance,
  platformSettings, 
  setVip1State, 
  setVip2State, 
  setUserOrders, 
  setBalance, 
  setView, 
  showAlert,
  socketRef
}: TradingViewProps) => {
  const state = roomId === 'VIP1' ? vip1State : vip2State;
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [betAmount, setBetAmount] = useState('');
  const [betCode, setBetCode] = useState('');

  const handleBet = () => {
    if (user.isBetBlocked) {
      showAlert('Thông báo', 'Tài khoản của bạn đã bị chặn giao dịch, vui lòng liên hệ bộ phận cskh để giải quyết');
      return;
    }
    if (!betCode || !betAmount) return;

    const amount = parseInt(betAmount);

    if (balance <= 0) {
      showAlert('Thông báo', 'Tài khoản của bạn hiện không có tiền. Vui lòng nạp thêm tiền để có thể giao dịch.');
      return;
    }

    if (balance < amount) {
      showAlert('Số dư không đủ', 'Số dư tài khoản không đủ. Vui lòng nạp thêm tiền để thực hiện giao dịch này.');
      return;
    }

    // Validation
    if (roomId === 'VIP1') {
      if (amount < platformSettings.vip1.min) {
        showAlert('Số tiền không đủ', `Số tiền giao dịch tối thiểu cho VIP1 là ${platformSettings.vip1.min.toLocaleString('vi-VN')} VND.`);
        return;
      }
      if (amount > platformSettings.vip1.max) {
        showAlert('Vượt hạn mức', `Số tiền giao dịch tối đa cho VIP1 là ${platformSettings.vip1.max.toLocaleString('vi-VN')} VND.`);
        return;
      }
    } else if (roomId === 'VIP2') {
      if (amount < platformSettings.vip2.min) {
        showAlert('Số tiền không đủ', `Số tiền giao dịch tối thiểu cho VIP2 là ${platformSettings.vip2.min.toLocaleString('vi-VN')} VND.`);
        return;
      }
      if (amount > platformSettings.vip2.max) {
        showAlert('Vượt hạn mức', `Số tiền giao dịch tối đa cho VIP2 là ${platformSettings.vip2.max.toLocaleString('vi-VN')} VND.`);
        return;
      }
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    const newOrder: Order = {
      id: Date.now().toString(),
      userId: user.id,
      time: timeStr,
      room: roomId,
      expect: state.currentExpect,
      betCode: betCode,
      amount: amount,
      status: 'pending'
    };

    if (socketRef.current) {
      socketRef.current.emit('place_order', newOrder);
    }
    
    const setState = roomId === 'VIP1' ? setVip1State : setVip2State;
    setState(prev => ({
      ...prev,
      messages: [
        {
          id: (Date.now() + 1).toString(),
          nickname: user.username,
          avatar: user.avatar,
          content: `${betCode}/${amount}`,
          addtime: timeStr,
          userId: user.id,
          isService: false
        },
        ...prev.messages
      ] as Message[]
    }));

    setBetAmount('');
    setBetCode('');
  };

  return (
    <div className="h-screen flex flex-col bg-[#e7f8ff] animate-fade-in overflow-hidden">
      <div className="bg-white p-4 text-center shadow-sm relative z-10">
        <button onClick={() => setView('home')} className="absolute left-4 top-1/2 -translate-y-1/2 p-2">
          <ChevronLeft className="text-gray-600" />
        </button>
        <span className="absolute right-4 top-4 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{roomId}</span>
        <div className="flex justify-center gap-2 mb-2">
          {state.symbols.map((s, i) => (
            <React.Fragment key={i}>
              <div className="w-12 h-12 bg-[#f0f4f8] border border-[#d1e3f0] rounded-lg flex items-center justify-center font-bold text-lg text-[#00aaff] shadow-inner">
                {s}
              </div>
              {i < 2 && <span className="text-xl font-bold text-gray-300 self-center">+</span>}
            </React.Fragment>
          ))}
          <span className="text-xl font-bold text-gray-300 self-center">=</span>
          <div className="w-16 h-12 bg-[#fffae6] border border-[#ffe58f] rounded-lg flex items-center justify-center font-bold text-lg text-[#d48806] shadow-inner">
            {state.result}
          </div>
        </div>
        <div className="text-xs text-gray-500">
          {state.isRunning ? 'Đang tổng kết dữ liệu...' : <>Phiên đang mở: <b className="text-[#ef73ac] text-sm">{state.timeLeft}</b> giây</>}
        </div>
      </div>

      <div 
        className={`bg-white border-b transition-all duration-300 overflow-hidden ${isHistoryExpanded ? 'h-64' : 'h-10'}`}
        onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
      >
        <table className="w-full text-[10px] text-center">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="py-2">Thời gian</th>
              <th>Kỳ</th>
              <th>Kết quả</th>
            </tr>
          </thead>
          <tbody>
            {state.history.map((h, i) => (
              <tr key={i} className="border-b border-gray-50">
                <td className="py-1.5 text-gray-500">{h.time}</td>
                <td className="text-gray-400">{h.expect}</td>
                <td className="font-bold text-gray-700">{h.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!isHistoryExpanded && state.history.length === 0 && (
          <div className="text-center py-2 text-[10px] text-gray-400">Chưa có lịch sử phiên</div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse gap-4">
        {state.messages.map((msg) => {
          const isService = msg.isService;
          return (
            <div key={msg.id} className={`flex ${isService ? 'flex-row-reverse' : 'flex-row'} items-start gap-2`}>
              <div className={`w-10 h-10 rounded-full overflow-hidden border-2 bg-white shadow-sm ${isService ? 'border-[#61bce9]' : 'border-white'}`}>
                <img src={msg.avatar} className="w-full h-full object-cover" alt="Avatar" />
              </div>
              <div className={`max-w-[75%] ${isService ? 'text-right' : 'text-left'}`}>
                <div className="text-[10px] text-gray-400 mb-1">{msg.nickname} • {msg.addtime}</div>
                <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                  isService 
                    ? 'shimmer-bg text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                }`}>
                  <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white p-3 flex gap-2 border-t pb-[calc(12px+env(safe-area-inset-bottom))]">
        <select 
          value={betCode}
          onChange={(e) => setBetCode(e.target.value)}
          className="w-24 h-10 border border-gray-200 rounded-lg text-sm px-2 outline-none focus:border-[#61bce9]"
        >
          <option value="">Chọn mã</option>
          {CODES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input 
          type="number" 
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          placeholder="Số tiền cược..." 
          className="flex-1 h-10 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-[#61bce9]" 
        />
        <button 
          onClick={handleBet}
          className="bg-[#61bce9] text-white px-4 rounded-lg font-bold text-sm active:scale-95 transition-transform"
        >
          Xác nhận
        </button>
      </div>
    </div>
  );
};

interface MarketViewProps {
  vip1State: RoomState;
  vip2State: RoomState;
}

const MarketView = ({ vip1State, vip2State }: MarketViewProps) => {
  const [activeTab, setActiveTab] = useState<'VIP1' | 'VIP2'>('VIP1');
  const history = activeTab === 'VIP1' ? vip1State.history : vip2State.history;

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
            <ChevronRight className="text-gray-300 w-4 h-4" />
          </button>
        ))}
      </div>
    </div>
  );
};

interface DepositViewProps {
  user: any;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  setView: React.Dispatch<React.SetStateAction<ViewType>>;
  showAlert: (title: string, msg: string, type?: 'success' | 'error') => void;
  socketRef: React.MutableRefObject<any>;
}

const DepositView = ({ user, setBalance, setView, showAlert, socketRef }: DepositViewProps) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDeposit = () => {
    if (!amount) {
      showAlert('Thiếu thông tin', 'Vui lòng nhập số tiền bạn muốn nạp.');
      return;
    }

    const numAmount = parseFloat(amount);
    if (numAmount < 100000) {
      showAlert('Không hợp lệ', 'Số tiền nạp tối thiểu là 100.000 VND.');
      return;
    }

    setIsLoading(true);
    
    const txData = {
      id: 'DP' + Date.now(),
      userId: user.id,
      username: user.username,
      type: 'deposit',
      amount: numAmount,
      time: new Date().toLocaleString('vi-VN')
    };

    if (socketRef.current) {
      socketRef.current.emit('request_transaction', txData);
    }

    setTimeout(() => {
      setIsLoading(false);
      showAlert('Gửi yêu cầu thành công', 'Yêu cầu nạp tiền của bạn đã được gửi đi. Vui lòng chờ Admin phê duyệt.', 'success');
      setAmount('');
      setView('home');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white animate-fade-in">
      <div className="h-16 flex items-center px-4 border-b">
        <button onClick={() => setView('home')} className="p-2 mr-2"><ChevronLeft /></button>
        <h2 className="font-bold text-lg">Nạp tiền trực tuyến</h2>
      </div>
      <div className="p-6">
        <div className="bg-gradient-to-b from-[#f7e5cd] to-[#fff5e9] p-6 rounded-2xl mb-6">
          <label className="block text-sm font-bold text-[#87551d] mb-3">Nhập số tiền nạp (VNĐ)</label>
          <div className="bg-[#e9d4b8] rounded-xl p-4 flex items-center">
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Vui lòng điền số tiền nạp" 
              className="bg-transparent border-none outline-none w-full text-lg font-bold text-[#87551d]" 
            />
          </div>
        </div>

        <div className="bg-[#fffbef] border-l-4 border-[#fcc419] p-5 rounded-2xl mb-8">
          <div className="flex items-center gap-2 text-[#856404] font-black mb-4">
            <ShieldCheck className="w-5 h-5" /> XÁC NHẬN NẠP TIỀN
          </div>
          <div className="space-y-4">
            {[
              'Nhấn vào dịch vụ khách hàng trực tuyến, Nhận thông tin tài khoản ngân hàng.',
              'Sau khi nhận thông tin ngân hàng, chủ tài khoản có thể giao dịch tùy hạn mức.',
              'Sau khi chuyển khoản thành công, gửi ảnh chuyển khoản lên dịch vụ khách hàng.',
              'Quay trở lại trang chủ và mục nạp tiền nhập số tiền đúng với biên lai giao dịch.'
            ].map((text, i) => (
              <div key={i} className="flex gap-3 text-xs text-[#6d4c41] leading-relaxed">
                <span className="w-5 h-5 bg-[#fcc419] text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">{i+1}</span>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={handleDeposit}
          disabled={isLoading}
          className="w-full h-14 bg-gradient-to-r from-[#0061ff] to-[#60efff] rounded-2xl text-white font-black text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            'GỬI YÊU CẦU NẠP'
          )}
        </button>
      </div>
    </div>
  );
};

interface WithdrawViewProps {
  user: any;
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  setView: React.Dispatch<React.SetStateAction<ViewType>>;
  showAlert: (title: string, msg: string, type?: 'success' | 'error') => void;
  socketRef: React.MutableRefObject<any>;
}

const WithdrawView = ({ user, balance, setBalance, setView, showAlert, socketRef }: WithdrawViewProps) => {
  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankUser, setBankUser] = useState('');
  const [money, setMoney] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user.bankName) setBankName(user.bankName);
    if (user.bankAccount) setBankAccount(user.bankAccount);
    if (user.bankOwner) setBankUser(user.bankOwner);
  }, [user]);

  const handleWithdraw = () => {
    if (user.withdrawBlockStatus === 'incomplete_balance') {
      showAlert('Thông báo', 'số dư chưa được hoàn thành xin mời quay lại bộ phận cskh để biết thêm chi tiết!');
      return;
    }
    if (user.withdrawBlockStatus === 'blocked') {
      showAlert('Thông báo', 'Tài khoản của quý khách đã bị chặn rút tiền để biết thêm chi tiết vui lòng liên hệ bộ phận cskh để biết thêm chi tiết!');
      return;
    }
    if (!bankName) {
      showAlert('Thiếu thông tin', 'Vui lòng nhập tên ngân hàng của bạn.');
      return;
    }
    if (!bankAccount) {
      showAlert('Thiếu thông tin', 'Vui lòng nhập số tài khoản ngân hàng.');
      return;
    }
    if (!bankUser) {
      showAlert('Thiếu thông tin', 'Vui lòng nhập họ tên chủ tài khoản.');
      return;
    }
    if (!money) {
      showAlert('Thiếu thông tin', 'Vui lòng nhập số tiền bạn muốn rút.');
      return;
    }

    const numMoney = parseFloat(money);
    if (numMoney < 2000000) {
      showAlert('Không hợp lệ', 'Số tiền rút tối thiểu là 2.000.000 VND.');
      return;
    }
    if (numMoney > 500000000) {
      showAlert('Vượt hạn mức', 'Số tiền rút tối đa cho một giao dịch là 500.000.000 VND.');
      return;
    }

    if (numMoney > balance) {
      showAlert('Số dư không đủ', 'Số dư khả dụng của bạn không đủ để thực hiện giao dịch này.');
      return;
    }

    setIsLoading(true);

    const txData = {
      id: 'WD' + Date.now(),
      userId: user.id,
      username: user.username,
      type: 'withdraw',
      amount: numMoney,
      time: new Date().toLocaleString('vi-VN'),
      bankName,
      bankAccount,
      bankOwner: bankUser
    };

    if (socketRef.current) {
      socketRef.current.emit('request_transaction', txData);
    }

    setBalance(prev => prev - numMoney);

    setTimeout(() => {
      setIsLoading(false);
      showAlert('Gửi yêu cầu thành công', 'Yêu cầu rút tiền đang được hệ thống phê duyệt. Vui lòng kiểm tra lịch sử giao dịch sau vài phút.', 'success');
      setMoney('');
      setView('home');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] animate-fade-in relative">
      <header className="bg-gradient-to-br from-[#e11d48] to-[#be123c] text-white h-14 flex items-center px-4 sticky top-0 z-50 shadow-md">
        <button onClick={() => setView('home')} className="p-2 -ml-2 active:opacity-60 transition-opacity">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold pr-6">Rút Tiền</h1>
      </header>

      <main className="flex-1 p-4 max-w-md mx-auto w-full">
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6 space-y-4 border border-slate-100">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-50">
            <div className="w-1.5 h-6 bg-rose-500 rounded-full"></div>
            <h2 className="font-bold text-slate-800 tracking-tight">Thông tin thụ hưởng</h2>
          </div>

          <div className="space-y-4">
            <div className="group">
              <label className="block text-xs font-medium text-slate-500 mb-1 ml-1">Ngân hàng</label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:border-rose-500 focus-within:ring-4 focus-within:ring-rose-500/10 transition-all">
                <input 
                  type="text" 
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="bg-transparent w-full text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400 placeholder:font-normal" 
                  placeholder="Nhập tên ngân hàng (VD: Vietcombank)"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-medium text-slate-500 mb-1 ml-1">Số tài khoản</label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:border-rose-500 focus-within:ring-4 focus-within:ring-rose-500/10 transition-all">
                <input 
                  type="text" 
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  className="bg-transparent w-full text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400 placeholder:font-normal" 
                  placeholder="Nhập số tài khoản ngân hàng"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-medium text-slate-500 mb-1 ml-1">Tên chủ tài khoản</label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:border-rose-500 focus-within:ring-4 focus-within:ring-rose-500/10 transition-all">
                <input 
                  type="text" 
                  value={bankUser}
                  onChange={(e) => setBankUser(e.target.value)}
                  className="bg-transparent w-full text-sm font-semibold text-slate-700 uppercase outline-none placeholder:text-slate-400 placeholder:font-normal" 
                  placeholder="HỌ VÀ TÊN KHÔNG DẤU"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6 border border-slate-100">
          <div className="flex items-center space-x-2 pb-4">
            <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
            <h2 className="font-bold text-slate-800 tracking-tight">Số tiền rút</h2>
          </div>

          <div className="relative border-2 border-slate-100 bg-slate-50 rounded-2xl p-4 focus-within:border-rose-500 transition-all flex items-center">
            <span className="text-2xl font-bold text-slate-400 mr-2">₫</span>
            <input 
              type="number" 
              value={money}
              onChange={(e) => setMoney(e.target.value)}
              className="bg-transparent w-full text-2xl font-bold text-slate-800 outline-none placeholder:text-slate-300" 
              placeholder="0"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-3 italic px-1">* Hạn mức: 2.000.000 - 500.000.000 VND</p>
        </div>

        <button 
          onClick={handleWithdraw}
          disabled={isLoading}
          className={`w-full py-4 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-bold rounded-2xl transition-all shadow-lg shadow-rose-200 flex items-center justify-center space-x-2 mb-8 ${isLoading ? 'opacity-80' : ''}`}
        >
          {!isLoading ? (
            <span>Xác nhận rút tiền</span>
          ) : (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
        </button>

        <div className="bg-slate-100 rounded-2xl p-5 border border-slate-200">
          <h3 className="flex items-center text-slate-700 font-bold mb-3 text-sm">
            <Info className="h-5 w-5 mr-2 text-rose-500" />
            Lưu ý quan trọng
          </h3>
          <ul className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <li className="flex items-start">
              <span className="font-bold mr-2 text-rose-500">01.</span>
              <span>Vui lòng kiểm tra kỹ thông tin ngân hàng thụ hưởng. Hệ thống không chịu trách nhiệm nếu sai sót thông tin từ phía người dùng.</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2 text-rose-500">02.</span>
              <span>Một giao dịch thực hiện rút tiền không vượt quá hạn mức tối đa <b className="text-slate-800 font-semibold">500.000.000 VND</b>.</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2 text-rose-500">03.</span>
              <span>Lệnh rút thường được xử lý trong 3-5 phút. Nếu quá thời gian trên, hãy liên hệ CSKH 24/7 để được hỗ trợ.</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

interface DepositHistoryViewProps {
  transactions: any[];
  user: any;
  setView: React.Dispatch<React.SetStateAction<ViewType>>;
}

const DepositHistoryView = ({ transactions, user, setView }: DepositHistoryViewProps) => {
  const depositHistory = transactions.filter(t => t.userId === user.id && t.type === 'deposit');
  
  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      <div className="bg-white p-4 flex items-center shadow-sm sticky top-0 z-50">
        <button onClick={() => setView('profile')} className="p-2">
          <ChevronLeft className="text-gray-600" />
        </button>
        <h1 className="flex-1 text-center font-bold text-gray-800 pr-8">Lịch Sử Nạp Tiền</h1>
      </div>

      <div className="p-4 space-y-3">
        {depositHistory.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="text-sm font-bold text-gray-800">Nạp tiền trực tuyến</div>
                <div className="text-[10px] text-gray-400">{item.time}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-blue-600">+{item.amount.toLocaleString('vi-VN')}</div>
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
        {depositHistory.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">Chưa có giao dịch nạp tiền nào.</div>
        )}
      </div>
    </div>
  );
};

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

interface EditProfileViewProps {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  setView: React.Dispatch<React.SetStateAction<ViewType>>;
  showAlert: (title: string, msg: string, type?: 'success' | 'error') => void;
}

const EditProfileView = ({ user, setUser, setView, showAlert }: EditProfileViewProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prev: any) => ({ ...prev, avatar: reader.result as string }));
        showAlert('Thành công', 'Ảnh đại diện đã được cập nhật từ thiết bị.', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-white animate-fade-in pb-10">
      <div className="h-16 flex items-center px-4 border-b sticky top-0 bg-white z-10">
        <button onClick={() => setView('profile')} className="p-2 mr-2"><ChevronLeft /></button>
        <h2 className="font-bold text-lg">Chỉnh sửa hồ sơ</h2>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col items-center mb-10">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-blue-50 shadow-2xl overflow-hidden mb-4">
              <img src={user.avatar} className="w-full h-full object-cover" alt="Current Avatar" />
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-4 right-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
            >
              <PlusCircle className="w-6 h-6" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
          </div>
          <div className="text-center">
            <div className="font-black text-xl text-gray-800">{user.username}</div>
            <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">ID: {user.id}</div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-black text-gray-800 mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500" /> CHỌN ẢNH NGƯỜI NỔI TIẾNG
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {FAMOUS_AVATARS.map((avatar, i) => (
              <button 
                key={i}
                onClick={() => {
                  setUser((prev: any) => ({ ...prev, avatar: avatar.url }));
                  showAlert('Thành công', `Đã đổi ảnh đại diện thành ${avatar.name}.`, 'success');
                }}
                className="relative aspect-square rounded-2xl overflow-hidden border-2 border-transparent active:border-blue-500 transition-all shadow-sm"
              >
                <img src={avatar.url} className="w-full h-full object-cover" alt={avatar.name} />
                <div className="absolute inset-0 bg-black/20 opacity-0 active:opacity-100 transition-opacity flex items-center justify-center">
                  <ShieldCheck className="text-white w-6 h-6" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-14 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center gap-3 text-gray-500 font-bold text-sm active:bg-gray-100 transition-all"
        >
          <PlusCircle className="w-5 h-5" /> Tải ảnh từ điện thoại
        </button>
      </div>
    </div>
  );
};

interface ChatViewProps {
  user: any;
  isAdmin: boolean;
  isChatOpen: boolean;
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
  allChatMessages: Message[];
  setAllChatMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  selectedChatUserId: string | null;
  setSelectedChatUserId: React.Dispatch<React.SetStateAction<string | null>>;
  socketRef: React.MutableRefObject<any>;
  registeredUsers: any[];
}

const ChatView = ({ 
  user, 
  isAdmin, 
  isChatOpen, 
  setIsChatOpen, 
  allChatMessages, 
  setAllChatMessages, 
  selectedChatUserId, 
  setSelectedChatUserId,
  socketRef,
  registeredUsers
}: ChatViewProps) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentChatMessages = isAdmin 
    ? (selectedChatUserId ? allChatMessages.filter(m => m.userId === selectedChatUserId || m.userId === 'all') : [])
    : allChatMessages.filter(m => m.userId === user.id || m.userId === 'all');

  useEffect(() => {
    if (isAdmin && selectedChatUserId) {
      if (socketRef.current) {
        socketRef.current.emit('mark_messages_read', { userId: selectedChatUserId });
      }
    }
  }, [selectedChatUserId, isAdmin]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [allChatMessages, isTyping, selectedChatUserId]);

  const handleSend = (content?: string) => {
    const messageText = content || input;
    if (!messageText.trim()) return;
    
    const targetUserId = isAdmin ? selectedChatUserId : user.id;
    if (!targetUserId) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      nickname: isAdmin ? 'CSKH MUFG' : user.username,
      avatar: isAdmin ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop' : user.avatar,
      content: messageText,
      addtime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      isService: isAdmin,
      userId: targetUserId,
      isRead: isAdmin
    };

    if (socketRef.current) {
      socketRef.current.emit('send_message', newMsg);
    }
    setInput('');

    if (!isAdmin) {
      // Check if admin has replied recently (within last 5 minutes)
      const lastAdminMsg = [...allChatMessages].reverse().find(m => m.userId === user.id && m.isService && !m.nickname.includes('Hệ thống'));
      const shouldAutoReply = !lastAdminMsg;

      if (shouldAutoReply) {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const reply: Message = {
            id: (Date.now() + 1).toString(),
            nickname: 'Hệ thống MUFG',
            avatar: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop',
            content: 'Cảm ơn bạn đã liên hệ. Chuyên viên của chúng tôi sẽ phản hồi bạn trong giây lát. Vui lòng giữ kết nối.',
            addtime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            isService: true,
            userId: user.id
          };
          if (socketRef.current) {
            socketRef.current.emit('send_message', reply);
          }
        }, 2000);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const targetUserId = isAdmin ? selectedChatUserId : user.id;
      if (!targetUserId) return;

      const reader = new FileReader();
      reader.onload = () => {
        const newMsg: Message = {
          id: Date.now().toString(),
          nickname: isAdmin ? 'CSKH MUFG' : user.username,
          avatar: isAdmin ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop' : user.avatar,
          content: `[Hình ảnh]`,
          addtime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          isService: isAdmin,
          userId: targetUserId,
          isRead: isAdmin
        };
        setAllChatMessages(prev => [...prev, newMsg]);
        
        if (!isAdmin) {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            const reply: Message = {
              id: (Date.now() + 1).toString(),
              nickname: 'Hệ thống MUFG',
              avatar: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop',
              content: 'Chúng tôi đã nhận được hình ảnh của bạn. Vui lòng chờ trong giây lát để chuyên viên kiểm tra.',
              addtime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
              isService: true,
              userId: user.id
            };
            setAllChatMessages(prev => [...prev, reply]);
          }, 1500);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AnimatePresence>
      {isChatOpen && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 100 }}
          className="fixed bottom-20 right-4 left-4 sm:left-auto sm:right-6 sm:w-[380px] h-[500px] bg-white rounded-[24px] shadow-2xl z-[500] flex flex-col overflow-hidden border border-gray-100"
        >
          <div className="h-14 bg-white border-b flex items-center px-4 shadow-sm shrink-0">
            <div className="flex items-center gap-3 flex-1">
              {isAdmin && selectedChatUserId && (
                <button onClick={() => setSelectedChatUserId(null)} className="p-1 -ml-2 hover:bg-gray-50 rounded-full transition-colors">
                  <ChevronLeft className="w-5 h-5 text-gray-400" />
                </button>
              )}
              <div className="relative">
                <div className="w-9 h-9 rounded-full border border-gray-100 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop" className="w-full h-full object-cover" alt="CSKH" />
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <div className="text-gray-900 font-bold text-[14px] leading-tight">
                  {isAdmin ? (selectedChatUserId ? `Hỗ trợ: ${selectedChatUserId}` : 'Danh sách hỗ trợ') : 'Hỗ trợ trực tuyến'}
                </div>
                <div className="text-gray-400 text-[10px]">Đang hoạt động</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-blue-600">
              <button className="p-1 hover:bg-gray-50 rounded-full transition-colors"><Phone className="w-4 h-4" /></button>
              <button className="p-1 hover:bg-gray-50 rounded-full transition-colors" onClick={() => setIsChatOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
          </div>

          {isAdmin && !selectedChatUserId ? (
            <div className="flex-1 overflow-y-auto bg-gray-50">
              <div className="p-4 space-y-2">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Danh sách khách hàng</div>
                {registeredUsers.filter(u => u.username !== 'admin').map(u => {
                  const lastMsg = [...allChatMessages].reverse().find(m => m.userId === u.id);
                  const unreadCount = allChatMessages.filter(m => m.userId === u.id && !m.isService && !m.isRead).length;
                  
                  return (
                    <button 
                      key={u.id} 
                      onClick={() => setSelectedChatUserId(u.id)}
                      className="w-full bg-white p-3 rounded-xl flex items-center gap-3 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 flex-shrink-0">
                        <img src={u.avatar} className="w-full h-full object-cover" alt="User" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                          <div className="font-bold text-sm text-gray-900 truncate">{u.username}</div>
                          <div className="text-[9px] text-gray-400">{lastMsg?.addtime || 'Mới'}</div>
                        </div>
                        <div className="text-xs text-gray-500 truncate">{lastMsg?.content || 'Chưa có tin nhắn'}</div>
                      </div>
                      {unreadCount > 0 && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                          {unreadCount}
                        </div>
                      )}
                    </button>
                  );
                })}
                {registeredUsers.filter(u => u.username !== 'admin').length === 0 && (
                  <div className="text-center py-10 text-gray-400 text-sm">Chưa có khách hàng nào đăng ký.</div>
                )}
              </div>
            </div>
          ) : (
            <>
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-white scrollbar-hide">
                <div className="flex flex-col items-center py-6 space-y-2">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-50 shadow-sm mb-1">
                    <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop" className="w-full h-full object-cover" alt="CSKH" />
                  </div>
                  <h3 className="font-bold text-base">Hệ thống MUFG</h3>
                  <p className="text-[10px] text-gray-400">Messenger • Bạn đang trò chuyện với CSKH</p>
                </div>

                {currentChatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isService ? 'justify-start' : 'justify-end'} items-end gap-2`}>
                    {msg.isService && (
                      <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mb-1">
                        <img src={msg.avatar} className="w-full h-full object-cover" alt="Avatar" />
                      </div>
                    )}
                    <div className={`max-w-[80%] ${msg.isService ? '' : 'flex flex-col items-end'}`}>
                      <div className={`p-2.5 rounded-[18px] text-[13px] leading-snug ${
                        msg.isService 
                          ? 'bg-gray-100 text-gray-900' 
                          : 'bg-[#0084ff] text-white'
                      }`}>
                        {msg.content}
                      </div>
                      <div className="text-[9px] text-gray-300 mt-0.5 px-1">
                        {msg.addtime}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start items-end gap-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mb-1">
                      <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop" className="w-full h-full object-cover" alt="Avatar" />
                    </div>
                    <div className="bg-gray-100 p-2.5 rounded-[18px] flex gap-1 items-center">
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-2 bg-white border-t flex items-center gap-2 shrink-0">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept="image/*"
                />
                
                {!input.trim() && (
                  <div className="flex items-center gap-1.5 text-blue-600">
                    <PlusCircle className="w-5 h-5 cursor-pointer active:scale-90 transition-transform" />
                    <Camera className="w-5 h-5 cursor-pointer active:scale-90 transition-transform" onClick={() => fileInputRef.current?.click()} />
                    <Image className="w-5 h-5 cursor-pointer active:scale-90 transition-transform" onClick={() => fileInputRef.current?.click()} />
                  </div>
                )}
                
                {input.trim() && (
                  <div className="flex items-center text-blue-600">
                    <ChevronRight className="w-5 h-5 cursor-pointer active:scale-90 transition-transform" />
                  </div>
                )}

                <div className="flex-1 bg-gray-100 rounded-full px-3 py-1.5 flex items-center">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Aa" 
                    className="bg-transparent border-none outline-none text-gray-900 w-full text-[13px]" 
                  />
                  <Smile className="w-4 h-4 text-blue-600 ml-1 cursor-pointer active:scale-90 transition-transform" />
                </div>

                <div className="flex items-center justify-center min-w-[32px]">
                  {input.trim() ? (
                    <button 
                      onClick={() => handleSend()}
                      className="text-blue-600 active:scale-90 transition-transform p-1"
                    >
                      <SendHorizontal className="w-5 h-5" />
                    </button>
                  ) : (
                    <ThumbsUp 
                      className="w-5 h-5 text-blue-600 p-1 cursor-pointer active:scale-90 transition-transform" 
                      onClick={() => handleSend('👍')}
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AboutView = ({ setView }: { setView: React.Dispatch<React.SetStateAction<ViewType>> }) => (
  <div className="min-h-screen bg-white animate-fade-in pb-10">
    <div className="h-16 flex items-center px-4 border-b sticky top-0 bg-white z-10">
      <button onClick={() => setView('home')} className="p-2 mr-2"><ChevronLeft /></button>
      <h2 className="font-bold text-lg">Thông tin đầu tư</h2>
    </div>
    <div className="p-6 space-y-8">
      <section>
        <h3 className="text-xl font-black text-[#c00001] mb-4 flex items-center gap-2">
          <BarChart2 className="w-6 h-6" /> THÔNG TIN NGẮN HẠN
        </h3>
        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
          <h4 className="font-bold text-gray-800 mb-3">Đầu tư tài chính ngắn hạn là gì?</h4>
          <div className="space-y-4 text-sm text-gray-600 leading-relaxed text-justify">
            <p>
              Đầu tư tài chính ngắn hạn là loại đầu tư mà người đầu tư đặt các khoản tiền vào các tài sản có thể chuyển đổi hoặc bán nhanh chóng trong vòng từ vài ngày đến một năm để kiếm lời. Mục đích của đầu tư tài chính ngắn hạn thường là tăng thu nhập và đẩy lùi rủi ro tài chính. Các loại đầu tư tài chính ngắn hạn phổ biến bao gồm chứng khoán, tiền gửi ngân hàng và các sản phẩm tài chính khác.
            </p>
            <p>
              Trái ngược với những rủi ro đầu tư tài chính dài hạn mang lại, đầu tư tài chính ngắn hạn là một công cụ phù hợp để nhà đầu tư thu hồi vốn, luân chuyển dòng tiền và thu được lợi nhuận nhanh chóng. Nó thích hợp với các mục tiêu tài chính ngắn hạn như du lịch, mua sắm hay quỹ dự phòng tài chính. Bởi vì, đầu tư tài chính ngắn hạn có tính thanh khoản cao và dễ dàng chuyển đổi thành tiền mặt trong thời gian ngắn.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-black text-[#c00001] mb-4 flex items-center gap-2">
          <Coins className="w-6 h-6" /> THÔNG TIN QUỸ MỞ
        </h3>
        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
          <h4 className="font-bold text-gray-800 mb-3">Quỹ mở là một dạng quỹ tương hỗ:</h4>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 mb-6">
            <li>Là quỹ đầu tư do các nhà đầu tư có cùng mục đích đầu tư góp vốn</li>
            <li>Được quản lý bởi công ty quản lý quỹ chuyên nghiệp</li>
          </ul>

          <h4 className="font-bold text-gray-800 mb-3">Đặc điểm của Quỹ mở:</h4>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 mb-6">
            <li>Không bị hạn chế về số lượng nhà đầu tư tham gia quỹ và không bị hạn chế về thời hạn của quỹ</li>
            <li>Quỹ mở cho phép nhà đầu tư có thể bán lại chứng chỉ quỹ vào bất cứ ngày giao dịch nào của quỹ với giá bằng giá trị NAV trên 1 đơn vị quỹ, phản ánh trực tiếp hiệu quả đầu tư của quỹ.</li>
          </ul>

          <h4 className="font-bold text-gray-800 mb-3">Loại hình quỹ mở:</h4>
          <p className="text-sm text-gray-600 mb-6">
            Quỹ mở được phân loại theo tài sản đầu tư chính của quỹ, bao gồm quỹ thị trường tiền tệ, quỹ trái phiếu hoặc quỹ thu nhập cố định, quỹ cổ phần, quỹ lai hỗn hợp
          </p>

          <h4 className="font-bold text-gray-800 mb-3">Quỹ mở dành cho ai?</h4>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 mb-6">
            <li>Nhà đầu tư có tiền nhàn rỗi, muốn đầu tư dài hạn nhưng lại bận rộn và không có thời gian theo sát diễn biến thị trường</li>
            <li>Nhà đầu tư mong muốn có quản lý đầu tư chuyên nghiệp, đảm bảo kỷ luật đầu tư</li>
            <li>Nhà đầu tư mong muốn có danh mục đầu tư đa dạng, giảm thiểu rủi ro mà vẫn tối đa hóa lợi nhuận</li>
            <li>Nhà đầu tư mong muốn hình thức đầu tư thuận tiện, dễ dàng cho việc giao dịch</li>
          </ul>

          <h4 className="font-bold text-gray-800 mb-3">Lợi thế khi đầu tư vào Quỹ mở:</h4>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 mb-6">
            <li>Lợi nhuận kỳ vọng cao trong dài hạn</li>
            <li>Vốn đầu tư phù hợp với nhiều nhà đầu tư</li>
            <li>Được quản lý bởi công ty quản lý đầu tư chuyên nghiệp</li>
            <li>Thanh khoản cao, linh hoạt</li>
            <li>Minh bạch, dễ đầu tư, dễ theo dõi</li>
          </ul>
        </div>
      </section>
    </div>
  </div>
);

interface AdminViewProps {
  registeredUsers: any[];
  setRegisteredUsers: React.Dispatch<React.SetStateAction<any[]>>;
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  setView: React.Dispatch<React.SetStateAction<ViewType>>;
  platformSettings: any;
  setPlatformSettings: React.Dispatch<React.SetStateAction<any>>;
  showAlert: (title: string, msg: string, type?: 'success' | 'error') => void;
  vip1State: RoomState;
  setVip1State: React.Dispatch<React.SetStateAction<RoomState>>;
  vip2State: RoomState;
  setVip2State: React.Dispatch<React.SetStateAction<RoomState>>;
  socketRef: React.MutableRefObject<any>;
  setSelectedChatUserId: React.Dispatch<React.SetStateAction<string | null>>;
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
  transactions: any[];
  allChatMessages: Message[];
}

const AdminView = ({ 
  registeredUsers, 
  setRegisteredUsers, 
  user, 
  setUser, 
  setBalance, 
  setView, 
  platformSettings, 
  setPlatformSettings, 
  showAlert,
  vip1State,
  setVip1State,
  vip2State,
  setVip2State,
  socketRef,
  setSelectedChatUserId,
  setIsChatOpen,
  transactions,
  allChatMessages
}: AdminViewProps) => {
  const [editingUser, setEditingUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'users' | 'platform' | 'results' | 'transactions'>('users');
  const [selectedTxUserId, setSelectedTxUserId] = useState<string | null>(null);
  const [sourceTab, setSourceTab] = useState<'users' | 'transactions'>('transactions');

  useEffect(() => {
    if (activeTab === 'transactions' && selectedTxUserId && socketRef.current) {
      socketRef.current.emit('mark_user_transactions_read', { userId: selectedTxUserId });
    }
    if (activeTab !== 'transactions' && activeTab !== 'users') {
      setSelectedTxUserId(null);
    }
  }, [activeTab, selectedTxUserId]);

  // Clear selected user if they are deleted
  useEffect(() => {
    if (selectedTxUserId && !registeredUsers.find(u => u.id === selectedTxUserId)) {
      setSelectedTxUserId(null);
    }
  }, [registeredUsers, selectedTxUserId]);

  const handleUpdateUser = (updatedUser: any) => {
    if (socketRef.current) {
      socketRef.current.emit('update_user', updatedUser);
    }
    setEditingUser(null);
    showAlert('Thành công', 'Cập nhật thông tin khách hàng thành công.', 'success');
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này và TOÀN BỘ lịch sử của khách hàng không?')) {
      console.log('Emitting delete_user for:', userId);
      if (socketRef.current) {
        socketRef.current.emit('delete_user', { userId });
        showAlert('Thành công', 'Đã gửi yêu cầu xóa tài khoản. Hệ thống đang xử lý...', 'success');
      }
    }
  };

  const handleApproveTx = (id: string) => {
    if (socketRef.current) {
      socketRef.current.emit('approve_transaction', { id });
      showAlert('Thành công', 'Đã duyệt giao dịch.', 'success');
    }
  };

  const handleRejectTx = (id: string) => {
    if (socketRef.current) {
      socketRef.current.emit('reject_transaction', { id });
      showAlert('Thành công', 'Đã từ chối giao dịch.', 'success');
    }
  };

  const handleDeleteTx = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch sử giao dịch này không?')) {
      if (socketRef.current) {
        socketRef.current.emit('delete_transaction', { id });
        showAlert('Thành công', 'Đã xóa lịch sử giao dịch.', 'success');
      }
    }
  };

  const handleDeleteUserTxs = (userId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa TẤT CẢ lịch sử giao dịch của khách hàng này không?')) {
      console.log('Emitting delete_user_transactions for:', userId);
      if (socketRef.current) {
        socketRef.current.emit('delete_user_transactions', { userId });
        showAlert('Thành công', 'Đã gửi yêu cầu xóa lịch sử giao dịch.', 'success');
        setSelectedTxUserId(null);
      }
    }
  };

  const handleDeleteAllTxs = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa TOÀN BỘ lịch sử giao dịch của TẤT CẢ khách hàng không?')) {
      if (socketRef.current) {
        socketRef.current.emit('delete_all_transactions');
        showAlert('Thành công', 'Đã xóa toàn bộ lịch sử giao dịch hệ thống.', 'success');
      }
    }
  };

  const handleUpdatePlatform = (e: React.FormEvent) => {
    e.preventDefault();
    if (socketRef.current) {
      socketRef.current.emit('update_platform_settings', platformSettings);
    }
    showAlert('Thành công', 'Cập nhật dữ liệu nền tảng thành công.', 'success');
  };

  const generateFutureResults = (roomId: 'VIP1' | 'VIP2') => {
    const results = Array.from({ length: 50 }, () => CODES[Math.floor(Math.random() * CODES.length)]);
    if (roomId === 'VIP1') {
      setVip1State(prev => ({ ...prev, futureResults: results }));
    } else {
      setVip2State(prev => ({ ...prev, futureResults: results }));
    }
    if (socketRef.current) {
      socketRef.current.emit('update_future_results', { roomId, results });
    }
    showAlert('Thành công', `Đã tạo 50 kết quả tương lai cho phòng ${roomId}.`, 'success');
  };

  const downloadResults = (roomId: 'VIP1' | 'VIP2') => {
    const state = roomId === 'VIP1' ? vip1State : vip2State;
    if (!state.futureResults || state.futureResults.length === 0) {
      showAlert('Lỗi', 'Chưa có kết quả tương lai để tải xuống.');
      return;
    }

    const startExpect = parseInt(state.currentExpect);
    const content = state.futureResults.map((res, i) => `Phiên: ${startExpect + i} - Kết quả: ${res}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KetQuaTuongLai_${roomId}_${state.currentExpect}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pb-24 animate-fade-in bg-gray-50 min-h-screen">
      <div className="bg-slate-900 pt-8 pb-12 px-6 rounded-b-[40px] shadow-lg relative">
        <button 
          onClick={() => setView('home')}
          className="absolute top-8 left-6 w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white active:scale-90 transition-transform"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white font-bold text-xl mb-4 uppercase tracking-widest text-center">QUẢN TRỊ HỆ THỐNG</h1>
        <div className="flex bg-white/10 p-1 rounded-2xl backdrop-blur-md max-w-sm mx-auto overflow-x-auto scrollbar-hide">
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'users' ? 'bg-white text-slate-900' : 'text-white'}`}
          >
            Khách hàng {allChatMessages.filter(m => !m.isService && !m.isRead && m.userId !== 'all').length > 0 && `(${allChatMessages.filter(m => !m.isService && !m.isRead && m.userId !== 'all').length})`}
          </button>
          <button 
            onClick={() => setActiveTab('transactions')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'transactions' ? 'bg-white text-slate-900' : 'text-white'}`}
          >
            Giao dịch {transactions.filter(t => !t.isRead).length > 0 && `(${transactions.filter(t => !t.isRead).length})`}
          </button>
          <button 
            onClick={() => setActiveTab('platform')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'platform' ? 'bg-white text-slate-900' : 'text-white'}`}
          >
            Nền tảng
          </button>
          <button 
            onClick={() => setActiveTab('results')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'results' ? 'bg-white text-slate-900' : 'text-white'}`}
          >
            Kết quả
          </button>
        </div>
      </div>

      <div className="mx-5 -mt-6">
        {activeTab === 'users' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2 ml-1">
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Danh sách khách hàng</div>
              {transactions.length > 0 && (
                <button 
                  onClick={handleDeleteAllTxs}
                  className="flex items-center gap-1 text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-50 px-2 py-1 rounded-lg active:scale-95 transition-all"
                >
                  <Trash2 className="w-3 h-3" /> Xóa tất cả lịch sử
                </button>
              )}
            </div>
            {registeredUsers.filter(u => u.username !== 'admin').map((u) => (
              <div key={u.id} className="bg-white rounded-3xl p-5 shadow-xl border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-100">
                      <img src={u.avatar} className="w-full h-full object-cover" alt="Avatar" />
                    </div>
                    {u.isVirtual && (
                      <div className="absolute -top-1 -right-1 bg-purple-600 text-[8px] text-white px-1.5 py-0.5 rounded-full font-black uppercase shadow-sm">Ảo</div>
                    )}
                  </div>
                  <div>
                    <div className="font-black text-gray-800 flex items-center gap-2">
                      {u.username}
                      {u.isBetBlocked && <ShieldAlert className="w-3 h-3 text-red-500" />}
                      {u.withdrawBlockStatus !== 'none' && <Wallet className="w-3 h-3 text-orange-500" />}
                    </div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ID: {u.id} • {u.vip}</div>
                    {u.referredBy && (
                      <div className="text-[9px] text-orange-500 font-bold">Mã mời: {u.referredBy}</div>
                    )}
                    <div className="text-sm font-bold text-blue-600 mt-1">{u.balance.toLocaleString('vi-VN')} VND</div>
                  </div>
                </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setSelectedTxUserId(u.id);
                        setSourceTab('users');
                        setActiveTab('transactions');
                      }}
                      className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center active:scale-90 transition-transform"
                    >
                      <History className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteUserTxs(u.id)}
                      className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center active:scale-90 transition-transform"
                    >
                      <Receipt className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedChatUserId(u.id);
                        setIsChatOpen(true);
                      }}
                      className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center active:scale-90 transition-transform"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setEditingUser({ ...u })}
                      className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center active:scale-90 transition-transform"
                    >
                      <UserPen className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(u.id)}
                      className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center active:scale-90 transition-transform"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
              </div>
            ))}
          </div>
        ) : activeTab === 'transactions' ? (
          <div className="space-y-4">
            {!selectedTxUserId ? (
              <>
                <div className="flex items-center justify-between mb-2 ml-1">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Danh sách khách hàng có giao dịch</div>
                  {transactions.length > 0 && (
                    <button 
                      onClick={handleDeleteAllTxs}
                      className="flex items-center gap-1 text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-50 px-2 py-1 rounded-lg active:scale-95 transition-all"
                    >
                      <Trash2 className="w-3 h-3" /> Xóa tất cả
                    </button>
                  )}
                </div>
                {Array.from(new Set(transactions.map(t => t.userId))).map(userId => {
                  const userTxs = transactions.filter(t => t.userId === userId);
                  const lastTx = userTxs[0];
                  const unreadCount = userTxs.filter(t => !t.isRead).length;
                  const userInfo = registeredUsers.find(u => u.id === userId);
                  
                  return (
                    <button 
                      key={userId}
                      onClick={() => setSelectedTxUserId(userId)}
                      className="w-full bg-white rounded-3xl p-5 shadow-xl border border-gray-100 flex items-center justify-between active:scale-[0.98] transition-all text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-100 bg-gray-50 flex items-center justify-center">
                          {userInfo?.avatar ? (
                            <img src={userInfo.avatar} className="w-full h-full object-cover" alt="Avatar" />
                          ) : (
                            <User className="w-6 h-6 text-gray-300" />
                          )}
                        </div>
                        <div>
                          <div className="font-black text-gray-800 flex items-center gap-2">
                            {lastTx.username}
                            {unreadCount > 0 && (
                              <span className="bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                            )}
                          </div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Tổng: {userTxs.length} giao dịch</div>
                          <div className="text-[9px] text-blue-600 font-bold mt-1 uppercase">Gần nhất: {lastTx.time}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300" />
                    </button>
                  );
                })}
                {transactions.length === 0 && (
                  <div className="text-center py-10 text-gray-400 text-sm">Chưa có giao dịch nào.</div>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4 px-1">
                  <button 
                    onClick={() => {
                      setSelectedTxUserId(null);
                      if (sourceTab === 'users') {
                        setActiveTab('users');
                      }
                    }}
                    className="flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-2.5 rounded-2xl active:scale-95 transition-all shadow-sm border border-blue-100"
                  >
                    <ChevronLeft className="w-4 h-4" /> Thoát trở lại
                  </button>
                  <button 
                    onClick={() => handleDeleteUserTxs(selectedTxUserId)}
                    className="flex items-center gap-2 text-xs font-black text-red-500 uppercase tracking-widest bg-red-50 px-4 py-2.5 rounded-2xl active:scale-95 transition-all shadow-sm border border-red-100"
                  >
                    <Trash2 className="w-4 h-4" /> Xóa lịch sử
                  </button>
                </div>
                
                <div className="bg-slate-900 rounded-3xl p-5 text-white shadow-xl mb-4 relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
                  <div className="text-[10px] font-bold uppercase opacity-60 mb-1 tracking-widest">Lịch sử giao dịch của</div>
                  <div className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                    {transactions.find(t => t.userId === selectedTxUserId)?.username || 'Khách hàng'}
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  </div>
                </div>

                {transactions.filter(t => t.userId === selectedTxUserId).map((tx) => (
                  <div key={tx.id} className="bg-white rounded-3xl p-5 shadow-xl border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${tx.type === 'deposit' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          <span className="font-black text-gray-800 uppercase text-xs">{tx.type === 'deposit' ? 'Nạp tiền' : 'Rút tiền'}</span>
                        </div>
                        <div className="text-[10px] text-gray-400 font-bold mt-1">{tx.time}</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-black ${tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.type === 'deposit' ? '+' : '-'}{tx.amount.toLocaleString('vi-VN')} VND
                        </div>
                        <div className={`text-[9px] font-bold uppercase mt-1 ${
                          tx.status === 'approved' ? 'text-green-500' : 
                          tx.status === 'rejected' ? 'text-red-500' : 'text-orange-500'
                        }`}>
                          {tx.status === 'approved' ? 'Đã duyệt' : tx.status === 'rejected' ? 'Từ chối' : 'Đang chờ'}
                        </div>
                      </div>
                    </div>
                    {tx.type === 'withdraw' && (
                      <div className="bg-gray-50 p-3 rounded-xl mb-3 text-[11px] space-y-1 border border-gray-100">
                        <div className="flex justify-between"><span className="text-gray-400">Ngân hàng:</span> <span className="font-bold text-gray-700">{tx.bankName}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Số tài khoản:</span> <span className="font-bold text-gray-700">{tx.bankAccount}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Chủ tài khoản:</span> <span className="font-bold text-gray-700">{tx.bankOwner}</span></div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      {tx.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleApproveTx(tx.id)}
                            className="flex-1 h-10 bg-green-600 text-white rounded-xl font-bold text-xs active:scale-95 transition-all"
                          >
                            Duyệt
                          </button>
                          <button 
                            onClick={() => handleRejectTx(tx.id)}
                            className="flex-1 h-10 bg-gray-100 text-gray-600 rounded-xl font-bold text-xs active:scale-95 transition-all"
                          >
                            Từ chối
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => handleDeleteTx(tx.id)}
                        className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center active:scale-95 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        ) : activeTab === 'platform' ? (
          <form onSubmit={handleUpdatePlatform} className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-800 border-l-4 border-blue-600 pl-2 uppercase">Thông báo hệ thống</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Nộp tiền</label>
                  <input 
                    type="text" 
                    value={platformSettings.announcement.depositTime}
                    onChange={(e) => setPlatformSettings((prev: any) => ({ ...prev, announcement: { ...prev.announcement, depositTime: e.target.value } }))}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Rút tiền</label>
                  <input 
                    type="text" 
                    value={platformSettings.announcement.withdrawTime}
                    onChange={(e) => setPlatformSettings((prev: any) => ({ ...prev, announcement: { ...prev.announcement, withdrawTime: e.target.value } }))}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Lời nhắn</label>
                <textarea 
                  rows={3}
                  value={platformSettings.announcement.message}
                  onChange={(e) => setPlatformSettings((prev: any) => ({ ...prev, announcement: { ...prev.announcement, message: e.target.value } }))}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-800 border-l-4 border-blue-600 pl-2 uppercase">Hạn mức VIP1</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Min</label>
                  <input 
                    type="number" 
                    value={platformSettings.vip1.min}
                    onChange={(e) => setPlatformSettings((prev: any) => ({ ...prev, vip1: { ...prev.vip1, min: parseInt(e.target.value) } }))}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Max</label>
                  <input 
                    type="number" 
                    value={platformSettings.vip1.max}
                    onChange={(e) => setPlatformSettings((prev: any) => ({ ...prev, vip1: { ...prev.vip1, max: parseInt(e.target.value) } }))}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-800 border-l-4 border-blue-600 pl-2 uppercase">Hạn mức VIP2</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Min</label>
                  <input 
                    type="number" 
                    value={platformSettings.vip2.min}
                    onChange={(e) => setPlatformSettings((prev: any) => ({ ...prev, vip2: { ...prev.vip2, min: parseInt(e.target.value) } }))}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Max</label>
                  <input 
                    type="number" 
                    value={platformSettings.vip2.max}
                    onChange={(e) => setPlatformSettings((prev: any) => ({ ...prev, vip2: { ...prev.vip2, max: parseInt(e.target.value) } }))}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl active:opacity-80 transition-opacity"
            >
              CẬP NHẬT DỮ LIỆU
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
              <h3 className="text-sm font-black text-slate-800 border-l-4 border-blue-600 pl-2 uppercase mb-4">Kết quả phòng VIP1</h3>
              <div className="flex gap-3 mb-6">
                <button 
                  onClick={() => generateFutureResults('VIP1')}
                  className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <RefreshCw className="w-4 h-4" /> Tạo 50 kết quả
                </button>
                <button 
                  onClick={() => downloadResults('VIP1')}
                  className="flex-1 py-3 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <Download className="w-4 h-4" /> Tải xuống
                </button>
              </div>
              {vip1State.futureResults && vip1State.futureResults.length > 0 ? (
                <div className="grid grid-cols-5 gap-2 max-h-[200px] overflow-y-auto pr-2 scrollbar-hide">
                  {vip1State.futureResults.map((res, i) => (
                    <div key={i} className="bg-gray-50 p-2 rounded-lg text-center">
                      <div className="text-[8px] text-gray-400 font-bold uppercase">#{parseInt(vip1State.currentExpect) + i}</div>
                      <div className="text-xs font-black text-blue-600">{res}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-400 text-xs italic">Chưa có kết quả tương lai</div>
              )}
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
              <h3 className="text-sm font-black text-slate-800 border-l-4 border-blue-600 pl-2 uppercase mb-4">Kết quả phòng VIP2</h3>
              <div className="flex gap-3 mb-6">
                <button 
                  onClick={() => generateFutureResults('VIP2')}
                  className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <RefreshCw className="w-4 h-4" /> Tạo 50 kết quả
                </button>
                <button 
                  onClick={() => downloadResults('VIP2')}
                  className="flex-1 py-3 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <Download className="w-4 h-4" /> Tải xuống
                </button>
              </div>
              {vip2State.futureResults && vip2State.futureResults.length > 0 ? (
                <div className="grid grid-cols-5 gap-2 max-h-[200px] overflow-y-auto pr-2 scrollbar-hide">
                  {vip2State.futureResults.map((res, i) => (
                    <div key={i} className="bg-gray-50 p-2 rounded-lg text-center">
                      <div className="text-[8px] text-gray-400 font-bold uppercase">#{parseInt(vip2State.currentExpect) + i}</div>
                      <div className="text-xs font-black text-blue-600">{res}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-400 text-xs italic">Chưa có kết quả tương lai</div>
              )}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 bg-black/60 z-[500] flex items-center justify-center p-6 overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl my-auto"
            >
              <h3 className="text-xl font-black text-gray-800 mb-6">Cập nhật khách hàng</h3>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Tên tài khoản</label>
                  <input 
                    type="text" 
                    defaultValue={editingUser.username}
                    onChange={(e) => editingUser.username = e.target.value}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Mật khẩu</label>
                  <input 
                    type="text" 
                    defaultValue={editingUser.password}
                    onChange={(e) => editingUser.password = e.target.value}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Số dư tài khoản</label>
                  <input 
                    type="number" 
                    defaultValue={editingUser.balance}
                    onChange={(e) => editingUser.balance = parseInt(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Cấp bậc VIP</label>
                  <select 
                    defaultValue={editingUser.vip}
                    onChange={(e) => editingUser.vip = e.target.value}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-blue-500"
                  >
                    <option value="Bronze">Bronze</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Platinum">Platinum</option>
                    <option value="Diamond">Diamond</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-700">Tài khoản ảo</span>
                    <button 
                      onClick={() => {
                        const updated = { ...editingUser, isVirtual: !editingUser.isVirtual };
                        setEditingUser(updated);
                      }}
                      className={`w-12 h-6 rounded-full transition-colors relative ${editingUser.isVirtual ? 'bg-purple-600' : 'bg-gray-200'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${editingUser.isVirtual ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-700">Chặn đặt cược</span>
                    <button 
                      onClick={() => {
                        const updated = { ...editingUser, isBetBlocked: !editingUser.isBetBlocked };
                        setEditingUser(updated);
                      }}
                      className={`w-12 h-6 rounded-full transition-colors relative ${editingUser.isBetBlocked ? 'bg-red-600' : 'bg-gray-200'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${editingUser.isBetBlocked ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Trạng thái rút tiền</label>
                    <select 
                      defaultValue={editingUser.withdrawBlockStatus}
                      onChange={(e) => {
                        const updated = { ...editingUser, withdrawBlockStatus: e.target.value };
                        setEditingUser(updated);
                      }}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-blue-500"
                    >
                      <option value="none">Bình thường</option>
                      <option value="incomplete_balance">Số dư chưa hoàn thành</option>
                      <option value="blocked">Bị chặn rút tiền</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button 
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-4 bg-gray-100 text-gray-500 font-bold rounded-2xl active:opacity-80"
                >
                  Hủy
                </button>
                <button 
                  onClick={() => handleUpdateUser(editingUser)}
                  className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl active:opacity-80"
                >
                  Lưu
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const socketRef = useRef<any>(null);
  const [view, setView] = useState<ViewType>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([
    { 
      username: 'admin', 
      password: 'admin123', 
      id: '000000', 
      vip: 'Admin', 
      balance: 9999999999, 
      avatar: 'https://cdn-icons-png.flaticon.com/512/6024/6024190.png',
      isVirtual: false,
      withdrawBlockStatus: 'none', // 'none', 'incomplete_balance', 'blocked'
      isBetBlocked: false
    }
  ]);
  const [balance, setBalance] = useState(439000000);
  const [user, setUser] = useState({
    username: 'truclinh123',
    id: '88992211',
    vip: 'Diamond',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
    isVirtual: false,
    withdrawBlockStatus: 'none',
    isBetBlocked: false
  });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [allChatMessages, setAllChatMessages] = useState<Message[]>([
    {
      id: '1',
      nickname: 'Hệ thống MUFG',
      avatar: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop',
      content: 'Chào mừng bạn đến với bộ phận CSKH trực tuyến. Bạn cần hỗ trợ gì ạ?',
      addtime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      isService: true,
      userId: 'all' // Default message for everyone
    }
  ]);
  const [selectedChatUserId, setSelectedChatUserId] = useState<string | null>(null);
  const [showChangePass, setShowChangePass] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [alert, setAlert] = useState<{ show: boolean; title: string; msg: string; type: 'success' | 'error' }>({
    show: false,
    title: '',
    msg: '',
    type: 'error'
  });

  const [platformSettings, setPlatformSettings] = useState({
    announcement: {
      depositTime: '11:00 - 00:00',
      withdrawTime: '12:00 - 00:00',
      serviceTime: '10:00 - 00:00',
      message: 'TRƯỚC KHI NỘP TIỀN VUI LÒNG VÀO DỊCH VỤ CHĂM SÓC KHÁCH HÀNG XIN SỐ TÀI KHOẢN NGÂN HÀNG'
    },
    vip1: {
      min: 100000,
      max: 500000000,
      botMin: 1000000,
      botMax: 200000000
    },
    vip2: {
      min: 150000000,
      max: 500000000,
      botMin: 150000000,
      botMax: 500000000
    }
  });

  const showAlert = (title: string, msg: string, type: 'success' | 'error' = 'error') => {
    setAlert({ show: true, title, msg, type });
  };

  const closeAlert = () => {
    setAlert(prev => ({ ...prev, show: false }));
  };

  // Trading Rooms State
  const [vip1State, setVip1State] = useState<RoomState>({
    currentExpect: '20240103201',
    timeLeft: INITIAL_TIMER,
    isRunning: false,
    symbols: ['?', '?', '?'],
    result: '?',
    history: generateMockHistory(20240103201, 100),
    messages: []
  });

  const [vip2State, setVip2State] = useState<RoomState>({
    currentExpect: '20240103501',
    timeLeft: INITIAL_TIMER,
    isRunning: false,
    symbols: ['?', '?', '?'],
    result: '?',
    history: generateMockHistory(20240103501, 100),
    messages: []
  });

  // Socket.io initialization
  useEffect(() => {

  socketRef.current = io();

  socketRef.current.on("connect", () => {

    if (user?.id) {
    socketRef.current.emit("get_initial_data", user?.id);
    socketRef.current.emit("join_room", "VIP1");
    socketRef.current.emit("join_room", "VIP2");
    }

  });

  socketRef.current.on('messages_cleaned', () => {
    if (user?.id) {
    socketRef.current.emit('get_initial_data', user?.id);
    }
  });

  return () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  };

}, [user]);


    socketRef.current.on('initial_data', (data: any) => {
      if (data.settings) {
        setPlatformSettings(data.settings);
      }
      if (data.lottery) {
        setVip1State(prev => ({ 
          ...prev, 
          timeLeft: data.lottery.vip1.timeLeft, 
          currentExpect: data.lottery.vip1.currentExpect,
          futureResults: data.lottery.vip1.futureResults 
        }));
        setVip2State(prev => ({ 
          ...prev, 
          timeLeft: data.lottery.vip2.timeLeft, 
          currentExpect: data.lottery.vip2.currentExpect,
          futureResults: data.lottery.vip2.futureResults 
        }));
      }
      setRegisteredUsers(prev => {
        const admin = prev.find(u => u.username === 'admin');
        const dbUsers = data.users || [];
        return [admin, ...dbUsers.filter((u: any) => u.username !== 'admin')];
      });
      
      if (data.messages) {
        setAllChatMessages(prev => {
          const systemMsg = prev[0];
          return [systemMsg, ...data.messages.reverse()];
        });
      }
      if (data.transactions) {
        setTransactions(data.transactions);
      }
      if (data.orders) {
        setUserOrders(data.orders);
      }
    });

    socketRef.current.on('user_registered', (userData: any) => {
      setRegisteredUsers(prev => [...prev, userData]);
    });

    socketRef.current.on('new_message', (msg: any) => {
      setAllChatMessages(prev => [...prev, msg]);
    });

    socketRef.current.on('new_transaction', (tx: any) => {
      setTransactions(prev => [tx, ...prev]);
    });

    socketRef.current.on('transaction_updated', (data: any) => {
      setTransactions(prev => prev.map(tx => tx.id === data.id ? { ...tx, status: data.status } : tx));
    });

    socketRef.current.on('transaction_deleted', (data: any) => {
      setTransactions(prev => prev.filter(tx => tx.id !== data.id));
    });

    socketRef.current.on('user_transactions_deleted', (data: any) => {
      setTransactions(prev => prev.filter(tx => tx.userId !== data.userId));
    });

    socketRef.current.on('all_transactions_deleted', () => {
      setTransactions([]);
    });

    socketRef.current.on('transactions_marked_read', () => {
      setTransactions(prev => prev.map(tx => ({ ...tx, isRead: 1 })));
    });

    socketRef.current.on('user_transactions_marked_read', (data: any) => {
      setTransactions(prev => prev.map(tx => tx.userId === data.userId ? { ...tx, isRead: 1 } : tx));
    });

    socketRef.current.on('messages_marked_read', (data: any) => {
      setAllChatMessages(prev => prev.map(m => 
        (m.userId === data.userId && !m.isService) ? { ...m, isRead: true } : m
      ));
    });

    socketRef.current.on('new_order', (order: any) => {
      setUserOrders(prev => [order, ...prev]);
    });

    socketRef.current.on('user_updated', (userData: any) => {
      setRegisteredUsers(prev => prev.map(u => u.id === userData.id ? userData : u));
      setUser(prev => {
        if (prev && prev.id === userData.id) {
          setBalance(userData.balance);
          return { ...prev, ...userData };
        }
        return prev;
      });
    });

    socketRef.current.on('timer_update', (data: any) => {
      setVip1State(prev => ({ ...prev, timeLeft: data.vip1Time }));
      setVip2State(prev => ({ ...prev, timeLeft: data.vip2Time }));
    });

    socketRef.current.on('lottery_animation_start', (data: any) => {
      const setState = data.roomId === 'VIP1' ? setVip1State : setVip2State;
      setState(prev => ({ ...prev, isRunning: true }));
      
      let count = 0;
      const animInterval = setInterval(() => {
        const rand = CODES[Math.floor(Math.random() * CODES.length)];
        setState(prev => ({
          ...prev,
          symbols: rand.split(''),
          result: rand
        }));
        count++;
        if (count > 25) {
          clearInterval(animInterval);
        }
      }, 100);
    });

    socketRef.current.on('lottery_result', (data: any) => {
      const setState = data.roomId === 'VIP1' ? setVip1State : setVip2State;
      const now = new Date();
      const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      setState(prev => ({
        ...prev,
        isRunning: false,
        symbols: data.result.split(''),
        result: data.result,
        currentExpect: data.nextExpect,
        futureResults: data.futureResults,
        history: [{ time: timeStr, expect: data.expect, result: data.result }, ...prev.history].slice(0, 100),
        messages: [{
          id: Date.now().toString(),
          nickname: 'Hệ thống MUFG',
          avatar: 'https://cdn-icons-png.flaticon.com/512/564/564751.png',
          content: `🔊 Phiên ${data.expect} kết thúc: ${data.result}.`,
          addtime: timeStr,
          isService: true
        }, ...prev.messages]
      }));
    });

    socketRef.current.on('order_updated', (data: any) => {
      setUserOrders(prev => prev.map(order => 
        order.id === data.id ? { ...order, status: data.status, result: data.result } : order
      ));
    });

    socketRef.current.on('user_deleted', (data: any) => {
      console.log('User deleted event received:', data.userId);
      setRegisteredUsers(prev => prev.filter(u => u.id !== data.userId));
      setTransactions(prev => prev.filter(tx => tx.userId !== data.userId));
      setAllChatMessages(prev => prev.filter(m => m.userId !== data.userId));
    });

    socketRef.current.on('platform_settings_updated', (settings: any) => {
      setPlatformSettings(settings);
      setShowAnnouncement(true); // Show announcement immediately when updated
    });

    socketRef.current.on('messages_cleaned', () => {
      socketRef.current.emit('get_initial_data');
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Simulation Loops
  useEffect(() => {
    if (!isLoggedIn) return;

    let timeoutVip1: NodeJS.Timeout;
    let timeoutVip2: NodeJS.Timeout;

    const simulateBotMessage = (roomId: 'VIP1' | 'VIP2') => {
      const setState = roomId === 'VIP1' ? setVip1State : setVip2State;
      const name = VN_NAMES[Math.floor(Math.random() * VN_NAMES.length)];
      const code = CODES[Math.floor(Math.random() * CODES.length)];
      
      const settings = roomId === 'VIP1' ? platformSettings.vip1 : platformSettings.vip2;
      // Generate amount and ensure last 3 digits are 000
      let amount = Math.floor(Math.random() * (settings.botMax - settings.botMin + 1)) + settings.botMin;
      amount = Math.floor(amount / 1000) * 1000;

      const now = new Date();
      const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      setState(prev => {
        const newMessages: Message[] = [
          {
            id: Date.now().toString(),
            nickname: name,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
            content: `${code}/${amount}`,
            addtime: timeStr
          }
        ];

        // CSKH Confirmation (Simultaneous)
        if (Math.random() > 0.4) {
          newMessages.unshift({
            id: (Date.now() + 1).toString(),
            nickname: 'CSKH MUFG',
            avatar: 'https://images.careerviet.vn/content/images/cham-soc-khach-hang-la-gi-1.jpg',
            content: `Khớp lệnh mã ${code} thành công.`,
            addtime: timeStr,
            isService: true
          });
        }

        return {
          ...prev,
          messages: [...newMessages, ...prev.messages].slice(0, 50)
        };
      });

      scheduleNext(roomId);
    };

    const scheduleNext = (roomId: 'VIP1' | 'VIP2') => {
      const delay = Math.floor(Math.random() * (12000 - 4000 + 1)) + 4000;
      if (roomId === 'VIP1') {
        timeoutVip1 = setTimeout(() => simulateBotMessage('VIP1'), delay);
      } else {
        timeoutVip2 = setTimeout(() => simulateBotMessage('VIP2'), delay);
      }
    };

    scheduleNext('VIP1');
    scheduleNext('VIP2');

    return () => {
      clearTimeout(timeoutVip1);
      clearTimeout(timeoutVip2);
    };
  }, [isLoggedIn, platformSettings]);










  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setView('login');
  };

  return (
    <div className="max-w-md mx-auto bg-[#f8f9fa] min-h-screen relative font-sans">
      <AnimatePresence mode="wait">
        {view === 'login' && (
          <LoginView 
            registeredUsers={registeredUsers}
            setRegisteredUsers={setRegisteredUsers}
            setIsAdmin={setIsAdmin}
            setIsLoggedIn={setIsLoggedIn}
            setUser={setUser}
            setBalance={setBalance}
            setView={setView}
            setShowAnnouncement={setShowAnnouncement}
            showAlert={showAlert}
            socketRef={socketRef}
          />
        )}
        {view === 'home' && <HomeView setView={setView} setIsChatOpen={setIsChatOpen} />}
        {view === 'market' && (
          <MarketView 
            vip1State={vip1State}
            vip2State={vip2State}
          />
        )}
        {view === 'orders' && (
          <OrdersView 
            userOrders={userOrders}
          />
        )}
        {view === 'trading-vip1' && (
          <TradingView 
            roomId="VIP1" 
            vip1State={vip1State}
            vip2State={vip2State}
            user={user}
            balance={balance}
            platformSettings={platformSettings}
            setVip1State={setVip1State}
            setVip2State={setVip2State}
            setUserOrders={setUserOrders}
            setBalance={setBalance}
            setView={setView}
            showAlert={showAlert}
            socketRef={socketRef}
          />
        )}
        {view === 'trading-vip2' && (
          <TradingView 
            roomId="VIP2" 
            vip1State={vip1State}
            vip2State={vip2State}
            user={user}
            balance={balance}
            platformSettings={platformSettings}
            setVip1State={setVip1State}
            setVip2State={setVip2State}
            setUserOrders={setUserOrders}
            setBalance={setBalance}
            setView={setView}
            showAlert={showAlert}
            socketRef={socketRef}
          />
        )}
        {view === 'profile' && (
          <ProfileView 
            user={user}
            balance={balance}
            setView={setView}
            setShowChangePass={setShowChangePass}
            isAdmin={isAdmin}
            setIsChatOpen={setIsChatOpen}
            handleLogout={handleLogout}
            unreadCount={
              allChatMessages.filter(m => !m.isService && !m.isRead && m.userId !== 'all').length +
              transactions.filter(t => !t.isRead).length
            }
            userOrders={userOrders}
          />
        )}
        {view === 'admin' && (
          <AdminView 
            registeredUsers={registeredUsers}
            setRegisteredUsers={setRegisteredUsers}
            user={user}
            setUser={setUser}
            setBalance={setBalance}
            setView={setView}
            platformSettings={platformSettings}
            setPlatformSettings={setPlatformSettings}
            showAlert={showAlert}
            vip1State={vip1State}
            setVip1State={setVip1State}
            vip2State={vip2State}
            setVip2State={setVip2State}
            socketRef={socketRef}
            setSelectedChatUserId={setSelectedChatUserId}
            setIsChatOpen={setIsChatOpen}
            transactions={transactions}
            allChatMessages={allChatMessages}
          />
        )}
        {view === 'deposit' && (
          <DepositView 
            user={user}
            setBalance={setBalance}
            setView={setView}
            showAlert={showAlert}
            socketRef={socketRef}
          />
        )}
        {view === 'withdraw' && (
          <WithdrawView 
            user={user}
            balance={balance}
            setBalance={setBalance}
            setView={setView}
            showAlert={showAlert}
            socketRef={socketRef}
          />
        )}
        {view === 'about' && <AboutView setView={setView} />}
        {view === 'deposit-history' && <DepositHistoryView transactions={transactions} user={user} setView={setView} />}
        {view === 'withdraw-history' && <WithdrawHistoryView transactions={transactions} user={user} setView={setView} />}
        {view === 'edit-profile' && (
          <EditProfileView 
            user={user}
            setUser={setUser}
            setView={setView}
            showAlert={showAlert}
          />
        )}
      </AnimatePresence>

      <ChatView 
        user={user}
        isAdmin={isAdmin}
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        allChatMessages={allChatMessages}
        setAllChatMessages={setAllChatMessages}
        selectedChatUserId={selectedChatUserId}
        setSelectedChatUserId={setSelectedChatUserId}
        socketRef={socketRef}
        registeredUsers={registeredUsers}
      />

      <AnimatePresence>
        {showAnnouncement && (
          <div className="fixed inset-0 bg-black/70 z-[300] flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl relative"
            >
              <div className="bg-[#c00001] p-6 text-center relative">
                <div className="w-16 h-16 bg-white/20 rounded-2xl rotate-45 flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                  <Bell className="-rotate-45 text-white w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-white tracking-wider uppercase">THÔNG BÁO HỆ THỐNG</h3>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-2 text-sm font-bold text-gray-700">
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span>Thời gian nộp tiền</span>
                    <span className="text-[#c00001]">{platformSettings.announcement.depositTime}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span>Thời gian rút tiền</span>
                    <span className="text-[#c00001]">{platformSettings.announcement.withdrawTime}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span>Thời gian phục vụ</span>
                    <span className="text-[#c00001]">{platformSettings.announcement.serviceTime}</span>
                  </div>
                </div>

                <div className="py-4 border-t-2 border-dashed border-gray-200 text-center">
                  <p className="text-xs font-black text-[#c00001] mb-2 uppercase tracking-widest">KÍNH GỬI CÁC NHÀ ĐẦU TƯ</p>
                  <p className="text-xs text-gray-600 leading-relaxed font-medium">
                    {platformSettings.announcement.message}
                  </p>
                </div>

                <button 
                  onClick={() => setShowAnnouncement(false)}
                  className="w-full h-14 bg-gradient-to-r from-[#c00001] to-[#f13031] rounded-2xl text-white font-black text-lg shadow-xl shadow-red-100 active:scale-95 transition-all"
                >
                  XÁC NHẬN
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showChangePass && (
          <div className="fixed inset-0 bg-black/60 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl relative"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-gray-800">Đổi Mật Khẩu</h3>
                <button 
                  onClick={() => setShowChangePass(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 active:scale-90 transition-transform"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Mật khẩu cũ</label>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 flex items-center focus-within:border-blue-500 transition-all">
                    <Lock className="text-gray-300 w-5 h-5 mr-3" />
                    <input 
                      type="password" 
                      placeholder="Nhập mật khẩu hiện tại" 
                      className="bg-transparent border-none outline-none text-gray-700 w-full text-sm font-medium" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Mật khẩu mới</label>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 flex items-center focus-within:border-blue-500 transition-all">
                    <Lock className="text-gray-300 w-5 h-5 mr-3" />
                    <input 
                      type="password" 
                      placeholder="Nhập mật khẩu mới" 
                      className="bg-transparent border-none outline-none text-gray-700 w-full text-sm font-medium" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Xác nhận mật khẩu mới</label>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 flex items-center focus-within:border-blue-500 transition-all">
                    <Lock className="text-gray-300 w-5 h-5 mr-3" />
                    <input 
                      type="password" 
                      placeholder="Nhập lại mật khẩu mới" 
                      className="bg-transparent border-none outline-none text-gray-700 w-full text-sm font-medium" 
                    />
                  </div>
                </div>

                <button 
                  onClick={() => {
                    showAlert('Thành công', 'Mật khẩu của bạn đã được thay đổi thành công.', 'success');
                    setShowChangePass(false);
                  }}
                  className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white font-black text-lg shadow-xl shadow-blue-200 active:scale-95 transition-all mt-4"
                >
                  ĐỔI MẬT KHẨU
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {alert.show && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-5"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[32px] p-8 w-full max-w-xs text-center shadow-2xl"
            >
              <div className={`mx-auto mb-6 flex items-center justify-center w-16 h-16 rounded-full ${alert.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-rose-100 text-rose-600'}`}>
                {alert.type === 'success' ? (
                  <ShieldCheck className="w-8 h-8" />
                ) : (
                  <Info className="w-8 h-8" />
                )}
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-2">{alert.title}</h4>
              <p className="text-slate-600 text-sm mb-8 leading-relaxed">{alert.msg}</p>
              <button 
                onClick={closeAlert}
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl active:opacity-80 transition-opacity"
              >
                Đóng
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoggedIn && !['trading-vip1', 'trading-vip2', 'deposit', 'withdraw', 'admin'].includes(view) && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-[65px] bg-white/95 backdrop-blur-md border-t border-gray-100 flex justify-around items-center pb-[env(safe-area-inset-bottom)] z-50">
          {[
            { id: 'home', label: 'Trang Chủ', icon: Home },
            { id: 'market', label: 'Số kỳ', icon: BarChart2 },
            { id: 'orders', label: 'Lệnh', icon: FileText },
            { id: 'profile', label: 'Tôi', icon: User },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setView(item.id as ViewType)}
              className={`flex flex-col items-center gap-1 ${view === item.id ? 'text-[#c00001]' : 'text-gray-400'}`}
            >
              <item.icon className="w-6 h-6" />
              <span className={`text-[10px] font-bold ${view === item.id ? 'text-[#c00001]' : 'text-gray-400'}`}>{item.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
