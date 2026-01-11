interface FooterProps {
  className?: string;
}

export default function Footer({ className = "" }: FooterProps) {
  return (
    <footer className={`bg-white border-t border-gray-200 pt-16 pb-8 ${className}`}>
      <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4 text-primary">
              <div className="size-8 bg-primary text-white rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">devices</span>
              </div>
              <h2 className="text-xl font-bold text-[#111318]">TechVN</h2>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Hệ thống bán lẻ điện thoại, laptop, phụ kiện chính hãng hàng đầu Việt Nam. Cam kết chất lượng
              100%.
            </p>
            <div className="flex gap-3">
              <a
                className="size-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors"
                href="#"
                aria-label="Facebook"
              >
                <svg aria-hidden="true" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    clipRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </a>
              <a
                className="size-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors"
                href="#"
                aria-label="Instagram"
              >
                <svg aria-hidden="true" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    clipRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465C9.673 2.013 10.03 2 12.48 2h-.165zm0-2H12.2c-2.63 0-2.985.01-4.085.06-1.1.05-1.885.23-2.585.5-1.075.42-1.99 1.01-2.9 1.92S1.415 4.3 1 5.375c-.27.7-.45 1.485-.5 2.585-.05 1.1-.06 1.455-.06 4.085s.01 2.985.06 4.085c.05 1.1.23 1.885.5 2.585.42 1.075 1.01 1.99 1.92 2.9s1.825.915 2.9 1.335c.7.27 1.485.45 2.585.5 1.1.05 1.455.06 4.085.06s2.985-.01 4.085-.06c1.1-.05 1.885-.23 2.585-.5 1.075-.42 1.99-1.01 2.9-1.92s.915-1.825 1.335-2.9c.27-.7.45-1.485.5-2.585.05-1.1.06-1.455.06-4.085s-.01-2.985-.06-4.085c-.05-1.1-.23-1.885-.5-2.585-.42-1.075-1.01-1.99-1.92-2.9s-1.825-.915-2.9-1.335c-.7-.27-1.485-.45-2.585-.5-1.1-.05-1.455-.06-4.085-.06z"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </a>
            </div>
          </div>

          {/* About Us */}
          <div>
            <h3 className="font-bold text-[#111318] mb-4">Về chúng tôi</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <a className="hover:text-primary" href="#">
                  Giới thiệu công ty
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  Tuyển dụng
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  Điều khoản sử dụng
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="font-bold text-[#111318] mb-4">Hỗ trợ khách hàng</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <a className="hover:text-primary" href="#">
                  Hướng dẫn mua hàng
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  Chính sách đổi trả
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  Trung tâm bảo hành
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  Liên hệ hỗ trợ
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-[#111318] mb-4">Đăng ký nhận tin</h3>
            <p className="text-sm text-gray-500 mb-3">Nhận thông tin khuyến mãi mới nhất.</p>
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-lg border-gray-300 text-sm focus:border-primary focus:ring-primary bg-gray-50"
                placeholder="Email của bạn"
                type="email"
              />
              <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-dark transition-colors">
                Gửi
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">© 2024 TechVN. All rights reserved.</p>
          <div className="flex gap-4">
            <img
              alt="Visa"
              className="h-6 object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBypMpLtiv70DJJptf_bcGz8DZp_k_xwYjMNZmBjMT7Cl-8Mg5-mZ79CXaivAzGMDGv4tRrUnWQCvf9Z9Slpi5TFJNxwGVaRb0DbaeG1anrzhQI6l_2UQI4LtKdND-jFumQfxBw4jR5NRtJwpttGuOnXYejXvfYnYH0g97pdPMDkXGgzH2NaMCbwP6A-Ge91BZcKeG-MkPpb64k7zJQihxqXm5kGQrIhHw5ks4DsrJXWmkoy-tDVjjJSuzkVN8g7esheqpljG-15cU"
            />
            <img
              alt="Mastercard"
              className="h-6 object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5PhQVtv5QcWb2HKeYSbeAOpQ7t-eYFBmZOZf4pJFWRPRIBI-J8x4e5IBe3T0KYCR4LF0AF8aZdg2GiQQXSQqI6_9yqoaXXSkOXwRzAfWwX6ZpunI2c-7qVo6UjprZVmFsvpYkypB23lqNZKportngYzpl2AD0e-0N6L_J_SYFXln1st5LBBgYax981iDXa2hEXwdi2lJXlR6w5iPCly_xCeHCZmrseFcqI_N8j2HTmtxl-KTbsC936JPpjnhd_kJVu3240kLUzzE"
            />
            <img
              alt="PayPal"
              className="h-6 object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbEmYdzTPsjHFjrqbnXKMFyvxh5sZkf48joHX_tdCDpO100uFu48OROOoNTBqvbI-cCmGAHlLeW-RdlNCyWXlJHevkzAxZeOXuI2V_1TRxOzpvuABZlkwHYnpbnnkmx7dFtcgXS0_Icc7kzyL_ZPGZ47vfASMaV3oHZUMeE1cWnPnXVB0-2zkItIxW1SESORXHGyReO00aJ0xM8azxA-pscHb2uzF7d7XNXaqdX_vy-XRtU6K-HtXrHYiA94X3VGs42UHAR0G9wik"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
