import React, { useState } from 'react';
import { login, register } from "./api/auth";
import { User, Lock, Eye, EyeOff, ShieldCheck, PlusCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { ViewType } from './types';

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

  const handleSubmit = async () => {
    if (!username || !password) {
      showAlert('Lỗi', 'Vui lòng nhập đầy đủ thông tin.');
      return;
    };

    if (isRegister) {
      if (!inviteCode) {
        showAlert('Lỗi', 'Vui lòng nhập mã mời để đăng ký.');
        return;
      };
      if (!registeredUsers.find(u => u.id === inviteCode || u.inviteCode === inviteCode || u.username === inviteCode)) {
        showAlert('Lỗi', 'Mã mời không hợp lệ hoặc không tồn tại.');
        return;
      };
      if (password !== confirmPass) {
        showAlert('Lỗi', 'Mật khẩu xác nhận không khớp.');
        return;
      };
      

      const res = await register(username, password);
      console.log("REGISTER RES:", res);

      if (!res.success) {
        showAlert('Lỗi', res.message || 'Đăng ký thất bại');
        return;
      }

      showAlert('Thành công', 'Đăng ký tài khoản thành công. Vui lòng đăng nhập.', 'success');
      setIsRegister(false);
      setPassword('');
      setConfirmPass('');
    } else {
      const res = await login(username, password);

if (!res.success) {
  showAlert('Lỗi', res.message || 'Sai tài khoản hoặc mật khẩu');
  return;
}

const userData = res.user;

setIsAdmin(userData.role === 'admin');
setIsLoggedIn(true);
setUser(userData);
setBalance(userData.balance || 0);
setView('home');
setShowAnnouncement(true);
    };
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

export default LoginView;