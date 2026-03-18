import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ChevronLeft,
  UserPen,
  Clock,
  Filter,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from './supabaseClient';

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────
interface User {
  id: number; // Đã đổi thành number để khớp với ID 11, 15, 16...
  username: string;
  balance: number;
  status: string;
  avatar?: string;
}

interface Transaction {
  id: string;
  user_id: number;
  username?: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
}

interface AdminViewProps {
  registeredUsers: User[];
  setRegisteredUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setView: React.Dispatch<React.SetStateAction<any>>;
  showAlert: (title: string, msg: string, type?: 'success' | 'error') => void;
}

const AdminView = ({
  registeredUsers,
  setRegisteredUsers,
  setView,
  showAlert,
}: AdminViewProps) => {
  const [activeTab, setActiveTab] = useState<'users' | 'transactions'>('users');
  const [selectedTxUserId, setSelectedTxUserId] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [txFilter, setTxFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState({ users: false, tx: false, action: false });

  // ────────────────────────────────────────────────
  // Fetch & Realtime
  // ────────────────────────────────────────────────
  
  // 1. Lấy danh sách khách hàng từ bảng profiles
  const fetchUsers = useCallback(async () => {
    setLoading((p) => ({ ...p, users: true }));
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('id', { ascending: true });
    
    setLoading((p) => ({ ...p, users: false }));
    if (!error) setRegisteredUsers(data || []);
  }, [setRegisteredUsers]);

  // 2. Lấy danh sách giao dịch
  const fetchTransactions = useCallback(async () => {
    setLoading((p) => ({ ...p, tx: true }));
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });
    
    setLoading((p) => ({ ...p, tx: false }));
    if (!error) setTransactions(data || []);
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchTransactions();

    // Lắng nghe thay đổi thời gian thực từ Supabase
    const channel = supabase
      .channel('admin-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchUsers)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, fetchTransactions)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchUsers, fetchTransactions]);

  // ────────────────────────────────────────────────
  // Handlers
  // ────────────────────────────────────────────────
  const handleApproveTx = async (tx: Transaction) => {
    const customerName = registeredUsers.find(u => u.id === tx.user_id)?.username || 'Khách';
    if (!window.confirm(`Duyệt nạp ${tx.amount.toLocaleString()}đ cho ${customerName}?`)) return;
    
    setLoading((p) => ({ ...p, action: true }));
    try {
      const delta = tx.type === 'deposit' ? tx.amount : -tx.amount;
      
      // Gọi hàm SQL rpc đã tạo ở bước trước
      const { error } = await supabase.rpc('approve_transaction_and_update_balance', {
        p_tx_id: tx.id,
        p_user_id: Number(tx.user_id), // Ép kiểu số nguyên
        p_delta: delta,
      });

      if (error) throw error;
      showAlert('Thành công', 'Đã duyệt đơn và cập nhật số dư', 'success');
    } catch (err: any) {
      showAlert('Lỗi', err.message || 'Không thể duyệt');
    } finally {
      setLoading((p) => ({ ...p, action: false }));
    }
  };

  const handleRejectTx = async (txId: string) => {
    if (!window.confirm("Từ chối giao dịch này?")) return;
    setLoading((p) => ({ ...p, action: true }));
    const { error } = await supabase.from('transactions').update({ status: 'rejected' }).eq('id', txId);
    setLoading((p) => ({ ...p, action: false }));
    if (!error) showAlert('Thành công', 'Đã từ chối giao dịch');
  };

  // Lọc danh sách giao dịch để hiển thị
  const filteredTxs = useMemo(() => {
    return transactions.filter((t) => {
      if (selectedTxUserId) return t.user_id === selectedTxUserId;
      if (txFilter === 'all') return true;
      return t.status === txFilter;
    });
  }, [transactions, selectedTxUserId, txFilter]);

  // ────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────
  return (
    <div className="pb-24 animate-fade-in bg-slate-50 min-h-screen font-sans">
      {/* Header */}
      <div className="bg-slate-900 pt-10 pb-14 px-6 rounded-b-[40px] shadow-2xl relative text-center">
        <button onClick={() => setView('home')} className="absolute top-10 left-6 p-2 bg-white/10 rounded-xl text-white">
          <ChevronLeft />
        </button>
        <h1 className="text-white font-black text-xl tracking-[0.2em]">QUẢN TRỊ ADMIN</h1>
        
        <div className="flex bg-white/10 p-1 rounded-2xl backdrop-blur-md mt-6 max-w-sm mx-auto">
          <button
            onClick={() => { setActiveTab('users'); setSelectedTxUserId(null); }}
            className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase transition-all ${activeTab === 'users' ? 'bg-white text-slate-900 shadow-lg' : 'text-white/60'}`}
          >
            Khách hàng
          </button>
          <button
            onClick={() => { setActiveTab('transactions'); setSelectedTxUserId(null); }}
            className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase transition-all ${activeTab === 'transactions' ? 'bg-white text-slate-900 shadow-lg' : 'text-white/60'}`}
          >
            Duyệt Giao dịch
          </button>
        </div>
      </div>

      <div className="mx-5 -mt-8">
        {activeTab === 'transactions' && (
          <div className="space-y-4">
            {/* Bộ lọc trạng thái */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {(['pending', 'approved', 'rejected', 'all'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => { setTxFilter(f); setSelectedTxUserId(null); }}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${txFilter === f && !selectedTxUserId ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 border'}`}
                >
                  {f === 'pending' ? '⌛ Chờ duyệt' : f === 'approved' ? '✅ Đã duyệt' : f === 'rejected' ? '❌ Từ chối' : 'Tất cả'}
                </button>
              ))}
            </div>

            {loading.tx ? (
              <div className="text-center py-20 text-slate-400">Đang tải...</div>
            ) : filteredTxs.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">Không có yêu cầu nào</p>
              </div>
            ) : (
              filteredTxs.map((tx) => {
                const user = registeredUsers.find(u => u.id === tx.user_id);
                return (
                  <div key={tx.id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 mb-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-2xl ${tx.type === 'deposit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                          <Filter size={18} />
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase">Khách hàng</div>
                          <div className="font-black text-slate-800">{user?.username || `ID: ${tx.user_id}`}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-black ${tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.type === 'deposit' ? '+' : '-'}{tx.amount.toLocaleString()}đ
                        </div>
                      </div>
                    </div>

                    {tx.status === 'pending' && (
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => handleApproveTx(tx)}
                          disabled={loading.action}
                          className="flex-[2] bg-slate-900 text-white py-3 rounded-2xl font-black text-xs uppercase shadow-lg disabled:opacity-50"
                        >
                          {loading.action ? 'ĐANG XỬ LÝ...' : 'DUYỆT NGAY'}
                        </button>
                        <button
                          onClick={() => handleRejectTx(tx.id)}
                          disabled={loading.action}
                          className="flex-1 bg-slate-100 text-slate-500 py-3 rounded-2xl font-bold text-xs uppercase"
                        >
                          HỦY
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Danh sách khách hàng ({registeredUsers.length})</div>
            {registeredUsers.map((u) => (
              <div key={u.id} className="bg-white rounded-[32px] p-4 shadow-sm border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden border-2 border-white shadow-inner">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} alt="" />
                  </div>
                  <div>
                    <div className="font-black text-slate-800">{u.username}</div>
                    <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg mt-1 inline-block">
                      Số dư: {u.balance.toLocaleString()}đ
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setSelectedTxUserId(u.id); setActiveTab('transactions'); }} className="p-3 bg-slate-50 text-slate-400 rounded-2xl">
                    <Clock size={18} />
                  </button>
                  <button onClick={() => setEditingUser(u)} className="p-3 bg-slate-900 text-white rounded-2xl">
                    <UserPen size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Chỉnh sửa số dư */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 z-[100]">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-[40px] p-8 w-full max-w-md shadow-2xl">
              <h2 className="text-xl font-black mb-6 text-slate-800 uppercase">Chỉnh sửa số dư</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Số dư mới</label>
                  <input
                    type="number"
                    value={editingUser.balance}
                    onChange={(e) => setEditingUser({ ...editingUser, balance: Number(e.target.value) })}
                    className="w-full mt-1 p-4 bg-slate-50 border-none rounded-2xl font-bold"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={() => setEditingUser(null)} className="flex-1 py-4 font-bold text-slate-400">ĐÓNG</button>
                  <button
                    onClick={async () => {
                      const { error } = await supabase.from('profiles').update({ balance: editingUser.balance }).eq('id', editingUser.id);
                      if (!error) { showAlert('Thành công', 'Đã cập nhật số dư', 'success'); setEditingUser(null); fetchUsers(); }
                    }}
                    className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg"
                  >
                    LƯU THÔNG TIN
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminView;