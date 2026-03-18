import React from 'react';
import { ChevronLeft, BarChart2, Coins } from 'lucide-react';
import { ViewType } from './types';

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

export default AboutView;