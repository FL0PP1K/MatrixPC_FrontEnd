const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Відповідність категорій Backend категоріям Frontend
const categoryMap = {
  'graphics-cards': 'gpu',
  processors: 'cpu',
  ram: 'ram',
  ssd: 'ssd',
};

// Тимчасове зображення, поки не додані фотографії товарів
const fallbackImage = `data:image/svg+xml,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="640" height="480">
    <rect width="100%" height="100%" fill="#111820"/>
    <text x="50%" y="50%" fill="#00FF66"
      font-size="36" text-anchor="middle"
      dominant-baseline="middle">MATRIXPC</text>
  </svg>
`)}`;

// Перетворення товару Backend у формат Frontend
function mapProduct(product, index) {
  return {
    id: product.id,
    name: product.name,
    category: categoryMap[product.category?.slug] || 'all',
    manufacturer:
      product.manufacturer || product.name.split(' ')[0],
    specs:
      product.specs ||
      product.description ||
      'Характеристики уточнюються',
    price: Number(product.price),
    image: product.imageUrl || fallbackImage,
    inStock: product.stock > 0,
    popularity: index + 1,
    sku: product.sku,
    description: product.description,
    categoryName: product.category?.name || 'Комплектуючі',
  };
}

// Отримання товарів із Backend
export async function getProducts() {
  const response = await fetch(`${API_BASE_URL}/products`);

  if (!response.ok) {
    throw new Error(
      `Помилка завантаження товарів: ${response.status}`
    );
  }

  const result = await response.json();

  if (!result.success || !Array.isArray(result.data)) {
    throw new Error('Некоректна відповідь від сервера');
  }

  return result.data.map((product, index) =>
    mapProduct(product, index)
  );
}
