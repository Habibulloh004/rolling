import { ProductDialog } from "@/components/shared/customModal";
import { Modal } from "@/components/shared/modal";
import { Fragment } from "react";

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
        <Fragment key={product.name}>
          <Modal>
            <ProductDialog product={product} />
          </Modal>
        </Fragment>
      ))}
    </div>
  );
}
