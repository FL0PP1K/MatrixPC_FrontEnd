import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import ComponentsSection from './components/ComponentsSection/ComponentsSection';
import PopularProducts from './components/PopularProducts/PopularProducts';
import Configurator from './components/Configurator/Configurator';
import Builds from './components/Builds/Builds';
import WhyUs from './components/WhyUs/WhyUs';
import Reviews from './components/Reviews/Reviews';
import Footer from './components/Footer/Footer';

import './App.css';

export default function App() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <ComponentsSection />
        <PopularProducts />
        <Configurator />
        <Builds />
        <WhyUs />
        <Reviews />
      </main>

      <Footer />
    </>
  );
}
