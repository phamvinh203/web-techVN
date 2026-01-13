import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';

export default function CartPage() {
  const { cart, loading, fetchCart, updateItem, removeItem } = useCart();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatPrice = (value: number) =>
    new Intl.NumberFormat('vi-VN').format(value) + 'đ';

  const handleSelectAll = (checked: boolean) => {
    if (!cart) return;
    setSelectedIds(checked ? cart.items.map(i => i._id) : []);
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    setSelectedIds(prev =>
      checked ? [...prev, id] : prev.filter(i => i !== id)
    );
  };

  const handleIncrease = async (item: any) => {
    await updateItem({
      item_id: item._id,
      quantity: item.quantity + 1,
    });
    // Fetch lại cart sau khi update để đảm bảo data đầy đủ
    await fetchCart();
  };

  const handleDecrease = async (item: any) => {
    if (item.quantity <= 1) return;
    await updateItem({
      item_id: item._id,
      quantity: item.quantity - 1,
    });
    await fetchCart();
  };

  const handleRemove = async (itemId: string) => {
    // Xóa khỏi selectedIds trước
    setSelectedIds(prev => prev.filter(id => id !== itemId));
    await removeItem(itemId);
    await fetchCart();
  };

  // Lọc các items có product hợp lệ
  const validItems = cart?.items?.filter(item => item?.product) || [];

  const totalSelectedAmount =
    validItems
      .filter(i => selectedIds.includes(i._id))
      .reduce((sum, i) => sum + (i.subtotal || 0), 0) || 0;

  const handleOpenAuth = () => {
    console.log('Open auth modal');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onOpenAuth={handleOpenAuth} />
        <div className="flex justify-center py-20">
          <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onOpenAuth={handleOpenAuth} />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Giỏ hàng</h1>

        {!cart || validItems.length === 0 ? (
          <div className="bg-white rounded-lg p-10 text-center">
            <p className="text-gray-500 mb-4">Giỏ hàng của bạn đang trống</p>
            <Link to="/products">
              <Button>Tiếp tục mua sắm</Button>
            </Link>
          </div>
        ) : (
          <>
            {/* ================= HEADER TABLE ================= */}
            <div className="bg-white rounded-lg shadow-sm px-4 py-3 mb-3">
              <div className="grid grid-cols-12 text-sm text-gray-500 font-medium">
                <div className="col-span-1">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === validItems.length && validItems.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </div>
                <div className="col-span-5">Sản phẩm</div>
                <div className="col-span-2 text-center">Đơn giá</div>
                <div className="col-span-2 text-center">Số lượng</div>
                <div className="col-span-1 text-center">Số tiền</div>
                <div className="col-span-1 text-right">Thao tác</div>
              </div>
            </div>

            {/* ================= LIST ITEMS ================= */}
            <div className="space-y-3">
              {validItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-sm px-4 py-4"
                >
                  <div className="grid grid-cols-12 items-center gap-3">
                    <div className="col-span-1">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item._id)}
                        onChange={(e) =>
                          handleSelectItem(item._id, e.target.checked)
                        }
                      />
                    </div>

                    <div className="col-span-5 flex gap-3">
                      <img
                        src={item.product?.images?.[0] || '/placeholder.png'}
                        alt={item.product?.name || 'Product'}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <p className="text-sm font-medium line-clamp-2">
                        {item.product?.name || 'Sản phẩm'}
                      </p>
                    </div>

                    <div className="col-span-2 text-center">
                      {formatPrice(item.price || 0)}
                    </div>

                    <div className="col-span-2 flex justify-center items-center gap-2">
                      <button
                        onClick={() => handleDecrease(item)}
                        className="w-7 h-7 border rounded hover:bg-gray-100"
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>

                      <span className="w-8 text-center">{item.quantity}</span>

                      <button
                        onClick={() => handleIncrease(item)}
                        className="w-7 h-7 border rounded hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>

                    <div className="col-span-1 text-center text-red-600 font-semibold">
                      {formatPrice(item.subtotal || 0)}
                    </div>

                    <div className="col-span-1 text-right">
                      <button
                        onClick={() => handleRemove(item._id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ================= FOOTER ================= */}
            <div className="bg-white rounded-lg shadow-sm mt-6 px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedIds.length === validItems.length && validItems.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
                <span>Chọn tất cả</span>
              </div>

              <div className="flex items-center gap-6">
                <p className="text-lg">
                  Tổng cộng ({selectedIds.length} sản phẩm):
                  <span className="text-red-600 font-bold ml-2">
                    {formatPrice(totalSelectedAmount)}
                  </span>
                </p>
                <Button
                  disabled={selectedIds.length === 0}
                  className={`px-8 ${
                    selectedIds.length === 0
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  Mua hàng
                </Button>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}