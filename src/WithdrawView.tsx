import React, { useState, useEffect } from 'react';
import { ChevronLeft, Lock, Info } from 'lucide-react';
import { ViewType } from './types';

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
    };
    if (user.withdrawBlockStatus === 'blocked') {
      showAlert('Thông báo', 'Tài khoản của quý khách đã bị chặn rút tiền để biết thêm chi tiết vui lòng liên hệ bộ phận cskh để biết thêm chi tiết!');
      return;
    };
    if (!bankName) {
      showAlert('Thiếu thông tin', 'Vui lòng nhập tên ngân hàng của bạn.');
      return;
    };
    if (!bankAccount) {
      showAlert('Thiếu thông tin', 'Vui lòng nhập số tài khoản ngân hàng.');
      return;
    };
    if (!bankUser) {
      showAlert('Thiếu thông tin', 'Vui lòng nhập họ tên chủ tài khoản.');
      return;
    };
    if (!money) {
      showAlert('Thiếu thông tin', 'Vui lòng nhập số tiền bạn muốn rút.');
      return;
    };

    const numMoney = parseFloat(money);
    if (numMoney < 2000000) {
      showAlert('Không hợp lệ', 'Số tiền rút tối thiểu là 2.000.000 VND.');
      return;
    };
    if (numMoney > 500000000) {
      showAlert('Vượt hạn mức', 'Số tiền rút tối đa cho một giao dịch là 500.000.000 VND.');
      return;
    };

    if (numMoney > balance) {
      showAlert('Số dư không đủ', 'Số dư khả dụng của bạn không đủ để thực hiện giao dịch này.');
      return;
    };

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
    };

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

export default WithdrawView;