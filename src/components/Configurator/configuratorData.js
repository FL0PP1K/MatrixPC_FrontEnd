export const categories = [
  { id: "gpu", name: "Відеокарта", side: "left" },
  { id: "cpu", name: "Процесор", side: "left" },
  { id: "motherboard", name: "Материнська плата", side: "left" },
  { id: "cooler", name: "Охолодження", side: "left" },
  { id: "case", name: "Корпус", side: "center" },
  { id: "ram", name: "Оперативна пам'ять", side: "right" },
  { id: "ssd", name: "SSD накопичувач", side: "right" },
  { id: "psu", name: "Блок живлення", side: "right" },
  { id: "fans", name: "Вентилятори", side: "right" },
];

export const formatPrice = (price) => `${Number(price).toLocaleString("uk-UA")} ₴`;
