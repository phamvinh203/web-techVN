import { Search } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";

export default function SearchBar() {
  const {
    keyword,
    suggestions,
    loading,
    showSuggestions,

    handleInputChange,
    handleSearch,
    handleSelect,
    handleKeyDown,
    handleBlur,
  } = useSearch();

  return (
    <div className="relative flex flex-1 max-w-2xl">
      <div className="flex w-full items-center gap-2 rounded-full bg-gray-100 px-4 py-2">
        <Search size={18} className="text-gray-400" />
        <input
          value={keyword}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder="Tìm kiếm điện thoại, laptop, phụ kiện..."
          className="flex-1 bg-transparent text-sm outline-none"
        />
        <button
          onClick={handleSearch}
          className="rounded-full bg-blue-600 px-4 py-1.5 text-sm text-white"
        >
          Tìm
        </button>
      </div>

      {showSuggestions && (
        <div className="absolute top-full mt-2 w-full rounded-lg border bg-white shadow-lg z-50">
          {loading && (
            <div className="px-4 py-2 text-sm text-gray-500">
              Đang tìm...
            </div>
          )}

          {suggestions.map((item) => (
            <button
              key={item._id}
              onMouseDown={() => handleSelect(item)}
              className="flex w-full items-center gap-3 px-4 py-2 hover:bg-gray-50 text-left"
            >
              <img
                src={item.thumbnail || "/placeholder.png"}
                className="h-10 w-10 rounded object-cover"
                alt={item.name}
              />

              <div>
                <p className="text-sm font-medium">{item.name}</p>
                {item.price && (
                  <p className="text-xs text-gray-500">
                    {item.price.toLocaleString()}đ
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
