import Cookies from "js-cookie";
import { create } from "zustand";

export const useClientStore = create((set) => ({
  client: Cookies.get("client") ? JSON.parse(Cookies.get("client")) : null,
  setClient: (data) => set(() => ({ client: data })),
}));

export const useStore = create((set) => ({
  open: false,
  isDisabled: true,
  setIsDisabled: (data) => set(() => ({ isDisabled: data })),
  toggleOpen: () => set((state) => ({ open: !state.open })),
  favorites: [],
  setFavorites: (favorite) => set(() => ({ favorites: favorite })),
  activeTab: "delivery",
  setActiveTab: (tab) =>
    set(() => {
      localStorage.setItem("activeTab", tab);
      return { activeTab: tab };
    }),
  initializeFavorites: () => {
    const savedProducts = localStorage.getItem("isFavorites");

    const savedActiveTab = localStorage.getItem("activeTab");
    const parsedProducts = savedProducts ? JSON.parse(savedProducts) : [];
    set({ favorites: parsedProducts });
    set({ activeTab: savedActiveTab ? savedActiveTab : "delivery" });
  },
}));

export const useProductStore = create((set) => ({
  products: [],
  initializeProducts: () => {
    const savedProducts = localStorage.getItem("products");
    const parsedProducts = savedProducts ? JSON.parse(savedProducts) : [];
    set({ products: parsedProducts });
  },
  setProductsData: (data) =>
    set(() => {
      localStorage.setItem("products", JSON.stringify(data));
      return {
        products: data,
      };
    }),
  setProducts: (data, product) =>
    set((state) => {
      state.initializeProducts();
      let updatedProducts;
      //modificator count
      if (product?.product_id) {
        // Find the product by ID in the state
        const findProduct = state.products.find(
          (p) => p.product_id === product.product_id
        );

        if (findProduct) {
          const hasModificator = findProduct.modifications.some(
            (mod) => mod.modificator_id == data?.modificator_id
          );

          updatedProducts = state.products.map((p) =>
            p.product_id === product.product_id
              ? {
                  ...p,
                  modifications: hasModificator
                    ? p.modifications.map((mod) =>
                        mod.modificator_id == data.modificator_id
                          ? { ...mod, count: mod.count + 1 }
                          : mod
                      )
                    : [...p.modifications, { ...data, count: 1 }],
                }
              : p
          );
        } else {
          // Product not found, add it with the modificator
          updatedProducts = [
            ...state.products,
            { ...product, count: 1, modifications: [{ ...data, count: 1 }] },
          ];
        }
      } else {
        //product count
        updatedProducts = state.products.some(
          (p) => p.product_id === data.product_id
        )
          ? state.products.map((p) =>
              p.product_id === data.product_id
                ? { ...p, count: p.count + 1 }
                : p
            )
          : [...state.products, { ...data, count: 1 }];
      }
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      return { products: updatedProducts };
    }),
  incrementCount: (product_id, modif_id) =>
    set((state) => {
      if (product_id && !modif_id) {
        let updatedProducts = state.products.map((product) =>
          product.product_id === product_id
            ? { ...product, count: product.count + 1 }
            : product
        );
        localStorage.setItem("products", JSON.stringify(updatedProducts));
        return { products: updatedProducts };
      }
      if (product_id && modif_id) {
        const findProduct = state.products.find(
          (p) => p.product_id === product_id
        );
        if (findProduct) {
          const findModificator = findProduct.modifications.find(
            (mod) => mod.modificator_id === modif_id
          );
          if (findModificator) {
            const updatedModifications = findProduct.modifications.map((mod) =>
              mod.modificator_id === modif_id
                ? { ...mod, count: mod.count + 1 }
                : mod
            );
            localStorage.setItem(
              "products",
              JSON.stringify(
                state.products.map((p) =>
                  p.product_id === product_id
                    ? { ...p, modifications: updatedModifications }
                    : p
                )
              )
            );
            return {
              products: state.products.map((p) =>
                p.product_id === product_id
                  ? { ...p, modifications: updatedModifications }
                  : p
              ),
            };
          }
        }
      }
    }),
  decrementCount: (product_id, modif_id) =>
    set((state) => {
      if (product_id && !modif_id) {
        let updatedProducts = state.products
          .map((product) =>
            product?.product_id === product_id && product.count > 0
              ? { ...product, count: product.count - 1 }
              : product
          )
          .filter((product) => product?.count > 0);

        localStorage.setItem("products", JSON.stringify(updatedProducts));
        return { products: updatedProducts };
      }

      if (product_id && modif_id) {
        const updatedProducts = state.products.map((product) => {
          if (product?.product_id === product_id) {
            const updatedModifications = product.modifications
              .map((mod) =>
                mod?.modificator_id === modif_id && mod.count > 0
                  ? { ...mod, count: mod.count - 1 }
                  : mod
              )
              .filter((mod) => mod.count > 0);

            if (product.count > 0 || updatedModifications.length > 0) {
              return { ...product, modifications: updatedModifications };
            }
            return null;
          }
          return product;
        });

        let finalProducts = updatedProducts
          .map((product) => {
            if (product?.modifications?.length === 0) {
              return null;
            }
            return product;
          })
          .filter((p) => p !== null);

        localStorage.setItem("products", JSON.stringify(finalProducts));
        return { products: finalProducts };
      }
    }),
  resetProduct: () => set(() => ({ products: [] })),
  deleteProduct: (product_id) =>
    set((state) => {
      let updatedProducts = state.products.filter(
        (product) => product?.product_id !== product_id
      );
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      return { products: updatedProducts };
    }),
}));

