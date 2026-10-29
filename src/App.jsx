import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import ComponentsSection from './components/ComponentsSection/ComponentsSection';

import './App.css';

function App() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <ComponentsSection />
      </main>
    </>
  );
}

export default App;