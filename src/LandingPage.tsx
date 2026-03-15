import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Building2, 
  Globe2, 
  ShieldCheck,
  ExternalLink,
  ArrowRight,
  Users2,
  X
} from "lucide-react";

interface LandingPageProps {
  onContinue: () => void;
}

export default function LandingPage({ onContinue }: LandingPageProps) {
  const [showPortal, setShowPortal] = useState(false);

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-slate-900 font-sans selection:bg-red-50 selection:text-red-900 overflow-x-hidden">
      {/* Modal xem cổng thông tin */}
      {showPortal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] bg-white flex flex-col"
        >
          <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-600 flex items-center justify-center rounded-lg">
                <span className="text-white font-black text-[10px]">MUFG</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-tighter leading-none">Mitsubishi UFJ</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Global Portal</span>
              </div>
            </div>
            <button 
              onClick={() => setShowPortal(false)}
              className="flex items-center gap-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 px-4 py-2 rounded-full transition-all font-bold text-[10px] uppercase tracking-widest"
            >
              Thoát <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 bg-slate-50 relative">
            <iframe 
              src="https://www.bk.mufg.jp/global/aboutus/origins/index.html" 
              className="w-full h-full border-none"
              title="MUFG Portal"
            />
          </div>
        </motion.div>
      )}

      <main className="pt-8 md:pt-16 pb-8 md:pb-20 max-w-6xl mx-auto px-6">
        {/* Hero Section */}
        <div className="grid grid-cols-12 gap-4 md:gap-12 items-center mb-8 md:mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="col-span-7"
          >
            <div className="mb-6 md:mb-10">
              <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-8">
                <div className="w-10 h-10 md:w-16 md:h-16 bg-red-600 flex items-center justify-center rounded-lg md:rounded-xl shadow-lg shadow-red-100">
                  <span className="text-white font-black text-xs md:text-lg tracking-tighter">MUFG</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm md:text-3xl font-black tracking-tighter text-slate-900 uppercase leading-none">Mitsubishi UFJ</span>
                  <span className="text-[6px] md:text-[10px] font-bold tracking-[0.2em] md:tracking-[0.4em] text-slate-400 uppercase mt-0.5 md:mt-1">Financial Group</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-[1px] w-4 md:w-8 bg-red-600"></div>
                <span className="text-[8px] md:text-[11px] font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] text-red-600">Global Financial Excellence</span>
              </div>
            </div>
            <h1 className="text-xl md:text-7xl font-light tracking-tight text-slate-900 mb-4 md:mb-8 leading-tight md:leading-[1.05]">
              Biểu tượng của <br />
              <span className="font-bold italic serif text-red-600">Sự Thịnh Vượng</span>
            </h1>
            <p className="text-[10px] md:text-lg text-slate-500 max-w-lg leading-relaxed mb-6 md:mb-10">
              Mitsubishi UFJ Financial Group (MUFG) - Tập đoàn tài chính hàng đầu Nhật Bản.
            </p>
            <div className="flex flex-wrap items-center gap-3 md:gap-6">
              <button 
                onClick={() => setShowPortal(true)}
                className="bg-slate-900 text-white px-4 md:px-8 py-2 md:py-4 rounded-full font-bold text-[8px] md:text-sm hover:bg-red-600 transition-all shadow-lg flex items-center gap-1 md:gap-2"
              >
                Truy cập <ExternalLink className="w-3 h-3 md:w-4 md:h-4" />
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-5 relative"
          >
            <div className="aspect-[4/5] rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-xl md:shadow-2xl relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000" 
                alt="MUFG Headquarters" 
                className="w-full h-full object-cover grayscale"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-3 gap-2 md:gap-6 mb-8 md:mb-24">
          <div className="col-span-2 bg-white border border-slate-100 p-3 md:p-8 rounded-2xl md:rounded-[2rem] flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-start mb-4 md:mb-12">
              <div className="w-6 h-6 md:w-12 md:h-12 bg-red-50 rounded-lg md:rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-3 h-3 md:w-6 md:h-6 text-red-600" />
              </div>
              <span className="text-[5px] md:text-[10px] font-black text-slate-200 uppercase tracking-widest">Trust</span>
            </div>
            <div>
              <h3 className="text-[10px] md:text-2xl font-bold mb-1 md:mb-4 italic serif">Di sản</h3>
              <p className="text-slate-500 text-[7px] md:text-sm leading-tight md:leading-relaxed">
                MUFG xây dựng niềm tin tuyệt đối toàn cầu.
              </p>
            </div>
          </div>

          <div className="bg-red-600 p-3 md:p-8 rounded-2xl md:rounded-[2rem] text-white flex flex-col justify-between shadow-lg">
            <Globe2 className="w-3 h-3 md:w-6 md:h-6 text-white" />
            <div>
              <div className="text-lg md:text-4xl font-bold mb-1">50+</div>
              <div className="text-[5px] md:text-[10px] font-bold uppercase tracking-tighter opacity-80">Quốc gia</div>
            </div>
          </div>

          <div className="bg-slate-900 p-3 md:p-8 rounded-2xl md:rounded-[2rem] text-white flex flex-col justify-between">
            <Users2 className="w-3 h-3 md:w-6 md:h-6 text-white" />
            <div>
              <h3 className="text-[8px] md:text-xl font-bold mb-1">VietinBank</h3>
              <p className="text-slate-400 text-[6px] md:text-xs leading-tight">Đối tác chiến lược.</p>
            </div>
          </div>

          <div className="col-span-2 bg-white border border-slate-100 p-3 md:p-8 rounded-2xl md:rounded-[2rem] flex items-center gap-2 md:gap-8 shadow-sm">
            <div className="shrink-0 w-8 h-8 md:w-20 md:h-20 bg-slate-50 rounded-full flex items-center justify-center">
              <Building2 className="w-4 h-4 md:w-8 md:h-8 text-slate-400" />
            </div>
            <div>
              <h3 className="text-[10px] md:text-xl font-bold mb-1 italic serif">Tầm nhìn</h3>
              <p className="text-slate-500 text-[7px] md:text-sm leading-tight">Chuyển đổi số bền vững.</p>
            </div>
          </div>
        </div>

        {/* Nút Tiếp tục - Chuyển vào App chính */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl md:rounded-[3rem] overflow-hidden bg-slate-900 py-8 md:py-20 px-6 text-center"
        >
          <div className="relative z-10">
            <h2 className="text-xl md:text-5xl font-bold text-white mb-3 md:mb-6 italic serif">Bắt đầu hành trình của bạn</h2>
            <p className="text-slate-400 mb-6 md:mb-10 max-w-lg mx-auto text-[10px] md:text-sm">
              Trải nghiệm dịch vụ tài chính đẳng cấp thế giới cùng MUFG.
            </p>
            <button 
              onClick={onContinue}
              className="bg-white text-slate-900 px-6 py-2 md:px-10 md:py-4 rounded-full font-bold text-[10px] md:text-sm hover:scale-105 transition-transform flex items-center gap-2 md:gap-3 mx-auto"
            >
              Tiếp tục <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
            </button>
          </div>
        </motion.div>
      </main>

      <footer className="py-6 md:py-12 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 flex flex-row justify-between items-center gap-2">
          <p className="text-[6px] md:text-[10px] font-bold uppercase text-slate-300">© 2026 MUFG</p>
        </div>
      </footer>
    </div>
  );
}