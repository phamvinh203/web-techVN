
import CategorySection from '@/components/category/CategorySection'
import Banner from '@/components/home/Banner'
import FeaturedBrands from '@/components/home/FeaturedBrands'
import ServiceHighlights from '@/components/home/ServiceHighlights'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import ListProduct from '@/components/product/ListProduct'
import React from 'react'


const HomePage: React.FC = () => {
    return (
        <>
            <Header />
                  
            <Banner />
            <ServiceHighlights />
            <FeaturedBrands />
            <CategorySection className="mt-10" />
            <ListProduct />
            <Footer />
        </>
    )
}

export default HomePage