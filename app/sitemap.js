import { ApiService } from "../service/api.services.js";
import { baseUrl } from "../lib/utils.js";

function slugify(text) {
  if (!text) return "";
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/[\*\$]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

function cleanText(text) {
  if (!text) return "";
  return text
    .replace(/<name>.*?<\/name>/g, "")
    .replace(/<description>.*?<\/description>/g, "")
    .replace(/<keywords>.*?<\/keywords>/g, "")
    .trim();
}

export async function generateSitemaps() {
  try {
    const productsResponse = await ApiService.getPosterData("menu.getProducts");
    const categoriesResponse = await ApiService.getPosterData(
      "menu.getCategories"
    );

    // Проверка и фильтрация продуктов
    const products = Array.isArray(productsResponse?.response)
      ? productsResponse.response.filter(
          (product) =>
            product &&
            product.menu_category_id &&
            product.product_id &&
            product.category_name &&
            product.product_name
        )
      : [];

    // Проверка и фильтрация категорий
    const categories = Array.isArray(categoriesResponse?.response)
      ? categoriesResponse.response.filter(
          (category) =>
            category && category.category_id && category.category_name
        )
      : [];

    const productChunks = [];
    for (let i = 0; i < products.length; i += 1000) {
      productChunks.push(products.slice(i, i + 1000));
    }

    // Возвращаем только корректные данные
    if (productChunks.length === 0 && categories.length === 0) {
      console.warn("Нет данных для генерации sitemap.");
      return [];
    }

    return [
      ...productChunks.map((_, index) => ({ type: "products", id: index })),
      { type: "categories", id: 0 },
      { type: "static", id: 0 },
    ];
  } catch (error) {
    console.error("Ошибка генерации sitemap:", error);
    return [];
  }
}

export default async function sitemap({ id, type }) {
  try {
    const languages = ["ru", "en", "uz"];

    if (!type) {
      console.error("Type отсутствует в параметрах.");
      return [];
    }

    if (type === "products") {
      console.log("Запуск обработки продуктов");
      const productsResponse = await ApiService.getPosterData(
        "menu.getProducts"
      );

      // Фильтруем корректные данные
      const products = Array.isArray(productsResponse?.response)
        ? productsResponse.response.filter(
            (product) =>
              product &&
              product.menu_category_id &&
              product.menu_category_id !== "0" && // Исключаем продукты без категории
              product.product_id &&
              product.category_name &&
              product.product_name
          )
        : [];

      if (!products.length) {
        console.warn(
          `Нет корректных продуктов для type="products" и id=${id}.`
        );
        return [];
      }

      const start = id * 50000;
      const end = start + 50000;
      const chunk = products.slice(start, end);

      return chunk.map((product) => ({
        url: `${baseUrl}/ru/web/category/${product.menu_category_id}-${slugify(
          product.category_name
        )}/product/${product.product_id}-${slugify(product.product_name)}`,
        lastModified: new Date().toISOString(),
      }));
    }

    if (type === "categories") {
      console.log("Запуск обработки категорий");
      const categoriesResponse = await ApiService.getPosterData(
        "menu.getCategories"
      );

      // Фильтруем корректные категории
      const categories = Array.isArray(categoriesResponse?.response)
        ? categoriesResponse.response.filter(
            (category) =>
              category &&
              category.category_id &&
              category.category_name &&
              category.category_id !== "0" // Исключаем категории без идентификатора
          )
        : [];

      if (!categories.length) {
        console.warn("Нет корректных категорий для sitemap.");
        return [];
      }

      return categories.map((category) => ({
        url: `${baseUrl}/ru/web/category/${category.category_id}-${slugify(
          cleanText(category.category_name)
        )}`,
        lastModified: new Date().toISOString(),
      }));
    }

    if (type === "static") {
      console.log("Запуск обработки статических путей");
      const staticPaths = [
        "web/about-us",
        "web/news",
        "web/saved",
        "web/reviews",
        "web/create-review",
        "web/create-vacansy",
      ];

      return staticPaths.map((path) => ({
        url: `${baseUrl}/ru/${path}`,
        lastModified: new Date().toISOString(),
      }));
    }

    console.warn(`Неизвестный type: ${type}`);
    return [];
  } catch (error) {
    console.error("Ошибка генерации данных sitemap:", error);
    return [];
  }
}
