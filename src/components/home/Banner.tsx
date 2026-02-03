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
        <section className="w-full py-6 md:py-10">
            <div className="mx-auto max-w-7xl px-4">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-white group">
                    {/* Slides Container */}
                    <div
                        className="flex transition-transform duration-700 ease-in-out"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {banners.map((banner) => (
                            <div
                                key={banner._id}
                                className="w-full flex-shrink-0 min-w-full"
                            >
                                <Link
                                    to={banner.link}
                                    className="block w-full"
                                >
                                    {/* Split Layout Container */}
                                    <div className="flex flex-col md:flex-row h-auto md:h-96 lg:h-[450px]">
                                        {/* Image Section - Left Side (60%) */}
                                        <div className="w-full md:w-3/5 h-64 md:h-full relative overflow-hidden">
                                            <img
                                                src={banner.imageUrl}
                                                alt={banner.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            {/* Subtle overlay on image */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 md:to-transparent" />
                                        </div>

                                        {/* Content Section - Right Side (40%) */}
                                        <div className="w-full md:w-2/5 flex items-center justify-center p-6 md:p-10 lg:p-12 bg-gradient-to-br from-white via-white to-gray-50">
                                            <div className="text-center md:text-left max-w-md">
                                                {/* Category Tag */}
                                                <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider text-blue-600 uppercase bg-blue-50 rounded-full">
                                                    Nổi bật
                                                </span>

                                                {/* Title */}
                                                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                                                    {banner.title}
                                                </h2>

                                                {/* CTA Button */}
                                                <span className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                                                    Xem ngay
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    {banners.length > 1 && (
                        <>
                            <button
                                onClick={goToPrevious}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
                                aria-label="Previous banner"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={goToNext}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
                                aria-label="Next banner"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}

                    {/* Dots Indicator */}
                    {banners.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
                            {banners.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`h-2.5 rounded-full transition-all duration-300 ${
                                        index === currentIndex
                                            ? 'w-8 bg-blue-600'
                                            : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Banner;