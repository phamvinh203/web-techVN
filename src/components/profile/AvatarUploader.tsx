export default function AvatarUploader() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-28 h-28 rounded-full bg-gray-200 mb-3" />
      <button className="border px-4 py-1 rounded text-sm">
        Chọn ảnh
      </button>
      <p className="text-xs text-gray-400 mt-2">
        Dung lượng tối đa 1MB<br />
        Định dạng: JPEG, PNG
      </p>
    </div>
  );
}
