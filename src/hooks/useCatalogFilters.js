import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getCategories as getCategoriesApi } from "../services/categoryApi";

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
  const [backendCategories, setBackendCategories] = useState([]);

  useEffect(() => {
    let active = true;
    getCategoriesApi()
      .then((items) => { if (active) setBackendCategories(items); })
      .catch((error) => console.error("Categories loading error:", error));
    return () => { active = false; };
  }, []);

  // Include empty categories and use backend slugs as stable filter IDs.
  const categories = useMemo(() => {
    const categoryMap = new Map(backendCategories.map((item) => [item.slug, item.name]));
    products.forEach((product) => {
      if (product.category && product.category !== "all") {
        categoryMap.set(product.category, product.categoryName || product.category);
      }
    });
    return [
      { id: "all", name: "Усі категорії" },
      ...Array.from(categoryMap, ([id, name]) => ({ id, name })),
    ];
  }, [backendCategories, products]);

  useEffect(() => {
    const validCategory = categoryFromUrl === "all" ||
      categories.some((item) => item.id === categoryFromUrl);
    setCategory(validCategory ? categoryFromUrl : "all");
    setSearch(searchFromUrl);
  }, [categoryFromUrl, searchFromUrl, categories]);

  const manufacturers = useMemo(() => {
    const scopedProducts = category === "all" ? products :
      products.filter((product) => product.category === category);
    return [...new Set(scopedProducts.map((product) => product.manufacturer))].sort();
  }, [category, products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (category !== "all") result = result.filter((product) => product.category === category);
    if (search.trim()) {
      const query = search.trim().toLowerCase();
      result = result.filter((product) =>
        `${product.name} ${product.specs} ${product.manufacturer}`.toLowerCase().includes(query),
      );
    }
    if (manufacturer !== "all") result = result.filter((product) => product.manufacturer === manufacturer);
    if (minPrice !== "") result = result.filter((product) => product.price >= Number(minPrice));
    if (maxPrice !== "") result = result.filter((product) => product.price <= Number(maxPrice));
    if (availability === "in-stock") result = result.filter((product) => product.inStock);

    switch (sortBy) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "name": result.sort((a, b) => a.name.localeCompare(b.name, "uk")); break;
      default: result.sort((a, b) => a.popularity - b.popularity);
    }
    return result;
  }, [products, category, search, manufacturer, minPrice, maxPrice, availability, sortBy]);

  const handleCategoryChange = (categoryId) => {
    setCategory(categoryId);
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (categoryId === "all") next.delete("category");
      else next.set("category", categoryId);
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
    categories, category, search, setSearch, manufacturer, setManufacturer,
    sortBy, setSortBy, minPrice, setMinPrice, maxPrice, setMaxPrice,
    availability, setAvailability, manufacturers, filteredProducts,
    handleCategoryChange, resetFilters,
  };
}
