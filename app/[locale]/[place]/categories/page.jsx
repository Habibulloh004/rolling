import { ProductDialog } from "@/components/modals/ProductModal";

const products = [
  {
    name: "Philadelphia Classic",
    price: "100 000 сум",
    image: "/placeholder.svg?height=200&width=200",
    description:
      "Fresh salmon, cream cheese, cucumber, and nori wrapped in sushi rice",
    isFavorite: true,
  },
  {
    name: "California Roll",
    price: "85 000 сум",
    image: "/placeholder.svg?height=200&width=200",
    description:
      "Crab meat, avocado, cucumber, and tobiko wrapped in sushi rice",
    isFavorite: false,
  },
];

export default function Page() {
  return (
    <div className="container mx-auto grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductDialog key={product.name} product={product} />
      ))}
    </div>
  );
}
