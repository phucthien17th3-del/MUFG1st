import React, { useState } from 'react';
import { ChevronLeft, ShieldCheck } from 'lucide-react';
import { supabase } from './supabaseClient';

const DepositView = ({ user, setView, showAlert }: any) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDeposit = async () => {
    if (!amount) { alert("Vui lòng nhập số tiền!"); return; }
    
    setIsLoading(true);
    try {
      // DEBUG: Kiểm tra xem user có tồn tại không
      if (!user || !user.id) {
        alert("Lỗi: Không tìm thấy ID người dùng. Bạn đã đăng nhập chưa?");
        setIsLoading(false);
        return;
      }

      console.log("Đang nạp tiền cho ID:", user.id);

      // GỬI DỮ LIỆU - CHỈ GỬI 2 CỘT CƠ BẢN NHẤT ĐỂ TRÁNH LỖI
      const { data, error } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: user.id,
            amount: parseFloat(amount),
            type: 'deposit',
            status: 'pending'
          }
        ])
        .select();

      if (error) {
        // HIỆN LỖI THẬT SỰ RA MÀN HÌNH
        alert("LỖI TỪ SUPABASE: " + error.message + " - Code: " + error.code);
        console.error(error);
      } else {
        alert("CHÚC MỪNG! Dữ liệu đã vào Database thành công.");
        setAmount('');
        setView('home');
      }
    } catch (err: any) {
      alert("LỖI HỆ THỐNG: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <button onClick={() => setView('home')} className="mb-4 flex items-center gap-2 text-blue-600"><ChevronLeft /> Quay lại</button>
      <h2 className="text-2xl font-bold mb-6">Nạp tiền</h2>
      
      <div className="bg-slate-100 p-6 rounded-2xl mb-6">
        <label className="block text-sm font-bold mb-2">Số tiền nạp (VNĐ)</label>
        <input 
          type="number" 
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-4 rounded-xl border-none text-xl font-bold" 
          placeholder="Ví dụ: 200000"
        />
      </div>

      <button 
        onClick={handleDeposit}
        disabled={isLoading}
        className="w-full h-14 bg-blue-600 text-white rounded-xl font-bold shadow-lg"
      >
        {isLoading ? "ĐANG XỬ LÝ..." : "GỬI YÊU CẦU NẠP"}
      </button>

      <div className="mt-8 p-4 bg-amber-50 text-amber-700 text-xs rounded-xl border border-amber-200">
        <strong>Lưu ý:</strong> Sau khi bấm nút, nếu thấy thông báo "CHÚC MỪNG" thì dữ liệu mới thực sự vào database.
      </div>
    </div>
  );
};

export default DepositView;