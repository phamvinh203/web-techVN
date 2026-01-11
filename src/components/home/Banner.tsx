import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getBanners } from '@/services/HomeService/homeService';
import type { BannerData } from '@/services/HomeService/homeTypes';


const Banner: React.FC = () => {
    const [banners, setBanners] = useState<BannerData[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await getBanners();
                if (response.success) {
                    setBanners(response.data);
                }
            } catch (error) {
                console.error('Error fetching banners:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();
    }, []);

    // Auto slide
    useEffect(() => {
        if (banners.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [banners.length]);

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    if (loading) {
        return (
            <div className="w-full h-64 md:h-96 bg-gray-200 animate-pulse rounded-lg" />
        );
    }

    if (banners.length === 0) {
        return null;
    }

    return (
        <section className="w-full bg-white py-4">
            <div className="mx-auto max-w-7xl px-4">
                <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-lg group">
                    {/* Slides */}
                    <div
                className="flex transition-transform duration-500 ease-out h-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {banners.map((banner) => (
                    <Link
                        key={banner._id}
                        to={banner.link}
                        className="w-full h-full flex-shrink-0"  // Đổi min-w-full → w-full
                    >
                        <img
                            src={banner.imageUrl}
                            alt={banner.title}
                            className="w-full h-full object-cover object-center"  // Thêm object-center
                        />
                    </Link>
                ))}
            </div>

            {/* Navigation Arrows */}
            {banners.length > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronRight size={24} />
                    </button>
                </>
            )}

            {/* Dots Indicator */}
            {banners.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-colors ${
                                index === currentIndex
                                    ? 'bg-white'
                                    : 'bg-white/50 hover:bg-white/75'
                            }`}
                        />
                    ))}
                </div>
            )}

                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <h2 className="text-white text-lg md:text-xl font-semibold">
                            {banners[currentIndex]?.title}
                        </h2>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;