const API_BASE_URL =
  import.meta.env.VITE_API_URL || '/api';

// Єдине нейтральне зображення для товарів без фото
const fallbackImage = `data:image/svg+xml,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="640" height="480">
    <rect width="100%" height="100%" fill="#111820"/>
    <text x="50%" y="50%" fill="#00FF66"
      font-size="36" text-anchor="middle"
      dominant-baseline="middle">MATRIXPC</text>
  </svg>
`)}`;

const normalizeSpecificationLabel = (label) => String(label).toLowerCase()
  .replace(/[’']/g, '')
  .replace(/[\s_-]+/g, '');

const readSpecificationValue = (specifications, ...aliases) => {
  const accepted = new Set(aliases.map(normalizeSpecificationLabel));
  const entry = Object.entries(specifications).find(([label]) =>
    accepted.has(normalizeSpecificationLabel(label))
  );
  return entry && typeof entry[1] === 'string' ? entry[1].trim() : '';
};

const readSpecificationNumber = (specifications, ...aliases) => {
  const match = readSpecificationValue(specifications, ...aliases).match(/-?\d+(?:[.,]\d+)?/);
  if (!match) return undefined;
  const value = Number(match[0].replace(',', '.'));
  return Number.isFinite(value) ? value : undefined;
};

const readSpecificationList = (specifications, ...aliases) => {
  const value = readSpecificationValue(specifications, ...aliases);
  return value ? value.split(/[,;/|]/).map((part) => part.trim()).filter(Boolean) : undefined;
};

// Перетворення товару Backend у формат Frontend
function mapProduct(product, index) {
  const specifications = product.specifications &&
    typeof product.specifications === 'object' &&
    !Array.isArray(product.specifications)
    ? product.specifications
    : {};
  const specs = Object.entries(specifications)
    .slice(0, 3)
    .map(([name, value]) => `${name}: ${value}`)
    .join(' • ');
  const socket = readSpecificationValue(specifications, 'socket', 'сокет');
  const memoryType = readSpecificationValue(
    specifications,
    'memoryType',
    "тип пам'яті",
    'тип пам’яті',
    'тип оперативної пам’яті',
  );
  const interfaceValue = readSpecificationValue(specifications, 'interface', 'інтерфейс', 'тип інтерфейсу');
  const normalizedInterface = interfaceValue.toLowerCase();
  const connector = readSpecificationValue(specifications, 'connector', "роз'єм", 'роз’єм', 'тип роз’єму') ||
    (normalizedInterface.includes('m.2') ? 'M.2' : normalizedInterface.includes('sata') ? 'SATA' : undefined);
  const storageInterface = normalizedInterface.includes('nvme') ? 'NVMe'
    : normalizedInterface.includes('sata') ? 'SATA'
      : interfaceValue || undefined;
  const coolerTypeValue = readSpecificationValue(specifications, 'coolerType', 'тип охолодження').toLowerCase();
  const coolerType = coolerTypeValue.includes('рідин') || coolerTypeValue.includes('liquid')
    ? 'liquid'
    : coolerTypeValue.includes('повітр') || coolerTypeValue.includes('air')
      ? 'air'
      : undefined;

  return {
    id: product.id,
    name: product.name,
    category: product.category?.slug || 'all',
    manufacturer: product.manufacturer || product.name.split(' ')[0],
    specs: specs || product.description || '',
    specifications,
    price: Number(product.price),
    image: product.imageUrl || fallbackImage,
    inStock: product.stock > 0,
    stock: Number(product.stock),
    popularity: index + 1,
    sku: product.sku,
    description: product.description || '',
    categoryName: product.category?.name || 'Комплектуючі',
    socket: socket || undefined,
    memoryType: memoryType || undefined,
    formFactor: readSpecificationValue(specifications, 'formFactor', 'форм-фактор') || undefined,
    supportedFormFactors: readSpecificationList(
      specifications,
      'supportedFormFactors',
      'підтримувані форм-фактори',
      'підтримка форм-факторів',
    ),
    lengthMm: readSpecificationNumber(specifications, 'lengthMm', 'довжина відеокарти', 'довжина'),
    powerW: readSpecificationNumber(specifications, 'powerW', 'tdp', 'споживана потужність', 'потужність споживання'),
    wattage: readSpecificationNumber(
      specifications,
      'wattage',
      'потужність бж',
      'потужність блока живлення',
      'номінальна потужність',
    ),
    maxGpuLengthMm: readSpecificationNumber(specifications, 'maxGpuLengthMm', 'максимальна довжина відеокарти'),
    maxCoolerHeightMm: readSpecificationNumber(specifications, 'maxCoolerHeightMm', 'максимальна висота кулера'),
    supportedSockets: readSpecificationList(specifications, 'supportedSockets', 'підтримувані сокети', 'сумісні сокети'),
    heightMm: readSpecificationNumber(specifications, 'heightMm', 'висота кулера'),
    radiatorMm: readSpecificationNumber(specifications, 'radiatorMm', 'розмір радіатора', 'радіатор'),
    type: coolerType,
    connector,
    interface: storageInterface,
    sizeMm: readSpecificationNumber(specifications, 'sizeMm', 'розмір вентилятора'),
    count: readSpecificationNumber(specifications, 'count', 'кількість вентиляторів'),
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
