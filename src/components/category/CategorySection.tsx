import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { getCategories } from '@/services/HomeService/homeService';
import type { CategoryData } from '@/services/HomeService/homeTypes';

interface CategorySectionProps {
  className?: string;
}

// Mapping slug -> image
const categoryImages: Record<string, string> = {
  'laptop-gaming': 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80',
  'laptop-van-phong': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80',
  'laptop-do-hoa-ky-thuat': 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&q=80',
  'laptop-mong-nhe': 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&q=80',
  'laptop-cao-cap-premium': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',
};

export default function CategorySection({ className = '' }: CategorySectionProps) {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (response.success) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getImage = (slug: string) => {
    return categoryImages[slug] || 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80';
  };

  if (loading) {
    return (
      <section className={`max-w-7xl mx-auto px-4 py-10 ${className}`}>
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="aspect-[4/3] bg-gray-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className={`max-w-7xl mx-auto px-4 py-10 ${className}`}>
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Danh mục nổi bật</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories.map((category) => (
          <Link
            key={category._id}
            to={`/products?category=${category.slug}`}
            className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer block"
          >
            <img
              alt={category.name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              src={getImage(category.slug)}
            />
            <div className="absolute bottom-0 left-0 p-4">
              <span className="text-white text-base md:text-lg font-bold drop-shadow-lg">
                {category.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}