import { useNavigate } from "react-router-dom";
import type { ChatProduct } from "@/services/ChatService/chat.types";

interface ProductSuggestionProps {
  products: ChatProduct[];
}

const ProductSuggestion = ({ products }: ProductSuggestionProps) => {
  const navigate = useNavigate();

  const handleProductClick = (product: ChatProduct) => {
    // Dùng slug từ DB thay vì tự tạo
    const slug = product.slug;
    navigate(`/product/${slug}`, { state: { productId: product._id } });
  };

  return (
    <div className="border-t bg-gradient-to-b from-blue-50 to-white p-3 max-h-[200px] overflow-y-auto">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">💡</span>
        <span className="text-sm font-semibold text-gray-700">Sản phẩm gợi ý</span>
        <span className="text-xs text-gray-400">({products.length} sản phẩm)</span>
      </div>
      <div className="space-y-2">
        {products.slice(0, 5).map(product => (
          <div
            key={product._id}
            onClick={() => handleProductClick(product)}
            className="group bg-white border border-gray-100 rounded-xl p-3 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                  {product.name}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {product.brand_id?.name && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {product.brand_id.name}
                    </span>
                  )}
                  {product.category_id?.name && (
                    <span className="text-xs text-gray-400">
                      {product.category_id.name}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right ml-3">
                <div className="text-sm font-bold text-blue-600">
                  {product.price.toLocaleString("vi-VN")}đ
                </div>
                {product.buyturn && product.buyturn > 0 && (
                  <div className="text-xs text-gray-400">
                    Đã bán {product.buyturn}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-2 flex items-center justify-end text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Xem chi tiết</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSuggestion;
