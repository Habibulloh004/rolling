// import ApiService from "@/app/lib/apiService";
// import { baseUrl } from "@/lib/utils";

// // Utility function to slugify text
// function slugify(text) {
//   return text
//     .replace(/<[^>]*>/g, "") // Remove HTML tags
//     .replace(/[\*\$]/g, "") // Remove special characters
//     .trim()
//     .toLowerCase()
//     .replace(/\s+/g, "-") // Replace spaces with dashes
//     .replace(/[^\w-]+/g, ""); // Remove non-alphanumeric characters
// }

// // Utility function to clean up category names or descriptions
// function cleanText(text) {
//   return text
//     .replace(/<name>.*?<\/name>/g, "")
//     .replace(/<description>.*?<\/description>/g, "")
//     .replace(/<keywords>.*?<\/keywords>/g, "")
//     .trim();
// }

// // Function to generate the sitemap metadata
// export async function generateSitemaps() {
//   // Fetch all products and categories
//   const { response: products } = await ApiService.getPosterData(
//     `menu.getProducts`
//   );
//   const { response: categories } = await ApiService.getPosterData(
//     `menu.getCategories`
//   );

//   // Split products into chunks of 50,000
//   const productChunks = [];
//   for (let i = 0; i < products.length; i += 50000) {
//     productChunks.push(products.slice(i, i + 50000));
//   }

//   return [
//     ...productChunks.map((_, index) => ({ type: "products", id: index })),
//     { type: "categories", id: 0 },
//     { type: "static", id: 0 },
//   ];
// }

// // Sitemap generation logic
// export default async function sitemap({ id, type }) {
//   const languages = ["ru", "en", "uz"];

//   if (type === "products") {
//     // Fetch all products
//     const { response: products } = await ApiService.getPosterData(
//       `menu.getProducts`
//     );

//     // Get the relevant chunk of products
//     const start = id * 50000;
//     const end = start + 50000;
//     const chunk = products.slice(start, end);

//     return chunk.map((product) => {
//       const alternates = {};
//       languages.forEach((lang) => {
//         alternates[lang] = `${baseUrl}/${lang}/web/category/${
//           product.menu_category_id
//         }-${slugify(product.category_name)}/product/${
//           product.product_id
//         }-${slugify(product.product_name)}`;
//       });

//       return {
//         url: `${baseUrl}/ru/web/category/${product.menu_category_id}-${slugify(
//           product.category_name
//         )}/product/${product.product_id}-${slugify(product.product_name)}`,
//         lastModified: new Date().toISOString(),
//         alternates: {
//           languages: alternates,
//         },
//       };
//     });
//   } else if (type === "categories") {
//     // Fetch all categories
//     const { response: categories } = await ApiService.getPosterData(
//       `menu.getCategories`
//     );

//     return categories.map((category) => {
//       const alternates = {};
//       languages.forEach((lang) => {
//         alternates[lang] = `${baseUrl}/${lang}/web/category/${
//           category.category_id
//         }-${slugify(cleanText(category.category_name))}`;
//       });

//       return {
//         url: `${baseUrl}/ru/web/category/${category.category_id}-${slugify(
//           cleanText(category.category_name)
//         )}`,
//         lastModified: new Date().toISOString(),
//         alternates: {
//           languages: alternates,
//         },
//       };
//     });
//   } else if (type === "static") {
//     const staticPaths = [
//       "web/about-us",
//       "web/news",
//       "web/saved",
//       "web/reviews",
//       "web/create-review",
//       "web/create-vacansy",
//     ];

//     return staticPaths.map((path) => {
//       const alternates = {};
//       languages.forEach((lang) => {
//         alternates[lang] = `${baseUrl}/${lang}/${path}`;
//       });

//       return {
//         url: `${baseUrl}/ru/${path}`,
//         lastModified: new Date().toISOString(),
//         alternates: {
//           languages: alternates,
//         },
//       };
//     });
//   }
// }
