import React, { useRef } from 'react';
import { ChevronLeft, PlusCircle, User, ShieldCheck } from 'lucide-react';
import { ViewType } from './types';
import { FAMOUS_AVATARS } from './constants';

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
    };
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

export default EditProfileView;