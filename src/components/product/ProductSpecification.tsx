import type { ProductSpecification } from '@/services/ProductService/productDetailTypes';

// Specification labels mapping
const specLabels: Record<string, string> = {
  cpu: 'CPU',
  ram: 'RAM',
  storage: 'Ổ cứng',
  screen: 'Màn hình',
  gpu: 'Card đồ họa',
};

interface ProductSpecificationProps {
  specification: ProductSpecification;
}

export default function ProductSpecificationSection({ specification }: ProductSpecificationProps) {
  if (!specification || Object.keys(specification).length === 0) {
    return null;
  }

  return (
    <div className="border-t pt-6">
      <h3 className="font-semibold text-gray-900 mb-4">Thông số kỹ thuật</h3>
      <div className="space-y-3">
        {Object.entries(specification).map(([key, value]) => (
          value && (
            <div key={key} className="flex items-start gap-2">
              <span className="text-gray-500 min-w-[120px]">
                {specLabels[key] || key}:
              </span>
              <span className="text-gray-900 font-medium">{value}</span>
            </div>
          )
        ))}
      </div>
    </div>
  );
}
