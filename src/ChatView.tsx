import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Phone, X, Smile, SendHorizontal, ThumbsUp, PlusCircle, Camera, Image, MessageCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { ViewType, Message } from './types';

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
      };
    };
  }, [selectedChatUserId, isAdmin]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    };
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
    };
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
          };
        }, 2000);
      };
    };
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
        };
      };
      reader.readAsDataURL(file);
    };
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

export default ChatView;