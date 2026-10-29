
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import ComponentsSection from './components/ComponentsSection/ComponentsSection';
import PopularProducts from './components/PopularProducts/PopularProducts';

import './App.css';

export default function App() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <ComponentsSection />
        <PopularProducts />
      </main>
    </>
  );
}