export const useOrderStore = create((set) => ({
  orderData: {
    spot_id: 0,
    spot_name: "",
    phone: "",
    products: [],
    payment_method: "",
    total: 0,
    delivery_price: 0,
    lng: 0,
    lat: 0,
    client: null,
    pay_cash: null,
    pay_card: null,
    pay_click: null,
    pay_payme: null,
    pay_uzum: null,
    pay_bonus: null,
    comment: "",
    address: "",
    client_addresses_id: null,
  },
  totalSum: 0,
  paymentData: null,
  selectCard: null,
  setSelectCard: (data) => {
    set((state) => {
      localStorage.setItem("selectCard", JSON.stringify(data));
      return { selectCard: data };
    });
  },
  setPaymentData: (data) => {
    set((state) => {
      localStorage.setItem("paymentData", JSON.stringify(data));
      Cookies.set("paymentData", JSON.stringify(data), { expires: 1 });
      return { paymentData: data };
    });
  },
  setTotalSum: (data) =>
    set(() => {
      localStorage.setItem("totalSum", JSON.stringify(data));
      return { totalSum: data };
    }),
  setOrderData: (data) =>
    set(() => {
      localStorage.setItem("orderData", JSON.stringify(data));
      return { orderData: data };
    }),

  initializeOrderData: () => {
    const orderData = localStorage.getItem("orderData");
    const totalSum = localStorage.getItem("totalSum");
    const paymentData = localStorage.getItem("paymentData");
    const selectCard = localStorage.getItem("selectCard");
    const parsedOrderData = orderData
      ? JSON.parse(orderData)
      : {
          spot_id: 0,
          spot_name: "",
          phone: "",
          products: [],
          payment_method: "",
          total: 0,
          delivery_price: 0,
          lng: 0,
          lat: 0,
          client: null,
          pay_cash: null,
          pay_card: null,
          pay_click: null,
          pay_payme: null,
          pay_uzum: null,
          pay_bonus: null,
          comment: "",
          address: "",
          client_addresses_id: null,
        };
    set({ orderData: { ...parsedOrderData, delivery_price: 0 } });
    set({ totalSum: totalSum || 0 });
    set({ paymentData: paymentData ? JSON.parse(paymentData) : null });
    set({ selectCard: selectCard ? JSON.parse(selectCard) : null });
  },
  resetOrder: () => {
    set({
      orderData: {
        spot_id: 0,
        spot_name: "",
        phone: "",
        products: [],
        payment_method: "",
        total: 0,
        delivery_price: 0,
        lng: 0,
        lat: 0,
        client: null,
        pay_cash: null,
        pay_card: null,
        pay_click: null,
        pay_payme: null,
        pay_uzum: null,
        pay_bonus: null,
        comment: "",
        address: "",
        client_addresses_id: null,
      },
    });
  },
}));
