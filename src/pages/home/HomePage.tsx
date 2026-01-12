
import CategorySection from '@/components/category/CategorySection'
import AuthModal from '@/components/auth/AuthModal'
import Banner from '@/components/home/Banner'
import FeaturedBrands from '@/components/home/FeaturedBrands'
import ServiceHighlights from '@/components/home/ServiceHighlights'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import ListProduct from '@/components/product/ListProduct'
import React, { useState } from 'react'


const HomePage: React.FC = () => {
    const [openAuth, setOpenAuth] = useState(false);
    return (
        <>
            <Header onOpenAuth={() => setOpenAuth(true)} />
            <AuthModal open={openAuth} onClose={() => setOpenAuth(false)} />
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