import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft } from 'lucide-react';
import { ViewType, RoomState, Order, Message } from './types';
import { CODES } from './constants';

interface TradingViewProps {
  roomId: 'VIP1' | 'VIP2';
  vipState: RoomState;
  vip2State: RoomState;

  user: any;
  balance: number;
  platformSettings: any;

  setvipState: React.Dispatch<React.SetStateAction<RoomState>>;
  setVip2State: React.Dispatch<React.SetStateAction<RoomState>>;

  setUserOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  setView: React.Dispatch<React.SetStateAction<ViewType>>;
  showAlert: (title: string, msg: string, type?: 'success' | 'error') => void;
  socketRef: React.MutableRefObject<any>;
}

const TradingView = ({
  roomId,
  vipState,
  vip2State,
  user,
  balance,
  platformSettings,
  setvipState,
  setVip2State,
  setUserOrders,
  setBalance,
  setView,
  showAlert,
  socketRef,
}: TradingViewProps) => {
  const state = roomId === 'VIP1' ? vipState : vip2State;

  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [betAmount, setBetAmount] = useState('');
  const [betCode, setBetCode] = useState('');

  // ── ĐẾM NGƯỢC CỤC BỘ ──
  const [localTimeLeft, setLocalTimeLeft] = useState<number>(state.timeLeft ?? 300);
  const [isWaitingResult, setIsWaitingResult] = useState<boolean>(false);
  const lastServerTimeRef = useRef<number | undefined>(undefined);

  // Đồng bộ từ server: Chỉ cập nhật khi giá trị Server thực sự thay đổi so với lần nhận trước
  useEffect(() => {
    if (vipState.timeLeft !== undefined && vipState.timeLeft !== lastServerTimeRef.current) {
      setLocalTimeLeft(vipState.timeLeft);
      setIsWaitingResult(false);
      lastServerTimeRef.current = vipState.timeLeft;
    }
  }, [vipState.timeLeft]);

  // Bộ đếm giây chạy liên tục
  useEffect(() => {
    const timer = setInterval(() => {
      setLocalTimeLeft((prev) => {
        if (prev <= 1) {
          if (!isWaitingResult) {
            setIsWaitingResult(true);
            return 5; // Chờ kết quả 5 giây
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isWaitingResult]);

  const handleBet = () => {
    if (user.isBetBlocked) {
      showAlert('Thông báo', 'Tài khoản của bạn đã bị chặn giao dịch.');
      return;
    }
    if (!betCode || !betAmount) return;

    const amount = parseInt(betAmount);
    if (balance < amount) {
      showAlert('Số dư không đủ', 'Vui lòng nạp thêm tiền để thực hiện giao dịch.');
      return;
    }

    const limits = roomId === 'VIP1' ? platformSettings.vip1 : platformSettings.vip2;
    if (amount < limits.min || amount > limits.max) {
      showAlert('Hạn mức', `Số tiền từ ${limits.min.toLocaleString()} - ${limits.max.toLocaleString()} VND.`);
      return;
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newOrder: Order = {
      id: uniqueId,
      userId: user.id,
      time: timeStr,
      room: roomId,
      expect: state.currentExpect,
      betCode: betCode,
      amount: amount,
      status: 'pending',
    };

    if (socketRef.current) socketRef.current.emit('place_order', newOrder);

    const setState = roomId === 'VIP1' ? setvipState : setVip2State;
    setState((prev) => ({
      ...prev,
      messages: [
        {
          id: uniqueId,
          nickname: user.username,
          avatar: user.avatar,
          content: `${betCode}/${amount}`,
          addtime: timeStr,
          userId: user.id,
          isService: false,
        },
        ...prev.messages,
      ] as Message[],
    }));

    setBetAmount('');
    setBetCode('');
  };

  return (
    <div className="h-screen flex flex-col bg-[#e7f8ff] animate-fade-in overflow-hidden">
      {/* Header */}
      <div className="bg-white p-4 text-center shadow-sm relative z-10">
        <button onClick={() => setView('home')} className="absolute left-4 top-1/2 -translate-y-1/2 p-2">
          <ChevronLeft className="text-gray-600" />
        </button>
        <span className="absolute right-4 top-4 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
          {roomId}
        </span>
        <div className="flex justify-center gap-2 mb-2">
          {state.symbols.map((s, i) => (
            <React.Fragment key={`sym-${i}`}>
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
        <div className="text-sm font-bold">
          {isWaitingResult ? (
            <span className="text-orange-600 animate-pulse">Chờ kết quả: {localTimeLeft} giây</span>
          ) : (
            <>Phiên đang mở: <b className="text-[#ef73ac]">{localTimeLeft}</b> giây</>
          )}
        </div>
      </div>

      {/* Lịch sử */}
      <div
        className={`bg-white border-b transition-all duration-300 overflow-hidden ${isHistoryExpanded ? 'h-64' : 'h-10'}`}
        onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
      >
        <table className="w-full text-[10px] text-center">
          <thead className="bg-gray-50 sticky top-0">
            <tr><th className="py-2">Thời gian</th><th>Kỳ</th><th>Kết quả</th></tr>
          </thead>
          <tbody>
            {state.history.map((h, i) => (
              <tr key={`hist-${h.expect || i}`} className="border-b border-gray-50">
                <td className="py-1.5 text-gray-500">{h.time}</td>
                <td className="text-gray-400">{h.expect}</td>
                <td className="font-bold text-gray-700">{h.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tin nhắn */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse gap-4">
        {state.messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isService ? 'flex-row-reverse' : 'flex-row'} items-start gap-2`}>
            <div className={`w-10 h-10 rounded-full overflow-hidden border-2 bg-white ${msg.isService ? 'border-[#61bce9]' : 'border-white'}`}>
              <img src={msg.avatar} className="w-full h-full object-cover" alt="Avatar" />
            </div>
            <div className={`max-w-[75%] ${msg.isService ? 'text-right' : 'text-left'}`}>
              <div className="text-[10px] text-gray-400 mb-1">{msg.nickname} • {msg.addtime}</div>
              <div className={`p-3 rounded-2xl text-sm shadow-sm ${msg.isService ? 'shimmer-bg text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'}`}>
                <div dangerouslySetInnerHTML={{ __html: msg.content }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="bg-white p-3 flex gap-2 border-t pb-[calc(12px+env(safe-area-inset-bottom))]">
        <select value={betCode} onChange={(e) => setBetCode(e.target.value)} className="w-24 h-10 border border-gray-200 rounded-lg text-sm px-2 outline-none focus:border-[#61bce9]">
          <option value="">Chọn mã</option>
          {CODES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input type="number" value={betAmount} onChange={(e) => setBetAmount(e.target.value)} placeholder="Số tiền cược..." className="flex-1 h-10 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-[#61bce9]" />
        <button onClick={handleBet} className="bg-[#61bce9] text-white px-4 rounded-lg font-bold text-sm active:scale-95 transition-transform">Xác nhận</button>
      </div>
    </div>
  );
};

export default TradingView; 