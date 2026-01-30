import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { ProductLite } from "@/services/ChatService/chat.types";

interface ProductCardProps {
  product: ProductLite;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();

  const targetHref = useMemo(() => {
    const slugOrId = product.slug || product.id || product._id;
    return slugOrId ? `/product/${slugOrId}` : "/products";
  }, [product.id, product._id, product.slug]);

  const handleNavigate = () => {
    navigate(targetHref);
  };

  const cover = product.images?.[0];

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleNavigate}
      onKeyDown={e => (e.key === "Enter" || e.key === " ") && handleNavigate()}
      className="mt-3 border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white cursor-pointer transition-transform hover:-translate-y-0.5 hover:shadow-md"
    >
      {cover && (
        <div className="w-full h-36 bg-gray-50 flex items-center justify-center overflow-hidden">
          <img src={cover} alt={product.name} className="h-full w-full object-cover" />
        </div>
      )}
      <div className="p-3 space-y-2">
        <div className="font-semibold text-gray-800 text-sm line-clamp-2">{product.name}</div>
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            handleNavigate();
          }}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-colors"
        >
          Xem chi tiết
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
