interface ProductDescriptionProps {
  description: string;
}

export default function ProductDescription({ description }: ProductDescriptionProps) {
  if (!description) {
    return null;
  }

  return (
    <div className=" border-t p-6 mb-8">
      {/* <h2 className="text-xl font-bold text-blue-600 mb-4">Mô tả sản phẩm</h2> */}
      <div className="prose max-w-none text-gray-600">
        <p>{description}</p>
      </div>
    </div>
  );
}
