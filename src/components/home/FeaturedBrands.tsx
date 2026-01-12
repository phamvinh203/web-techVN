import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { getBrands } from '@/services/HomeService/homeService';
import type { BrandData } from '@/services/HomeService/homeTypes';

const FeaturedBrands: React.FC = () => {
    const [brands, setBrands] = useState<BrandData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await getBrands();
                if (response.success) {
                    setBrands(response.data);
                }
            } catch (error) {
                console.error('Error fetching brands:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBrands();
    }, []);

    if (loading) {
        return (
            <section className="w-full py-8">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-6" />
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="h-20 bg-gray-200 animate-pulse rounded-lg" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (brands.length === 0) {
        return null;
    }

    return (
        <section className="w-full py-8">
            <div className="mx-auto max-w-7xl px-4">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Thương hiệu nổi bật
                </h2>
                
                <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                    {brands.map((brand) => (
                        <Link
                            key={brand._id}
                            to={`/products?brand=${brand.slug}`}
                            className="flex items-center justify-center p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all duration-200 group"
                        >
                            <img
                                src={brand.logo}
                                alt={brand.name}
                                className="h-8 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-200"
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedBrands;