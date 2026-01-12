import type { ProductSpecification } from "@/services/ProductService/productDetailTypes";

interface ProductSpecificationProps {
  specification: ProductSpecification;
}

export default function ProductSpecificationSection({
  specification,
}: ProductSpecificationProps) {
  if (!specification || Object.keys(specification).length === 0) {
    return null;
  }

  return (
    <div>
      <div className="border-t p-2"></div>

      {/* Specs table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 border-t">
        {Object.entries(specification).map(([key, value], index) => {
          if (value === null || value === undefined || value === "") {
            return null;
          }

          return (
            <div
              key={key}
              className={`grid grid-cols-3 gap-4 px-6 py-4 text-sm
                ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              `}
            >
              {/* Left column */}
              <div className="col-span-1 font-semibold text-gray-700">
                {formatSpecKey(key)}
              </div>

              {/* Right column */}
              <div className="col-span-2 text-gray-600 leading-relaxed">
                {renderSpecValue(value)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ===== Helpers ===== */

const formatSpecKey = (key: string) => {
  return key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const renderSpecValue = (value: unknown) => {
  if (Array.isArray(value)) {
    return (
      <ul className="list-disc pl-5 space-y-1">
        {value.map((item, idx) => (
          <li key={idx}>{String(item)}</li>
        ))}
      </ul>
    );
  }

  if (typeof value === "number") {
    return <span>{value}</span>;
  }

  if (typeof value === "string") {
    return <span>{value}</span>;
  }

  return null;
};
