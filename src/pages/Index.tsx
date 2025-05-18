
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import Categories from '@/components/home/Categories';
import About from '@/components/home/About';
import Newsletter from '@/components/home/Newsletter';
import AdminLoginLink from '@/components/home/AdminLoginLink';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <FeaturedProducts />
        <Categories />
        <About />
        <Newsletter />
        <AdminLoginLink />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
