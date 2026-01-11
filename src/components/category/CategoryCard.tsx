import { Link } from 'react-router';

interface CategoryCardProps {
  title: string;
  slug: string;
  imageSrc: string;
}

export default function CategoryCard({
  title,
  slug,
  imageSrc,
}: CategoryCardProps) {
  return (
    <Link
      to={`/category/${slug}`}
      className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer block"
    >
      <img
        alt={title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        src={imageSrc}
      />
      <div className="absolute bottom-0 left-0 p-4">
        <span className="text-white text-lg font-bold drop-shadow-lg">{title}</span>
      </div>
    </Link>
  );
}