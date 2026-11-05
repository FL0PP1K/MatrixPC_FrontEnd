import { useEffect } from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import ComponentsSection from './components/ComponentsSection/ComponentsSection';
import PopularProducts from './components/PopularProducts/PopularProducts';
import Configurator from './components/Configurator/Configurator';
import Builds from './components/Builds/Builds';
import WhyUs from './components/WhyUs/WhyUs';
import Reviews from './components/Reviews/Reviews';
import Footer from './components/Footer/Footer';
import Cart from './components/Cart/Cart';

import './App.css';

export default function App() {
  const isCartPage = window.location.pathname === '/cart';
  useEffect(() => {
    if (isCartPage || !window.location.hash) return;
    const element = document.querySelector(window.location.hash);
    if (element) {
      requestAnimationFrame(() => {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      });
    }
  }, [isCartPage]);
  return (
    <>
      <Header />

      <main>
        {isCartPage ? (
          <Cart />
        ) : (
          <>
            <Hero />
            <ComponentsSection />
            <PopularProducts />
            <Configurator />
            <Builds />
            <WhyUs />
            <Reviews />
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
