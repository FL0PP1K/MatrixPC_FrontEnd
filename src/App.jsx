import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import ComponentsSection from './components/ComponentsSection/ComponentsSection';
import PopularProducts from './components/PopularProducts/PopularProducts';
import Configurator from './components/Configurator/Configurator';

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
      </main>
    </>
  );
}