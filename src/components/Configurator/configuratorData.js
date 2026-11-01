export const categories = [
  { id: 'gpu', name: 'Відеокарта', side: 'left' },
  { id: 'cpu', name: 'Процесор', side: 'left' },
  { id: 'motherboard', name: 'Материнська плата', side: 'left' },
  { id: 'cooler', name: 'Охолодження', side: 'left' },
  { id: 'case', name: 'Корпус', side: 'center' },
  { id: 'ram', name: "Оперативна пам'ять", side: 'right' },
  { id: 'ssd', name: 'SSD накопичувач', side: 'right' },
  { id: 'psu', name: 'Блок живлення', side: 'right' },
  { id: 'fans', name: 'Вентилятори', side: 'right' },
];

// Демонстраційний асортимент і ціни.
export const options = {
  
gpu: [
  {
      id: 'gpu1',
      name: 'GeForce RTX 5070 12GB',
      price: 47999,
      lengthMm: 340,
      powerW: 250
  },
  {
      id: 'gpu2',
      name: 'GeForce RTX 5060 8GB',
      price: 19999,
      lengthMm: 250,
      powerW: 150
  },
],

cpu: [
  {
      id: 'cpu1',
      name: 'AMD Ryzen 7 9700X',
      price: 14499,
      socket: 'AM5',
      powerW: 65
  },
  {
      id: 'cpu2',
      name: 'AMD Ryzen 5 7600',
      price: 8499,
      socket: 'AM5',
      powerW: 65
  },
],

motherboard: [
    {
        id: 'mb1',
        name: 'Материнська плата B650 ATX',
        price: 7999,
        socket: 'AM5',
        memoryType: 'DDR5'
    },
    {
        id: 'mb2',
        name: 'Материнська плата B650M',
        price: 5999,
        socket: 'AM5',
        memoryType: 'DDR5'
    },
],

motherboard: [
    {
        id: 'mb1',
        name: 'Материнська плата B650 ATX',
        price: 7999,
        socket: 'AM5',
        memoryType: 'DDR5'
    },
    {
        id: 'mb2',
        name: 'Материнська плата B650M',
        price: 5999,
        socket: 'AM5',
        memoryType: 'DDR5'
    },
],

motherboard: [
    {
        id: 'mb1',
        name: 'Материнська плата B650 ATX',
        price: 7999,
        socket: 'AM5',
        memoryType: 'DDR5'
    },
    {
        id: 'mb2',
        name: 'Материнська плата B650M',
        price: 5999,
        socket: 'AM5',
        memoryType: 'DDR5'
    },
],

motherboard: [
  {
      id: 'mb1',
      name: 'Материнська плата B650 ATX',
      price: 7999,
      socket: 'AM5',
      memoryType: 'DDR5',
      formFactor: 'ATX',
      supportedStorage: [
          { connector: 'M.2', interface: 'NVMe' },
          { connector: 'SATA', interface: 'SATA' }
      ]
  },
  {
      id: 'mb2',
      name: 'Материнська плата B650M',
      price: 5999,
      socket: 'AM5',
      memoryType: 'DDR5',
      formFactor: 'Micro-ATX',
      supportedStorage: [
          { connector: 'M.2', interface: 'NVMe' },
          { connector: 'SATA', interface: 'SATA' }
      ]
  },
],

cooler: [
  {
      id: 'cool1',
      name: 'Повітряне охолодження Tower',
      price: 2299,
      supportedSockets: ['AM4', 'AM5'],
      type: 'air',
      heightMm: 160
  },
  {
      id: 'cool2',
      name: 'Рідинне охолодження 360 мм',
      price: 4999,
      supportedSockets: ['AM5'],
      type: 'liquid',
      radiatorMm: 360
  },
],
  
case: [
  {
      id: 'case1',
      name: 'Корпус Mid Tower A',
      price: 3499,
      supportedFormFactors: ['ATX', 'Micro-ATX'],
      maxGpuLengthMm: 370,
      maxCoolerHeightMm: 170,
      supportedRadiatorsMm: [120, 240, 280, 360]
  },
  {
      id: 'case2',
      name: 'Корпус Mid Tower B',
      price: 4499,
      supportedFormFactors: ['Micro-ATX'],
      maxGpuLengthMm: 310,
      maxCoolerHeightMm: 155,
      supportedRadiatorsMm: [120, 240]
  },
],


ram: [
  {
      id: 'ram1',
      name: '32GB DDR5 6000 MHz',
      price: 4999,
      memoryType: 'DDR5'
  },
  {
      id: 'ram2',
      name: '16GB DDR5 5200 MHz',
      price: 2499,
      memoryType: 'DDR5'
  },
],

ssd: [
  {
      id: 'ssd1',
      name: 'SSD NVMe 1TB',
      price: 3999,
      interface: 'NVMe',
      connector: 'M.2'
  },
  {
      id: 'ssd2',
      name: 'SSD NVMe 2TB',
      price: 6999,
      interface: 'NVMe',
      connector: 'M.2'
  },
],
  
psu: [
  {
      id: 'psu1',
      name: 'Блок живлення 750W Gold',
      price: 4999,
      wattage: 750
  },
  {
      id: 'psu2',
      name: 'Блок живлення 850W Gold',
      price: 5999,
      wattage: 850
  },
],

  fans: [
    { id: 'fan1', name: 'Комплект 3 × 120 мм', price: 1599 },
    { id: 'fan2', name: 'Комплект 2 × 140 мм', price: 1299 },
  ],
};

export const formatPrice = (price) =>
  `${price.toLocaleString('uk-UA')} ₴`;