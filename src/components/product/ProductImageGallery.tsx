interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  selectedImage: number;
  onSelectImage: (index: number) => void;
  discount?: number;
}

export default function ProductImageGallery({
  images,
  productName,
  selectedImage,
  onSelectImage,
  discount = 0,
}: ProductImageGalleryProps) {
  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
        {discount > 0 && (
          <span className="absolute top-4 left-4 z-10 text-sm bg-red-500 text-white px-2 py-1 rounded-md font-medium">
            -{discount}%
          </span>
        )}
        <img
          src={images[selectedImage] || images[0]}
          alt={productName}
          className="w-full h-full object-contain p-4"
        />
      </div>
      
      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onSelectImage(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${
                selectedImage === index 
                  ? 'border-blue-500 ring-2 ring-blue-200' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={image}
                alt={`${productName} - ${index + 1}`}
                className="w-full h-full object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
