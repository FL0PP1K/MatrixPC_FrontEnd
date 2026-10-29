import './ComponentsSection.css';

const categories = [
  {
    id: 'gpu',
    name: 'ВІДЕОКАРТИ',
    image: '/image/GPU.png'
  },
  {
    id: 'cpu',
    name: 'ПРОЦЕСОРИ',
    image: '/image/Processor 1 1.png'
  },
  {
    id: 'motherboard',
    name: 'МАТЕРИНСЬКІ ПЛАТИ',
    image: "/image/Mat' 1.png"
  },
  {
    id: 'ssd',
    name: 'SSD НАКОПИЧУВАЧІ',
    image: '/image/SSD.png'
  },
  {
    id: 'ram',
    name: "ОПЕРАТИВНА ПАМ'ЯТЬ",
    image: '/image/RAM 1.png'
  },
  {
    id: 'psu',
    name: 'БЛОКИ ЖИВЛЕННЯ',
    image: '/image/BlockPit.png'
  }
];

function ComponentsSection() {
  return (
    <section
      id="components"
      className="components-section"
    >
      <div className="components-container">

        <div className="section-header">
          <h2 className="section-title">
            КОМПЛЕКТУЮЧІ
          </h2>

          <p className="section-subtitle">
            Все необхідне для створення потужного
            та збалансованого ПК.
          </p>
        </div>

        <div className="components-grid">
          {categories.map((category) => (
            <a
              href={`/catalog?category=${category.id}`}
              className="component-card"
              key={category.id}
            >
              <div className="card-img-wrapper">
                <img
                  src={category.image}
                  alt={category.name}
                  className="component-img"
                  loading="lazy"
                />
              </div>

              <h3 className="component-name">
                {category.name}
              </h3>

              <span className="component-link">
                Переглянути →
              </span>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}

export default ComponentsSection;