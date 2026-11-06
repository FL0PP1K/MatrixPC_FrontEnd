import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { productCategories } from "../data/catalogProducts";

export function useCatalogFilters(products) {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryFromUrl = searchParams.get("category") || "all";
  const searchFromUrl = searchParams.get("search") || "";

  const [category, setCategory] = useState(categoryFromUrl);
  const [search, setSearch] = useState(searchFromUrl);
  const [manufacturer, setManufacturer] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [availability, setAvailability] = useState("all");

  // Синхронізація фільтрів з адресою сторінки
  useEffect(() => {
    const validCategory = productCategories.some(
      (item) => item.id === categoryFromUrl,
    );

    setCategory(validCategory ? categoryFromUrl : "all");
    setSearch(searchFromUrl);
  }, [categoryFromUrl, searchFromUrl]);

  // Список виробників
  const manufacturers = useMemo(() => {
    const filteredProducts =
      category === "all"
        ? products
        : products.filter((product) => product.category === category);

    return [
      ...new Set(filteredProducts.map((product) => product.manufacturer)),
    ].sort();
  }, [category, products]);

  // Фільтрація та сортування товарів
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (category !== "all") {
      result = result.filter((product) => product.category === category);
    }

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      result = result.filter((product) =>
        `${product.name} ${product.specs} ${product.manufacturer}`
          .toLowerCase()
          .includes(query),
      );
    }

    if (manufacturer !== "all") {
      result = result.filter(
        (product) => product.manufacturer === manufacturer,
      );
    }

    if (minPrice !== "") {
      result = result.filter((product) => product.price >= Number(minPrice));
    }

    if (maxPrice !== "") {
      result = result.filter((product) => product.price <= Number(maxPrice));
    }

    if (availability === "in-stock") {
      result = result.filter((product) => product.inStock);
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name, "uk"));
        break;
      default:
        result.sort((a, b) => a.popularity - b.popularity);
    }

    return result;
  }, [
    products,
    category,
    search,
    manufacturer,
    minPrice,
    maxPrice,
    availability,
    sortBy,
  ]);

  const handleCategoryChange = (categoryId) => {
    setCategory(categoryId);

    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (categoryId === "all") {
        next.delete("category");
      } else {
        next.set("category", categoryId);
      }
      return next;
    });
  };

  const resetFilters = () => {
    setCategory("all");
    setSearch("");
    setManufacturer("all");
    setSortBy("popular");
    setMinPrice("");
    setMaxPrice("");
    setAvailability("all");
    setSearchParams({});
  };

  return {
    category,
    search,
    setSearch,
    manufacturer,
    setManufacturer,
    sortBy,
    setSortBy,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    availability,
    setAvailability,
    manufacturers,
    filteredProducts,
    handleCategoryChange,
    resetFilters,
  };
}
